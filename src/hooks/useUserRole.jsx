import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosPublic from "./useAxiosPublic";

const useUserRole = () => {
    const { user, loading } = useAuth();
    const axiosPublic = useAxiosPublic();

    const {
        data: role = "user",
        isLoading: isRoleLoading,
    } = useQuery({
        queryKey: ["user-role", user?.email],
        enabled: !!user && !loading,
        queryFn: async () => {
            const res = await axiosPublic.get(`/users/role/${user.email}`);
            // Expect { role: 'admin' | 'creator' | 'user' }
            return res.data.role;
        },
    });

    return {
        role,
        isAdmin: role === "admin",
        isCreator: role === "creator",
        isUser: role === "user",
        isRoleLoading: isRoleLoading || loading,
    };
};

export default useUserRole;