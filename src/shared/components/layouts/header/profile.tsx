// "use client"

// import { useSession } from "next-auth/react"
// export function Profile () {
//   const { data: session } = useSession()
//   console.log(session)
//   return (
//     <div>
//       {session?.user.name}
//     </div>
//   )
// }
"use client"

import React from "react"

import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  LogOut,
  Moon, UserRoundCog,
} from "lucide-react"
import {
  useSession,
} from "next-auth/react"
import {
  useTheme,
} from "next-themes"

import {
  getUserSession,
} from "~/shared/hooks/data/use-session"
import {
  useLazyRef,
} from "~/shared/hooks/state/use-lazy-ref"

// import {
//   getLangValue,
// } from "~/shared/utils/shared"

import {
  logOut,
} from "~/features/auth/api/auth"
import {
  Link,
} from "~/i18n"
import {
  ChipPicker,
} from "~/shared/components/inputs/chip-picker"
import {
  ImageView,
} from "~/shared/components/shared/image"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,

  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/shared/components/ui/dropdown-menu"
import {
  Tabs, TabsContent,
} from "~/shared/components/ui/tabs"

export function Profile() {
  const { data: session } = useSession()

  return (
    <div
      className="group/menu relative flex"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            role="button"
            className="flex items-center gap-1.5 rounded-full p-1 pr-1.5 bg-secondary"
          >
            <span className="flex size-7 items-center justify-center rounded-full hover:bg-light-primary hover:text-primary group-hover/menu:bg-light-primary group-hover/menu:text-primary">
              <ImageView
                src={session?.user?.image_link}
                isAvatar
                alt="logo"
                height="100"
                width="100"
                className="rounded-full size-7 object-cover"
              />
            </span>

            <span className="font-medium text-sm">{session?.user?.name}</span>

            <ChevronDown className="size-4" />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="space-y-2 p-3 rounded-2xl bg-white"
        >
          <ProfileContent />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

const ThemeOptions = [
  {
    label: "Đang tắt",
    value: "light",
  },
  {
    label: "Đang bật",
    value: "dark",
  },
  {
    label: "Tự động",
    description: "Chúng tôi sẽ tự động điều chỉnh màn hình theo cài đặt hệ thống trên thiết bị của bạn",
    value: "system",
  },
]

function ProfileContent() {
  const userRef = useLazyRef(getUserSession)
  const [
    tabValue,
    setTabValue,
  ] = React.useState("menu")
  const {
    theme,
    setTheme,
  } = useTheme()

  const menuOptions = React.useMemo(
    () => {
      return [
        {
          title: "Hồ sơ",
          description: "Cài đặt tài khoản",
          asChild: true,
          href: "/profile",
          icon: UserRoundCog,
        },
      ]
    }, []
  )

  return (
    <Tabs
      value={tabValue}
      onValueChange={setTabValue}
    >
      <TabsContent
        value="menu"
        className="mt-0 space-y-1 w-60"
      >
        {/* <DropdownMenuLabel className="text-md">{getLangValue(userRef.current?.group.name)}</DropdownMenuLabel> */}

        <div className="py-3">
          <div className="px-2 flex items-center">
            <ImageView
              src={userRef.current?.image_link}
              isAvatar
              alt="logo"
              height="200"
              width="200"
              className="rounded-full size-11 object-cover"
            />

            <div className="ml-3">
              <h5 className="font-medium">{userRef.current?.name}</h5>

              <p className="text-xs opacity-50">
                {userRef.current?.email}
              </p>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        {
          menuOptions.map(it => (
            <DropdownMenuItem
              key={it.title}
              asChild={it.asChild}
              className="group flex items-center rounded-xl cursor-pointer"
            >
              <Link href={it.href}>
                <div className="rounded-full bg-info/20 size-11 grid place-content-center">
                  <it.icon className="text-info size-5" />
                </div>

                <div className="ml-3 flex-1">
                  <h6 className="font-medium">{it.title}</h6>

                  {
                    it.description ? (
                      <p className="text-xs opacity-50">{it.description}</p>
                    ) : null
                  }
                </div>
              </Link>
            </DropdownMenuItem>
          ))
        }

        <DropdownMenuItem
          onClick={
            (e) => {
              e.preventDefault()
              e.stopPropagation()
              setTabValue("theme")
            }
          }
          className="group flex items-center rounded-xl cursor-pointer"
        >
          <div className="rounded-full bg-info/20 size-11 grid place-content-center">
            <Moon className="text-info size-5" />
          </div>

          <div className="ml-3 flex-1">
            <h6 className="font-medium">
              Giao diện
            </h6>
          </div>

          <ChevronRight className="size-5" />
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={
            () => {
              logOut()
            }
          }
          className="group flex items-center rounded-xl cursor-pointer"
        >
          <div className="rounded-full bg-destructive/10 dark:bg-destructive/30 size-11 grid place-content-center">
            <LogOut className="text-destructive size-5" />
          </div>

          <div className="ml-3 flex-1">
            <h6 className="font-medium">
              Đăng xuất
            </h6>
          </div>
        </DropdownMenuItem>
      </TabsContent>

      <TabsContent
        value="theme"
        className="max-w-60 mt-0"
      >
        <div className="space-y-3">
          <div className="flex items-center">
            <Button
              onClick={() => setTabValue("menu")}
              type="button"
              variant="ghost"
              size="icon"
            >
              <ArrowLeft />
            </Button>

            <div className="ml-3">
              <h4 className="text-xl font-semibold">Giao diện</h4>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center">
              <div className="rounded-full bg-info/20 p-2">
                <Moon className="text-info size-5" />
              </div>

              <div className="ml-3">
                <h5 className="font-semibold">Chế độ tối</h5>
              </div>
            </div>

            <div className="ml-9">
              <ChipPicker
                mode="single"
                value={theme}
                onValueChange={value => setTheme(value!)}
                options={ThemeOptions}
                classNames={
                  {
                    group: "*:flex-col *:gap-1",
                  }
                }
                renderItem={
                  option => (
                    <div className="flex-1 w-full p-3 rounded-xl flex items-center gap-2 hover:bg-accent justify-between">
                      <div className="flex flex-col gap-1">
                        <p>{option.label}</p>

                        {
                          option.description ? (
                            <span className="opacity-50 text-[9px] leading-tight">
                              {option.description}
                            </span>
                          ) : null
                        }
                      </div>

                      <div className="shrink-0 size-4 border-2 border-current rounded-full group-data-[state=checked]:border-4 group-data-[state=checked]:border-primary" />
                    </div>
                  )
                }
              />
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
