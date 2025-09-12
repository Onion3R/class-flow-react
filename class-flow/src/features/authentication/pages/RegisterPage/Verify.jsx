import React, {useState} from 'react'
import { Button } from '@/components/ui/button'
import { MailOpen } from "lucide-react";
import VerifyAnimation from './components/VerifyAnimation'
function Verify() {
    const [email] = useState(window.localStorage.getItem('emailForSignIn'))
  return (
  <div className="flex flex-col items-center justify-center max-w-md mx-auto ">
  <VerifyAnimation />

  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
    Check Your Email
  </h2>

  <p className="text-center text-gray-600 dark:text-white mb-6 text-base">
    We've sent a verification link to <span className="font-medium text-blue-600">{email}</span>.
    If you don’t see it in your inbox, be sure to check your <span className="font-semibold">Spam</span>
  </p>

 <Button size="lg" className='w-full' asChild>
  <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer">
  <MailOpen/>
    Check email
  </a>
</Button>
</div>


  )
}

export default Verify