interface ChapterItemProps {
  chapter: {
    id: string;
    title: string;
    status: "completed" | "current" | "locked";
    duration?: string;
  };
  position: number;
  onClick?: () => void;
}

export function ChapterItem({ chapter, position, onClick }: ChapterItemProps) {
  const isCompleted = chapter.status === "completed";
  const isCurrent = chapter.status === "current";
  const isLocked = chapter.status === "locked";

  return (
    <div
      onClick={onClick}
      className={`
        group relative flex items-center gap-3 p-3 rounded-lg text-sm transition-all duration-300
        ${isCurrent ? "bg-primary/5" : "hover:bg-muted/30"}
        ${isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${isCurrent ? "border border-primary/30 shadow-[0_0_15px_rgba(249,115,22,0.15)]" : "border border-transparent"}
      `}
    >
      {/* Left Accent Bar (Only for Current) */}
      {isCurrent && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-primary rounded-r-full shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
      )}

      {/* Status Icon */}
      <span
        className={`
        material-symbols-outlined text-base shrink-0 transition-colors
        ${isCompleted ? "text-green-500" : ""}
        ${isCurrent ? "text-primary animate-pulse" : ""}
        ${isLocked ? "text-muted-foreground" : ""}
      `}
      >
        {isCompleted && "check_circle"}
        {isCurrent && "play_circle"}
        {isLocked && "lock"}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        {/* Row 1: Position + Title */}
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-mono ${isCurrent ? "text-primary" : "text-muted-foreground"}`}
          >
            {position < 10 ? `0${position}` : position}
          </span>
          <span
            className={`truncate font-medium ${isCurrent ? "text-primary" : "text-foreground"}`}
          >
            {chapter.title}
          </span>
        </div>

        {/* Row 2: Duration */}
        {chapter.duration && (
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <span className="material-symbols-outlined text-[10px]">
              schedule
            </span>
            {chapter.duration}
          </span>
        )}
      </div>
    </div>
  );
}
