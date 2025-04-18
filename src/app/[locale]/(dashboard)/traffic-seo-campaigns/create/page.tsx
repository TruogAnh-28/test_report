import {
  TrafficSeoCampaignsForm,
} from "~/features/traffic-seo-campaigns/components/forms/traffic-seo-campaigns-form"

export default function CreateTrafficSeoCampaignsPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-semibold font-[Phudu] capitalize">Tạo chiến dịch Traffic SEO mới</h1>
      </div>

      <TrafficSeoCampaignsForm
        isCreate
      />
    </div>
  )
}
