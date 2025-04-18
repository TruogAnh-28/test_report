/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getSession,
} from "next-auth/react"
import {
  toast,
} from "sonner"

const apiUrl = process.env.NEXT_PUBLIC_API_ENDPOINT_URL
// Hàm lấy token từ localStorage hoặc cookie
const getAuthToken = async (): Promise<string | null> => {
  const session = await getSession()
  return session?.user?.token || null
}

// Hàm request chung với generic chỉ cho dữ liệu trả về
export const request = async <TResponse>(
  method: string,
  endpoint: string,
  body?: any,
  isAuthRequired = true,
  isFormData = false // Thêm flag để xác định FormData
): Promise<TResponse> => {
  const token = isAuthRequired ? await getAuthToken() : null
  const headers: Record<string, string> = {
  }

  if (isAuthRequired && token) {
    headers.Authorization = `Bearer ${token}`
  }

  // Nếu không phải FormData thì thêm Content-Type JSON
  if (!isFormData) {
    headers["Content-Type"] = "application/json"
  }

  try {
    const response = await fetch(
      `${apiUrl}${endpoint}`, {
        method,
        headers,
        body: body ? (isFormData ? body : JSON.stringify(body)) : undefined, // Không stringify FormData
      }
    )

    const data: TResponse = await response.json()

    if (response.status === 402) {
      toast.info("Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại")
      localStorage.removeItem("token")
      window.location.href = "/login"
      throw new Error("Token expired")
    }

    if (!response.ok) {
      throw new Error("Đã có lỗi xảy ra")
    }

    return data
  }
  catch (error) {
    toast.error("Có lỗi khi gọi API")
    throw error
  }
}

export const api = {
  get: <TResponse>(endpoint: string, isAuthRequired = true) =>
    request<TResponse>(
      "GET", endpoint, undefined, isAuthRequired
    ),
  post: <TResponse>(endpoint: string, body: any, isAuthRequired = true) =>
    request<TResponse>(
      "POST", endpoint, body, isAuthRequired
    ),
  put: <TResponse>(endpoint: string, body: any, isAuthRequired = true) =>
    request<TResponse>(
      "PUT", endpoint, body, isAuthRequired
    ),
  delete: <TResponse>(endpoint: string, isAuthRequired = true) =>
    request<TResponse>(
      "DELETE", endpoint, undefined, isAuthRequired
    ),
}
