import { 
  Calendar,
  Home, 
 
  AudioWaveform,
  GalleryVerticalEnd,
} from "lucide-react"

export  const  data = {
  class: [
  {
    time: "08:00 - 09:30",
    subject: "Calculus I",
    room: "Room 302",
    link: "https://zoom.us/j/abc123"
  },
  {
    time: "10:00 - 11:30",
    subject: "Physics Lab",
    room: "Lab B1",
    link: "https://teams.microsoft.com/lab"
  },
  {
    time: "13:00 - 14:30",
    subject: "Philosophy",
    room: "Room 210",
    link: ""
  },
  ],
  panels: [
    {
      name: "Admin Panel",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
      url: "/admin",
      role: "Admin"
    },
    {
      name: "Instructor Panel",
      logo: AudioWaveform,
      plan: "Startup",
      url: "/dashboard",
      role: "Instructor"
    },
  ],
}