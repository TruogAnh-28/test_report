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
  generateBacklinkData,
} from "~/features/reports/utils/generate-data"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "~/shared/components/ui/card"

interface BacklinkGrowthChartProps {
  campaignId: number
}

export function BacklinkGrowthChart({ campaignId }: BacklinkGrowthChartProps) {
  // Trong dự án thực tế, dữ liệu sẽ được lấy từ API dựa trên campaignId
  // Ở đây chúng ta tạo dữ liệu mẫu dựa trên campaignId để mô phỏng
  const data = React.useMemo(
    () => generateBacklinkData(campaignId), [campaignId]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tăng trưởng backlink</CardTitle>

        <CardDescription>
          Biểu đồ thể hiện số lượng và sự tăng trưởng backlink theo thời gian
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
                  id="colorBacklink"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#104f50"
                    stopOpacity={0.8}
                  />

                  <stop
                    offset="95%"
                    stopColor="#104f50"
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
                    "Backlinks",
                  ]
                }
                labelFormatter={label => `${label}`}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke="#104f50"
                fillOpacity={1}
                fill="url(#colorBacklink)"
                name="Backlinks"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
