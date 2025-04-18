"use client"

import React from "react"

import {
  Calendar, Filter, Smartphone, Tablet,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"

import {
  type SearchTrafficSeoCampaigns,
} from "~/features/traffic-seo-campaigns/type/traffic-seo-campaigns"
import {
  type FilterField, FiltersContent,
} from "~/shared/components/dialogs/filters-content"
import {
  ChipPicker,
} from "~/shared/components/inputs/chip-picker"
import {
  DayPicker,
} from "~/shared/components/inputs/day-picker"
import {
  TextInput,
} from "~/shared/components/inputs/text-input"
import {
  Button,
} from "~/shared/components/ui/button"

interface TrafficSeoCampaignsFiltersProps {
  defaultFilters?: SearchTrafficSeoCampaigns
  filters?: SearchTrafficSeoCampaigns
  onFiltersChange?: (filters: SearchTrafficSeoCampaigns) => void
}

export function TrafficSeoCampaignsFilters({
  defaultFilters, filters, onFiltersChange,
}: TrafficSeoCampaignsFiltersProps) {
  const t = useTranslations("trafficSeoCampaigns")
  const DeviceOptions = [
    {
      label: "Mobile",
      value: "mobile",
      icon: <Smartphone className="size-4" />,
    },
    {
      label: "Tablet",
      value: "tablet",
      icon: <Tablet className="size-4" />,
    },
    {
      label: t("deviceOptions.all"),
      value: "all",
      icon: <Filter className="size-4" />,
    },
  ]
  const StatusOptions = [
    {
      label: t("statusOptions.active"),
      value: "ACTIVE",
    },
    {
      label: t("statusOptions.paused"),
      value: "PAUSED",
    },
    {
      label: t("statusOptions.scheduled"),
      value: "SCHEDULED",
    },
  ]

  const fields = React.useMemo<FilterField[]>(
    () => [
      {
        name: t("filters.device"),
        title: t("filters.device"),
        children: ({ field }) => (
          <ChipPicker
            options={DeviceOptions}
            mode="single"
            value={field.value}
            onValueChange={value => field.onChange(value)}
            renderItem={
              option => (
                <div className="px-2 py-1.5 pr-3 rounded-full border-2 border-input group-data-[state=checked]:border-primary flex items-center gap-2">
                  {option.icon}

                  {option.label}
                </div>
              )
            }
          />
        ),
      },
      {
        name: t("filters.status"),
        title: t("filters.status"),
        children: ({ field }) => (
          <ChipPicker
            options={StatusOptions}
            mode="single"
            value={field.value}
            onValueChange={value => field.onChange(value)}
            renderItem={
              option => (
                <div className="px-2 py-1.5 pr-3 rounded-full border-2 border-input group-data-[state=checked]:border-primary flex items-center gap-2">
                  <div className="size-4 border-2 rounded-full group-data-[state=checked]:border-4 group-data-[state=checked]:border-primary" />

                  {option.label}
                </div>
              )
            }
          />
        ),
      },
      {
        name: t("filters.domain"),
        title: t("filters.domain"),
        children: ({ field }) => (
          <TextInput
            {...field}
            placeholder={t("filters.enterDomain")}
          />
        ),
      },
      {
        name: t("filters.dateRange"),
        title: t("filters.dateRange"),
        children: ({ field }) => (
          <div className="space-y-4">
            <div>
              <p className="text-sm mb-2">{t("filters.startDate")}</p>

              <DayPicker
                mode="single"
                selected={field.value?.start_date ? new Date(field.value.start_date) : undefined}
                onSelect={
                  date => field.onChange({
                    ...field.value,
                    start_date: date?.toISOString() || "",
                  })
                }
                TriggerComponent={
                  (
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 size-4" />

                      {field.value?.start_date ? new Date(field.value.start_date).toLocaleDateString("vi-VN") : t("filters.chooseStartDate")}
                    </Button>
                  )
                }
              />
            </div>

            <div>
              <p className="text-sm mb-2">{t("filters.endDate")}</p>

              <DayPicker
                mode="single"
                selected={field.value?.end_date ? new Date(field.value.end_date) : undefined}
                onSelect={
                  date => field.onChange({
                    ...field.value,
                    end_date: date?.toISOString() || "",
                  })
                }
                TriggerComponent={
                  (
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 size-4" />

                      {field.value?.end_date ? new Date(field.value.end_date).toLocaleDateString("vi-VN") : t("filters.chooseEndDate")}
                    </Button>
                  )
                }
              />
            </div>
          </div>
        ),
      },
    ],
    []
  )

  const handleFiltersChange = React.useCallback(
    (updatedFilters: Record<string, unknown>) => {
      if (onFiltersChange) {
        onFiltersChange(updatedFilters as SearchTrafficSeoCampaigns)
      }
    }, [onFiltersChange]
  )

  return (
    <FiltersContent
      defaultFilters={defaultFilters}
      filters={filters}
      onFiltersChange={handleFiltersChange}
      fields={fields}
      hasBack
    />
  )
}
