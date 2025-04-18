import {
  type SearchTrafficSeoCampaigns, type SearchTrafficSeoCampaignsResponse,
  type TrafficSeoCampaigns, type TrafficSeoCampaignsInput,
} from "~/features/traffic-seo-campaigns/type/traffic-seo-campaigns"
import {
  api,
} from "~/lib/modules/api"
import {
  type ApiResponse,
} from "~/types/api"

export const getAllTrafficSeoCampaigns = async () => {
  const response = await api.get<ApiResponse<TrafficSeoCampaigns[]>>("/traffic-seo-campaigns")
  return response
}

export const getTrafficSeoCampaigns = async (data: {
  id: number
}) => {
  const response = await api.get<ApiResponse<TrafficSeoCampaigns>>(`/campaigns/${data.id}`)
  return response
}

export const createTrafficSeoCampaigns = async (data: TrafficSeoCampaignsInput) => {
  const response = await api.post<ApiResponse<null>>(
    "/traffic-seo-campaigns", data
  )
  return response
}

export const updateTrafficSeoCampaigns = async (
  id: number, data: TrafficSeoCampaignsInput
) => {
  const response = await api.put<ApiResponse<null>>(
    `/traffic-seo-campaigns/${id}`, data
  )
  return response
}

export const deleteTrafficSeoCampaigns = async (id: number) => {
  const response = await api.delete<ApiResponse<null>>(`/traffic-seo-campaigns/${id}`)
  return response
}

export const updateAvatar = async (data: {
  image_link: string | undefined
}) => {
  const response = await api.post<ApiResponse<null>>(
    "/traffic-seo-campaigns/updateAvatar", data
  )
  return response
}

export const searchTrafficSeoCampaigns = async (filters: SearchTrafficSeoCampaigns) => {
  const searchParams = {
    ...filters,
    campaignTypeId: 1,
  }

  const response = await api.post<ApiResponse<SearchTrafficSeoCampaignsResponse>>(
    "/campaigns/search", searchParams
  )
  return response
}
