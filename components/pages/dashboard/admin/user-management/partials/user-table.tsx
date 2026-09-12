"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Eye, ChevronDown } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin" | "user";
  status: "active" | "inactive" | "pending";
  tenant: string;
  joinDate: string;
}

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserTable({ users, onEdit }: UserTableProps) {
  return (
    <Card className="shadow-none border-slate-200 rounded-2xl p-6 gap-0">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-violet-600" />
          <h3 className="text-lg font-bold text-slate-900">Daftar Admin Client UMKM</h3>
        </div>
        <span className="text-sm text-slate-400">{users.length} pengguna terdaftar</span>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-slate-200">
            <TableHead className="text-xs font-bold text-slate-400 uppercase py-4">User</TableHead>
            <TableHead className="text-xs font-bold text-slate-400 uppercase py-4">Produk</TableHead>
            <TableHead className="text-xs font-bold text-slate-400 uppercase py-4">User Type</TableHead>
            <TableHead className="text-xs font-bold text-slate-400 uppercase py-4">Status</TableHead>
            <TableHead className="text-xs font-bold text-slate-400 uppercase py-4">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-transparent border-slate-200">
              <TableCell className="py-4 text-sm font-medium text-slate-900">{user.tenant}</TableCell>
              <TableCell className="py-4 text-sm text-slate-900">5</TableCell>
              <TableCell className="py-4">
                <Select defaultValue="gratis">
                  <SelectTrigger className="w-27.5 rounded-xl border-slate-200 bg-white text-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gratis">Gratis</SelectItem>
                    <SelectItem value="umkm">UMKM</SelectItem>
                    <SelectItem value="bisnis">Bisnis</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="py-4">
                <Select defaultValue={user.status}>
                  <SelectTrigger
                    className={`w-27.5 rounded-xl font-semibold border ${
                      user.status === "active"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                        : "bg-slate-50 border-slate-200 text-slate-500"
                    }`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Non Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="py-4">
                <button
                  onClick={() => onEdit(user)}
                  className="inline-flex items-center gap-2 bg-violet-50 hover:bg-violet-100 text-violet-600 rounded-xl px-4 py-1.5 text-sm font-medium transition-colors"
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
  );
}
