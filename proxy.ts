import { middleware } from "@/lib/auth/middleware"

export const proxy = middleware

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/otp/:path*", "/forgot-password"],
}
