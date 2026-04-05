"use client";

export function DiscussionPreview() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">forum</span>
          Discussion
        </h3>
        <button className="text-sm text-primary hover:text-primary/80 transition-colors">
          View All →
        </button>
      </div>

      <div className="glass-card-no-glow rounded-xl p-5 border border-border">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
            Z
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Zain Ahmed</p>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Great explanation on OKLCH! Can you share more about browser
              support?
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <button className="flex items-center gap-1 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-base">
                  thumb_up
                </span>
                5
              </button>
              <button className="flex items-center gap-1 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-base">
                  reply
                </span>
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
