import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FcGoogle } from "react-icons/fc";
import { Label } from "@/components/ui/label"
import { Separator } from "./ui/separator";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export function LoginForm({
    className,
    email,
    password,
    handleEmailChange,
    handlePasswordChange,
    handleSignIn,
    loginWithGoogle,
    showPassword,
    togglePasswordVisibility,
}: {
    className?: string
    email: string
    password: string
    handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleSignIn: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    loginWithGoogle: (e: React.MouseEvent<HTMLButtonElement>) => void
    showPassword: boolean;
    togglePasswordVisibility: () => void;
}) {
    return (
        <div className={cn("flex flex-col gap-6 font-mono", className)} >
            <Card className="backdrop-blur-md bg-black/30 bg-opacity-60 dark:bg-opacity-70 rounded-lg shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription className="font-mono text-lg">
                        Turn in to the CodeBox World!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => handleSignIn(e)}>
                        <div className="flex flex-col gap-6">
                            <Button
                                onClick={loginWithGoogle}
                                className="cursor-pointer text-black flex gap-4 justify-center items-center bg-white px-4 py-3 rounded-lg font-medium text-base hover:bg-zinc-300 transition-all ease-in duration-200"
                            >
                                <FcGoogle size={20} />
                                Continue with Google
                            </Button>
                            <Separator className="separator">or</Separator>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {/* <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a> */}
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                    <button type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                            <Button type="submit" className="w-full">
                                Login
                            </Button>


                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link to="/signup" className="underline underline-offset-4">
                                Sign up
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
