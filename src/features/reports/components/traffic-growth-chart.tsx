"use client"

import React from "react"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

import {
  generateTrafficData,
} from "~/features/reports/utils/generate-data"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "~/shared/components/ui/card"

interface TrafficGrowthChartProps {
  campaignId: number
}

export function TrafficGrowthChart({ campaignId }: TrafficGrowthChartProps) {
  const data = React.useMemo(
    () => generateTrafficData(campaignId), [campaignId]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tăng trưởng traffic</CardTitle>

        <CardDescription>
          Biểu đồ thể hiện sự tăng trưởng traffic trong 30 ngày qua
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart
              data={data}
              margin={
                {
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 0,
                }
              }
            >
              <defs>
                <linearGradient
                  id="colorTraffic"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#27BDBE"
                    stopOpacity={0.8}
                  />

                  <stop
                    offset="95%"
                    stopColor="#27BDBE"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />

              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={value => `${value}`}
              />

              <Tooltip
                contentStyle={
                  {
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }
                }
                formatter={
                  (value: number) => [
                    `${value.toLocaleString()}`,
                    "Traffic",
                  ]
                }
                labelFormatter={label => `${label}`}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke="#27BDBE"
                fillOpacity={1}
                fill="url(#colorTraffic)"
                name="Traffic"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
