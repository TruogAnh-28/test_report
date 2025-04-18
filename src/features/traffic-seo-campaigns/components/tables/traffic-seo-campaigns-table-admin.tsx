"use client"

import React from "react"

import {
  type VisibilityState, type ColumnDef, getCoreRowModel, useReactTable,
} from "@tanstack/react-table"
import {
  Edit2, Trash, Calendar, Globe, Laptop, Smartphone, Tablet, ExternalLink,
} from "lucide-react"

import {
  deleteTrafficSeoCampaigns,
} from "~/features/traffic-seo-campaigns/api/traffic-seo-campaigns"
import {
  type SearchTrafficSeoCampaigns, type TrafficSeoCampaignsAdmin,
} from "~/features/traffic-seo-campaigns/type/traffic-seo-campaigns"
import {
  Link,
} from "~/i18n"
import {
  confirmAlert,
} from "~/shared/components/dialogs/use-confirm-alert"
import {
  type BaseDataTableProps, DataTable,
} from "~/shared/components/tables/data-table"
import {
  TableContainer,
} from "~/shared/components/tables/table-container"
import {
  TablePagination,
} from "~/shared/components/tables/table-pagination"
import {
  TableToolbar,
  type TableToolbarProps,
} from "~/shared/components/tables/table-toolbar"
import {
  Badge,
} from "~/shared/components/ui/badge"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "~/shared/components/ui/tooltip"

const formatDate = (date: Date | string) => {
  if (!date) return "N/A"
  const dateObj = typeof date === "string" ? new Date(date) : date
  return dateObj.toLocaleDateString(
    "vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  )
}

const StatusBadge = ({ status }: { status: string }) => {
  let variant: "default" | "destructive" | "outline" | "secondary" = "outline"
  let label = status

  if (status === "ACTIVE") {
    variant = "default"
    label = "Hoạt động"
  }
  if (status === "PAUSED") {
    variant = "default"
    label = "Tạm dừng"
  }
  if (status === "SCHEDULED") {
    variant = "default"
    label = "Lên lịch"
  }

  return <Badge variant={variant}>{label}</Badge>
}

const DeviceIcon = ({ device }: { device: string }) => {
  if (device === "desktop") {
    return <Laptop className="size-4" />
  }
  if (device === "mobile") {
    return <Smartphone className="size-4" />
  }
  if (device === "tablet") {
    return <Tablet className="size-4" />
  }
  return <Globe className="size-4" />
}

export interface TrafficSeoCampaignsTableProps extends BaseDataTableProps, TableToolbarProps {
  data?: TrafficSeoCampaignsAdmin[]
  onDeleteSuccess?: () => void
  filters?: SearchTrafficSeoCampaigns
  total?: number
  hasSelection?: boolean
  columnVisibility?: VisibilityState
}

export function TrafficSeoCampaignsTable({
  data, filters, total, onFiltersChange, onDeleteSuccess, onFilterClick, hasSelection, FiltersComponent, hasFilters, hasReset, columnVisibility: columnVisibilityProp, ...props
}: TrafficSeoCampaignsTableProps) {
  const columns = React.useMemo<ColumnDef<TrafficSeoCampaignsAdmin>[]>(
    () => {
      const selectColumn: ColumnDef<TrafficSeoCampaignsAdmin>[] = hasSelection
        ? []
        : []
      return [
        ...selectColumn,
        {
          header: "Tên người dùng",
          meta: {
            columnName: "Tên người dùng",
          },
          accessorKey: "user_name",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              <Link
                href={`/traffic-seo-campaigns/${row.original.id}`}
                className="font-medium text-blue-600 hover:underline"
              >
                {row.original.user_name}
              </Link>
            </div>
          ),
        },
        {
          header: "Tên chiến dịch",
          meta: {
            columnName: "Tên chiến dịch",
          },
          accessorKey: "name",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              <Link
                href={`/traffic-seo-campaigns/${row.original.id}`}
                className="font-medium text-blue-600 hover:underline"
              >
                {row.original.name}
              </Link>
            </div>
          ),
        },
        {
          header: "Tên miền",
          meta: {
            columnName: "Tên miền",
          },
          accessorKey: "domain",
          cell: ({ row }) => (
            <div className="flex gap-2 items-center">
              <Globe className="size-4 text-muted-foreground" />

              <a
                href={`https://${row.original.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                {row.original.domain}

                <ExternalLink className="size-3" />
              </a>
            </div>
          ),
        },
        {
          header: "Thiết bị",
          meta: {
            columnName: "Thiết bị",
          },
          accessorKey: "device",
          cell: ({ row }) => (
            <div className="flex gap-2 items-center">
              <DeviceIcon device={row.original.device} />

              <span>
                {row.original.device === "desktop" && "Desktop"}

                {row.original.device === "mobile" && "Mobile"}

                {row.original.device === "tablet" && "Tablet"}

                {row.original.device === "all" && "Tất cả thiết bị"}
              </span>
            </div>
          ),
        },
        {
          header: "Traffic",
          meta: {
            columnName: "Traffic",
          },
          accessorKey: "totalTraffic",
          cell: ({ row }) => (
            <div className="font-medium">
              {row.original.totalTraffic.toLocaleString()}
            </div>
          ),
        },
        {
          header: "Chi phí",
          meta: {
            columnName: "Chi phí",
          },
          accessorKey: "cost",
          cell: ({ row }) => (
            <div className="font-medium">
              {row.original.cost.toLocaleString()}

              {" "}
              đ
            </div>
          ),
        },
        {
          header: "Thời gian",
          meta: {
            columnName: "Thời gian",
          },
          accessorKey: "startDate",
          cell: ({ row }) => (
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-xs">
                <Calendar className="size-3 text-muted-foreground" />

                <span>
                  Bắt đầu:
                  {formatDate(row.original.startDate)}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs mt-1">
                <Calendar className="size-3 text-muted-foreground" />

                <span>
                  Kết thúc:
                  {formatDate(row.original.endDate)}
                </span>
              </div>
            </div>
          ),
        },
        {
          header: "Trạng thái",
          meta: {
            columnName: "Trạng thái",
          },
          accessorKey: "status",
          cell: ({ row }) => (
            <StatusBadge status={row.original.status} />
          ),
        },
        {
          id: "actions",
          header: () => <p className="text-center">Tùy chỉnh</p>,
          meta: {
            columnName: "Tùy chỉnh",
            allowClick: false,
          },
          maxSize: 70,
          enableHiding: false,
          cell: ({ row }) => (
            <TooltipProvider delayDuration={100}>
              <div className="flex gap-1 justify-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      title="Sửa"
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 hover:text-destructive hover:bg-destructive/20 hover:dark:bg-destructive hover:dark:text-white"
                    >
                      <Link href={`/traffic-seo-campaigns/${row.original.id}`}>
                        <Edit2 className="size-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>Sửa</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={
                        () =>
                          confirmAlert({
                            onAction: () =>
                              deleteTrafficSeoCampaigns(row.original.id),
                            onActionSuccess: onDeleteSuccess,
                            document: {
                              title: "Xóa chiến dịch",
                              descriptions: "Bạn có chắc chắn muốn xóa chiến dịch này không? Hành động này không thể hoàn tác.",
                              action: "Xóa chiến dịch",
                            },
                          })
                      }
                      title="Xóa"
                      variant="ghost"
                      size="icon"
                      className="size-8 hover:text-destructive hover:bg-destructive/20 hover:dark:bg-destructive hover:dark:text-white"
                    >
                      <Trash className="size-4" />
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>Xóa</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          ),
        },
      ]
    },
    []
  )

  const [
    columnVisibility,
    setColumnVisibility,
  ] = React.useState<VisibilityState>(columnVisibilityProp ?? {
  })

  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnPinning: {
        right: ["actions"],
      },
    },
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    columns: columns,
    data: data ?? [],
    getRowId: (originalRow) => {
      return originalRow.id.toString()
    },
  })

  return (
    <TableContainer>
      <TableToolbar
        table={table}
        filters={filters}
        onFiltersChange={onFiltersChange}
        onFilterClick={onFilterClick}
        FiltersComponent={FiltersComponent}
        hasFilters={hasFilters}
        hasReset={hasReset}
      />

      <DataTable
        table={table}
        {...props}
      />

      <TablePagination
        table={table}
        total={total}
        filters={filters}
        onFiltersChange={onFiltersChange}
      />
    </TableContainer>
  )
}
