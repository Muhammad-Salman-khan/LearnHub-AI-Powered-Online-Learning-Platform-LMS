"use client";

interface StatusFilterTabsProps {
  value: string;
  onChange: (value: string) => void;
}

const tabs = [
  { label: "All", value: "all" },
  { label: "Published", value: "published", color: "text-green-400" },
  { label: "Draft", value: "draft", color: "text-muted-foreground" },
];

export function StatusFilterTabs({ value, onChange }: StatusFilterTabsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border
            ${
              value === tab.value
                ? "bg-primary/10 text-primary border-primary/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]"
                : "bg-muted/30 text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
