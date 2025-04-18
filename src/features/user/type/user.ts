import {
  z,
} from "zod"

export const userInputSchema = z.object({
  username: z.string().min(
    1, "Vui lòng nhập tên người dùng"
  ),
  email: z.string().email(),
  password: z.string().min(
    0, "Vui lòng nhập mật khẩu"
  ),
  role_id: z.coerce.number().min(
    -1, "Vui lòng chọn chức vụ"
  ),

})

export type UserInput = z.infer<typeof userInputSchema>

export type User = {
  id: number
  username: string
  email: string
  password: string
  created_at: string
  gender: number
  role_id: number
  birth_date: string
  role_name: string
  permissions: string[]
  image_link: string
}

export type SearchUsers = {
  key: string
  limit: number
  page: number
  role_ids: Array<number>
}
