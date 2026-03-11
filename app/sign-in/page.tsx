import { SignInClient } from "@/app/components/SignInClient";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  return <SignInClient callbackUrl={callbackUrl} />;
}
