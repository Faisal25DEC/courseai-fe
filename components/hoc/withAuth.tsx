import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, ComponentType } from "react";
import { useUser } from "@clerk/nextjs";
import { getUserById } from "@/services/user.service";
import { useRecoilState } from "recoil";
import { currentUserRoleAtom } from "@/store/atoms";
import { admin, member } from "@/lib/constants";

interface WithAuthProps {}

const withAuth = <P extends WithAuthProps>(
  WrappedComponent: ComponentType<P>
) => {
  const WithAuthComponent = (props: P) => {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useUser();
    const [currentUserRole, setCurrentUserRole] =
      useRecoilState(currentUserRoleAtom);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkUserVerification = async () => {
        try {
          const userData = await getUserById(user?.id as any);
          if (userData.data.verified) {
            if (currentUserRole === admin && pathname !== "/courses/list") {
              router.push("/courses/list");
            }
          } else {
            if (currentUserRole === admin && pathname !== "/courses/list") {
              router.refresh()
              router.push("/courses/list");
            } else if (pathname !== "/onboarding-flow") {
              router.refresh()
              router.push("/onboarding-flow");
            }
          }
        } catch (error) {
          console.error("Error checking user verification:", error);
        } finally {
          setIsLoading(false);
        }
      };

      if (currentUserRole === member && user?.id) {
        checkUserVerification();
      } else {
        router.refresh()
        router.push("/courses/list");
        // router.push("/onboarding-flow");
      }
    }, [user, router, currentUserRole]);

    // if (isLoading) {
    //   return (
    //     <main className="flex min-h-screen flex-col gap-6 items-center mx-auto w-[90%]">
    //       <h1 className="text-sm text-gray-700">Loading...</h1>
    //     </main>
    //   );
    // }

    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
};

export default withAuth;
