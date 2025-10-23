import { 
  Calendar,
  Home, 
 
  AudioWaveform,
  GalleryVerticalEnd,
} from "lucide-react"

export  const  data = {
  panels: [
    {
      name: "Admin Panel",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
      url: "/admin",
      role: "Admin"
    },
    {
      name: "Teacher Panel",
      logo: AudioWaveform,
      plan: "Startup",
      url: "/dashboard",
      role: "Teacher"
    },
  ],
}