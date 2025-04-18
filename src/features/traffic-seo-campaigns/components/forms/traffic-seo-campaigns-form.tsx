"use client"

import React from "react"

import {
  zodResolver,
} from "@hookform/resolvers/zod"
import {
  Plus, Trash, Calendar, ChevronDown, ChevronRight, Link as LinkIcon,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"
import {
  type SubmitHandler, useForm, useFieldArray,
} from "react-hook-form"
import {
  toast,
} from "sonner"

import {
  createTrafficSeoCampaigns, updateTrafficSeoCampaigns,
} from "~/features/traffic-seo-campaigns/api/traffic-seo-campaigns"
import {
  type TrafficSeoCampaigns, type TrafficSeoCampaignsInput,
  trafficSeoCampaignsSchema,
} from "~/features/traffic-seo-campaigns/type/traffic-seo-campaigns"
import {
  AppForm, type BaseAppFormProps,
} from "~/shared/components/forms/app-form"
import {
  ChipPicker,
} from "~/shared/components/inputs/chip-picker"
import {
  DayPicker,
} from "~/shared/components/inputs/day-picker"
import {
  TextInput,
} from "~/shared/components/inputs/text-input"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "~/shared/components/ui/card"
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "~/shared/components/ui/collapsible"
import {
  FormControl,
  FormField, FormItem, FormLabel, FormMessage,
} from "~/shared/components/ui/form"

export interface TrafficSeoCampaignsFormProps extends BaseAppFormProps {
  onSubmitSuccess?: () => void
  values?: TrafficSeoCampaigns
}

export function TrafficSeoCampaignsForm({
  onSubmitSuccess, ...props
}: TrafficSeoCampaignsFormProps) {
  const t = useTranslations("trafficSeoCampaigns")
  const DistributionOptions = [
    {
      label: t("form.distributionOptions.day"),
      value: "day",
    },
    {
      label: t("form.distributionOptions.month"),
      value: "month",
    },
    {
      label: t("form.distributionOptions.year"),
      value: "year",
    },
  ]

  const DeviceOptions = [
    {
      label: t("deviceOptions.desktop"),
      value: "desktop",
    },
    {
      label: t("deviceOptions.mobile"),
      value: "mobile",
    },
    {
      label: t("deviceOptions.tablet"),
      value: "tablet",
    },
    {
      label: t("filters.allDevices"),
      value: "all",
    },
  ]

  const StatusOptions = [
    {
      label: t("statusOptions.active"),
      value: "ACTIVE",
    },
    {
      label: t("statusOptions.inactive"),
      value: "INACTIVE",
    },
    {
      label: t("statusOptions.processing"),
      value: "PROCESSING",
    },
  ]

  const form = useForm<TrafficSeoCampaignsInput>({
    resolver: zodResolver(trafficSeoCampaignsSchema),
    defaultValues: {
      name: "",
      type: "traffic-seo",
      device: "all",
      timeCode: "",
      startDate: new Date().toISOString(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
      totalTraffic: 0,
      cost: 0,
      domain: "",
      search: "",
      status: "active",
      keywords: [],
      links: [],
    },
    values: props.values && {
      ...props.values,
      startDate: props.values.startDate instanceof Date ? props.values.startDate.toISOString() : props.values.startDate,
      endDate: props.values.endDate instanceof Date ? props.values.endDate.toISOString() : props.values.endDate,
      keywords: props.values.keywords || [],
      links: props.values.links || [],
    },
  })

  const {
    fields: keywordFields, append: appendKeyword, remove: removeKeyword,
  } = useFieldArray({
    control: form.control,
    name: "keywords",
  })

  const {
    fields: linkFields, append: appendLink, remove: removeLink,
  } = useFieldArray({
    control: form.control,
    name: "links",
  })

  const [
    openKeywordItems,
    setOpenKeywordItems,
  ] = React.useState<Record<number, boolean>>({
  })
  const [
    openLinkItems,
    setOpenLinkItems,
  ] = React.useState<Record<number, boolean>>({
  })

  const toggleKeywordItem = (index: number) => {
    setOpenKeywordItems(prev => ({
      ...prev,
      [index]: !prev[index],
    }))
  }
  const toggleLinkItem = (index: number) => {
    setOpenLinkItems(prev => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const handleSubmit: SubmitHandler<TrafficSeoCampaignsInput> = React.useCallback(
    async (data) => {
      try {
        if (props.isCreate) {
          const response = await createTrafficSeoCampaigns(data)
          toast.success(response.message || t("form.successMessages.create"))
          onSubmitSuccess?.()
          return
        }

        const response = await updateTrafficSeoCampaigns(
          props.values?.id || 0, data
        )

        toast.success(response.message || t("form.successMessages.update"))
        onSubmitSuccess?.()
      }
      catch (error) {
        form.setError(
          "root", {
            message: (error as Error).message ?? t("form.errorMessages.requestFailed"),
          }
        )
      }
    }, [
      onSubmitSuccess,
      props,
    ]
  )

  return (
    <AppForm
      {...props}
      form={form}
      onSubmit={handleSubmit}
      title={t("form.sectionInfo")}
    >
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{t("form.sectionInfo")}</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid lg:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={
                  ({ field }) =>
                    (
                      <FormItem>
                        <FormLabel required>{t("form.name")}</FormLabel>

                        <FormControl>
                          <TextInput
                            {...field}
                            placeholder={t("form.placeholders.name")}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )
                }
              />

              <FormField
                control={form.control}
                name="domain"
                render={
                  ({ field }) =>
                    (
                      <FormItem>
                        <FormLabel required>{t("form.domain")}</FormLabel>

                        <FormControl>
                          <TextInput
                            {...field}
                            placeholder={t("form.placeholders.domain")}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )
                }
              />

              <FormField
                control={form.control}
                name="search"
                render={
                  ({ field }) =>
                    (
                      <FormItem>
                        <FormLabel>{t("form.search")}</FormLabel>

                        <FormControl>
                          <TextInput
                            {...field}
                            placeholder={t("form.placeholders.search")}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )
                }
              />

              <FormField
                control={form.control}
                name="timeCode"
                render={
                  ({ field }) =>
                    (
                      <FormItem>
                        <FormLabel>{t("form.timeCode")}</FormLabel>

                        <FormControl>
                          <TextInput
                            {...field}
                            placeholder={t("form.placeholders.timeCode")}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )
                }
              />

              <FormField
                control={form.control}
                name="totalTraffic"
                render={
                  ({ field }) =>
                    (
                      <FormItem>
                        <FormLabel required>{t("form.totalTraffic")}</FormLabel>

                        <FormControl>
                          <TextInput
                            {...field}
                            type="number"
                            placeholder={t("form.placeholders.totalTraffic")}
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )
                }
              />

              <FormField
                control={form.control}
                name="cost"
                render={
                  ({ field }) =>
                    (
                      <FormItem>
                        <FormLabel required>{t("form.cost")}</FormLabel>

                        <FormControl>
                          <TextInput
                            {...field}
                            type="number"
                            placeholder={t("form.placeholders.cost")}
                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )
                }
              />

              <FormField
                control={form.control}
                name="startDate"
                render={
                  ({ field }) =>
                    (
                      <FormItem className="flex flex-col">
                        <FormLabel>{t("form.startDate")}</FormLabel>

                        <DayPicker
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={date => field.onChange(date?.toISOString())}
                          TriggerComponent={
                            (
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <Calendar className="mr-2 size-4" />

                                {field.value ? new Date(field.value).toLocaleDateString("vi-VN") : t("filters.chooseStartDate")}
                              </Button>
                            )
                          }
                        />

                        <FormMessage />
                      </FormItem>
                    )
                }
              />

              <FormField
                control={form.control}
                name="endDate"
                render={
                  ({ field }) =>
                    (
                      <FormItem className="flex flex-col">
                        <FormLabel>{t("form.endDate")}</FormLabel>

                        <DayPicker
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={date => field.onChange(date?.toISOString())}
                          TriggerComponent={
                            (
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <Calendar className="mr-2 size-4" />

                                {field.value ? new Date(field.value).toLocaleDateString("vi-VN") : t("filters.chooseEndDate")}
                              </Button>
                            )
                          }
                        />

                        <FormMessage />
                      </FormItem>
                    )
                }
              />

              <FormField
                control={form.control}
                name="device"
                render={
                  ({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.device")}</FormLabel>

                      <ChipPicker
                        options={DeviceOptions}
                        mode="single"
                        value={field.value}
                        onValueChange={value => field.onChange(value)}
                        renderItem={
                          option => (
                            <div className="px-2 py-1.5 pr-3 rounded-full border-2 border-input group-data-[state=checked]:border-primary flex items-center gap-2">
                              <div className="size-4 border-2 rounded-full group-data-[state=checked]:border-4 group-data-[state=checked]:border-primary" />

                              {option.label}
                            </div>
                          )
                        }
                      />

                      <FormMessage />
                    </FormItem>
                  )
                }
              />

            </div>
          </CardContent>
        </Card>

        {/* Keywords Section */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>{t("form.keywords.title")}</CardTitle>

              <Button
                type="button"
                onClick={
                  () => {
                    const newIndex = keywordFields.length
                    appendKeyword({
                      name: "",
                      url: [],
                      distribution: "EVEN",
                      traffic: 0,
                    })
                    // Mở từ khóa mới tự động
                    setOpenKeywordItems(prev => ({
                      ...prev,
                      [newIndex]: true,
                    }))
                  }
                }
                variant="outline"
                size="sm"
                className="ml-auto"
              >
                <Plus className="size-4 mr-2" />

                {t("form.keywords.add")}
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {
                keywordFields.length === 0 && (
                  <p className="text-sm text-muted-foreground italic text-center py-4">
                    {t("form.keywords.empty")}
                  </p>
                )
              }

              {
                keywordFields.map((
                  field, index
                ) => (
                  <Collapsible
                    key={field.id}
                    open={openKeywordItems[index]}
                    onOpenChange={() => toggleKeywordItem(index)}
                    className="border rounded-lg"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className="p-0 h-auto flex items-center gap-2 hover:bg-transparent"
                          >
                            {openKeywordItems[index] ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}

                            <div className="flex items-center">
                              <h4 className="text-sm font-semibold">
                                {t("form.keywords.keyword")}

                                {" "}

                                #

                                {index + 1}

                                {field.name ? `: ${field.name}` : ""}
                              </h4>
                            </div>
                          </Button>
                        </CollapsibleTrigger>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeKeyword(index)}
                          className="size-8 hover:text-destructive hover:bg-destructive/20"
                        >
                          <Trash className="size-4" />
                        </Button>
                      </div>
                    </div>

                    <CollapsibleContent>
                      <div className="px-4 pb-4 space-y-4">
                        <div className="grid lg:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`keywords.${index}.name`}
                            render={
                              ({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("form.keywords.name")}</FormLabel>

                                  <FormControl>
                                    <TextInput
                                      {...field}
                                      placeholder={t("form.keywords.placeholders.name")}
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )
                            }
                          />

                          <FormField
                            control={form.control}
                            name={`keywords.${index}.traffic`}
                            render={
                              ({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("form.keywords.traffic")}</FormLabel>

                                  <FormControl>
                                    <TextInput
                                      {...field}
                                      type="number"
                                      placeholder={t("form.keywords.placeholders.traffic")}
                                      onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )
                            }
                          />

                          <FormField
                            control={form.control}
                            name={`keywords.${index}.distribution`}
                            render={
                              ({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("form.keywords.distribution")}</FormLabel>

                                  <ChipPicker
                                    options={DistributionOptions}
                                    mode="single"
                                    value={field.value}
                                    onValueChange={value => field.onChange(value)}
                                    renderItem={
                                      option => (
                                        <div className="px-2 py-1.5 pr-3 rounded-full border-2 border-input group-data-[state=checked]:border-primary flex items-center gap-2">
                                          <div className="size-4 border-2 rounded-full group-data-[state=checked]:border-4 group-data-[state=checked]:border-primary" />

                                          {option.label}
                                        </div>
                                      )
                                    }
                                  />

                                  <FormMessage />
                                </FormItem>
                              )
                            }
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name={`keywords.${index}.url`}
                          render={
                            ({ field }) => (
                              <FormItem>
                                <FormLabel>{t("form.keywords.urls")}</FormLabel>

                                <div className="space-y-2">
                                  {
                                    field.value ? field.value.map((
                                      url, urlIndex
                                    ) => (
                                      <div
                                        key={url || `empty-url-${urlIndex}`}
                                        className="flex gap-2"
                                      >
                                        <FormControl>
                                          <TextInput
                                            value={url}
                                            onChange={
                                              (e) => {
                                                const newUrls = [...field.value]
                                                newUrls[urlIndex] = e.target.value
                                                field.onChange(newUrls)
                                              }
                                            }
                                            placeholder={t("form.keywords.placeholders.url")}
                                            className="flex-1"
                                          />
                                        </FormControl>

                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          onClick={
                                            () => {
                                              const newUrls = [...field.value]
                                              newUrls.splice(
                                                urlIndex, 1
                                              )
                                              field.onChange(newUrls)
                                            }
                                          }
                                          className="size-8 hover:text-destructive hover:bg-destructive/20"
                                        >
                                          <Trash className="size-4" />
                                        </Button>
                                      </div>
                                    )) : null
                                  }

                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={
                                      () => field.onChange([
                                        ...field.value,
                                        "",
                                      ])
                                    }
                                    className="w-full"
                                  >
                                    <Plus className="size-4 mr-2" />

                                    {t("form.keywords.addUrl")}
                                  </Button>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )
                          }
                        />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))
              }
            </div>
          </CardContent>
        </Card>

        {/* Links Section */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>{t("form.links.title")}</CardTitle>

              <Button
                type="button"
                onClick={
                  () => {
                    const newIndex = linkFields.length
                    appendLink({
                      link: "",
                      linkTo: "",
                      distribution: "",
                      traffic: 0,
                      anchorText: "",
                      status: "active",
                      url: "",
                      page: "",
                    })
                    // Mở liên kết mới tự động
                    setOpenLinkItems(prev => ({
                      ...prev,
                      [newIndex]: true,
                    }))
                  }
                }
                variant="outline"
                size="sm"
                className="ml-auto"
              >
                <Plus className="size-4 mr-2" />

                {t("form.links.add")}
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {
                linkFields.length === 0 && (
                  <p className="text-sm text-muted-foreground italic text-center py-4">
                    {t("form.links.empty")}
                  </p>
                )
              }

              {
                linkFields.map((
                  field, index
                ) => (
                  <Collapsible
                    key={field.id}
                    open={openLinkItems[index]}
                    onOpenChange={() => toggleLinkItem(index)}
                    className="border rounded-lg"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className="p-0 h-auto flex items-center gap-2 hover:bg-transparent"
                          >
                            {openLinkItems[index] ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}

                            <div className="flex items-center">
                              <LinkIcon className="size-4 mr-2" />

                              <h4 className="text-sm font-semibold">
                                {t("form.links.link")}

                                {" "}

                                #

                                {index + 1}

                                {field.link ? `: ${field.link}` : ""}
                              </h4>
                            </div>
                          </Button>
                        </CollapsibleTrigger>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLink(index)}
                          className="size-8 hover:text-destructive hover:bg-destructive/20"
                        >
                          <Trash className="size-4" />
                        </Button>
                      </div>
                    </div>

                    <CollapsibleContent>
                      <div className="px-4 pb-4 space-y-4">
                        <div className="grid lg:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`links.${index}.link`}
                            render={
                              ({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("form.links.linkSource")}</FormLabel>

                                  <FormControl>
                                    <TextInput
                                      {...field}
                                      placeholder={t("form.links.placeholders.linkSource")}
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )
                            }
                          />

                          <FormField
                            control={form.control}
                            name={`links.${index}.linkTo`}
                            render={
                              ({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("form.links.linkTarget")}</FormLabel>

                                  <FormControl>
                                    <TextInput
                                      {...field}
                                      placeholder={t("form.links.placeholders.linkTarget")}
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )
                            }
                          />

                          <FormField
                            control={form.control}
                            name={`links.${index}.distribution`}
                            render={
                              ({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("form.links.distribution")}</FormLabel>

                                  <FormControl>
                                    <TextInput
                                      {...field}
                                      placeholder={t("form.links.placeholders.distribution")}
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )
                            }
                          />

                          <FormField
                            control={form.control}
                            name={`links.${index}.traffic`}
                            render={
                              ({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("form.links.traffic")}</FormLabel>

                                  <FormControl>
                                    <TextInput
                                      {...field}
                                      type="number"
                                      placeholder={t("form.links.placeholders.traffic")}
                                      onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )
                            }
                          />

                          <FormField
                            control={form.control}
                            name={`links.${index}.anchorText`}
                            render={
                              ({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("form.links.anchorText")}</FormLabel>

                                  <FormControl>
                                    <TextInput
                                      {...field}
                                      placeholder={t("form.links.placeholders.anchorText")}
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )
                            }
                          />

                          <FormField
                            control={form.control}
                            name={`links.${index}.status`}
                            render={
                              ({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("form.links.status")}</FormLabel>

                                  <ChipPicker
                                    options={StatusOptions}
                                    mode="single"
                                    value={field.value}
                                    onValueChange={value => field.onChange(value)}
                                    renderItem={
                                      option => (
                                        <div className="px-2 py-1.5 pr-3 rounded-full border-2 border-input group-data-[state=checked]:border-primary flex items-center gap-2">
                                          <div className="size-4 border-2 rounded-full group-data-[state=checked]:border-4 group-data-[state=checked]:border-primary" />

                                          {option.label}
                                        </div>
                                      )
                                    }
                                  />

                                  <FormMessage />
                                </FormItem>
                              )
                            }
                          />

                          <FormField
                            control={form.control}
                            name={`links.${index}.url`}
                            render={
                              ({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("form.links.url")}</FormLabel>

                                  <FormControl>
                                    <TextInput
                                      {...field}
                                      placeholder={t("form.links.placeholders.url")}
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )
                            }
                          />

                          <FormField
                            control={form.control}
                            name={`links.${index}.page`}
                            render={
                              ({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("form.links.page")}</FormLabel>

                                  <FormControl>
                                    <TextInput
                                      {...field}
                                      placeholder={t("form.links.placeholders.page")}
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )
                            }
                          />
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))
              }
            </div>
          </CardContent>
        </Card>
      </div>
    </AppForm>
  )
}
