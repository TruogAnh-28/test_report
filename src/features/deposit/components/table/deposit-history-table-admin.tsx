"use client"

import React from "react"

import {
  type VisibilityState, type ColumnDef, getCoreRowModel, useReactTable,
} from "@tanstack/react-table"
import {
  CheckCircle, Trash, XCircle,
} from "lucide-react"

import {
  DepositStatus,
  type SearchDeposits,
  type Deposit,
} from "~/features/deposit/type/deposit"
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
import {
  type ApiResponse,
} from "~/types/api"

export interface DepositsTableAdminProps extends BaseDataTableProps, TableToolbarProps {
  data?: Deposit[]
  onDelete?: (id: number) => Promise<ApiResponse<boolean>>
  onApprove?: (id: number) => Promise<ApiResponse<boolean>>
  onReject?: (id: number) => Promise<ApiResponse<boolean>>
  onDeleteSuccess?: () => void
  onApproveSuccess?: () => void
  onRejectSuccess?: () => void
  filters?: SearchDeposits
  total?: number
  hasSelection?: boolean
  columnVisibility?: VisibilityState
}

export function DepositHistoryTableAdmin({
  data,
  filters,
  total,
  onFiltersChange,
  onDelete,
  onApprove,
  onReject,
  onDeleteSuccess,
  onApproveSuccess,
  onRejectSuccess,
  onFilterClick,
  hasSelection,
  FiltersComponent,
  hasFilters,
  hasReset,
  columnVisibility: columnVisibilityProp,
  ...props
}: DepositsTableAdminProps) {
  const getStatusBadge = (status: DepositStatus) => {
    if (status === DepositStatus.PENDING)
      return (
        <Badge
          variant="outline"
          className="bg-warning/20 text-warning"
        >
          Chờ xử lý
        </Badge>
      )

    if (status === DepositStatus.APPROVED)
      return (
        <Badge
          variant="outline"
          className="bg-success/20 text-success"
        >
          Đã duyệt
        </Badge>
      )

    if (status === DepositStatus.REJECTED)
      return (
        <Badge
          variant="outline"
          className="bg-destructive/20 text-destructive"
        >
          Từ chối
        </Badge>
      )

    return <Badge variant="outline">Không xác định</Badge>
  }

  const columns = React.useMemo<ColumnDef<Deposit>[]>(
    () => {
      const selectColumn: ColumnDef<Deposit>[] = hasSelection
        ? []
        : []
      return [
        ...selectColumn,
        {
          header: "Mã giao dịch",
          meta: {
            columnName: "Mã giao dịch",
          },
          accessorKey: "codeTransaction",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {row.original.codeTransaction}
            </div>
          ),
        },
        {
          header: "Người dùng",
          meta: {
            columnName: "Người dùng",
          },
          accessorKey: "userName",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {row.original.userName || "N/A"}
            </div>
          ),
        },
        {
          header: "Số tiền",
          meta: {
            columnName: "Số tiền",
          },
          accessorKey: "amount",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center font-semibold">
              {row.original.amount.toLocaleString()}

              {" "}
              đ
            </div>
          ),
        },
        {
          header: "Phương thức",
          meta: {
            columnName: "Phương thức",
          },
          accessorKey: "method",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {row.original.method}
            </div>
          ),
        },
        {
          header: "Mã Voucher",
          meta: {
            columnName: "Mã Voucher",
          },
          accessorKey: "voucherCode",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {row.original.voucherCode || "Không có"}
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
            <div className="flex gap-3 items-center">
              {getStatusBadge(row.original.status)}
            </div>
          ),
        },
        {
          header: "Ngày tạo",
          meta: {
            columnName: "Ngày tạo",
          },
          accessorKey: "createdAt",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {new Date(row.original.createdAt).toLocaleDateString("vi-VN")}
            </div>
          ),
        },
        {
          id: "actions",
          header: () => <p className="text-center">Tùy chỉnh</p>,
          meta: {
            columnName: "Tùy chỉnh",
            allowClick: false,
          },
          maxSize: 120,
          enableHiding: false,
          cell: ({ row }) => (
            <TooltipProvider delayDuration={100}>
              <div className="flex gap-1 justify-center">
                {
                  row.original.status === DepositStatus.PENDING && onApprove && onReject ? (
                    <React.Fragment>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={
                              () =>
                                confirmAlert({
                                  onAction: () => onApprove(row.original.id),
                                  onActionSuccess: onApproveSuccess,
                                  document: {
                                    title: "Xác nhận duyệt nạp tiền",
                                    descriptions: "Bạn có chắc chắn muốn duyệt giao dịch nạp tiền này?",
                                    action: "Duyệt",
                                  },
                                })
                            }
                            title="Duyệt"
                            variant="ghost"
                            size="icon"
                            className="size-8 hover:text-success hover:bg-success/20"
                          >
                            <CheckCircle />
                          </Button>
                        </TooltipTrigger>

                        <TooltipContent>Duyệt</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={
                              () =>
                                confirmAlert({
                                  onAction: () => onReject(row.original.id),
                                  onActionSuccess: onRejectSuccess,
                                  document: {
                                    title: "Xác nhận từ chối nạp tiền",
                                    descriptions: "Bạn có chắc chắn muốn từ chối giao dịch nạp tiền này?",
                                    action: "Từ chối",
                                  },
                                })
                            }
                            title="Từ chối"
                            variant="ghost"
                            size="icon"
                            className="size-8 hover:text-destructive hover:bg-destructive/20"
                          >
                            <XCircle />
                          </Button>
                        </TooltipTrigger>

                        <TooltipContent>Từ chối</TooltipContent>
                      </Tooltip>
                    </React.Fragment>
                  ) : null
                }

                {
                  onDelete ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={
                            () =>
                              confirmAlert({
                                onAction: () => onDelete(row.original.id),
                                onActionSuccess: onDeleteSuccess,
                                document: {
                                  title: "Xác nhận xóa giao dịch",
                                  descriptions: "Bạn có chắc chắn muốn xóa giao dịch nạp tiền này?",
                                  action: "Xóa",
                                },
                              })
                          }
                          title="Xóa"
                          variant="ghost"
                          size="icon"
                          className="size-8 hover:text-destructive hover:bg-destructive/20 hover:dark:bg-destructive hover:dark:text-white"
                        >
                          <Trash />
                        </Button>
                      </TooltipTrigger>

                      <TooltipContent>Xóa</TooltipContent>
                    </Tooltip>
                  ) : null
                }
              </div>
            </TooltipProvider>
          ),
        },
      ]
    },
    [
      onApprove,
      onReject,
      onDelete,
      onApproveSuccess,
      onRejectSuccess,
      onDeleteSuccess,
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
