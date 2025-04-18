import {
  type TransactionFilter,
  type Transaction,
} from "~/features/transaction/type/transaction"
import {
  api,
} from "~/lib/modules/api"
import {
  type ApiResponse,
} from "~/types/api"

export const searchTransactions = async (filters: TransactionFilter) => {
  const response = await api.post<ApiResponse<{
    list: Transaction[]
    total: number
  }>>(
    "/transactions/search", filters
  )
  return response
}
