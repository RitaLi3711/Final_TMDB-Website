import { Navigate } from "react-router-dom";
import { useFirebaseContext } from "@/hooks";

export const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useFirebaseContext();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return user ? children : <Navigate replace to="/sign-in" />;
};
