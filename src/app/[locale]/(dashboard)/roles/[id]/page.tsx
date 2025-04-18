import {
  UpdateRole,
} from "~/features/role/components/update-role"

export default function UpdateRolePage({ params }: { params: {
  id: number
} }) {
  return (
    <UpdateRole id={params.id} />
  )
}
