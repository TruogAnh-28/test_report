"use client"

import React from "react"

import {
  useQuery,
} from "@tanstack/react-query"
import {
  Plus,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"

import {
  useUrlState,
} from "~/shared/hooks/state/use-url-state"

import {
  searchTrafficSeoCampaigns,
} from "~/features/traffic-seo-campaigns/api/traffic-seo-campaigns"
import {
  TrafficSeoCampaignsTable,
} from "~/features/traffic-seo-campaigns/components/tables/traffic-seo-campaigns-table"
import {
  type SearchTrafficSeoCampaigns,
} from "~/features/traffic-seo-campaigns/type/traffic-seo-campaigns"
import {
  Link,
} from "~/i18n"
import {
  Button,
} from "~/shared/components/ui/button"

export function ViewTrafficSeoCampaigns() {
  const t = useTranslations("trafficSeoCampaigns")
  const defaultFilters: SearchTrafficSeoCampaigns = {
    key: "",
    page: 1,
    limit: 10,
    role_ids: [],
    campaignTypeId: 1,
    status: "",
    device: "",
    domain: "",
    date_range: {
      start_date: "",
      end_date: "",
    },
  }

  const [
    filters,
    setFilters,
  ] = useUrlState<SearchTrafficSeoCampaigns>(defaultFilters)

  // Fetch data using React Query
  const {
    data: trafficSeoCampaignsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "searchTrafficSeoCampaigns",
      filters,
    ],
    queryFn: () => searchTrafficSeoCampaigns(filters),
    refetchOnWindowFocus: false,
    enabled: true,
  })

  const handleFiltersChange = (newFilters: Record<string, unknown>) => {
    // Ensure campaignTypeId is always 1
    setFilters({
      ...(newFilters as SearchTrafficSeoCampaigns),
      campaignTypeId: 1,
    })
  }

  const handleDeleteSuccess = () => {
    refetch()
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-semibold font-[Phudu] capitalize">{t("title")}</h1>

        <div className="flex items-center gap-2">
          <Button asChild>
            <Link
              href="/traffic-seo-campaigns/create"
            >
              <Plus className="size-4 mr-2" />

              {t("create")}
            </Link>
          </Button>
        </div>
      </div>

      <TrafficSeoCampaignsTable
        data={trafficSeoCampaignsResponse?.data?.campaigns || []}
        total={trafficSeoCampaignsResponse?.data?.total}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onDeleteSuccess={handleDeleteSuccess}
        error={error}
        isLoading={isLoading}
      />
    </div>
  )
}
