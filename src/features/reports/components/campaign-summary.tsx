"use client"

import React from "react"

import {
  ArrowUpRight, ArrowDownRight, LinkIcon, Layers, Globe,
} from "lucide-react"

import {
  mockBacklinkCampaigns,
} from "~/features/backlink-campaigns/components/data/backlink-campaigns-mocks"
import {
  CampaignSummaryChart,
} from "~/features/reports/components/campaign-summary-chart"
import {
  type CampaignStat,
} from "~/features/reports/types/report"
import {
  formatCampaignStatsOverTime,
} from "~/features/reports/utils/format-stats"
import {
  mockTrafficSeoCampaigns,
} from "~/features/traffic-seo-campaigns/components/data/traffic-seo-campaigns-mocks"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "~/shared/components/ui/card"

export function CampaignSummary() {
  // Simulating stats data from the mocks
  const totalTrafficCampaigns = mockTrafficSeoCampaigns.length
  const activeTrafficCampaigns = mockTrafficSeoCampaigns.filter(campaign =>
    campaign.status === "ACTIVE").length
  const totalTraffic = mockTrafficSeoCampaigns.reduce(
    (
      sum, campaign
    ) => sum + campaign.totalTraffic, 0
  )

  const totalBacklinkCampaigns = mockBacklinkCampaigns.length
  const activeBacklinkCampaigns = mockBacklinkCampaigns.filter(campaign =>
    campaign.status === "ACTIVE").length
  const totalBacklinks = mockBacklinkCampaigns.reduce(
    (
      sum, campaign
    ) => sum + campaign.totalTraffic, 0
  )

  // Simulated growth metrics (these would come from real data)
  const trafficGrowthRate = 23.5 // 23.5% growth
  const backlinkGrowthRate = 15.7 // 15.7% growth

  // Formatting past data for charts
  const trafficData: CampaignStat[] = formatCampaignStatsOverTime(mockTrafficSeoCampaigns)
  const backlinkData: CampaignStat[] = formatCampaignStatsOverTime(mockBacklinkCampaigns)

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Tổng quan chiến dịch</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng chiến dịch Traffic
            </CardTitle>

            <Layers className="size-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{totalTrafficCampaigns}</div>

            <p className="text-xs text-muted-foreground">
              {activeTrafficCampaigns}

              {" "}
              chiến dịch đang hoạt động
            </p>

            <div className="mt-2 flex items-center text-sm">
              {
                trafficGrowthRate > 0 ? (
                  <React.Fragment>
                    <ArrowUpRight className="mr-1 size-3.5 text-success" />

                    <span className="text-success">
                      +
                      {trafficGrowthRate}
                      %
                    </span>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <ArrowDownRight className="mr-1 size-3.5 text-destructive" />

                    <span className="text-destructive">
                      {trafficGrowthRate}
                      %
                    </span>
                  </React.Fragment>
                )
              }

              <span className="ml-1 text-muted-foreground">so với tháng trước</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng chiến dịch Backlink
            </CardTitle>

            <LinkIcon className="size-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{totalBacklinkCampaigns}</div>

            <p className="text-xs text-muted-foreground">
              {activeBacklinkCampaigns}

              {" "}
              chiến dịch đang hoạt động
            </p>

            <div className="mt-2 flex items-center text-sm">
              {
                backlinkGrowthRate > 0 ? (
                  <React.Fragment>
                    <ArrowUpRight className="mr-1 size-3.5 text-success" />

                    <span className="text-success">
                      +
                      {backlinkGrowthRate}
                      %
                    </span>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <ArrowDownRight className="mr-1 size-3.5 text-destructive" />

                    <span className="text-destructive">
                      {backlinkGrowthRate}
                      %
                    </span>
                  </React.Fragment>
                )
              }

              <span className="ml-1 text-muted-foreground">so với tháng trước</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng Keyword
            </CardTitle>

            <Globe className="size-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{totalTraffic.toLocaleString()}</div>

            <p className="text-xs text-muted-foreground">
              Keyword đang hoạt động
            </p>

            <div className="mt-2 flex items-center text-sm">
              <div className="size-3 rounded-full bg-success mr-1.5" />

              <span>Tỉ lệ tồn tại: 97.5%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng backlink tồn tại
            </CardTitle>

            <LinkIcon className="size-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{totalBacklinks.toLocaleString()}</div>

            <p className="text-xs text-muted-foreground">
              Backlink đang hoạt động
            </p>

            <div className="mt-2 flex items-center text-sm">
              <div className="size-3 rounded-full bg-success mr-1.5" />

              <span>Tỉ lệ tồn tại: 97.5%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <CampaignSummaryChart
          title="Tăng trưởng Traffic"
          description="Số lượng traffic trong 6 tháng qua"
          data={trafficData}
          type="traffic"
        />

        <CampaignSummaryChart
          title="Tăng trưởng Backlink"
          description="Số lượng backlink trong 6 tháng qua"
          data={backlinkData}
          type="backlink"
        />
      </div>
    </div>
  )
}
