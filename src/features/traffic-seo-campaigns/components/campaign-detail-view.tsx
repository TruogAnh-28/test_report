"use client"

import React from "react"

import Link from "next/link"

import {
  ArrowLeft,
  CalendarIcon,
  Edit2,
  ExternalLink,
  Globe,
  Laptop,
  LayoutDashboard,
  Link as LinkIcon,
  Plus,
  Smartphone,
  Tablet,
  Trash,
} from "lucide-react"

import {
  deleteKeywordApi,
  deleteLinkApi,
} from "~/features/traffic-seo-campaigns/api/traffic-seo-campaigns-api-extension"
import {
  KeywordEditor,
} from "~/features/traffic-seo-campaigns/components/keyword-editor"
import {
  LinkEditor,
} from "~/features/traffic-seo-campaigns/components/link-editor"
import {
  SheetsContainer,
} from "~/shared/components/dialogs/sheets-container"
import {
  confirmAlert,
} from "~/shared/components/dialogs/use-confirm-alert"
import {
  showDialog,
} from "~/shared/components/dialogs/use-open-dialog"
import {
  Badge,
} from "~/shared/components/ui/badge"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "~/shared/components/ui/card"
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "~/shared/components/ui/tabs"
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "~/shared/components/ui/tooltip"
import {
  cn,
} from "~/shared/utils"

// Mock data
const MOCK_CAMPAIGN_DATA = {
  id: 1,
  name: "Chiến dịch SEO Trang chủ",
  domain: "example.com",
  device: "desktop",
  search: "Google",
  startDate: "2025-03-01",
  endDate: "2025-06-30",
  status: "ACTIVE",
  totalTraffic: 45680,
  cost: 8750000,
  createdAt: "2025-02-15",
  keywords: [
    {
      id: 1,
      name: "Digital marketing services",
      traffic: 12500,
      distribution: "EVEN",
      url: [
        "https://example.com/services",
        "https://example.com/digital-marketing",
      ],
    },
    {
      id: 2,
      name: "SEO company Vietnam",
      traffic: 8700,
      distribution: "FRONT",
      url: [
        "https://example.com/about-us",
        "https://example.com/contact",
      ],
    },
    {
      id: 3,
      name: "Best marketing agency",
      traffic: 6200,
      distribution: "BACK",
      url: [
        "https://example.com/portfolio",
        "https://example.com/case-studies",
      ],
    },
    {
      id: 4,
      name: "Web design services",
      traffic: 5300,
      distribution: "EVEN",
      url: ["https://example.com/web-design"],
    },
    {
      id: 5,
      name: "Social media marketing",
      traffic: 4200,
      distribution: "FRONT",
      url: [
        "https://example.com/social-media",
        "https://example.com/facebook-marketing",
      ],
    },
  ],
  links: [
    {
      id: 1,
      anchorText: "Dịch vụ marketing chuyên nghiệp",
      link: "https://blog.example.com/marketing-trends",
      linkTo: "https://example.com/services",
      traffic: 7800,
      status: "ACTIVE",
    },
    {
      id: 2,
      anchorText: "Thiết kế website responsive",
      link: "https://forum.webdesign.org/responsive-design",
      linkTo: "https://example.com/web-design",
      traffic: 5400,
      status: "ACTIVE",
    },
    {
      id: 3,
      anchorText: "SEO trang web hiệu quả",
      link: "https://seo-forum.vn/tips-and-tricks",
      linkTo: "https://example.com/seo-services",
      traffic: 4900,
      status: "PAUSED",
    },
  ],
}

export interface CampaignDetailViewProps {
  id: number
}

export function CampaignDetailView({ id }: CampaignDetailViewProps) {
  // Use mock data directly instead of query
  const campaign = {
    data: MOCK_CAMPAIGN_DATA,
  }
  // const isLoading = false
  // const isError = false
  // const error = null

  const handleEditKeyword = (keywordId?: number) => {
    const keyword = keywordId ? campaign?.data.keywords?.find(k => k.id === keywordId) : undefined
    showDialog(
      "edit-keyword", {
        campaignId: id,
        keyword,
      }
    )
  }

  const handleEditLink = (linkId?: number) => {
    const link = linkId ? campaign?.data.links?.find(l => l.id === linkId) : undefined
    showDialog(
      "edit-link", {
        campaignId: id,
        link,
      }
    )
  }

  const handleDeleteKeyword = (keywordId: number) => {
    confirmAlert({
      document: {
        title: "Xóa từ khóa",
        descriptions: "Bạn có chắc chắn muốn xóa từ khóa này không? Hành động này không thể hoàn tác.",
        action: "Xóa từ khóa",
      },
      onAction: async () => {
        const response = await deleteKeywordApi(keywordId)
        if (response.status) {
          return Promise.resolve({
            message: "Đã xóa từ khóa thành công",
          })
        }
        return Promise.reject({
          message: "Đã có lỗi xảy ra",
        })
      },
    })
  }

  const handleDeleteLink = (linkId: number) => {
    confirmAlert({
      document: {
        title: "Xóa liên kết",
        descriptions: "Bạn có chắc chắn muốn xóa liên kết này không? Hành động này không thể hoàn tác.",
        action: "Xóa liên kết",
      },
      onAction: () => {
        deleteLinkApi(linkId)
        return Promise.resolve({
          message: "Đã xóa liên kết thành công",
        })
      },
    })
  }

  const campaignData = campaign?.data
  if (!campaignData) return <div>Không tìm thấy dữ liệu chiến dịch</div>

  // Format dates for display
  const formatDate = (date: Date | string) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString(
      "vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    )
  }

  // Get device icon based on device type
  const getDeviceIcon = () => {
    if (campaignData.device === "desktop")
      return <Laptop className="size-5" />
    if (campaignData.device === "mobile")
      return <Smartphone className="size-5" />
    if (campaignData.device === "tablet")
      return <Tablet className="size-5" />
    if (campaignData.device === "all")
      return <Globe className="size-5" />
  }

  // Get status badge
  const getStatusBadge = () => {
    let variant: "default" | "destructive" | "outline" | "secondary" = "outline"
    let className = ""
    if (campaignData.status === "ACTIVE") {
      variant = "outline"
      className = "bg-success/20 text-success border-success/20"
    }
    if (campaignData.status === "PAUSED") {
      variant = "secondary"
    }
    if (campaignData.status === "SCHEDULED") {
      variant = "outline"
      className = "bg-warning/20 text-warning border-warning/20"
    }
    if (campaignData.status === "COMPLETED") {
      variant = "outline"
      className = "bg-success/20 text-success border-success/20"
    }
    if (campaignData.status === "CANCELED") {
      variant = "destructive"
      className = "bg-destructive/20 text-destructive border-destructive/20"
    }
    return (
      <Badge
        variant={variant}
        className={className}
      >
        {
          campaignData.status === "ACTIVE" ? "Đang hoạt động"
            : campaignData.status === "PAUSED" ? "Tạm dừng"
              : campaignData.status === "SCHEDULED" ? "Lên lịch" : campaignData.status
        }
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            asChild
          >
            <Link href="/traffic-seo-campaigns">
              <ArrowLeft className="size-4 mr-2" />
              Quay lại
            </Link>
          </Button>

          <h1 className="text-xl font-semibold">{campaignData.name}</h1>

          {getStatusBadge()}
        </div>

        <div>
          <Button asChild>
            <Link href={`/traffic-seo-campaigns/${id}`}>
              <Edit2 className="size-4 mr-2" />
              Sửa chiến dịch
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Thông tin chiến dịch</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Tên miền</h3>

              <div className="flex items-center mt-1">
                <Globe className="mr-2 size-4 text-primary" />

                <a
                  href={`https://${campaignData.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  {campaignData.domain}

                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Thiết bị</h3>

              <div className="flex items-center mt-1">
                {getDeviceIcon()}

                <span className="ml-2">
                  {
                    campaignData.device === "desktop" ? "Desktop"
                      : campaignData.device === "mobile" ? "Mobile"
                        : campaignData.device === "tablet" ? "Tablet" : "Tất cả thiết bị"
                  }
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Công cụ tìm kiếm</h3>

              <p className="mt-1">{campaignData.search || "Không xác định"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Thời gian</h3>

              <div className="flex flex-col gap-1 mt-1">
                <div className="flex items-center">
                  <CalendarIcon className="size-4 mr-2 text-muted-foreground" />

                  <span>
                    Bắt đầu:
                    {formatDate(campaignData.startDate)}
                  </span>
                </div>

                <div className="flex items-center">
                  <CalendarIcon className="size-4 mr-2 text-muted-foreground" />

                  <span>
                    Kết thúc:
                    {formatDate(campaignData.endDate)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Hiệu suất</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Tổng lượng traffic</h3>

              <p className="text-2xl font-bold mt-1">{campaignData.totalTraffic.toLocaleString()}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Chi phí</h3>

              <p className="text-2xl font-bold mt-1">
                {campaignData.cost.toLocaleString()}

                {" "}
                đ
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Chi phí trung bình</h3>

              <p className="text-xl font-bold mt-1">
                {Math.round(campaignData.cost / campaignData.totalTraffic).toLocaleString()}

                {" "}
                đ/lượt
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tóm tắt</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Từ khóa</h3>

              <p className="text-2xl font-bold mt-1">{campaignData.keywords?.length || 0}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Liên kết</h3>

              <p className="text-2xl font-bold mt-1">{campaignData.links?.length || 0}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Ngày tạo</h3>

              <p className="mt-1">{formatDate(campaignData.createdAt || new Date())}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="keywords">
        <TabsList>
          <TabsTrigger
            value="keywords"
            className="flex gap-2 items-center"
          >
            <LayoutDashboard className="size-4" />

            <span>Từ khóa</span>
          </TabsTrigger>

          <TabsTrigger
            value="links"
            className="flex gap-2 items-center"
          >
            <LinkIcon className="size-4" />

            <span>Liên kết</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="keywords"
          className="mt-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Từ khóa</h2>

            <Button onClick={() => handleEditKeyword()}>
              <Plus className="size-4 mr-2" />
              Thêm từ khóa
            </Button>
          </div>

          {
            campaignData.keywords && campaignData.keywords.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {
                  campaignData.keywords.map(keyword => (
                    <Card
                      key={keyword.id}
                      className="overflow-hidden"
                    >
                      <div className="bg-muted px-4 py-3 flex justify-between items-center">
                        <h3 className="font-medium truncate">{keyword.name}</h3>

                        <div className="flex gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8"
                                  onClick={() => handleEditKeyword(keyword.id)}
                                >
                                  <Edit2 className="size-4" />
                                </Button>
                              </TooltipTrigger>

                              <TooltipContent>Sửa</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8 hover:text-destructive hover:bg-destructive/20"
                                  onClick={() => handleDeleteKeyword(keyword.id)}
                                >
                                  <Trash className="size-4" />
                                </Button>
                              </TooltipTrigger>

                              <TooltipContent>Xóa</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>

                      <CardContent className="p-4 space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Traffic</p>

                          <p className="font-medium">{keyword.traffic.toLocaleString()}</p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">Phân phối</p>

                          <p className="font-medium capitalize">{keyword.distribution.toLowerCase()}</p>
                        </div>

                        {
                          keyword.url && keyword.url.length > 0 ? (
                            <div>
                              <p className="text-sm text-muted-foreground">
                                URL (
                                {keyword.url.length}
                                )
                              </p>

                              <div className="mt-1 space-y-1 max-h-24 overflow-y-auto">
                                {
                                  keyword.url.map(url => (
                                    <div
                                      key={url}
                                      className="flex items-center gap-1"
                                    >
                                      <LinkIcon className="size-3.5 shrink-0 text-muted-foreground" />

                                      <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-primary hover:underline truncate"
                                      >
                                        {url}
                                      </a>
                                    </div>
                                  ))
                                }
                              </div>
                            </div>
                          ) : null
                        }
                      </CardContent>
                    </Card>
                  ))
                }
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Chưa có từ khóa nào cho chiến dịch này</p>

                <Button
                  onClick={() => handleEditKeyword()}
                  className="mt-4"
                >
                  <Plus className="size-4 mr-2" />
                  Thêm từ khóa
                </Button>
              </Card>
            )
          }
        </TabsContent>

        <TabsContent
          value="links"
          className="mt-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Liên kết</h2>

            <Button onClick={() => handleEditLink()}>
              <Plus className="size-4 mr-2" />
              Thêm liên kết
            </Button>
          </div>

          {
            campaignData.links && campaignData.links.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {
                  campaignData.links.map(link => (
                    <Card
                      key={link.id}
                      className="overflow-hidden"
                    >
                      <div className="bg-muted px-4 py-3 flex justify-between items-center">
                        <h3 className="font-medium truncate">{link.anchorText || "Link " + link.id}</h3>

                        <div className="flex gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8"
                                  onClick={() => handleEditLink(link.id)}
                                >
                                  <Edit2 className="size-4" />
                                </Button>
                              </TooltipTrigger>

                              <TooltipContent>Sửa</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8 hover:text-destructive hover:bg-destructive/20"
                                  onClick={() => handleDeleteLink(link.id)}
                                >
                                  <Trash className="size-4" />
                                </Button>
                              </TooltipTrigger>

                              <TooltipContent>Xóa</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>

                      <CardContent className="p-4 space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Link nguồn</p>

                          <a
                            href={link.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary hover:underline flex items-center gap-1 truncate"
                          >
                            {link.link}

                            <ExternalLink className="size-3.5 shrink-0" />
                          </a>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">Link đích</p>

                          <a
                            href={link.linkTo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary hover:underline flex items-center gap-1 truncate"
                          >
                            {link.linkTo}

                            <ExternalLink className="size-3.5 shrink-0" />
                          </a>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Traffic</p>

                            <p className="font-medium">{link.traffic.toLocaleString()}</p>
                          </div>

                          <div>
                            <p className="text-sm text-muted-foreground">Trạng thái</p>

                            <Badge
                              variant={link.status === "ACTIVE" ? "outline" : "secondary"}
                              className={
                                cn(link.status === "ACTIVE" && "bg-success/20 text-success border-success/20")
                              }
                            >
                              {link.status === "ACTIVE" ? "Hoạt động" : link.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                }
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Chưa có liên kết nào cho chiến dịch này</p>

                <Button
                  onClick={() => handleEditLink()}
                  className="mt-4"
                >
                  <Plus className="size-4 mr-2" />
                  Thêm liên kết
                </Button>
              </Card>
            )
          }
        </TabsContent>
      </Tabs>

      <SheetsContainer
        content={
          [
            {
              accessorKey: "edit-keyword",
              children: (ctx) => {
                const props = {
                  ...(typeof ctx.value === "object" && ctx.value !== null ? ctx.value : {
                  }),
                  campaignId: (ctx.value as any)?.campaignId || id,
                  onCloseSheet: ctx.onClose,
                }
                return <KeywordEditor {...props} />
              },
            },
            {
              accessorKey: "edit-link",
              children: (ctx) => {
                const props = {
                  ...(typeof ctx.value === "object" && ctx.value !== null ? ctx.value : {
                  }),
                  campaignId: (ctx.value as any)?.campaignId || id,
                  onCloseSheet: ctx.onClose,
                }
                return <LinkEditor {...props} />
              },
            },
          ]
        }
      />
    </div>
  )
}
