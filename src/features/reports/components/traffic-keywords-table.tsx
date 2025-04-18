"use client"

import React from "react"

import {
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react"

import {
  generateKeywordsData,
} from "~/features/reports/utils/generate-data"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/shared/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/shared/components/ui/table"

interface TrafficKeywordsTableProps {
  campaignId: number
}

export function TrafficKeywordsTable({ campaignId }: TrafficKeywordsTableProps) {
  // Trong dự án thực tế, dữ liệu sẽ được lấy từ API dựa trên campaignId
  // Ở đây chúng ta tạo dữ liệu mẫu dựa trên campaignId để mô phỏng
  const keywords = React.useMemo(
    () => generateKeywordsData(campaignId),
    [campaignId]
  )

  // Render arrow dựa trên trạng thái thay đổi thứ hạng
  const renderRankChange = (change: number) => {
    if (change > 0) {
      return (
        <div className="flex items-center text-success">
          <ArrowUp className="mr-1 size-3.5" />

          <span>{change}</span>
        </div>
      )
    }
    if (change < 0) {
      return (
        <div className="flex items-center text-destructive">
          <ArrowDown className="mr-1 size-3.5" />

          <span>{Math.abs(change)}</span>
        </div>
      )
    }
    return (
      <div className="flex items-center text-muted-foreground">
        <Minus className="mr-1 size-3.5" />

        <span>0</span>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hiệu suất từ khóa hàng đầu</CardTitle>

        <CardDescription>
          Hiệu suất của các từ khóa top trong chiến dịch
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Từ khóa</TableHead>

              <TableHead>Xếp hạng</TableHead>

              <TableHead>Thay đổi</TableHead>

              <TableHead className="text-right">Traffic</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {
              keywords.map(keyword => (
                <TableRow key={keyword.id}>
                  <TableCell className="font-medium">{keyword.keyword}</TableCell>

                  <TableCell>{keyword.rank}</TableCell>

                  <TableCell>{renderRankChange(keyword.change)}</TableCell>

                  <TableCell className="text-right">{keyword.traffic.toLocaleString()}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
