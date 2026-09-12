"use client";

import { useState } from "react";
import { UserTable } from "./partials/user-table";
import { UserDetailPage } from "./partials/detail";

interface User {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin" | "user";
  status: "active" | "inactive" | "pending";
  tenant: string;
  joinDate: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    tenant: "PT. Cisarua Mountain Dairy Tbk",
    joinDate: "2024-01-15",
  },
];

export function UserManagement() {
  const [view, setView] = useState<"list" | "detail">("list");

  const handleEdit = () => {
    setView("detail");
  };

  if (view === "detail") {
    return <UserDetailPage />;
  }

  return (
    <UserTable users={mockUsers} onEdit={handleEdit} onDelete={() => {}} />
  );
}
