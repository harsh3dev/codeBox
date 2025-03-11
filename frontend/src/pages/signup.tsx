import { useEffect, useState } from "react";
import { SignupForm } from "../components/signup-form";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MenuBar } from "@/components/menu-bar";

const Signup = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { user, signup } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user]);


    const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFullName(e.target.value);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const result = await signup(fullName, email, password);
            if (result.success) {
                toast.success("Signed up successfully");
            } else {
                setError(result.error || "An unknown error occurred");
                toast.error(result.error || "An unknown error occurred");
            }
        } catch (error) {
            console.error(error);
            setError(error instanceof Error ? error.message : "An unknown error occurred");
            toast.error(error instanceof Error ? error.message : "An unknown error occurred");
        } finally {
            setLoading(false);
            navigate("/login");
        }
    };

    return (
        <div className="flex flex-col min-h-svh w-full items-center justify-normal p-6 dark">
            <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
            <MenuBar />
            <div className="w-full my-auto max-w-sm">
                <SignupForm
                    fullName={fullName}
                    email={email}
                    password={password}
                    handleFullNameChange={handleFullNameChange}
                    handleEmailChange={handleEmailChange}
                    handlePasswordChange={handlePasswordChange}
                    handleSignUp={handleSignUp}
                    showPassword={showPassword}
                    togglePasswordVisibility={togglePasswordVisibility}
                />
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default Signup;
