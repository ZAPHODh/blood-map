"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Plus } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { useData } from "@/hooks/data"
import { Reading } from "@/generated/prisma"

const readingSchema = z.object({
    date: z.string(),
    time: z.string(),
    systolic: z.string().min(1, "Obrigatório"),
    diastolic: z.string().min(1, "Obrigatório"),
    heartRate: z.string().min(1, "Obrigatório"),
    notes: z.string().optional(),
})

type ReadingFormValues = z.infer<typeof readingSchema>

export function AddReadingDialog() {
    const { addReading } = useData()
    const [isOpen, setIsOpen] = useState(false)

    const form = useForm<ReadingFormValues>({
        resolver: zodResolver(readingSchema),
        defaultValues: {
            date: format(new Date(), "yyyy-MM-dd"),
            time: format(new Date(), "HH:mm"),
            systolic: "",
            diastolic: "",
            heartRate: "",
            notes: "",
        },
    })

    const onSubmit = (values: ReadingFormValues) => {
        const reading: Omit<Reading, "id" | "userId"> = {
            date: `${values.date}T${values.time}:00`,
            systolic: parseInt(values.systolic),
            diastolic: parseInt(values.diastolic),
            heartRate: parseInt(values.heartRate),
            notes: values.notes ?? "",
        }

        addReading(reading)
        form.reset()
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="shadow-md">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Medição
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Adicionar Nova Medição</DialogTitle>
                    <DialogDescription>
                        Registre uma nova aferição de pressão arterial e batimentos cardíacos
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="time"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hora</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="systolic"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sistólica (mmHg)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="120" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="diastolic"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Diastólica (mmHg)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="80" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="heartRate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Batimentos (bpm)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="70" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Observações</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: manhã, após exercício, etc." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit">Salvar Medição</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
