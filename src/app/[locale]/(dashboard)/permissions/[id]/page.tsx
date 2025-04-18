import {
  UpdatePermission,
} from "~/features/permission/components/update-permission"

export default function UpdatePermissionPage({ params }: { params: {
  id: number
} }) {
  return (
    <UpdatePermission id={params.id} />
  )
}
