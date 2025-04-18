"use client"

import React from "react"

import {
  useQuery,
} from "@tanstack/react-query"
import {
  useSession,
} from "next-auth/react"
import {
  useTranslations,
} from "next-intl"

import {
  useUrlState,
} from "~/shared/hooks/state/use-url-state"

import {
  searchTransactions,
} from "~/features/transaction/api/transaction"
import {
  TransactionHistoryFilters,
} from "~/features/transaction/components/filters/transaction-history-filters"
import {
  TransactionHistoryTable,
} from "~/features/transaction/components/table/transaction-history-table"
import {
  type TransactionFilter,
} from "~/features/transaction/type/transaction"

export function ViewTransactionHistory() {
  const t = useTranslations("transaction")
  const { data: session } = useSession()
  const walletId = session?.user?.walletId
  const defaultFilters: TransactionFilter = {
    key: "",
    page: 1,
    limit: 10,
    status: undefined,
    start_date: undefined,
    end_date: undefined,
    walletId: walletId,
  }

  const [
    filters,
    setFilters,
  ] = useUrlState<TransactionFilter>(defaultFilters)

  const {
    data: transactionsData,
    refetch,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "searchTransactions",
      filters,
    ],
    queryFn: () => searchTransactions(filters),
  })

  const handleFilterClick = () => {
    refetch()
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-semibold font-[Phudu] capitalize">{t("title")}</h1>
      </div>

      <TransactionHistoryTable
        data={transactionsData?.data.list || []}
        total={transactionsData?.data.total}
        filters={filters}
        onFiltersChange={setFilters}
        onFilterClick={handleFilterClick}
        FiltersComponent={
          (
            <TransactionHistoryFilters
              filters={filters}
              onFiltersChange={setFilters}
            />
          )
        }
        hasFilters
        hasReset
        error={error}
        isLoading={isLoading}
      />
    </div>
  )
}
