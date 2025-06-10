"use client"

import { useMemo } from "react"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { TrendingUp, TrendingDown, Heart, Activity, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Reading } from "@/generated/prisma"



interface DashboardPageProps {
    readings: Reading[]
    onNavigateToRecords: () => void
}

export function DashboardPage({ readings, onNavigateToRecords }: DashboardPageProps) {
    const recentReadings = useMemo(() => {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        return readings
            .filter((reading) => new Date(reading.date) >= thirtyDaysAgo)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }, [readings])

    const latestReadings = recentReadings.slice(0, 5)

    const stats = useMemo(() => {
        if (recentReadings.length === 0) {
            return {
                avgSystolic: 0,
                avgDiastolic: 0,
                avgHeartRate: 0,
                maxSystolic: 0,
                minSystolic: 0,
                maxDiastolic: 0,
                minDiastolic: 0,
                maxHeartRate: 0,
                minHeartRate: 0,
                highReadings: 0,
                normalReadings: 0,
                totalReadings: 0,
            }
        }

        const avgSystolic = Math.round(recentReadings.reduce((sum, r) => sum + r.systolic, 0) / recentReadings.length)
        const avgDiastolic = Math.round(recentReadings.reduce((sum, r) => sum + r.diastolic, 0) / recentReadings.length)
        const avgHeartRate = Math.round(recentReadings.reduce((sum, r) => sum + r.heartRate, 0) / recentReadings.length)

        const systolicValues = recentReadings.map((r) => r.systolic)
        const diastolicValues = recentReadings.map((r) => r.diastolic)
        const heartRateValues = recentReadings.map((r) => r.heartRate)

        const highReadings = recentReadings.filter((r) => r.systolic >= 140 || r.diastolic >= 90).length
        const normalReadings = recentReadings.length - highReadings

        return {
            avgSystolic,
            avgDiastolic,
            avgHeartRate,
            maxSystolic: Math.max(...systolicValues),
            minSystolic: Math.min(...systolicValues),
            maxDiastolic: Math.max(...diastolicValues),
            minDiastolic: Math.min(...diastolicValues),
            maxHeartRate: Math.max(...heartRateValues),
            minHeartRate: Math.min(...heartRateValues),
            highReadings,
            normalReadings,
            totalReadings: recentReadings.length,
        }
    }, [recentReadings])

    const chartData = useMemo(() => {
        return recentReadings
            .slice(0, 10)
            .reverse()
            .map((reading) => ({
                date: format(parseISO(reading.date), "dd/MM", { locale: ptBR }),
                sistolica: reading.systolic,
                diastolica: reading.diastolic,
                batimentos: reading.heartRate,
            }))
    }, [recentReadings])

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

    const getHeartRateCategory = (heartRate: number, age = 40) => {
        if (heartRate < 50) {
            return { category: "Bradicardia", color: "destructive", description: "Muito baixo" }
        } else if (heartRate >= 50 && heartRate < 60) {
            return { category: "Baixo", color: "secondary", description: "Abaixo do normal" }
        } else if (heartRate >= 60 && heartRate <= 100) {
            return { category: "Normal", color: "default", description: "Frequência normal" }
        } else if (heartRate > 100 && heartRate <= 120) {
            return { category: "Elevado", color: "secondary", description: "Acima do normal" }
        } else {
            return { category: "Taquicardia", color: "destructive", description: "Muito alto" }
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Resumo dos Últimos 30 Dias</CardTitle>
                    <CardDescription>{stats.totalReadings} medições registradas</CardDescription>
                </CardHeader>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pressão Média</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.avgSystolic}/{stats.avgDiastolic}
                        </div>
                        <p className="text-xs text-muted-foreground">mmHg (sistólica/diastólica)</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">FC Média</CardTitle>
                        <Heart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.avgHeartRate}</div>
                        <p className="text-xs text-muted-foreground">bpm (frequência cardíaca)</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Picos Máximos</CardTitle>
                        <TrendingUp className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold text-red-600">
                            PA: {stats.maxSystolic}/{stats.maxDiastolic}
                        </div>
                        <div className="text-lg font-bold text-red-600">FC: {stats.maxHeartRate} bpm</div>
                        <p className="text-xs text-muted-foreground">Valores máximos registrados</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Valores Baixos</CardTitle>
                        <TrendingDown className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold text-green-600">
                            PA: {stats.minSystolic}/{stats.minDiastolic}
                        </div>
                        <div className="text-lg font-bold text-green-600">FC: {stats.minHeartRate} bpm</div>
                        <p className="text-xs text-muted-foreground">Valores mínimos registrados</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Variabilidade FC</CardTitle>
                        <Heart className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.maxHeartRate - stats.minHeartRate}</div>
                        <p className="text-xs text-muted-foreground">bpm de variação total</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Leituras Elevadas</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.highReadings}</div>
                        <p className="text-xs text-muted-foreground">Medições com pressão ≥ 140/90 mmHg</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Leituras Normais</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.normalReadings}</div>
                        <p className="text-xs text-muted-foreground">Medições com pressão {"<"} 140/90 mmHg</p>
                    </CardContent>
                </Card>
            </div>
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        Análise de Frequência Cardíaca
                    </CardTitle>
                    <CardDescription>Distribuição e alertas dos batimentos cardíacos</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                            <div className="text-xl font-bold text-red-600">
                                {recentReadings.filter((r) => r.heartRate < 50).length}
                            </div>
                            <p className="text-xs text-red-700">Bradicardia (&lt;50)</p>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                            <div className="text-xl font-bold text-yellow-600">
                                {recentReadings.filter((r) => r.heartRate >= 50 && r.heartRate < 60).length}
                            </div>
                            <p className="text-xs text-yellow-700">Baixo (50-59)</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-xl font-bold text-green-600">
                                {recentReadings.filter((r) => r.heartRate >= 60 && r.heartRate <= 100).length}
                            </div>
                            <p className="text-xs text-green-700">Normal (60-100)</p>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                            <div className="text-xl font-bold text-red-600">
                                {recentReadings.filter((r) => r.heartRate > 100).length}
                            </div>
                            <p className="text-xs text-red-700">Elevado (&gt;100)</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {recentReadings.filter((r) => r.heartRate < 50).length > 0 && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-800">
                                    ⚠️ <strong>Bradicardia detectada:</strong> {recentReadings.filter((r) => r.heartRate < 50).length}{" "}
                                    medição(ões) com FC muito baixa. Consulte um cardiologista.
                                </p>
                            </div>
                        )}
                        {recentReadings.filter((r) => r.heartRate > 120).length > 0 && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-800">
                                    ⚠️ <strong>Taquicardia detectada:</strong> {recentReadings.filter((r) => r.heartRate > 120).length}{" "}
                                    medição(ões) com FC muito alta. Monitore de perto.
                                </p>
                            </div>
                        )}
                        {stats.maxHeartRate - stats.minHeartRate > 50 && (
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                <p className="text-sm text-yellow-800">
                                    💡 <strong>Alta variabilidade:</strong> Diferença de {stats.maxHeartRate - stats.minHeartRate} bpm
                                    entre máximo e mínimo. Considere fatores como exercício, estresse e medicamentos.
                                </p>
                            </div>
                        )}
                        {recentReadings.filter((r) => r.heartRate >= 60 && r.heartRate <= 100).length === recentReadings.length &&
                            recentReadings.length > 0 && (
                                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                                    <p className="text-sm text-green-800">
                                        ✓ <strong>Excelente:</strong> Todas as medições de FC estão dentro da faixa normal (60-100 bpm).
                                    </p>
                                </div>
                            )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Tendência Recente</CardTitle>
                    <CardDescription>Últimas 10 medições registradas</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="sistolica" stroke="#ef4444" strokeWidth={2} name="Sistólica" />
                                <Line type="monotone" dataKey="diastolica" stroke="#f97316" strokeWidth={2} name="Diastólica" />
                                <Line type="monotone" dataKey="batimentos" stroke="#3b82f6" strokeWidth={2} name="Batimentos" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Últimas Medições</CardTitle>
                        <CardDescription>5 registros mais recentes</CardDescription>
                    </div>
                    <Button variant="outline" onClick={onNavigateToRecords} className="flex items-center gap-2">
                        Ver Todos
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data/Hora</TableHead>
                                <TableHead>Pressão Arterial</TableHead>
                                <TableHead>Frequência Cardíaca</TableHead>
                                <TableHead>Categoria PA</TableHead>
                                <TableHead>Observações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {latestReadings.map((reading) => {
                                const bpCategory = getBloodPressureCategory(reading.systolic, reading.diastolic)
                                const hrCategory = getHeartRateCategory(reading.heartRate)
                                return (
                                    <TableRow key={reading.id}>
                                        <TableCell className="font-medium">
                                            {format(parseISO(reading.date), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                        </TableCell>
                                        <TableCell className="font-mono">
                                            {reading.systolic}/{reading.diastolic} mmHg
                                        </TableCell>
                                        <TableCell className="font-mono">
                                            <div className="flex flex-col">
                                                <span className="font-semibold">{reading.heartRate} bpm</span>
                                                <Badge variant={hrCategory.color as any} className="text-xs mt-1 w-fit">
                                                    {hrCategory.category}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={bpCategory.color as any}>{bpCategory.category}</Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{reading.notes || "-"}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                    {latestReadings.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">Nenhuma medição encontrada</div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
