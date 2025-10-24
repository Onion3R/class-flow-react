import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

import { triggerToast } from "@/lib/utils/toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {  ClipboardCheck, ExternalLink, RefreshCcw } from "lucide-react"
import TeacherRolePopover from "../../../../../../../components/ShareDialog/TeacherRolePopover"
import useRolesGetter from "@/lib/hooks/useRoles"
import { v4 as uuidv4 } from 'uuid';
import { handleCreateInvite } from "../handlers/inviteHandler"
export default function ShareDialog() {
  const { data: allRoleData, isLoading: allRolesIsLoading } = useRolesGetter()

  const [retries, setRetries] = useState(1)
  const [roleId, setRoleId] = useState()
  const [invite, setInvite] = useState(undefined)
  const [selectedRole, setSelectedRole] = useState()
  const [hasGeneratedUrl, setHasGeneratedUrl] = useState()
  const [email, setEmail] = useState('')
  const [token, setToken] = useState()


  
  useEffect(() => {
    if (allRoleData && allRoleData.length > 0 && !allRolesIsLoading) {
      setSelectedRole(allRoleData[0].label)
      setRoleId(allRoleData[0].id)
    }

    if(!email) {
      setInvite('')
    }
  }, [allRolesIsLoading, allRoleData, email])

  const handleCopyLink = () => {
    if(invite) {
    
      navigator.clipboard
      .writeText(invite)
      .then(() => {
          const toastInfo = {
              success: true, 
            title: 'Copy link',
            desc: 'Copied the link to your clipboard'
          }
        triggerToast(toastInfo)
      })
      .catch((err) => {
        const toastInfo = {
                       success: false, 
                     title: 'Fail to copy',
                     desc: err
                   }
       triggerToast(toastInfo)
      })
    } else {
     const toastInfo = {
  success: false,
  title: 'Copy Failed',
  desc: 'No invite link available to copy.'
};

        triggerToast(toastInfo)
    }
    
  }

  const callInviteHandler = () => {
    handleCreateInvite({
      email,
      hasGeneratedUrl,
      retries,
      setToken,
      setInvite,
      setHasGeneratedUrl,
      roleId,
    })

  }




const handleRetries = () => {
  if (retries <= 2) {
    setRetries(prev => prev + 1);
    callInviteHandler(); // ✅ invoke the function
  } else {
    
 const toastInfo = {
  success: false,
  title: 'Retry Limit Reached',
  desc: 'You’ve hit the maximum number of retry attempts.'
};

    triggerToast(toastInfo)
  }
}

useEffect(() => {
  console.log('tries', retries)
}, [retries])



  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="ml-2">
          <ExternalLink className="mr-1" /> Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
       
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
             Copy the link above and share it with others.
          </DialogDescription>
        </DialogHeader>
    
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <div className="relative">
              <Input
                id="link"
                defaultValue={invite}
                placeholder={invite ? invite: 'Click "Generate" to create an invite. '}
                readOnly
              />
            </div>
          </div>
        </div>
          <div>
                           <Label className='mb-2'>Email</Label>

            <div className="flex">
            <Input 
              placeholder='olmida@gmail.com'
              value={email}
              type='email'
              onChange={(e) => setEmail(e.target.value)}
              />
               {allRoleData?.length > 0 && (
            <TeacherRolePopover
              roles={allRoleData}
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
              setRoleId={setRoleId}
            />
          )}
            </div>
           
        {/* <div className="flex items-center justify-between mt-4">
          <div>
            <h3 className="text-sm font-medium">General access</h3>
            <DialogDescription className="text-[12px]">
              Copy the link above and share it with others.
            </DialogDescription>
          </div>
          {allRoleData?.length > 0 && (
            <TeacherRolePopover
              roles={allRoleData}
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
            />
          )}
        </div> */}
        
</div>
        <DialogFooter className="sm:justify-start !flex !items-center !justify-start w-full ">
          <div className="flex gap-2 ">
          <Button variant='secondary'  onClick={callInviteHandler} disabled={hasGeneratedUrl} >Generate</Button>
          <Button variant='secondary'   onClick={handleRetries} disabled={!hasGeneratedUrl}> <RefreshCcw className="h-4 w-4" /></Button>
          <Button variant='secondary'  onClick={handleCopyLink}> <ClipboardCheck className="h-4 w-4" /></Button>
          </div>
          {/* <DialogClose asChild>
            <Button type="button" variant="secondary" >
              Close
            </Button>
          </DialogClose> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
