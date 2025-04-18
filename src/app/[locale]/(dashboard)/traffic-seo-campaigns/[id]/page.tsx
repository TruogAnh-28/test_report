import {
  UpdateTrafficSeoCampaigns,
} from "~/features/traffic-seo-campaigns/components/update-traffic-seo-campaigns"

export default function UpdateTrafficSeoCampaignsPage({ params }: { params: {
  id: number
} }) {
  return (
    <UpdateTrafficSeoCampaigns id={params.id} />
  )
}
