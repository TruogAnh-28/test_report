import { addDays, format } from "date-fns"
import { type CampaignStat, type KeywordData, type DomainData } from "~/features/reports/types/report"
import { mockTrafficSeoCampaigns } from "~/features/traffic-seo-campaigns/components/data/traffic-seo-campaigns-mocks"
import { mockBacklinkCampaigns } from "~/features/backlink-campaigns/components/data/backlink-campaigns-mocks"

/**
 * Tạo dữ liệu traffic theo thời gian cho một chiến dịch
 * @param campaignId Id của chiến dịch
 * @returns Mảng dữ liệu thống kê theo ngày
 */
export function generateTrafficData(campaignId: number): CampaignStat[] {
  // Tìm chiến dịch từ dữ liệu mẫu
  const campaign = mockTrafficSeoCampaigns.find(c => c.id === campaignId) || mockTrafficSeoCampaigns[0]

  // Sử dụng ID chiến dịch làm seed để tạo dữ liệu ngẫu nhiên nhưng nhất quán
  const seed = campaignId % 10

  // Tạo dữ liệu cho 30 ngày
  const result: CampaignStat[] = []
  const today = new Date()

  // Chia tổng traffic thành các đơn vị nhỏ hơn theo ngày
  const baseTraffic = Math.floor(campaign.totalTraffic / 30)

  for (let i = 29; i >= 0; i--) {
    const day = addDays(today, -i)
    const dayOfMonth = day.getDate()

    // Tạo biến động dựa trên ngày trong tháng và seed
    const variance = Math.sin(dayOfMonth * seed / 10) * 0.3 + 1

    // Làm tròn thành số nguyên và đảm bảo giá trị dương
    const value = Math.max(10, Math.round(baseTraffic * variance))

    result.push({
      date: format(day, "dd/MM"),
      value
    })
  }

  return result
}

/**
 * Tạo dữ liệu thống kê backlink theo thời gian cho một chiến dịch
 * @param campaignId Id của chiến dịch
 * @returns Mảng dữ liệu thống kê theo ngày
 */
export function generateBacklinkData(campaignId: number): CampaignStat[] {
  // Tìm chiến dịch từ dữ liệu mẫu
  const campaign = mockBacklinkCampaigns.find(c => c.id === campaignId) || mockBacklinkCampaigns[0]

  // Sử dụng ID chiến dịch làm seed để tạo dữ liệu ngẫu nhiên nhưng nhất quán
  const seed = campaignId % 7

  // Tạo dữ liệu cho 30 ngày
  const result: CampaignStat[] = []
  const today = new Date()

  // Chia tổng backlink thành các đơn vị nhỏ hơn theo ngày, với xu hướng tăng dần
  const baseBacklink = Math.floor(campaign.totalTraffic / 40)
  let cumulativeBacklinks = campaign.totalTraffic * 0.65 // Bắt đầu với khoảng 65% tổng số

  for (let i = 29; i >= 0; i--) {
    const day = addDays(today, -i)
    const dayOfMonth = day.getDate()

    // Tạo biến động dựa trên ngày trong tháng và seed
    const dailyGrowth = baseBacklink * (0.8 + (seed * 0.05)) * (1 + Math.sin(dayOfMonth / 10) * 0.2)

    if (i < 29) {
      cumulativeBacklinks += Math.round(dailyGrowth)
    }

    // Đảm bảo không vượt quá tổng số backlink của chiến dịch
    const value = Math.min(Math.round(cumulativeBacklinks), campaign.totalTraffic)

    result.push({
      date: format(day, "dd/MM"),
      value
    })
  }

  return result
}

/**
 * Tạo dữ liệu thống kê từ khóa cho một chiến dịch
 * @param campaignId Id của chiến dịch
 * @returns Mảng dữ liệu từ khóa
 */
export function generateKeywordsData(campaignId: number): KeywordData[] {
  // Danh sách mẫu các từ khóa
  const sampleKeywords = [
    "SEO optimization",
    "Digital marketing",
    "Content strategy",
    "Search traffic",
    "Keyword research",
    "Backlink strategy",
    "Social media marketing",
    "Website traffic",
    "Mobile SEO",
    "Local SEO"
  ]

  // Sử dụng campaignId làm seed để tạo dữ liệu nhất quán
  const seed = campaignId % 5

  return sampleKeywords.slice(0, 5 + seed).map((keyword, index) => {
    // Tạo xếp hạng ngẫu nhiên từ 1-30
    const rank = Math.floor(1 + Math.random() * 30)

    // Tạo biến động xếp hạng từ -5 đến +5
    const change = Math.floor(Math.random() * 11) - 5

    // Tạo traffic ngẫu nhiên dựa trên xếp hạng (xếp hạng càng thấp, traffic càng cao)
    const trafficBase = 1000 - (rank * 20)
    const traffic = Math.max(50, trafficBase + (seed * 100))

    return {
      id: index + 1,
      keyword,
      rank,
      change,
      traffic
    }
  })
}

/**
 * Tạo dữ liệu thống kê top domains cho một chiến dịch
 * @param campaignId Id của chiến dịch
 * @returns Mảng dữ liệu domain
 */
export function generateTopDomainsData(campaignId: number): DomainData[] {
  // Danh sách mẫu các domain
  const sampleDomains = [
    { domain: "example.com", quality: "Cao" },
    { domain: "blog-site.net", quality: "Trung bình" },
    { domain: "news-portal.org", quality: "Cao" },
    { domain: "tech-blog.com", quality: "Cao" },
    { domain: "review-site.net", quality: "Trung bình" },
    { domain: "forum-community.org", quality: "Thấp" },
    { domain: "social-media.com", quality: "Trung bình" },
    { domain: "industry-news.net", quality: "Cao" },
    { domain: "personal-blog.org", quality: "Thấp" },
    { domain: "edu-resource.edu", quality: "Cao" }
  ]

  // Sử dụng campaignId làm seed để tạo dữ liệu nhất quán
  const seed = campaignId % 5

  return sampleDomains.slice(0, 5 + seed).map((item, index) => {
    // Tạo số lượng backlink ngẫu nhiên từ 5-50
    const count = 5 + Math.floor(Math.random() * 46)

    return {
      id: index + 1,
      domain: item.domain,
      quality: item.quality,
      count: count + (index * seed)
    }
  }).sort((a, b) => b.count - a.count) // Sắp xếp theo số lượng giảm dần
}

/**
 * Tạo dữ liệu chiến dịch từ danh sách mẫu
 */
export function formatCampaignStatsOverTime(campaigns: any[]): CampaignStat[] {
  // Lấy 6 tháng gần nhất
  const result: CampaignStat[] = []
  const today = new Date()

  for (let i = 5; i >= 0; i--) {
    // Tạo ngày đầu tháng trước
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth() - i, 1)

    // Đếm số chiến dịch hoạt động trong tháng đó
    const activeInMonth = campaigns.filter(campaign => {
      const startDate = new Date(campaign.startDate)
      const endDate = new Date(campaign.endDate)
      return startDate <= firstDayOfMonth && endDate >= firstDayOfMonth
    })

    // Tính tổng traffic/backlink
    const totalValue = activeInMonth.reduce((sum, campaign) => {
      return sum + Math.round(campaign.totalTraffic / 2) // Chia 2 để có số phù hợp cho biểu đồ
    }, 0)

    result.push({
      date: format(firstDayOfMonth, "MM/yyyy"),
      value: totalValue
    })
  }

  return result
}
