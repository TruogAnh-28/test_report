import {
  type ReactNode,
} from "react"

// import {
//   redirect,
// } from "next/navigation"

import {
  type Session,
} from "next-auth"

import {
  getServerAuthSession,
} from "~/server/auth"
import {
  AppInitializer,
} from "~/shared/components/app-initializer"
import {
  Header,
} from "~/shared/components/layouts/header/header"
import {
  AppSidebar,
} from "~/shared/components/layouts/sidebar"
import {
  BasePage,
} from "~/shared/components/shared/page-component"
import {
  SidebarInset, SidebarProvider,
} from "~/shared/components/ui/sidebar"

export default async function DashboardLayout({ children }: Readonly<{
  children: ReactNode
}>) {
  const session = await getServerAuthSession()

  // if (!session) {
  //   redirect("/")
  // }

  const sessionMock: Session = {
    user: {
      name: "Test",
      token: "fafsafsafsfsafasfasafafa",
      permission: "search-role",
      image_link: "",
      email: "cyno@gmail.com",
      gender: 1,
      phone: "013131313",
      address: "Cyno",
      birth_date: "18/2/2024",
      permissions: ["search-role"],
    },
    expires: "test",

  }

  return (
    <AppInitializer session={
      session || sessionMock
    }
    >

      <SidebarProvider style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
      >
        <AppSidebar />

        <SidebarInset className="grow">

          <Header />

          <BasePage>
            {children}
          </BasePage>
        </SidebarInset>
      </SidebarProvider>
    </AppInitializer>

  )
}
