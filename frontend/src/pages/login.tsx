import { useEffect, useState } from "react";
import { LoginForm } from "@/components/login-from";
import { BACKEND_URL } from "@/lib/credentials";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MenuBar } from "@/components/menu-bar";
import React from "react";

const GoogleAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);


  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const loginWithGoogle = () => {
    const url = `${BACKEND_URL}/auth/google/login`;
    window.location.href = `${url}`;
  };


  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await login(email, password);
      if (result.success) {
        toast.success("Logged in successfully");
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
      navigate("/problems");
    }
    console.log("Email:", email, "Password:", password);
  };

  return (
    <div className="flex flex-col min-h-svh w-full items-center justify-normal p-6 dark">
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <MenuBar /> 
      <div className="w-full my-auto max-w-sm">
        <LoginForm
          email={email}
          password={password}
          handleEmailChange={handleEmailChange}
          handlePasswordChange={handlePasswordChange}
          handleSignIn={handleSignIn}
          loginWithGoogle={loginWithGoogle}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
        />
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default GoogleAuth;

