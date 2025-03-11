import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "@/context/authContext";

const AuthenticatedRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <p>Loading...</p>;
    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default AuthenticatedRoute;
