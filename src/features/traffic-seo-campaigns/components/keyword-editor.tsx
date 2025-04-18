"use client"

import React from "react"

import {
  zodResolver,
} from "@hookform/resolvers/zod"
import {
  Plus, Trash,
} from "lucide-react"
import {
  useForm, useFieldArray,
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
  type Keyword,
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

// Schema for keyword validation
const keywordSchema = z.object({
  name: z.string().min(
    1, "Vui lòng nhập tên từ khóa"
  ),
  url: z.array(z.string()),
  distribution: z.string(),
  traffic: z.number().int().min(
    0, "Traffic không thể nhỏ hơn 0"
  ),
})

type KeywordFormValues = z.infer<typeof keywordSchema>

// Distribution options
const DistributionOptions = [
  {
    label: "Đều",
    value: "EVEN",
  },
  {
    label: "Ngày",
    value: "DAY",
  },
  {
    label: "Tuần",
    value: "WEEK",
  },
  {
    label: "Tháng",
    value: "MONTH",
  },
]

interface KeywordEditorProps {
  campaignId: number
  keyword?: Keyword
  onCloseSheet?: () => void
}

export function KeywordEditor({
  campaignId, keyword, onCloseSheet,
}: KeywordEditorProps) {
  const {
    updateKeyword, addKeyword,
  } = useTrafficSeoCampaignsQuery(campaignId)
  const isEditMode = Boolean(keyword)

  const form = useForm<KeywordFormValues>({
    resolver: zodResolver(keywordSchema),
    defaultValues: {
      name: keyword?.name || "",
      url: keyword?.url || [""],
      distribution: keyword?.distribution || "EVEN",
      traffic: keyword?.traffic || 0,
    },
  })

  const {
    fields, append, remove,
  } = useFieldArray({
    control: form.control,
    name: "url",
  })

  const onSubmit = async (values: KeywordFormValues) => {
    try {
      if (isEditMode && keyword) {
        await updateKeyword.mutateAsync({
          ...values,
          id: keyword.id,
          campaignId,
        })
        toast.success("Từ khóa đã được cập nhật")
      }
      else {
        // Add new keyword
        await addKeyword.mutateAsync({
          ...values,
          campaignId,
        })
        toast.success("Đã thêm từ khóa mới")
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
        <SheetTitle>{isEditMode ? "Sửa từ khóa" : "Thêm từ khóa mới"}</SheetTitle>
      </SheetHeader>

      <SheetContent className="px-6 overflow-y-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={
                ({ field }) => (
                  <FormItem>
                    <FormLabel required>Tên từ khóa</FormLabel>

                    <FormControl>
                      <TextInput
                        {...field}
                        placeholder="Nhập tên từ khóa"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )
              }
            />

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
                        placeholder="Nhập traffic cho từ khóa này"
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

            <div className="space-y-2">
              <FormLabel>URLs</FormLabel>

              {
                fields.map((
                  field, index
                ) => (
                  <div
                    key={field.id}
                    className="flex gap-2"
                  >
                    <TextInput
                      {...form.register(`url.${index}`)}
                      placeholder="https://example.com/page"
                      className="flex-1"
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="size-9 shrink-0 hover:text-destructive hover:bg-destructive/20"
                    >
                      <Trash className="size-4" />
                    </Button>
                  </div>
                ))
              }

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append("")}
                className="w-full"
              >
                <Plus className="size-4 mr-2" />
                Thêm URL
              </Button>
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
