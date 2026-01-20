import { SignInClient } from "@/app/components/SignInClient";

export default function SignInPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  return <SignInClient callbackUrl={searchParams.callbackUrl} />;
}
