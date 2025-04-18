// These functions should be added to your existing src/features/traffic-seo-campaigns/api/traffic-seo-campaigns.ts file

import {
  type Keyword,
  type Link,
} from "~/features/traffic-seo-campaigns/type/traffic-seo-campaigns"
import {
  api,
} from "~/lib/modules/api"
import {
  type ApiResponse,
} from "~/types/api"

// Keyword API functions
export const updateKeywordApi = async (keyword: Keyword) => {
  const response = await api.put<ApiResponse<null>>(
    `/traffic-seo-campaigns/keywords/${keyword.id}`,
    keyword
  )
  return response
}

export const addKeywordApi = async (keyword: Keyword) => {
  const response = await api.post<ApiResponse<null>>(
    "/traffic-seo-campaigns/keywords",
    keyword
  )
  return response
}

export const deleteKeywordApi = async (keywordId: number) => {
  const response = await api.delete<ApiResponse<null>>(`/traffic-seo-campaigns/keywords/${keywordId}`)
  return response
}

// Link API functions
export const updateLinkApi = async (link: Link) => {
  const response = await api.put<ApiResponse<null>>(
    `/traffic-seo-campaigns/links/${link.id}`,
    link
  )
  return response
}

export const addLinkApi = async (link: Link) => {
  const response = await api.post<ApiResponse<null>>(
    "/traffic-seo-campaigns/links",
    link
  )
  return response
}

export const deleteLinkApi = async (linkId: number) => {
  const response = await api.delete<ApiResponse<null>>(`/traffic-seo-campaigns/links/${linkId}`)
  return response
}
