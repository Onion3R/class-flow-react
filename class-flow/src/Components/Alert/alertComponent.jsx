import React from 'react'
import { AlertCircleIcon } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
function AlertComponent() {
  return (
    <Alert variant="destructive" className="mb-4 bg-red-100 dark:bg-red-900/30 border-red-500">
      <AlertCircleIcon />
      <AlertTitle>Connection Error</AlertTitle>
      <AlertDescription>
        <p>We couldn’t connect to the server. Please check your internet connection and try again.</p>
        <ul className="list-inside list-disc text-sm">
          <li>Ensure your device is connected to the internet</li>
          <li>Disable any VPN or firewall that might block access</li>
          <li>Try refreshing the page once you're back online</li>
        </ul>
      </AlertDescription>
    </Alert>
  )
}

export default AlertComponent