"use client";

import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface UnpublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: any;
  onConfirm: () => void;
}

export function UnpublishDialog({
  open,
  onOpenChange,
  course,
  onConfirm,
}: UnpublishDialogProps) {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );

  useEffect(() => {
    setPortalContainer(document.body);
    return () => setPortalContainer(null);
  }, []);

  if (!open || !course || !portalContainer) return null;

  const DialogContent = () => (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] animate-fade-in"
        onClick={() => onOpenChange(false)}
      />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md glass-card rounded-xl border border-border p-6 z-[100] animate-slide-up shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        style={{
          position: "fixed",
          maxWidth: "448px",
          width: "calc(100% - 32px)",
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl text-orange-400">
              visibility_off
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Unpublish Course?
            </h3>
            <p className="text-sm text-muted-foreground">
              Students won't be able to access this course
            </p>
          </div>
        </div>

        <div className="glass-card-no-glow rounded-lg border border-border p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
              {course.title.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-foreground truncate">
                {course.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {course.students} enrolled students
              </p>
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
            className="flex-1 bg-orange-500 text-white hover:bg-orange-500/90 shadow-[0_0_20px_rgba(249,115,22,0.3)]"
          >
            <span className="material-symbols-outlined text-base mr-2">
              visibility_off
            </span>
            Unpublish
          </Button>
        </div>
      </div>
    </>
  );

  return createPortal(<DialogContent />, portalContainer);
}
