import {
  z,
} from "zod"

export const rolePermissionInputSchema = z.object({
  role_id: z.coerce.number().min(
    0, "Vui lòng chọn chức vụ"
  ),
  permission_id: z.coerce.number().min(
    0, "Vui lòng chọn quyền"
  ),
})

export type RolePermissionInput = z.infer<typeof rolePermissionInputSchema>

export type RolePermission = {
  id: number
  role_id: number
  permission_id: number
}

export type SearchRolePermissions = {
  key: string
  page: number
  limit: number
  role_id: number
}
