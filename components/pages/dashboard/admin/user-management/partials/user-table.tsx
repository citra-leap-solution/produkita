"use client"

import { Eye, Users } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { AdminTenantListItem } from "@/lib/admin/api"

function statusStyle(status: string) {
  if (status === "UMKM Aktif") return "border-emerald-200 bg-emerald-50 text-emerald-600"
  if (status === "UMKM Pending") return "border-amber-200 bg-amber-50 text-amber-600"
  return "border-red-200 bg-red-50 text-red-600"
}

export function UserTable({
  users,
  onDetail,
}: {
  users: AdminTenantListItem[]
  onDetail: (user: AdminTenantListItem) => void
}) {
  return (
    <Card className="gap-0 rounded-2xl border-slate-200 p-6 shadow-none">
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-violet-600" />
          <h3 className="text-lg font-bold text-slate-900">Daftar UMKM</h3>
        </div>
        <span className="text-sm text-slate-400">{users.length} UMKM ditampilkan</span>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-slate-200 hover:bg-transparent">
            <TableHead className="py-4 text-xs font-bold uppercase text-slate-400">Nama UMKM</TableHead>
            <TableHead className="py-4 text-xs font-bold uppercase text-slate-400">Produk</TableHead>
            <TableHead className="py-4 text-xs font-bold uppercase text-slate-400">Paket</TableHead>
            <TableHead className="py-4 text-xs font-bold uppercase text-slate-400">Status</TableHead>
            <TableHead className="py-4 text-xs font-bold uppercase text-slate-400">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-10 text-center text-sm text-slate-500">
                Tidak ada UMKM yang ditemukan.
              </TableCell>
            </TableRow>
          ) : users.map((user) => (
            <TableRow key={user.uuid} className="border-slate-200 hover:bg-transparent">
              <TableCell className="py-4 text-sm font-medium text-slate-900">{user.name}</TableCell>
              <TableCell className="py-4 text-sm text-slate-900">{user.products_count}</TableCell>
              <TableCell className="py-4">
                <span className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-600">
                  {user.package}
                </span>
              </TableCell>
              <TableCell className="py-4">
                <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle(user.status)}`}>
                  {user.status}
                </span>
              </TableCell>
              <TableCell className="py-4">
                <button
                  onClick={() => onDetail(user)}
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-600 transition-colors hover:bg-violet-100"
                >
                  <Eye className="h-4 w-4" />
                  Detail
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
