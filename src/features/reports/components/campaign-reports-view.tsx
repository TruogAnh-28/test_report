"use client"

import React from "react"

import {
  BacklinkReports,
} from "~/features/reports/components/backlink-reports"
import {
  TrafficReports,
} from "~/features/reports/components/traffic-reports"
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "~/shared/components/ui/tabs"

export function CampaignReportsView() {
  return (
    <div className="space-y-8">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-semibold font-[Phudu] capitalize">Báo cáo chiến dịch</h1>
      </div>

      <Tabs defaultValue="traffic">
        <TabsList className="w-full mb-6 max-w-md">
          <TabsTrigger
            className="flex-1"
            value="traffic"
          >
            Chiến dịch Traffic
          </TabsTrigger>

          <TabsTrigger
            className="flex-1"
            value="backlink"
          >
            Chiến dịch Backlink
          </TabsTrigger>
        </TabsList>

        <TabsContent value="traffic">
          <TrafficReports />
        </TabsContent>

        <TabsContent value="backlink">
          <BacklinkReports />
        </TabsContent>
      </Tabs>
    </div>
  )
}
