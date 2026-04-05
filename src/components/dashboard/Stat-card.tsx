import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color?: "amber" | "green" | "blue";
}

const colorVariants = {
  amber: {
    bg: "bg-[#F97316]/10",
    text: "text-[#F97316]",
    border: "border-[#F97316]/20",
  },
  green: {
    bg: "bg-[#22c55e]/10",
    text: "text-[#22c55e]",
    border: "border-[#22c55e]/20",
  },
  blue: {
    bg: "bg-[#3b82f6]/10",
    text: "text-[#3b82f6]",
    border: "border-[#3b82f6]/20",
  },
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  color = "amber",
}: StatCardProps) {
  const colors = colorVariants[color];

  return (
    <Card className="glass-card-no-glow rounded-xl w-full overflow-hidden">
      <div className="p-4 sm:p-6">
        {/* ✅ min-w-0 allows flex children to shrink and truncate */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div
            className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full ${colors.bg} ${colors.text} amber-glow shrink-0`}
          >
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          {/* ✅ min-w-0 + truncate for text overflow */}
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">
              {label}
            </p>
            <p className="text-xl sm:text-2xl font-bold text-gray-200 truncate">
              {value}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
