import { getInstructorId } from "@/server/action";

const InstructorNameBadge = async ({
  instructorId,
}: {
  instructorId: string;
}) => {
  const { success, error, data } = await getInstructorId(instructorId);
  if (!success) {
    console.log(error);
  }
  if (!data) {
    console.log(error);
  }
  return (
    <div>
      <p className="font-medium text-foreground">
        {(data?.name && data?.name) || "Unknown Instructor"}
      </p>
      {data?.bio && data?.bio && (
        <p className="text-sm text-muted-foreground line-clamp-2">{data.bio}</p>
      )}
    </div>
  );
};

export default InstructorNameBadge;
