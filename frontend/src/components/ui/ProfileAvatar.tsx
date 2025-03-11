import Avvvatars from 'avvvatars-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu"
import { Link, useNavigate } from "react-router-dom"
import { Info, LogOut, User } from "lucide-react"
import useAuth from "@/hooks/useAuth"
import { useState } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog" 
import { Button } from "./button"

export default function ProfileAvatar({ size = 32 }: { size?: number }) {
  const { logout } = useAuth();
  const [showDialog, setShowDialog] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    setShowDialog(true);
  }

  const confirmLogout = () => {
    logout();
    setShowDialog(false);
    navigate("/login");
  }

  const cancelLogout = () => {
    setShowDialog(false); // Hide the confirmation dialog
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="hover:bg-gray-400 dark:hover:bg-neutral-600/50 transition-all rounded-full p-1 cursor-pointer">
            <Avvvatars size={size} value="harshpandey.tech@gmail.com" style="shape" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44">
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer">
              <Link to={`/profile`} className="w-full flex justify-between items-center">
                <span> My Profile </span>
                <span> <User /> </span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <Link to={`/`} target="_blank" className="w-full flex justify-between items-center">
              <span> Report a bug </span>
              <span> <Info className="w-4 h-4" /> </span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="w-full flex justify-between items-center cursor-pointer">
            <span> Log out </span>
            <span> <LogOut /> </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger asChild>
          <div />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>Are you sure you want to log out?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant={'ghost'} onClick={cancelLogout} className="">Cancel</Button>
            <Button variant={'destructive'} onClick={confirmLogout} className="">Log out</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
