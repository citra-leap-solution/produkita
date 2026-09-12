"use client";

import { Button } from "@/components/ui/button";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmationModal({ isOpen, onClose, onConfirm }: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl" role="dialog" aria-modal="true">
        <h3 className="text-lg font-bold mb-4">Delete User</h3>
        <p className="text-muted-foreground mb-6">
          Are you sure you want to delete this user account?
        </p>
        <div className="flex gap-3 pt-4">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" size="sm" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}