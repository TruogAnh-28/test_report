import {
  z,
} from "zod"

export enum TransactionStatus {
  PAY = "PAY",
  REFUND = "REFUND",
  CHARGE = "CHARGE",
}

export const transactionFilterSchema = z.object({
  key: z.string().optional(),
  limit: z.number(),
  page: z.number(),
  walletId: z.number().optional(),
  status: z.nativeEnum(TransactionStatus).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
})

export type TransactionFilter = z.infer<typeof transactionFilterSchema>

export type Transaction = {
  id: number
  walletId: number
  amount: number
  status: TransactionStatus
  date: string
  createdAt: string
  updatedAt: string
}

export type SearchTransactionsResponse = {
  list: Transaction[]
  total: number
}
