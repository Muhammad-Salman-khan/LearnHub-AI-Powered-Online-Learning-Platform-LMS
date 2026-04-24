"use client";

/**
 * ResourcesSection — Scholarly Architect Design System
 *
 * Lists downloadable resources for a course chapter.
 * Uses CSS variables for dark mode support.
 */

interface Resource {
  name: string;
  type: string;
  url: string;
}

interface ResourcesSectionProps {
  resources: Resource[];
}

export function ResourcesSection({ resources }: ResourcesSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold flex items-center gap-2" style={{ color: "var(--on-surface)" }}>
        <span className="material-symbols-outlined" style={{ color: "var(--primary)" }}>
          folder_open
        </span>
        Resources & Downloads
      </h3>
      <div className="grid gap-2">
        {resources.map((resource, index) => (
          <a
            key={index}
            href={resource.url}
            className="rounded-lg p-3 transition-all duration-300 flex items-center justify-between group"
            style={{
              backgroundColor: "var(--surface-container-lowest)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined transition-colors" style={{ color: "var(--on-surface-variant)" }}>
                {resource.type === "Download" ? "download" : "link"}
              </span>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--on-surface)" }}>
                  {resource.name}
                </p>
                <p className="text-xs" style={{ color: "var(--on-surface-variant)" }}>{resource.type}</p>
              </div>
            </div>
            <span className="material-symbols-outlined transition-colors" style={{ color: "var(--on-surface-variant)" }}>
              open_in_new
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
