"use client"

import { Reading } from "@/generated/prisma"
import { createContext, useContext, useState, type ReactNode } from "react"



interface DataContextType {
    readings: Reading[]
    addReading: (reading: Omit<Reading, "id" | 'userId'>) => Promise<void>
    updateReading: (id: string, reading: Omit<Reading, "id">) => Promise<void>
    deleteReading: (id: string) => Promise<void>
    clearReadings: () => void
    getReadingById: (id: string) => Reading | undefined
    getReadingsByDate: (date: string) => Reading[]
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children, initialReadings }: { children: ReactNode, initialReadings: Reading[] }) {
    const [readings, setReadings] = useState<Reading[]>(initialReadings)

    const addReading = async (newReading: Omit<Reading, "id" | "userId">) => {
        const res = await fetch("/api/readings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newReading),
        })

        if (!res.ok) {
            console.error("Erro ao adicionar leitura")
            return
        }

        const savedReading: Reading = await res.json()
        setReadings((prev) => [...prev, savedReading])
    }

    const updateReading = async (id: string, updatedReading: Omit<Reading, "id">) => {
        const res = await fetch(`/api/readings/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedReading),
        })

        if (!res.ok) {
            console.error("Erro ao atualizar leitura")
            return
        }

        const savedReading: Reading = await res.json()

        setReadings((prev) =>
            prev.map((reading) =>
                reading.id === id ? savedReading : reading
            )
        )
    }

    const deleteReading = async (id: string) => {
        const res = await fetch(`/api/readings/${id}`, {
            method: "DELETE",
        })

        if (!res.ok) {
            console.error("Erro ao deletar leitura")
            return
        }

        setReadings((prev) => prev.filter((reading) => reading.id !== id))
    }

    const clearReadings = () => {
        setReadings([])
    }

    const getReadingById = (id: string) => {
        return readings.find((reading) => reading.id === id)
    }

    const getReadingsByDate = (date: string) => {
        return readings.filter((reading) => reading.date === date)
    }

    return (
        <DataContext.Provider
            value={{
                readings,
                addReading,
                updateReading,
                deleteReading,
                clearReadings,
                getReadingById,
                getReadingsByDate,
            }}
        >
            {children}
        </DataContext.Provider>
    )
}

export function useData() {
    const context = useContext(DataContext)
    if (context === undefined) {
        throw new Error("useData must be used within a DataProvider")
    }
    return context
}


