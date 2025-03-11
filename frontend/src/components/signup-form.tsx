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
import { Label } from "@/components/ui/label"
import { Separator } from "./ui/separator";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom"

export function SignupForm({
    className,
    fullName,
    email,
    password,
    handleFullNameChange,
    handleEmailChange,
    handlePasswordChange,
    handleSignUp,
    showPassword,
    togglePasswordVisibility,
}: {
    className?: string
    fullName: string
    email: string
    password: string
    handleFullNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleSignUp: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    showPassword: boolean;
    togglePasswordVisibility: () => void;
}) {
    return (
        <div className={cn("flex flex-col gap-6 font-mono", className)} >
            <Card className="backdrop-blur-md bg-black/30 bg-opacity-60 dark:bg-opacity-70 rounded-lg shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl">Sign Up</CardTitle>
                    <CardDescription className="font-mono text-lg">
                        Join the CodeBox World!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => handleSignUp(e)}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    type="text"
                                    value={fullName}
                                    onChange={handleFullNameChange}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
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
                                Sign Up
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link to="/login" className="underline underline-offset-4">
                                Log in
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
