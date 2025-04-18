"use client"

import React, {
  useState, useEffect,
} from "react"

import {
  zodResolver,
} from "@hookform/resolvers/zod"
import {
  useMutation,
} from "@tanstack/react-query"
import {
  AlertCircle,
} from "lucide-react"
import {
  useSession,
} from "next-auth/react"
import {
  useTranslations,
} from "next-intl"
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
  createDeposit, createDepositUSDT,
} from "~/features/deposit/api/deposit"
import {
  useVoucher,
} from "~/features/deposit/store/use-voucher"
import {
  PaymentMethod,
  type CreateDepositRequest,
  type CreateDepositUSDTRequest,
} from "~/features/deposit/type/deposit"
import {
  TextInput,
} from "~/shared/components/inputs/text-input"
import {
  Alert, AlertDescription, AlertTitle,
} from "~/shared/components/ui/alert"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "~/shared/components/ui/card"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "~/shared/components/ui/form"
import {
  Input,
} from "~/shared/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "~/shared/components/ui/select"
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "~/shared/components/ui/tabs"

// Define the schema using imported types
const depositFormSchema = z.object({
  amount: z.number().min(
    10000, "Số tiền tối thiểu là 10,000đ"
  ).max(
    100000000, "Số tiền tối đa là 100,000,000đ"
  ),
  paymentMethod: z.nativeEnum(PaymentMethod).default(PaymentMethod.ONLINE),
  voucherId: z.number().optional(),
  unit: z.string().optional(),
})

type DepositFormValues = z.infer<typeof depositFormSchema>

export function DepositForm() {
  const t = useTranslations("deposit")
  const { data: session } = useSession()
  const userId = session?.user?.id
  const [
    voucherCode,
    setVoucherCode,
  ] = useState<string>("")
  const [
    totalAmount,
    setTotalAmount,
  ] = useState<number>(0)

  const {
    voucherData,
    checkVoucher,
    isLoading: isCheckingVoucher,
    reset: resetVoucher,
  } = useVoucher()

  const form = useForm<DepositFormValues>({
    resolver: zodResolver(depositFormSchema),
    defaultValues: {
      amount: 0,
      paymentMethod: PaymentMethod.ONLINE,
      voucherId: 1,
      unit: "",
    },
  })

  const watchAmount = form.watch("amount")
  const watchPaymentMethod = form.watch("paymentMethod")
  const isUSDTPayment = watchPaymentMethod.startsWith("USDT")

  useEffect(
    () => {
      const amount = parseFloat(watchAmount?.toString() || "0") || 0

      if (voucherData?.isValid) {
        setTotalAmount(amount + (amount * voucherData.value / 100))
      }
      else {
        setTotalAmount(amount)
      }
    }, [
      watchAmount,
      voucherData,
    ]
  )

  const depositMutation = useMutation({
    mutationFn: (data: CreateDepositRequest | CreateDepositUSDTRequest) => {
      if (isUSDTPayment && "unit" in data) {
        return createDepositUSDT(data)
      }
      return createDeposit(data as CreateDepositRequest)
    },
    onSuccess: (response) => {
      if (response.data?.checkoutUrl) {
        window.open(
          response.data.checkoutUrl, "_blank"
        )
        toast.success("Đã mở trang thanh toán trong tab mới")
      }
      else {
        toast.success(response.message || "Đã gửi yêu cầu nạp tiền thành công")
      }
      form.reset()
      setVoucherCode("")
      resetVoucher()
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi gửi yêu cầu")
    },
  })

  const handleCheckVoucher = () => {
    if (!voucherCode) {
      toast.error(t("voucher.error"))
      return
    }

    checkVoucher(voucherCode)
  }

  const handleUnitChange = (value: string) => {
    form.setValue(
      "unit", value
    )
  }

  const handleTabChange = (value: PaymentMethod) => {
    form.setValue(
      "paymentMethod", value
    )
  }

  const onSubmit = async (data: DepositFormValues) => {
    // For USDT payment methods
    if (!userId) {
      toast.error("Vui lòng đăng nhập để tiếp tục")
      return
    }
    if (isUSDTPayment && !data.unit) {
      toast.error("Vui lòng chọn đơn vị tiền tệ")
      return
    }
    if (isUSDTPayment && data.unit) {
      const depositData: CreateDepositUSDTRequest = {
        userId: userId,
        amount: data.amount,
        paymentMethodId: data.paymentMethod === PaymentMethod.USDT_TRC20 ? 1 : 2,
        voucherId: voucherData?.id || 1,
        unit: data.unit,
      }

      depositMutation.mutate(depositData)
    }
    else {
      const depositData: CreateDepositRequest = {
        userId: userId,
        amount: data.amount,
        paymentMethodId: 3,
        voucherId: voucherData?.id || 1,
      }

      depositMutation.mutate(depositData)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">{t("form.title")}</CardTitle>

          <CardDescription className="text-center">
            {t("form.description")}
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Amount field */}
              <FormField
                control={form.control}
                name="amount"
                render={
                  ({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel required>{t("form.amount")}</FormLabel>

                      <FormControl>
                        <TextInput
                          {...field}
                          type="number"
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                          placeholder={t("form.enterAmount")}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )
                }
              />

              {/* Phương thức thanh toán */}
              <FormField
                control={form.control}
                name="paymentMethod"
                render={
                  ({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.selectPaymentMethod")}</FormLabel>

                      <FormControl>
                        <Tabs
                          defaultValue={PaymentMethod.ONLINE}
                          value={field.value}
                          onValueChange={value => handleTabChange(value as PaymentMethod)}
                          className="w-full"
                        >
                          <TabsList className="grid grid-cols-3 mb-6">
                            <TabsTrigger
                              value={PaymentMethod.ONLINE}
                              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                            >
                              {t("form.paymentMethods.online")}
                            </TabsTrigger>

                            <TabsTrigger
                              value={PaymentMethod.USDT_TRC20}
                              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                            >
                              USDT-TRC20
                            </TabsTrigger>

                            <TabsTrigger
                              value={PaymentMethod.USDT_ERC20}
                              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                            >
                              USDT-ERC20
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value={PaymentMethod.ONLINE}>
                            <div className="border border-primary rounded-lg p-4 cursor-pointer bg-primary/5">
                              <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                  <AlertCircle className="size-5 text-primary" />
                                </div>

                                <div className="flex-1">
                                  <h4 className="font-medium">{t("form.paymentMethods.onlineName")}</h4>

                                  <p className="text-sm text-muted-foreground">{t("form.paymentMethods.onlineDesc")}</p>
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent
                            value={PaymentMethod.USDT_TRC20}
                            className="space-y-4"
                          >
                            <Alert className="bg-primary/10 border border-primary">
                              <AlertTitle>{t("form.wallet.instructions")}</AlertTitle>

                              <AlertDescription className="text-sm">
                                {t("form.wallet.instructionsDescTrc20")}
                              </AlertDescription>
                            </Alert>

                            <FormField
                              control={form.control}
                              name="unit"
                              render={
                                ({ field }) => (
                                  <FormItem>
                                    <FormLabel required>{t("form.wallet.selectUnit")}</FormLabel>

                                    <Select
                                      onValueChange={handleUnitChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder={t("form.wallet.selectUnitPlaceholder")} />
                                        </SelectTrigger>
                                      </FormControl>

                                      <SelectContent>
                                        <SelectItem value="USDT">USDT</SelectItem>

                                        <SelectItem value="BUSD">BUSD</SelectItem>

                                        <SelectItem value="USDC">USDC</SelectItem>
                                      </SelectContent>
                                    </Select>

                                    <p className="text-xs text-muted-foreground mt-1">
                                      {t("form.wallet.unitHelp")}
                                    </p>

                                    <FormMessage />
                                  </FormItem>
                                )
                              }
                            />
                          </TabsContent>

                          <TabsContent
                            value={PaymentMethod.USDT_ERC20}
                            className="space-y-4"
                          >
                            <Alert className="bg-primary/10 border border-primary">
                              <AlertTitle>{t("form.wallet.instructions")}</AlertTitle>

                              <AlertDescription className="text-sm">
                                {t("form.wallet.instructionsDescErc20")}
                              </AlertDescription>
                            </Alert>

                            <FormField
                              control={form.control}
                              name="unit"
                              render={
                                ({ field }) => (
                                  <FormItem>
                                    <FormLabel required>{t("form.wallet.selectUnit")}</FormLabel>

                                    <Select
                                      onValueChange={handleUnitChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder={t("form.wallet.selectUnitPlaceholder")} />
                                        </SelectTrigger>
                                      </FormControl>

                                      <SelectContent>
                                        <SelectItem value="USDT">USDT</SelectItem>

                                        <SelectItem value="ETH">ETH</SelectItem>

                                        <SelectItem value="USDC">USDC</SelectItem>
                                      </SelectContent>
                                    </Select>

                                    <p className="text-xs text-muted-foreground mt-1">
                                      {t("form.wallet.unitHelp")}
                                    </p>

                                    <FormMessage />
                                  </FormItem>
                                )
                              }
                            />
                          </TabsContent>
                        </Tabs>
                      </FormControl>
                    </FormItem>
                  )
                }
              />

              {/* Phần Voucher */}
              <div className="mb-6">
                <FormLabel htmlFor="voucher">{t("form.voucherCode")}</FormLabel>

                <div className="flex space-x-2">
                  <Input
                    id="voucher"
                    placeholder={t("form.voucherCodePlaceholder")}
                    value={voucherCode}
                    onChange={e => setVoucherCode(e.target.value)}
                    className={`flex-1 ${voucherData === null ? "" : voucherData?.isValid ? "border-green-500" : "border-red-500"}`}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCheckVoucher}
                    isLoading={isCheckingVoucher}
                  >
                    {t("form.applyVoucher")}
                  </Button>
                </div>

                {
                  voucherData?.isValid ? (
                    <p className="text-sm text-green-600 mt-1">
                      {t("voucher.applied")}

                      {" "}

                      +
                      {voucherData.value}
                      %
                    </p>
                  ) : null
                }
              </div>

              {/* Total amount display */}
              {
                totalAmount > 0 && (
                  <Alert className="bg-accent/20 border-accent mb-6">
                    <AlertTitle>{t("form.totalAfterDiscount")}</AlertTitle>

                    <AlertDescription className="font-semibold">
                      {totalAmount.toLocaleString("vi-VN")}

                      {" "}

                      đ

                      {
                        voucherData?.isValid ? (
                          <span className="text-green-600 ml-2">
                            (+
                            {voucherData.value}
                            %)
                          </span>
                        ) : null
                      }
                    </AlertDescription>
                  </Alert>
                )
              }

              {/* Payment notice */}
              <Alert className="bg-blue-500/10 border-blue-500/30">
                <AlertCircle className="size-4 text-blue-500" />

                <AlertTitle>{t("form.paymentNotice")}</AlertTitle>

                <AlertDescription>
                  {t("form.paymentNoticeDesc")}
                </AlertDescription>
              </Alert>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={depositMutation.isPending || !form.formState.isValid || watchAmount <= 0}
                isLoading={depositMutation.isPending}
              >
                {t("form.confirm")}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <div className="mt-6 p-4 bg-accent/10 rounded-lg">
        <h3 className="font-semibold mb-2">
          {t("form.note")}
          :
        </h3>

        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>{t("form.noteItems.checkInfo")}</li>

          <li>{t("form.noteItems.processingTime")}</li>

          <li>{t("form.noteItems.support")}</li>
        </ul>
      </div>
    </div>
  )
}
