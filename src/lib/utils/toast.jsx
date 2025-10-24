import { toast } from "sonner"
import { CircleCheck, CircleX, Undo2 } from "lucide-react"





export const triggerToast = ({success, title, desc}) => {
  toast.custom((t) => (
    <div className="flex items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 rounded-md shadow-lg w-[360px]">
      {/* Left side: Icon + Text */}
      <div className="flex items-center gap-3">
        {
          success ?   <CircleCheck className="text-green-500 w-5 h-5" /> :  <CircleX className="text-red-500 w-5 h-5" />
        }
        <div className="text-sm">
          <p className="font-semibold">{title}</p>
          <p className="text-muted-foreground text-xs truncate">
           {desc}
          </p>
        </div>
      </div>

      {/* Right side: Icon Button Action */}
   
    </div>
  ))
}
