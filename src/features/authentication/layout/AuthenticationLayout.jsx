
import { Outlet } from "react-router-dom";
import { GalleryVerticalEnd } from "lucide-react"
import ParticleBackground from '@/features/authentication/components/ParticleBackground/particleBackground'
import Register from "../pages/RegisterPage/RegisterPage";
export default function AuthenticationLayout() {
  return (
    <div className=" relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <ParticleBackground/>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          ClassFlow.
        </a>
        <Outlet />
      </div>
    </div>
  );
}