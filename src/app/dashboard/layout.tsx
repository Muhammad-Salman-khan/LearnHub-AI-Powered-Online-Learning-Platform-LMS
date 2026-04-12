import AuthProvider from "@/components/AuthProvider";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default layout;
