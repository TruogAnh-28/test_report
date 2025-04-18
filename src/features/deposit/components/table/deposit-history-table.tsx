"use client"

import React from "react"

import {
  type VisibilityState, type ColumnDef, getCoreRowModel, useReactTable,
} from "@tanstack/react-table"
import {
  useTranslations,
} from "next-intl"

import {
  DepositStatus,
  type SearchDeposits,
  type Deposit,
} from "~/features/deposit/type/deposit"
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

export interface DepositsTableProps extends BaseDataTableProps, TableToolbarProps {
  data?: Deposit[]
  filters?: SearchDeposits
  total?: number
  hasSelection?: boolean
  columnVisibility?: VisibilityState
}

export function DepositHistoryTable({
  data,
  filters,
  total,
  onFiltersChange,
  onFilterClick,
  hasSelection,
  FiltersComponent,
  hasFilters,
  hasReset,
  columnVisibility: columnVisibilityProp,
  ...props
}: DepositsTableProps) {
  const t = useTranslations("deposit")
  const getStatusBadge = (status: DepositStatus) => {
    if (status === DepositStatus.PENDING)
      return (
        <Badge
          variant="outline"
          className="bg-warning/20 text-warning"
        >
          {t("status.pending")}
        </Badge>
      )

    if (status === DepositStatus.COMPLETED)
      return (
        <Badge
          variant="outline"
          className="bg-success/20 text-success"
        >
          {t("status.approved")}
        </Badge>
      )

    if (status === DepositStatus.FAILED)
      return (
        <Badge
          variant="outline"
          className="bg-destructive/20 text-destructive"
        >
          {t("status.rejected")}
        </Badge>
      )

    return (
      <Badge
        variant="outline"
      >
        {t("status.unknown")}
      </Badge>
    )
  }

  const columns = React.useMemo<ColumnDef<Deposit>[]>(
    () => {
      const selectColumn: ColumnDef<Deposit>[] = hasSelection
        ? []
        : []
      return [
        ...selectColumn,
        {
          header: t("table.depositCode"),
          meta: {
            columnName: t("table.depositCode"),
          },
          accessorKey: "codeTransaction",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {row.original.codeTransaction || row.original.orderId || "-"}
            </div>
          ),
        },
        {
          header: t("table.amount"),
          meta: {
            columnName: t("table.amount"),
          },
          accessorKey: "amount",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center font-semibold">
              {row.original.amount.toLocaleString()}
              ₫
            </div>
          ),
        },
        {
          header: t("table.method"),
          meta: {
            columnName: t("table.method"),
          },
          accessorKey: "method",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {row.original.method || "-"}
            </div>
          ),
        },
        {
          header: t("table.voucherCode"),
          meta: {
            columnName: t("table.voucherCode"),
          },
          accessorKey: "voucherCode",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {row.original.voucherCode || t("table.noVoucher")}
            </div>
          ),
        },
        {
          header: t("table.status"),
          meta: {
            columnName: t("table.status"),
          },
          accessorKey: "status",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {getStatusBadge(row.original.status)}
            </div>
          ),
        },
        {
          header: t("table.createdAt"),
          meta: {
            columnName: t("table.createdAt"),
          },
          accessorKey: "createdAt",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {new Date(row.original.createdAt).toLocaleDateString("vi-VN")}
            </div>
          ),
        },
      ]
    },
    [
      t,
      hasSelection,
    ]
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
        right: [],
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
