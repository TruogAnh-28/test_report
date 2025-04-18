"use client"

import React from "react"

import {
  type VisibilityState,
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  useTranslations,
} from "next-intl"

import {
  TransactionStatus,
  type TransactionFilter,
  type Transaction,
} from "~/features/transaction/type/transaction"
import {
  type BaseDataTableProps,
  DataTable,
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

export interface TransactionHistoryTableProps extends BaseDataTableProps, TableToolbarProps {
  data?: Transaction[]
  filters?: TransactionFilter
  total?: number
  hasSelection?: boolean
  columnVisibility?: VisibilityState
}

export function TransactionHistoryTable({
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
}: TransactionHistoryTableProps) {
  const t = useTranslations("transaction")

  const getStatusBadge = (status: TransactionStatus) => {
    if (status === TransactionStatus.PAY)
      return (
        <Badge
          variant="outline"
          className="bg-success/20 text-success"
        >
          {t("status.pay")}
        </Badge>
      )

    if (status === TransactionStatus.REFUND)
      return (
        <Badge
          variant="outline"
          className="bg-warning/20 text-warning"
        >
          {t("status.refund")}
        </Badge>
      )

    if (status === TransactionStatus.CHARGE)
      return (
        <Badge
          variant="outline"
          className="bg-info/20 text-info"
        >
          {t("status.charge")}
        </Badge>
      )
  }

  const columns = React.useMemo<ColumnDef<Transaction>[]>(
    () => {
      const selectColumn: ColumnDef<Transaction>[] = hasSelection
        ? []
        : []
      return [
        ...selectColumn,
        {
          header: t("table.transactionId"),
          meta: {
            columnName: t("table.transactionId"),
          },
          accessorKey: "id",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              #
              {row.original.id}
            </div>
          ),
        },
        {
          header: t("table.walletId"),
          meta: {
            columnName: t("table.walletId"),
          },
          accessorKey: "walletId",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {row.original.walletId}
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

              {" "}
              ₫
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
          header: t("table.date"),
          meta: {
            columnName: t("table.date"),
          },
          accessorKey: "date",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {
                new Date(row.original.date).toLocaleDateString(
                  "vi-VN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )
              }
            </div>
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
