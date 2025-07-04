import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ComponentType, JSX } from "react";

export function withAuthRedirect<P extends JSX.IntrinsicAttributes>(
  WrappedComponent: ComponentType<P>
) {
  return function AuthRedirectWrapper(props: P) {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "authenticated") {
        router.push("/");
      }
    }, [status]);

    if (status === "loading") return <div>Loading...</div>;
    if (status === "authenticated") return null;

    return <WrappedComponent {...props} />;
  };
}
