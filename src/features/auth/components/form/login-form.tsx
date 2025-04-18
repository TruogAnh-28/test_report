"use client"

import Link from "next/link"
import {
  useRouter,
} from "next/navigation"

import {
  zodResolver,
} from "@hookform/resolvers/zod"
import {
  signIn,
} from "next-auth/react"
import {
  type SubmitHandler, useForm,
} from "react-hook-form"
import {
  toast,
} from "sonner"

import {
  type LoginInput,
  loginInputSchema,
} from "~/features/auth/type/auth"
import {
  ErrorMessage,
} from "~/shared/components/shared/error-message"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/shared/components/ui/form"
import {
  Input,
} from "~/shared/components/ui/input"
import {
  PasswordButton,
  Password,
  PasswordInput,
} from "~/shared/components/ui/password-input"

export function AuthLoginForm() {
  const router = useRouter()
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema),
  })

  const handleSubmit: SubmitHandler<LoginInput> = async (data) => {
    try {
      const response = await signIn(
        "credentials",
        {
          email: data.email,
          password: data.password,
          redirect: false,
          callbackUrl: "/",
        },
      )

      // localStorage.setItem("token",response.data.token)
      if (!response?.ok || response.error) {
        form.setError(
          "root", {
            message: response?.error ?? "Log in failed",
          }
        )

        return
      }

      router.push(response?.url || "/")
      // router.refresh()
    }
    catch (error) {
      toast.error((error as Error).message || "Log in failed")
    }

    router.refresh()
  }

  return (
    <Form
      {...form}
    >
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div
          className="mb-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={
              ({ field }) =>
                (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">Email</FormLabel>

                    <FormControl>
                      <Input
                        type="text"
                        placeholder="example@mail.com"
                        {...field}
                        className="rounded-full text-xs sm:text-sm"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )
            }
          />
        </div>

        <div
          className="mb-4"
        >
          <FormField
            control={form.control}
            name="password"
            render={
              ({ field }) =>
                (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">Password</FormLabel>

                    <FormControl>
                      <Password>
                        <PasswordInput
                          placeholder="Password"
                          {...field}
                          className="rounded-full text-xs sm:text-sm"
                        />

                        <PasswordButton />
                      </Password>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )
            }
          />
        </div>

        <ErrorMessage
          variant="destructive"
          message={form.formState.errors.root?.message}
          className="mb-4"
        />

        <Button
          isLoading={form.formState.isSubmitting}
          type="submit"
          className="w-full rounded-full bg-accent text-white text-xs sm:text-sm"
        >
          Log in
        </Button>

        {/* <Button
          isLoading={form.formState.isSubmitting}
          type="submit"
          className="w-full rounded-full bg-accent text-white text-xs sm:text-sm"
        >
          Đăng nhập với google
        </Button> */}
        <div
          className="my-5 block sm:flex justify-between items-center"
        >
          <Link
            href="/reset-password"
            className="text-xs font-medium text-accent underline"
          >
            Forget password?
          </Link>
        </div>
      </form>
    </Form>
  )
}
