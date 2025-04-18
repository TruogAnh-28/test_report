"use client"

import React from "react"

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"

import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "~/shared/components/ui/card"

interface DeviceDistributionItem {
  name: string
  value: number
}

interface TrafficDeviceDistributionProps {
  data: DeviceDistributionItem[]
}

export function TrafficDeviceDistribution({ data }: TrafficDeviceDistributionProps) {
  const COLORS = [
    "#104f50",
    "#27BDBE",
    "#8bd5d6",
  ]

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        style={
          {
            fontWeight: 500,
          }
        }
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phân bổ theo thiết bị</CardTitle>

        <CardDescription>
          Tỷ lệ traffic theo từng loại thiết bị
        </CardDescription>
      </CardHeader>

      <CardContent className="flex items-center justify-center">
        <div className="h-[250px] w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {
                  data.map((
                    entry, index
                  ) => (
                    <Cell
                      key={`cell-${entry}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))
                }
              </Pie>

              <Tooltip
                formatter={
                  (value: number) => [
                    `${value}%`,
                    "",
                  ]
                }
                contentStyle={
                  {
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }
                }
              />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
