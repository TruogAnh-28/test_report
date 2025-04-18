"use client"

import React from "react"

import {
  ExternalLink,
} from "lucide-react"

import {
  generateTopDomainsData,
} from "~/features/reports/utils/generate-data"
import {
  Badge,
} from "~/shared/components/ui/badge"
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

interface BacklinkTopDomainsProps {
  campaignId: number
}

export function BacklinkTopDomains({ campaignId }: BacklinkTopDomainsProps) {
  // Trong dự án thực tế, dữ liệu sẽ được lấy từ API dựa trên campaignId
  // Ở đây chúng ta tạo dữ liệu mẫu dựa trên campaignId để mô phỏng
  const domains = React.useMemo(
    () => generateTopDomainsData(campaignId), [campaignId]
  )

  // Xác định màu cho badge dựa trên chất lượng domain
  const getDomainQualityBadge = (quality: string) => {
    if (quality.toLowerCase() === "cao") {
      return <Badge className="bg-success/20 text-success border-success/20">Cao</Badge>
    }

    if (quality.toLowerCase() === "trung bình") {
      return (
        <Badge
          variant="outline"
          className="bg-warning/20 text-warning border-warning/20"
        >
          Trung bình
        </Badge>
      )
    }

    if (quality.toLowerCase() === "thấp") {
      return (
        <Badge
          variant="outline"
          className="bg-destructive/20 text-destructive border-destructive/20"
        >
          Thấp
        </Badge>
      )
    }

    return <Badge variant="outline">Không xác định</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top domains</CardTitle>

        <CardDescription>
          Các domains đóng góp nhiều backlink nhất
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domain</TableHead>

              <TableHead>Chất lượng</TableHead>

              <TableHead className="text-right">Số lượng</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {
              domains.map(domain => (
                <TableRow key={domain.id}>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <a
                        href={`https://${domain.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {domain.domain}

                        <ExternalLink className="size-3.5" />
                      </a>
                    </div>
                  </TableCell>

                  <TableCell>{getDomainQualityBadge(domain.quality)}</TableCell>

                  <TableCell className="text-right">{domain.count}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
