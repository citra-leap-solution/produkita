import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)
const COOKIE_NAME = process.env.COOKIE_NAME! || "bebekpalupi"

const AUTH_PATHS = ["/login", "/register", "/otp"]
const DASHBOARD_PATH = "/dashboard"
const VALID_ROLES = ["superadmin", "admin", "user"] as const
type UserRole = (typeof VALID_ROLES)[number]

const getAuthenticatedRole = async (token: string | undefined): Promise<UserRole | null> => {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return VALID_ROLES.find((role) => role === payload.role) ?? null
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(COOKIE_NAME)?.value
  const role = await getAuthenticatedRole(token)
  const authenticated = role !== null

  const isAuthPath = AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
  const isDashboardPath =
    pathname === DASHBOARD_PATH || pathname.startsWith(`${DASHBOARD_PATH}/`)

  if (isDashboardPath && !authenticated) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isDashboardPath && role !== "user" && pathname !== DASHBOARD_PATH) {
    return NextResponse.redirect(new URL(DASHBOARD_PATH, request.url))
  }

  if (isAuthPath && authenticated) {
    return NextResponse.redirect(new URL(DASHBOARD_PATH, request.url))
  }

  return NextResponse.next()
}
