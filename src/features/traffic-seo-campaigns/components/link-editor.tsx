"use client"

import React from "react"

import {
  zodResolver,
} from "@hookform/resolvers/zod"
import {
  useForm,
} from "react-hook-form"
import {
  toast,
} from "sonner"
import {
  z,
} from "zod"

import {
  useTrafficSeoCampaignsQuery,
} from "~/features/traffic-seo-campaigns/store/use-traffic-seo-campaigns-query"
import {
  type Link,
} from "~/features/traffic-seo-campaigns/type/traffic-seo-campaigns"
import {
  ChipPicker,
} from "~/shared/components/inputs/chip-picker"
import {
  TextInput,
} from "~/shared/components/inputs/text-input"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  FormControl, FormField, FormItem, FormLabel, FormMessage,

  Form,
} from "~/shared/components/ui/form"
import {
  SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle,
} from "~/shared/components/ui/sheet"

// Schema for link validation
const linkSchema = z.object({
  link: z.string().min(
    1, "Vui lòng nhập link nguồn"
  ),
  linkTo: z.string().min(
    1, "Vui lòng nhập link đích"
  ),
  distribution: z.string(),
  traffic: z.number().int().min(
    0, "Traffic không thể nhỏ hơn 0"
  ),
  anchorText: z.string(),
  status: z.string(),
  url: z.string(),
  page: z.string(),
})

type LinkFormValues = z.infer<typeof linkSchema>

// Status options
const StatusOptions = [
  {
    label: "Hoạt động",
    value: "ACTIVE",
  },
  {
    label: "Vô hiệu",
    value: "INACTIVE",
  },
  {
    label: "Đang xử lý",
    value: "PROCESSING",
  },
]

interface LinkEditorProps {
  campaignId: number
  link?: Link
  onCloseSheet?: () => void
}

export function LinkEditor({
  campaignId, link, onCloseSheet,
}: LinkEditorProps) {
  const {
    updateLink, addLink,
  } = useTrafficSeoCampaignsQuery(campaignId)
  const isEditMode = Boolean(link)

  const form = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      link: link?.link || "",
      linkTo: link?.linkTo || "",
      distribution: link?.distribution || "EVEN",
      traffic: link?.traffic || 0,
      anchorText: link?.anchorText || "",
      status: link?.status || "ACTIVE",
      url: link?.url || "",
      page: link?.page || "",
    },
  })

  const onSubmit = async (values: LinkFormValues) => {
    try {
      if (isEditMode && link) {
        // Update existing link
        await updateLink.mutateAsync({
          ...values,
          id: link.id,
          campaignId,
        })
        toast.success("Liên kết đã được cập nhật")
      }
      else {
        // Add new link
        await addLink.mutateAsync({
          ...values,
          campaignId,
        })
        toast.success("Đã thêm liên kết mới")
      }
      onCloseSheet?.()
    }
    catch {
      toast.error("Đã có lỗi xảy ra")
    }
  }

  return (
    <React.Fragment>
      <SheetHeader className="px-6 py-4">
        <SheetTitle>{isEditMode ? "Sửa liên kết" : "Thêm liên kết mới"}</SheetTitle>
      </SheetHeader>

      <SheetContent className="px-6 overflow-y-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="link"
              render={
                ({ field }) => (
                  <FormItem>
                    <FormLabel required>Link nguồn</FormLabel>

                    <FormControl>
                      <TextInput
                        {...field}
                        placeholder="Nhập link nguồn (ví dụ: https://example.com)"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )
              }
            />

            <FormField
              control={form.control}
              name="linkTo"
              render={
                ({ field }) => (
                  <FormItem>
                    <FormLabel required>Link đích</FormLabel>

                    <FormControl>
                      <TextInput
                        {...field}
                        placeholder="Nhập link đích (ví dụ: https://yourdomain.com/page)"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )
              }
            />

            <FormField
              control={form.control}
              name="anchorText"
              render={
                ({ field }) => (
                  <FormItem>
                    <FormLabel>Anchor Text</FormLabel>

                    <FormControl>
                      <TextInput
                        {...field}
                        placeholder="Nhập anchor text (văn bản hiển thị)"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="traffic"
                render={
                  ({ field }) => (
                    <FormItem>
                      <FormLabel required>Traffic</FormLabel>

                      <FormControl>
                        <TextInput
                          {...field}
                          type="number"
                          placeholder="Nhập traffic"
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          value={field.value}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )
                }
              />

              <FormField
                control={form.control}
                name="distribution"
                render={
                  ({ field }) => (
                    <FormItem>
                      <FormLabel>Phân phối</FormLabel>

                      <FormControl>
                        <TextInput
                          {...field}
                          placeholder="Nhập cách phân phối"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )
                }
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={
                ({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="url"
                render={
                  ({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>

                      <FormControl>
                        <TextInput
                          {...field}
                          placeholder="Nhập URL"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )
                }
              />

              <FormField
                control={form.control}
                name="page"
                render={
                  ({ field }) => (
                    <FormItem>
                      <FormLabel>Trang</FormLabel>

                      <FormControl>
                        <TextInput
                          {...field}
                          placeholder="Nhập trang"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )
                }
              />
            </div>
          </form>
        </Form>
      </SheetContent>

      <SheetFooter className="px-6 py-4">
        <div className="flex justify-end gap-2 w-full">
          <SheetClose asChild>
            <Button
              type="button"
              variant="outline"
            >
              Hủy
            </Button>
          </SheetClose>

          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting}
          >
            {isEditMode ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      </SheetFooter>
    </React.Fragment>
  )
}
