/* eslint-disable no-restricted-syntax */
import {
  type LucideIcon,
  House,
  UserRoundCog,
  UsersRound,
  CircleDollarSign,
  FileText,
  CreditCard,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"

import {
  type PermissionCode,
} from "~/types/permission-code"

export interface MenuItem {
  children?: MenuItem[]
  icon?: LucideIcon
  title: string
  url?: string
  separator?: boolean
  permissionCode?: PermissionCode | PermissionCode[]
  isSupperAdminOnly?: boolean
}

export function useSidebarContent(): MenuItem[] {
  const t = useTranslations("sidebar")

  return [
    {
      icon: House,
      title: t("home"),
      url: "/",
    },
    {
      icon: FileText,
      title: t("reports"),
      url: "/reports",
    },
    {
      icon: CircleDollarSign,
      title: t("campaigns.title"),
      children: [
        {
          title: t("campaigns.traffic"),
          url: "/traffic-seo-campaigns",
        },
        {
          title: t("campaigns.backlink"),
          url: "/backlink-campaigns",
        },
      ],
    },
    {
      icon: CreditCard,
      title: t("transactions.title"),
      children: [
        {
          title: t("transactions.deposit"),
          url: "/deposit",
        },
        {
          title: t("transactions.depositHistory"),
          url: "/deposit-history",
        },
        {
          title: t("transactions.transactionHistory"),
          url: "/transactions",
        },
        {
          title: t("transactions.depositVerification"),
          url: "/deposit-history-admin",
        },
      ],
    },
    {
      icon: UserRoundCog,
      title: t("accounts.title"),
      children: [
        {
          title: t("accounts.employees"),
          url: "/employees",
        },
        {
          title: t("accounts.users"),
          url: "/users",
        },
      ],
    },
    {
      icon: UsersRound,
      title: t("permissions.title"),
      children: [
        {
          title: t("permissions.permissionsList"),
          url: "/permissions",
          // permissionCode: "search-permission",
        },
        {
          title: t("permissions.rolesList"),
          url: "/roles",
          // permissionCode: "search-role",
        },
      ],
    },
  ]
}
