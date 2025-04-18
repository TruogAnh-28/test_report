import {
  signOut,
} from "next-auth/react"

import {
  type LoginUser, type LoginGoolgeInput, type LoginInput,
  type UpdateProfileInput,
} from "~/features/auth/type/auth"
import {
  api,
} from "~/lib/modules/api"
import {
  type ApiResponse,
} from "~/types/api"

export const login = async (data: LoginInput) => {
  const response = await api.post<ApiResponse<LoginUser>>(
    "/auth", data
  )
  return response
}
export const logOut = async () => {
  signOut({
    callbackUrl: "/en/login",
  })
  return {
    data: null,
    message: "Log out thành công!",
    status: true,
  }
  // try {
  //   const response = await api.post<ApiResponse<null>>("/user/logout")
  //   return response
  // }
  // catch (error) {
  //   // eslint-disable-next-line no-console
  //   console.log(error)
  // }
}
export const loginGoogle = async (data: LoginGoolgeInput) => {
  const response = await api.post<ApiResponse<LoginUser>>(
    "/auth/goolge-login", data
  )

  return response
}
export const changePassword = async (data: {
  old_password: string
  new_password: string
}) => {
  const response = await api.post<ApiResponse<null>>(
    "/employees/updatePassword", data
  )

  return response
}

export const updateProfile = async (data: UpdateProfileInput) => {
  const response = await api.post<ApiResponse<null>>(
    "/auth/updateProfile", data
  )

  return response
}
