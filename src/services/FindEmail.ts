import { prisma } from "@/lib/prisma";

export const FindUser = async (email: string) => {
  const existEmail = await prisma.user.findUnique({
    where: { email: email },
  });
  return existEmail;
};

export default FindUser;
