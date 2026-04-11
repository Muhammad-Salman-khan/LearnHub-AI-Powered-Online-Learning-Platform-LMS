import { ChapterItem } from "./chapter-item";

interface ChapterSidebarProps {
  courseTitle: string;
  progress: number;
  chapters: any[];
  onClose?: () => void;
}

export function ChapterSidebar({
  courseTitle,
  progress,
  chapters,
  onClose,
}: ChapterSidebarProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 p-5 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-foreground truncate leading-tight">
            {courseTitle}
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden text-muted-foreground hover:text-foreground"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>

        {/* Spec: Overall progress bar */}
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Progress</span>
          <span className="text-primary font-semibold">{progress}%</span>
        </div>
        <div className="w-full bg-muted/50 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full rounded-full shadow-[0_0_8px_rgba(249,115,22,0.6)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Chapter List (Scrollable) */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden sidebar-scroll p-3 space-y-1">
        {chapters.map((chapter, index) => (
          <ChapterItem
            key={chapter.id}
            chapter={chapter}
            position={index + 1}
            onClick={onClose}
          />
        ))}
      </div>
    </div>
  );
}
