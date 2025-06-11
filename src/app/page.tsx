"use client"

import { use, useMemo } from "react"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"
import { TrendingUp, TrendingDown, Heart, Activity, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { AddReadingDialog } from "@/components/add-reading-dialog"
import { PageHeader } from "@/components/page-header"
import { useData } from "@/hooks/data"


export default function DashboardPage() {
  const { readings } = useData()
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
    } else if (systolic <= 120 && diastolic <= 80) {
      return { category: "Normal", color: "default" }
    } else if ((systolic >= 121 && systolic <= 129) && diastolic < 80) {
      return { category: "Elevada", color: "secondary" }
    } else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 81 && diastolic <= 89)) {
      return { category: "Hipertensão Estágio 1", color: "warning" }
    } else {
      return { category: "Indefinido", color: "default" }
    }
  }


  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" description="Visão geral das suas medições e tendências dos últimos 30 dias">
        <AddReadingDialog />
      </PageHeader>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Resumo dos Últimos 30 Dias</CardTitle>
          <CardDescription className="text-blue-700">
            {stats.totalReadings} medições registradas • Última medição:{" "}
            {latestReadings.length > 0
              ? format(parseISO(latestReadings[0].date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
              : "Nenhuma medição"}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
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

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Batimentos Médios</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgHeartRate}</div>
            <p className="text-xs text-muted-foreground">bpm (batimentos por minuto)</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Picos Máximos</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.maxSystolic}/{stats.maxDiastolic}
            </div>
            <p className="text-xs text-muted-foreground">Pressão máxima registrada</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valores Baixos</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.minSystolic}/{stats.minDiastolic}
            </div>
            <p className="text-xs text-muted-foreground">Pressão mínima registrada</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leituras Elevadas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.highReadings}</div>
            <p className="text-xs text-muted-foreground">Medições com pressão ≥ 140/90 mmHg</p>
            {stats.highReadings > 0 && <p className="text-xs text-red-600 mt-1">⚠️ Consulte seu médico se persistir</p>}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leituras Normais</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.normalReadings}</div>
            <p className="text-xs text-muted-foreground">Medições com pressão {"<"} 140/90 mmHg</p>
            {stats.normalReadings > 0 && (
              <p className="text-xs text-green-600 mt-1">✓ Continue mantendo hábitos saudáveis</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Tendência Recente</CardTitle>
          <CardDescription>Últimas 10 medições registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
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
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Últimas Medições</CardTitle>
            <CardDescription>5 registros mais recentes</CardDescription>
          </div>
          <Link href="/entry">
            <Button variant="outline" className="flex items-center gap-2">
              Ver Todos
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
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
                {latestReadings.map((reading) => {
                  const category = getBloodPressureCategory(reading.systolic, reading.diastolic)
                  return (
                    <TableRow key={reading.id}>
                      <TableCell className="font-medium">
                        {format(parseISO(reading.date), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="font-mono">
                        {reading.systolic}/{reading.diastolic} mmHg
                      </TableCell>
                      <TableCell className="font-mono">{reading.heartRate} bpm</TableCell>
                      <TableCell>
                        {/* eslint-disable  @typescript-eslint/no-explicit-any */}
                        <Badge variant={category.color as any}>{category.category}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{reading.notes || "-"}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            {latestReadings.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg font-medium">Nenhuma medição encontrada</p>
                <p className="text-sm">Adicione sua primeira medição para começar</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
