import bcrypt from "bcryptjs";

export const Hashpassword = async (password: string, round: number) => {
  const hashPassword = await bcrypt.hash(password, round);
  return hashPassword;
};
