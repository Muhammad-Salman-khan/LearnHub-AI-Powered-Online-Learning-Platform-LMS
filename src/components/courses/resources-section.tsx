"use client";

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
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">
          folder_open
        </span>
        Resources & Downloads
      </h3>
      <div className="grid gap-2">
        {resources.map((resource, index) => (
          <a
            key={index}
            href={resource.url}
            className="glass-card-no-glow rounded-lg p-3 border border-border hover:border-primary/50 transition-all duration-300 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-muted-foreground group-hover:text-primary transition-colors">
                {resource.type === "Download" ? "download" : "link"}
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {resource.name}
                </p>
                <p className="text-xs text-muted-foreground">{resource.type}</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-muted-foreground group-hover:text-primary transition-colors">
              open_in_new
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
