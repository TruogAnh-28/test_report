"use client"

import React from "react"

import {
  Calendar, ArrowUpRight, Link as LinkIcon, Globe,
} from "lucide-react"

import {
  useUrlState,
} from "~/shared/hooks/state/use-url-state"

import {
  mockBacklinkCampaigns,
} from "~/features/backlink-campaigns/components/data/backlink-campaigns-mocks"
import {
  BacklinkGrowthChart,
} from "~/features/reports/components/backlink-growth-chart"
import {
  BacklinkQualityDistribution,
} from "~/features/reports/components/backlink-quality-distribution"
import {
  BacklinkTopDomains,
} from "~/features/reports/components/backlink-top-domains"
import {
  DayPicker,
} from "~/shared/components/inputs/day-picker"
import {
  Badge,
} from "~/shared/components/ui/badge"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/shared/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/shared/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/shared/components/ui/table"

export function BacklinkReports() {
  const defaultFilters = {
    campaign_id: "",
    from_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    to_date: new Date().toISOString(),
  }

  const [
    filters,
    setFilters,
  ] = useUrlState(defaultFilters)

  // Sử dụng dữ liệu mẫu cho demo
  const campaigns = mockBacklinkCampaigns
  const selectedCampaign = filters.campaign_id
    ? campaigns.find(campaign => campaign.id.toString() === filters.campaign_id)
    : campaigns[0]

  // Tính tỷ lệ tăng trưởng (dữ liệu mẫu)
  const growthRate = 12.5
  const retentionRate = 95.8

  // Phân loại backlink dựa trên chất lượng (dữ liệu mẫu)
  const qualityDistribution = [
    {
      name: "Cao",
      value: 35,
    },
    {
      name: "Trung bình",
      value: 45,
    },
    {
      name: "Thấp",
      value: 20,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Select
            value={filters.campaign_id || (campaigns[0]?.id.toString() || "")}
            onValueChange={
              value => setFilters({
                ...filters,
                campaign_id: value,
              })
            }
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Chọn chiến dịch" />
            </SelectTrigger>

            <SelectContent>
              {
                campaigns.map(campaign => (
                  <SelectItem
                    key={campaign.id}
                    value={campaign.id.toString()}
                  >
                    {campaign.name}
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>

          <Badge
            variant={selectedCampaign?.status === "ACTIVE" ? "outline" : "secondary"}
            className={
              selectedCampaign?.status === "ACTIVE"
                ? "bg-success/20 text-success border-success/20"
                : ""
            }
          >
            {selectedCampaign?.status === "ACTIVE" ? "Đang hoạt động" : "Đã tạm dừng"}
          </Badge>
        </div>

        <div className="flex gap-2">
          <DayPicker
            mode="single"
            selected={filters.from_date ? new Date(filters.from_date) : undefined}
            onSelect={
              date => date && setFilters({
                ...filters,
                from_date: date.toISOString(),
              })
            }
            TriggerComponent={
              (
                <Button
                  variant="outline"
                  className="w-full justify-start font-normal"
                >
                  <Calendar className="mr-2 size-4" />

                  {filters.from_date ? new Date(filters.from_date).toLocaleDateString("vi-VN") : "Từ ngày"}
                </Button>
              )
            }
          />

          <DayPicker
            mode="single"
            selected={filters.to_date ? new Date(filters.to_date) : undefined}
            onSelect={
              date => date && setFilters({
                ...filters,
                to_date: date.toISOString(),
              })
            }
            TriggerComponent={
              (
                <Button
                  variant="outline"
                  className="w-full justify-start font-normal"
                >
                  <Calendar className="mr-2 size-4" />

                  {filters.to_date ? new Date(filters.to_date).toLocaleDateString("vi-VN") : "Đến ngày"}
                </Button>
              )
            }
          />
        </div>
      </div>

      {
        selectedCampaign ? (
          <React.Fragment>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Tổng backlink</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="text-2xl font-bold">{selectedCampaign.totalTraffic.toLocaleString()}</div>

                  <div className="mt-1 flex items-center text-sm">
                    <ArrowUpRight className="mr-1 size-3.5 text-success" />

                    <span className="text-success">
                      +
                      {growthRate}
                      %
                    </span>

                    <span className="ml-1 text-muted-foreground">so với giai đoạn trước</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Tỷ lệ tồn tại</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="text-2xl font-bold">
                    {retentionRate}
                    %
                  </div>

                  <div className="mt-1 flex items-center text-sm">
                    <div className="size-2 rounded-full bg-success mr-1.5" />

                    <span className="text-muted-foreground">Tỷ lệ backlink còn hoạt động</span>
                  </div>

                  <div className="mt-2 text-sm text-muted-foreground">
                    {Math.floor(selectedCampaign.totalTraffic * (retentionRate / 100))}

                    {" "}

                    trên
                    {selectedCampaign.totalTraffic}

                    {" "}
                    backlink
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Tên miền</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center">
                    <Globe className="mr-2 size-4 text-muted-foreground" />

                    <a
                      href={`https://${selectedCampaign.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate"
                    >
                      {selectedCampaign.domain}
                    </a>
                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Bắt đầu:
                    {" "}

                    {new Date(selectedCampaign.startDate).toLocaleDateString("vi-VN")}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Kết thúc:
                    {" "}

                    {new Date(selectedCampaign.endDate).toLocaleDateString("vi-VN")}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <BacklinkGrowthChart campaignId={selectedCampaign.id} />

              <BacklinkQualityDistribution data={qualityDistribution} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <BacklinkTopDomains campaignId={selectedCampaign.id} />

              <Card>
                <CardHeader>
                  <CardTitle>Links mới gần đây</CardTitle>

                  <CardDescription>
                    Backlinks mới được tạo trong 7 ngày qua
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nguồn</TableHead>

                        <TableHead>TLD</TableHead>

                        <TableHead className="text-right">Ngày tạo</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {/* Dữ liệu mẫu cho các backlink mới */}
                      {
                        [
                          1,
                          2,
                          3,
                          4,
                          5,
                        ].map(item => (
                          <TableRow key={item}>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <LinkIcon className="size-3.5 text-muted-foreground" />

                                <a
                                  href={`https://example${item}.com`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline truncate max-w-[160px]"
                                >
                                  example
                                  {item}
                                  .com/page

                                  {item}
                                </a>
                              </div>
                            </TableCell>

                            <TableCell>.com</TableCell>

                            <TableCell className="text-right">
                              {new Date(Date.now() - item * 24 * 60 * 60 * 1000).toLocaleDateString("vi-VN")}
                            </TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </React.Fragment>
        ) : null
      }
    </div>
  )
}
