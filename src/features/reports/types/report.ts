// Các kiểu dữ liệu cho báo cáo

/**
 * Dữ liệu thống kê chiến dịch theo thời gian
 */
export interface CampaignStat {
  date: string
  value: number
}

/**
 * Thông tin dữ liệu keyword
 */
export interface KeywordData {
  id: number
  keyword: string
  rank: number
  change: number
  traffic: number
}

/**
 * Thông tin dữ liệu domain
 */
export interface DomainData {
  id: number
  domain: string
  quality: string
  count: number
}

/**
 * Thông tin phân bổ thiết bị
 */
export interface DeviceDistribution {
  name: string
  value: number
}

/**
 * Thông tin backlink tạo mới
 */
export interface NewBacklink {
  id: number
  source: string
  tld: string
  createdAt: Date
}
