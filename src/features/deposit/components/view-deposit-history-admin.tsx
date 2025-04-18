"use client"

import React from "react"

import {
  useQuery,
} from "@tanstack/react-query"

import {
  useUrlState,
} from "~/shared/hooks/state/use-url-state"

import {
  approveDeposit,
  deleteDeposit,
  rejectDeposit,
  searchDeposits,
} from "~/features/deposit/api/deposit"
import {
  DepositHistoryFilters,
} from "~/features/deposit/components/filters/deposit-history-filters"
import {
  DepositHistoryTableAdmin,
} from "~/features/deposit/components/table/deposit-history-table-admin"
import {
  type DepositStatus,
} from "~/features/deposit/type/deposit"

export function ViewDepositHistoryAdmin() {
  const defaultFilters = {
    key: "",
    page: 1,
    limit: 10,
    status: undefined as DepositStatus | undefined,
    fromDate: undefined as string | undefined,
    toDate: undefined as string | undefined,
    codeTransaction: undefined as string | undefined,
  }

  const [
    filters,
    setFilters,
  ] = useUrlState(defaultFilters)

  const {
    data: deposits,
    refetch,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "searchDeposits",
      filters,
    ],
    queryFn: () => searchDeposits(filters),
  })

  const handleFilterClick = () => {
    refetch()
  }

  const handleApproveSuccess = () => {
    refetch()
  }

  const handleRejectSuccess = () => {
    refetch()
  }

  const handleDeleteSuccess = () => {
    refetch()
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-semibold font-[Phudu] capitalize">Quản lý giao dịch nạp tiền</h1>
      </div>

      <DepositHistoryTableAdmin
        data={deposits?.data.list || []}
        total={deposits?.data.total}
        filters={filters}
        onFiltersChange={setFilters}
        onFilterClick={handleFilterClick}
        FiltersComponent={
          (
            <DepositHistoryFilters
              filters={filters}
              onFiltersChange={setFilters}
            />
          )
        }
        hasFilters
        hasReset
        error={error}
        isLoading={isLoading}
        onDeleteSuccess={handleDeleteSuccess}
        onApproveSuccess={handleApproveSuccess}
        onRejectSuccess={handleRejectSuccess}
        onApprove={approveDeposit}
        onReject={rejectDeposit}
        onDelete={deleteDeposit}
      />
    </div>
  )
}
