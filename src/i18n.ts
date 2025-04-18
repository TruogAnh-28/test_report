import {
  createSharedPathnamesNavigation,
} from "next-intl/navigation"

// Define locales and paths
export const locales = [
  "en",
  "vi",
]
export const defaultLocale = "vi"

// Create navigation functions that handle locale detection
export const {
  Link, redirect, usePathname, useRouter,
} = createSharedPathnamesNavigation({
  locales,
  localePrefix: "as-needed",
})
