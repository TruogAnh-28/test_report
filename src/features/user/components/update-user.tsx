"use client"

import {
  useQuery,
} from "@tanstack/react-query"

import {
  getUser,
} from "~/features/user/api/user"
import {
  UserForm,
} from "~/features/user/components/forms/user-form"
import {
  Loading,
} from "~/shared/components/shared/loading"

export function UpdateUser({ id }: { id: number }) {
  const {
    data: user, isLoading,
  } = useQuery({
    queryKey: ["getUser"],
    queryFn: () => getUser({
      id,
    }),
  })
  if (isLoading) return <Loading />
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-row items-center justify-between">

        <h1 className="text-xl font-semibold capitalize">Chỉnh sửa tài khoản</h1>

      </div>

      <UserForm
        values={user?.data}
      />
    </div>
  )
}
