"use client";

import { Input } from "@/components/ui/input";

interface UserSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function UserSearchBar({ value, onChange }: UserSearchBarProps) {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <div className="relative flex-1">
        <Input
          placeholder="Cari berdasarkan nama, paket, atau status UMKM..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}
