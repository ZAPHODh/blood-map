"use client"

import { useState, useMemo } from "react"
import { format, parseISO, isWithinInterval, subDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Filter, Download, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AddReadingDialog } from "@/components/add-reading-dialog"
import { PageHeader } from "@/components/page-header"
import { useData } from "@/hooks/data"

type FilterPeriod = "7d" | "30d" | "90d" | "all"

export default function LancamentosPage() {
    const { readings } = useData()
    const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("30d")
    const [systolicMin, setSystolicMin] = useState("")
    const [systolicMax, setSystolicMax] = useState("")
    const [diastolicMin, setDiastolicMin] = useState("")
    const [diastolicMax, setDiastolicMax] = useState("")
    const [heartRateMin, setHeartRateMin] = useState("")
    const [heartRateMax, setHeartRateMax] = useState("")
    const [searchTerm, setSearchTerm] = useState("")

    const filteredReadings = useMemo(() => {
        let filtered = [...readings]

        if (filterPeriod !== "all") {
            const now = new Date()
            let startDate: Date

            switch (filterPeriod) {
                case "7d":
                    startDate = subDays(now, 7)
                    break
                case "30d":
                    startDate = subDays(now, 30)
                    break
                case "90d":
                    startDate = subDays(now, 90)
                    break
                default:
                    startDate = new Date(0)
            }

            filtered = filtered.filter((reading) => isWithinInterval(parseISO(reading.date), { start: startDate, end: now }))
        }

        filtered = filtered.filter((reading) => {
            const systolicInRange =
                (!systolicMin || reading.systolic >= Number.parseInt(systolicMin)) &&
                (!systolicMax || reading.systolic <= Number.parseInt(systolicMax))
            const diastolicInRange =
                (!diastolicMin || reading.diastolic >= Number.parseInt(diastolicMin)) &&
                (!diastolicMax || reading.diastolic <= Number.parseInt(diastolicMax))
            const heartRateInRange =
                (!heartRateMin || reading.heartRate >= Number.parseInt(heartRateMin)) &&
                (!heartRateMax || reading.heartRate <= Number.parseInt(heartRateMax))

            return systolicInRange && diastolicInRange && heartRateInRange
        })

        if (searchTerm) {
            filtered = filtered.filter(
                (reading) =>
                    (reading.notes?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                    format(parseISO(reading.date), "dd/MM/yyyy HH:mm", { locale: ptBR }).includes(searchTerm),
            )
        }

        return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }, [
        readings,
        filterPeriod,
        systolicMin,
        systolicMax,
        diastolicMin,
        diastolicMax,
        heartRateMin,
        heartRateMax,
        searchTerm,
    ])

    const getBloodPressureCategory = (systolic: number, diastolic: number) => {
        if (systolic >= 180 || diastolic >= 110) {
            return { category: "Crise Hipertensiva", color: "destructive" }
        } else if (systolic >= 140 || diastolic >= 90) {
            return { category: "Hipertensão", color: "destructive" }
        } else if (systolic >= 130 || diastolic >= 80) {
            return { category: "Elevada", color: "secondary" }
        } else {
            return { category: "Normal", color: "default" }
        }
    }

    const clearFilters = () => {
        setSystolicMin("")
        setSystolicMax("")
        setDiastolicMin("")
        setDiastolicMax("")
        setHeartRateMin("")
        setHeartRateMax("")
        setFilterPeriod("30d")
        setSearchTerm("")
    }

    const exportData = () => {
        const csvContent = [
            ["Data/Hora", "Sistólica", "Diastólica", "Batimentos", "Categoria", "Observações"],
            ...filteredReadings.map((reading) => {
                const category = getBloodPressureCategory(reading.systolic, reading.diastolic)
                return [
                    format(parseISO(reading.date), "dd/MM/yyyy HH:mm", { locale: ptBR }),
                    reading.systolic.toString(),
                    reading.diastolic.toString(),
                    reading.heartRate.toString(),
                    category.category,
                    reading.notes || "",
                ]
            }),
        ]
            .map((row) => row.join(","))
            .join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `pressao-arterial-${format(new Date(), "yyyy-MM-dd")}.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="space-y-8">
            <PageHeader title="Lançamentos" description="Histórico completo de todas as suas medições de pressão arterial">
                <AddReadingDialog />
            </PageHeader>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        Busca Rápida
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Buscar por observações ou data..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Filtros Avançados
                    </CardTitle>
                    <CardDescription>Use os filtros abaixo para encontrar medições específicas</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label>Período</Label>
                            <Select value={filterPeriod} onValueChange={(value: FilterPeriod) => setFilterPeriod(value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                                    <SelectItem value="90d">Últimos 90 dias</SelectItem>
                                    <SelectItem value="all">Todos os registros</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Sistólica (mmHg)</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Min"
                                    value={systolicMin}
                                    onChange={(e) => setSystolicMin(e.target.value)}
                                    type="number"
                                />
                                <Input
                                    placeholder="Max"
                                    value={systolicMax}
                                    onChange={(e) => setSystolicMax(e.target.value)}
                                    type="number"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Diastólica (mmHg)</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Min"
                                    value={diastolicMin}
                                    onChange={(e) => setDiastolicMin(e.target.value)}
                                    type="number"
                                />
                                <Input
                                    placeholder="Max"
                                    value={diastolicMax}
                                    onChange={(e) => setDiastolicMax(e.target.value)}
                                    type="number"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Batimentos (bpm)</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Min"
                                    value={heartRateMin}
                                    onChange={(e) => setHeartRateMin(e.target.value)}
                                    type="number"
                                />
                                <Input
                                    placeholder="Max"
                                    value={heartRateMax}
                                    onChange={(e) => setHeartRateMax(e.target.value)}
                                    type="number"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between mt-6">
                        <Button variant="outline" onClick={clearFilters}>
                            Limpar Filtros
                        </Button>
                        <Button variant="outline" onClick={exportData} className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Exportar CSV
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Histórico Completo de Medições</CardTitle>
                    <CardDescription>{filteredReadings.length} registro(s) encontrado(s)</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Data/Hora</TableHead>
                                    <TableHead>Pressão Arterial</TableHead>
                                    <TableHead>Batimentos</TableHead>
                                    <TableHead>Categoria</TableHead>
                                    <TableHead>Observações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredReadings.map((reading) => {
                                    const category = getBloodPressureCategory(reading.systolic, reading.diastolic)
                                    return (
                                        <TableRow key={reading.id} className="hover:bg-muted/50">
                                            <TableCell className="font-medium">
                                                {format(parseISO(reading.date), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                            </TableCell>
                                            <TableCell className="font-mono">
                                                {reading.systolic}/{reading.diastolic} mmHg
                                            </TableCell>
                                            <TableCell className="font-mono">{reading.heartRate} bpm</TableCell>
                                            <TableCell>
                                                <Badge variant={category.color as any}>{category.category}</Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground max-w-xs truncate">{reading.notes || "-"}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                        {filteredReadings.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                <p className="text-lg font-medium">Nenhuma medição encontrada</p>
                                <p className="text-sm">Tente ajustar os filtros ou adicionar novas medições</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
