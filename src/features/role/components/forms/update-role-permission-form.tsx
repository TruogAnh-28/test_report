/* eslint-disable no-restricted-syntax */
"use client"

import {
  useState,
} from "react"

import {
  useQuery,
} from "@tanstack/react-query"
import {
  toast,
} from "sonner"

import {
  getAllPermissions,
} from "~/features/permission/api/permission"
import {
  createRolePermission, deleteRolePermission, searchRolePermissions,
} from "~/features/role-permission/api/role-permission"
import {
  Loading,
} from "~/shared/components/shared/loading"
import {
  Checkbox,
} from "~/shared/components/ui/checkbox"

export function UpdateRolePermissionForm({ role_id }: { role_id: number }) {
  const [
    isLoading,
    setIsLoading,
  ] = useState(false)
  const {
    data: rolePermissions, isLoading: isRolePermissionLoading, refetch: refetchRolePermissions,
  } = useQuery({
    queryKey: [
      "searchRolePermission",
      role_id,
    ],
    queryFn: () => searchRolePermissions({
      key: "",
      limit: 0,
      page: 0,
      role_id: role_id,
    }),
    enabled: !!role_id,
  })
  const {
    data: permissions, isLoading: isPermissionLoading, refetch: refetchPermissions,
  } = useQuery({
    queryKey: ["getAllPermissions"],
    queryFn: getAllPermissions,
    enabled: !!rolePermissions,
    select: (data) => {
      data.data.forEach((permission) => {
        permission.isChecked = !!rolePermissions?.data.list.find(rolePermission => rolePermission.permission_id === permission.id)
      })

      return data.data
    },
  })
  const handleUpdateRolePermission = async (permission_id: number) => {
    try {
      setIsLoading(true)
      const response = await createRolePermission({
        role_id: role_id,
        permission_id: permission_id,
      })
      refetchRolePermissions()
      refetchPermissions()
      toast.success(response.message || "Cập nhật thành công")
    }
    catch (error) {
      toast.error((error as Error).message || "Cập nhật thất bại")
    }
    finally {
      setIsLoading(false)
    }
  }
  const handleDeleteRolePermission = async (permission_id: number) => {
    const id = rolePermissions?.data.list.find(rolePermission => rolePermission.permission_id === permission_id)?.id
    if (!id) return
    try {
      setIsLoading(true)
      await deleteRolePermission(id)
      refetchRolePermissions()
      refetchPermissions()
      toast.success("Cập nhật thành công")
    }
    catch (error) {
      toast.error((error as Error).message || "Cập nhật thất bại")
    }
    finally {
      setIsLoading(false)
    }
  }
  if (isRolePermissionLoading || isPermissionLoading) return <Loading />
  return (
    <div className="">
      {
        permissions?.map(permission => (
          <div
            key={permission.id}
            className="flex flex-row gap-2 items-center"
          >
            <Checkbox
              checked={permission.isChecked}
              disabled={isLoading}
              value={permission.isChecked ? 1 : 0}
              onCheckedChange={
                (checked) => {
                  if (checked)
                    handleUpdateRolePermission(permission.id)
                  else handleDeleteRolePermission(permission.id)
                }
              }
            />

            {permission.name}
          </div>
        ))
      }
    </div>
  )
}
