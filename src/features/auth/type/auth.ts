import {
  z,
} from "zod"

import {
  type PermissionCode,
} from "~/types/permission-code"

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(
    1, "Vui lòng nhập password"
  ),
})

export type LoginInput = z.infer<typeof loginInputSchema>

export const loginGoogleInputSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  googleId: z.string(),
})

export type LoginGoolgeInput = z.infer<typeof loginGoogleInputSchema>

export const registerInputSchema = z.object({
  name: z.string().min(
    1, "Vui lòng nhập họ tên"
  ),
  email: z.string().email(),
  password: z.string().min(
    1, "Vui lòng nhập password"
  ),
})

export type RegisterInput = z.infer<typeof registerInputSchema>

export type LoginUser = {
  id: number
  name: string
  token: string
  permission: PermissionCode
  image_link: string
  email: string
  gender: number
  phone: string
  address: string
  birth_date: string
  permissions: string[]
  walletId: number | undefined
}

export const changePasswordInputSchema = z.object({
  old_password: z.string().min(
    1, "Vui lòng nhập mật khẩu cũ"
  ),
  new_password: z.string().min(
    1, "Vui lòng nhập mật khẩu mới"
  ),
  password_confirm: z.string().min(
    1, "Vui lòng nhập lại mật khẩu mới"
  ),
}).refine(
  data => data.new_password === data.password_confirm, {
    message: "Không khớp mật khẩu",
    path: ["password_confirm"],
  }
)

export type ChangePasswordInput = z.infer<typeof changePasswordInputSchema>

export const updateProfileInputSchema = z.object({
  name: z.string().min(
    1, "Vui lòng nhập tên người dùng"
  ),
  gender: z.coerce.number().min(
    -1, "Vui lòng chọn trạng thái"
  ),
  phone: z.string().min(
    1, "Vui lòng nhập số điện thoại"
  ),
  address: z.string(),
  birth_date: z.string(),

})

export type UpdateProfileInput = z.infer<typeof updateProfileInputSchema>
