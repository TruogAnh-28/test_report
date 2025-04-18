"use client"

import React from "react"

import {
  Globe, Calendar, ArrowUpRight,
} from "lucide-react"

import {
  useUrlState,
} from "~/shared/hooks/state/use-url-state"

import {
  TrafficDeviceDistribution,
} from "~/features/reports/components/traffic-device-distribution"
import {
  TrafficGrowthChart,
} from "~/features/reports/components/traffic-growth-chart"
import {
  TrafficKeywordsTable,
} from "~/features/reports/components/traffic-keywords-table"
import {
  mockTrafficSeoCampaigns,
} from "~/features/traffic-seo-campaigns/components/data/traffic-seo-campaigns-mocks"
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

export function TrafficReports() {
  const defaultFilters = {
    campaign_id: "",
    from_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    to_date: new Date().toISOString(),
  }

  const [
    filters,
    setFilters,
  ] = useUrlState(defaultFilters)

  // Using mockedData for the demo
  const campaigns = mockTrafficSeoCampaigns
  const selectedCampaign = filters.campaign_id
    ? campaigns.find(campaign => campaign.id.toString() === filters.campaign_id)
    : campaigns[0]

  // Calculate growth rates (this would be from real data)
  const growthRate = 18.7
  const retentionRate = 95.8
  // Device distribution
  const deviceDistribution = [
    {
      name: "Desktop",
      value: 45,
    },
    {
      name: "Mobile",
      value: 40,
    },
    {
      name: "Tablet",
      value: 15,
    },
  ]

  // Country distribution
  const countryDistribution = [
    {
      country: "United States",
      percentage: 35,
    },
    {
      country: "Vietnam",
      percentage: 25,
    },
    {
      country: "Germany",
      percentage: 15,
    },
    {
      country: "France",
      percentage: 10,
    },
    {
      country: "United Kingdom",
      percentage: 8,
    },
    {
      country: "Others",
      percentage: 7,
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
                  <CardTitle className="text-sm font-medium">Tổng traffic</CardTitle>
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
              <TrafficGrowthChart campaignId={selectedCampaign.id} />

              <TrafficDeviceDistribution data={deviceDistribution} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Phân bổ theo quốc gia</CardTitle>

                  <CardDescription>
                    Phân bổ lượng traffic theo quốc gia trong thời gian báo cáo
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Quốc gia</TableHead>

                        <TableHead className="text-right">Phần trăm</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {
                        countryDistribution.map(item => (
                          <TableRow key={item.country}>
                            <TableCell>{item.country}</TableCell>

                            <TableCell className="text-right">
                              {item.percentage}
                              %
                            </TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <TrafficKeywordsTable campaignId={selectedCampaign.id} />
            </div>
          </React.Fragment>
        ) : null
      }
    </div>
  )
}
