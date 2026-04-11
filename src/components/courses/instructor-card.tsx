interface InstructorCardProps {
  instructor: {
    name: string;
    avatar: string;
    title: string;
  };
}

export function InstructorCard({ instructor }: InstructorCardProps) {
  return (
    <div className="glass-card-no-glow rounded-xl p-5 border border-border">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
          {instructor.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">Instructor</h3>
          <p className="text-primary font-medium">{instructor.name}</p>
          <p className="text-sm text-muted-foreground">{instructor.title}</p>
        </div>
        <button className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-base">mail</span>
          Contact
        </button>
      </div>
    </div>
  );
}
