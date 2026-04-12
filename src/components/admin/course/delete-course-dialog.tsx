"use client";

import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface DeleteCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: any;
  onConfirm: () => void;
}

export function DeleteCourseDialog({
  open,
  onOpenChange,
  course,
  onConfirm,
}: DeleteCourseDialogProps) {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

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
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md glass-card rounded-xl border border-destructive/50 p-6 z-[100] animate-slide-up shadow-[0_0_50px_rgba(239,68,68,0.3)]"
        style={{
          position: "fixed",
          maxWidth: "448px",
          width: "calc(100% - 32px)",
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl text-destructive">
              warning
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-destructive">
              Delete Course?
            </h3>
            <p className="text-sm text-destructive/80">
              This action cannot be undone
            </p>
          </div>
        </div>

        <div className="glass-card-no-glow rounded-lg border border-destructive/30 p-4 mb-6 bg-destructive/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center text-destructive font-bold">
              {course.title.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-foreground truncate">
                {course.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {course.students || 0} enrolled students
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-xs text-destructive/80 bg-destructive/10 p-2 rounded">
            <span className="material-symbols-outlined text-base shrink-0">
              error
            </span>
            <p>
              <strong>Warning:</strong> All enrollment data, progress, and
              certificates will be permanently lost.
            </p>
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
            className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
          >
            <span className="material-symbols-outlined text-base mr-2">
              delete
            </span>
            Delete Course
          </Button>
        </div>
      </div>
    </>
  );

  return createPortal(<DialogContent />, portalContainer);
}