"use client"

import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { useAdmin, type AdminTenantDetailData } from "@/hooks/useAdmin"
import type { AdminTenantListItem } from "@/lib/admin/api"
import { UserDetailPage } from "./partials/detail"
import { UserSearchBar } from "./partials/user-search-bar"
import { UserTable } from "./partials/user-table"

export function UserManagement() {
  const { getTenants, getTenantDetail, loading, error } = useAdmin()
  const [users, setUsers] = useState<AdminTenantListItem[]>([])
  const [search, setSearch] = useState("")
  const [selectedUser, setSelectedUser] = useState<AdminTenantListItem | null>(null)
  const [detail, setDetail] = useState<AdminTenantDetailData | null>(null)

  useEffect(() => {
    let active = true
    void getTenants().then((result) => {
      if (active && result) setUsers(result)
    })
    return () => { active = false }
  }, [getTenants])

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("id-ID")
    if (!query) return users
    return users.filter((user) =>
      [user.name, user.package, user.status].some((value) =>
        value.toLocaleLowerCase("id-ID").includes(query)
      )
    )
  }, [search, users])

  const openDetail = async (user: AdminTenantListItem) => {
    setSelectedUser(user)
    setDetail(null)
    const result = await getTenantDetail(user.uuid)
    if (result) setDetail(result)
  }

  const closeDetail = () => {
    setSelectedUser(null)
    setDetail(null)
  }

  if (selectedUser) {
    if (!detail) {
      return (
        <Card className="rounded-2xl border-slate-200 p-8 text-center shadow-none">
          <p className={error ? "text-red-600" : "text-slate-500"}>
            {error ?? (loading ? "Memuat detail UMKM..." : "Detail UMKM belum tersedia")}
          </p>
          <button className="mt-4 text-sm font-semibold text-violet-600" onClick={closeDetail}>Kembali</button>
        </Card>
      )
    }
    return <UserDetailPage data={detail} onBack={closeDetail} />
  }

  return (
    <div className="space-y-4">
      <UserSearchBar value={search} onChange={setSearch} />
      {error && users.length === 0 ? (
        <Card className="rounded-2xl border-slate-200 p-8 text-center text-red-600 shadow-none">{error}</Card>
      ) : loading && users.length === 0 ? (
        <Card className="rounded-2xl border-slate-200 p-8 text-center text-slate-500 shadow-none">Memuat daftar UMKM...</Card>
      ) : (
        <UserTable users={filteredUsers} onDetail={openDetail} />
      )}
    </div>
  )
}
