import {
  ViewDepositDetail,
} from "~/features/deposit/components/view-deposit-detail"

export default function DepositDetailPage({ params }: { params: {
  id: number
} }) {
  return (
    <div className="p-8">
      <ViewDepositDetail id={params.id} />
    </div>
  )
}
