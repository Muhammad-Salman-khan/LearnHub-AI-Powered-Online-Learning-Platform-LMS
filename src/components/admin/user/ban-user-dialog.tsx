"use client";

import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface BanUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  onConfirm: () => void;
}

export function BanUserDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
}: BanUserDialogProps) {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );

  useEffect(() => {
    setPortalContainer(document.body);
    return () => setPortalContainer(null);
  }, []);

  if (!open || !user || !portalContainer) return null;

  const isBanning = user.status === "Active";

  const DialogContent = () => (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] animate-fade-in"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md glass-card rounded-xl border border-border p-6 z-[100] animate-slide-up shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        style={{
          position: "fixed",
          maxWidth: "448px",
          width: "calc(100% - 32px)",
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isBanning ? "bg-destructive/20" : "bg-green-500/20"
            }`}
          >
            <span
              className={`material-symbols-outlined text-2xl ${
                isBanning ? "text-destructive" : "text-green-400"
              }`}
            >
              {isBanning ? "block" : "check_circle"}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              {isBanning ? "Ban User?" : "Unban User?"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isBanning
                ? "This will prevent them from logging in"
                : "This will restore their access"}
            </p>
          </div>
        </div>

        <div className="glass-card-no-glow rounded-lg border border-border p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-foreground">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 border-border text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className={`flex-1 transition-all duration-300 ${
              isBanning
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                : "bg-green-500 text-white hover:bg-green-500/90 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            }`}
          >
            <span className="material-symbols-outlined text-base mr-2">
              {isBanning ? "block" : "check_circle"}
            </span>
            {isBanning ? "Ban User" : "Unban User"}
          </Button>
        </div>
      </div>
    </>
  );

  return createPortal(<DialogContent />, portalContainer);
}
