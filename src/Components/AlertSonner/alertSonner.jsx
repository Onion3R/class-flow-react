// lib/utils/toast.js
import { toast } from 'sonner';
import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@Components/ui/alert"

export function triggerToast(toastInfo) {
  toast.custom((t) => (
    <div
      className="w-full max-w-[480px]"
      role="alert"
    >
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>The process is taking a long time.</AlertTitle>
        <AlertDescription>
          <p>Please try again.</p>
          <ul className="list-inside list-disc text-sm">
            <li>Check your internet</li>
            <li>Refresh the website</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  ));
}
