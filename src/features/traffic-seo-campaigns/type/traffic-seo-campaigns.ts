// src/features/traffic-seo-campaigns/type/traffic-seo-campaigns.ts
import {
  z,
} from "zod"

// Schema for Links
const linkSchema = z.object({
  link: z.string().min(
    1, "Vui lòng nhập link nguồn"
  ),
  linkTo: z.string().min(
    1, "Vui lòng nhập link đích"
  ),
  distribution: z.string(),
  traffic: z.number().int().min(
    0, "Traffic không thể nhỏ hơn 0"
  ),
  anchorText: z.string(),
  status: z.string(), // Enum string for LinkStatus
  url: z.string(),
  page: z.string(),
  id: z.number().optional(),
})

// Schema for Keywords
const keywordSchema = z.object({
  name: z.string().min(
    1, "Vui lòng nhập tên từ khóa"
  ),
  url: z.array(z.string()),
  distribution: z.string(), // Enum string for DistributionType
  traffic: z.number().int().min(
    0, "Traffic không thể nhỏ hơn 0"
  ),
  id: z.number().optional(),
})

// Schema for TrafficSeoCampaigns
export const trafficSeoCampaignsSchema = z.object({
  name: z.string().min(
    1, "Vui lòng nhập tên chiến dịch"
  ),
  type: z.string().optional(),
  device: z.string().optional(),
  timeCode: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  totalTraffic: z.number().min(
    0, "Tổng traffic không thể nhỏ hơn 0"
  ).optional(),
  cost: z.number().min(
    0, "Chi phí không thể nhỏ hơn 0"
  ).optional(),
  domain: z.string().min(
    1, "Vui lòng nhập tên miền"
  ),
  search: z.string().optional(),
  status: z.string().optional(),
  keywords: z.array(keywordSchema).optional(),
  links: z.array(linkSchema).optional(),
})

export type TrafficSeoCampaignsInput = z.infer<typeof trafficSeoCampaignsSchema>

export type Keyword = {
  id?: number
  campaignId?: number
  name: string
  url: string[]
  distribution: string
  traffic: number
  createdAt?: Date
  updatedAt?: Date
}

export type Link = {
  id?: number
  campaignId?: number
  link: string
  linkTo: string
  distribution: string
  traffic: number
  anchorText: string
  status: string
  url: string
  page: string
  createdAt?: Date
  updatedAt?: Date
}

export enum CampaignStatus {
  NOT_STARTED = "NOT_STARTED",
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  COMPLETED = "COMPLETED",
}

export type TrafficSeoCampaigns = {
  id: number
  userId?: number
  countryId?: number
  campaignTypeId?: number
  name: string
  type: string
  device: string
  timeCode: string
  startDate: Date | string
  endDate: Date | string
  totalTraffic: number
  cost: number
  domain: string
  search: string
  status: string
  createdAt?: Date
  updatedAt?: Date
  keywords?: Keyword[]
  links?: Link[]
}

export type TrafficSeoCampaignsAdmin = TrafficSeoCampaigns & {
  user_name: string
}

export type SearchTrafficSeoCampaignsResponse = {
  campaigns: TrafficSeoCampaigns[]
  total: number
}

export type SearchTrafficSeoCampaigns = {
  key: string
  limit: number
  page: number
  campaignTypeId: number
  userId?: number
  device?: string
  status?: string
  domain?: string
  date_range?: {
    start_date: string
    end_date: string
  }
  role_ids?: Array<number>
}
