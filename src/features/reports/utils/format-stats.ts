import { addDays, format } from "date-fns"
import { type CampaignStat } from "~/features/reports/types/report"

/**
 * Formats campaign stats data over time for visualization
 * @param campaigns Array of campaign data
 * @returns Formatted array of campaign stats by month
 */
export function formatCampaignStatsOverTime(campaigns: any[]): CampaignStat[] {
  // Get the last 6 months
  const result: CampaignStat[] = []
  const today = new Date()

  for (let i = 5; i >= 0; i--) {
    // Create date for the first day of previous month
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth() - i, 1)

    // Count campaigns active during that month
    const activeInMonth = campaigns.filter(campaign => {
      const startDate = new Date(campaign.startDate)
      const endDate = new Date(campaign.endDate)
      return startDate <= firstDayOfMonth && endDate >= firstDayOfMonth
    })

    // Calculate total traffic/backlinks
    const totalValue = activeInMonth.reduce((sum, campaign) => {
      return sum + Math.round(campaign.totalTraffic / 2) // Divide by 2 to get appropriate scale for chart
    }, 0)

    result.push({
      date: format(firstDayOfMonth, "MM/yyyy"),
      value: totalValue
    })
  }

  return result
}

/**
 * Formats daily campaign stats for the last 30 days
 * @param campaign The campaign to analyze
 * @param totalValue The total value to distribute
 * @returns Array of daily stats
 */
export function formatDailyStats(campaign: any, totalValue: number): CampaignStat[] {
  const result: CampaignStat[] = []
  const today = new Date()

  // Base value per day
  const baseValue = totalValue / 30

  for (let i = 29; i >= 0; i--) {
    const day = addDays(today, -i)
    const dayOfMonth = day.getDate()

    // Create some variance based on day of month
    const variance = Math.sin(dayOfMonth / 5) * 0.3 + 1

    // Round to integer and ensure positive value
    const value = Math.max(10, Math.round(baseValue * variance))

    result.push({
      date: format(day, "dd/MM"),
      value
    })
  }

  return result
}

/**
 * Formats growth data for backlinks over time
 * @param campaign The campaign to analyze
 * @returns Array of cumulative backlink stats
 */
export function formatBacklinkGrowth(campaign: any): CampaignStat[] {
  const result: CampaignStat[] = []
  const today = new Date()

  // Start with about 65% of total backlinks
  let cumulativeBacklinks = Math.floor(campaign.totalTraffic * 0.65)
  const dailyGrowth = Math.floor((campaign.totalTraffic - cumulativeBacklinks) / 30)

  for (let i = 29; i >= 0; i--) {
    const day = addDays(today, -i)

    // Add daily growth with some random variation
    if (i < 29) {
      const growthVariance = 0.8 + (Math.random() * 0.4)
      cumulativeBacklinks += Math.round(dailyGrowth * growthVariance)
    }

    // Ensure we don't exceed total backlinks
    const value = Math.min(Math.round(cumulativeBacklinks), campaign.totalTraffic)

    result.push({
      date: format(day, "dd/MM"),
      value
    })
  }

  return result
}
