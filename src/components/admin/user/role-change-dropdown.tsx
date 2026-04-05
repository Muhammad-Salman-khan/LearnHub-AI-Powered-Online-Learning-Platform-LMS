"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";

interface RoleChangeDropdownProps {
  currentRole: string;
  userId: string;
  onRoleChange: (userId: string, newRole: string) => void;
  disabled?: boolean;
}

export function RoleChangeDropdown({
  currentRole,
  userId,
  onRoleChange,
  disabled,
}: RoleChangeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const roles = ["Student", "Instructor", "Admin"];

  const handleSelect = (newRole: string) => {
    onRoleChange(userId, newRole);
    setIsOpen(false);
  };

  // Set portal container after mount
  useEffect(() => {
    setPortalContainer(document.body);
    return () => setPortalContainer(null);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const DropdownContent = () => {
    if (!buttonRef.current) return null;

    const buttonRect = buttonRef.current.getBoundingClientRect();

    return (
      <div
        ref={dropdownRef}
        className="glass-card-no-glow rounded-lg border border-border overflow-hidden z-[100] shadow-[0_0_30px_rgba(0,0,0,0.5)] animate-slide-up"
        style={{
          position: "fixed",
          top: buttonRect.bottom + window.scrollY + 8,
          left: buttonRect.right - 160 + window.scrollX,
          width: "160px",
          minWidth: "160px",
        }}
      >
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => handleSelect(role)}
            disabled={role === currentRole}
            className={`
              w-full text-left px-4 py-2.5 text-sm transition-all duration-300
              ${
                role === currentRole
                  ? "bg-primary/10 text-primary cursor-default"
                  : "text-foreground hover:bg-primary/10 hover:text-primary"
              }
            `}
          >
            {role}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="border-border text-muted-foreground hover:text-foreground hover:border-primary/30 disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-base mr-1">badge</span>
        {currentRole}
        <span className="material-symbols-outlined text-base ml-1">
          expand_more
        </span>
      </Button>

      {isOpen &&
        portalContainer &&
        createPortal(<DropdownContent />, portalContainer)}
    </div>
  );
}
