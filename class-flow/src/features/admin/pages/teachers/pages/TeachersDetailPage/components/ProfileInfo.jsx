import React, {useState, useEffect} from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import ShareDialog from '@/components/ShareDialog/shareDialog' 
import TeacherRolePopover from '@/components/ShareDialog/TeacherRolePopover'
import useRolesGetter from '@/lib/hooks/useRoles'
import { Card, CardContent, CardHeader, CardDescription, CardTitle, CardAction } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Profile from './Profile'
import { Switch } from '@/components/ui/switch'
import { updateTeacher } from '@/app/services/teacherService'
import { triggerToast } from '@/lib/utils/toast'

function ProfileInfo({ teacherDetail, disable, setDisable, onRefresh }) {
  const [selectedRole, setSelectedRole] = useState('')
  const {data: allRolesData, isLoading: allRolesIsLoading} = useRolesGetter()
  const [isActive, setIsActive] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setlatName] = useState('')
  const [minsPerWeek, setMinsPerWeek] = useState('')
  const [teacherId, setTeacherId] = useState('')


  useEffect(() => {
   

    if(teacherDetail) {
      const {
      id,
      base_max_minutes_per_week,
      is_active,
      first_name,
      last_name,
      role_details
    } = teacherDetail;

    setTeacherId(id)
    setSelectedRole(role_details.label)
       setIsActive(is_active)
     setFirstName(first_name)
     setlatName(last_name)
     setMinsPerWeek(base_max_minutes_per_week)
    }

  }, [ teacherDetail] )
  
  const handleUpdate = async () =>  {
    try {
      const data = {
         first_name: firstName,
          last_name: lastName,
          role: allRolesData.find(e => e.label === selectedRole)?.id,
          base_max_minutes_per_week: minsPerWeek,
          is_active: isActive
      }

      await updateTeacher(teacherId,data)
      const toastInfo = {
        success: true,
        title: 'Successfull',
        desc: 'Update the teacher successfully'
      }
      triggerToast(toastInfo)
      console.log('to be sent:',data)
    } catch (error) {
     console.log(error) 
     const toastInfo = {
        success: false,
        title: 'Update Failed',
        desc: 'Something went wrong while updating.'
      }
      triggerToast(toastInfo)
    } finally {
      setDisable(true)
      onRefresh()
    }
    
  }

  return (
    <div className='w-full lg:w-[50%]  space-y-4 md:min-w-[360px]  '>
      <div>
        <Profile teacherDetail={teacherDetail}/>
      </div>
      <div className='p-4'>
      <div className='space-y-4'>
        <div>
          <h1 className='text-base font-bold'>Profile details</h1>
          <p className='text-sm text-muted-foreground'>Manage your profile settings here.</p>
        </div>
        <div className='space-y-4 px-1'>
          <div className='flex gap-5'>
            <Input placeholder='First Name' value={firstName} onChange={(e)=>setFirstName(e.target.value)} disabled={disable} />
            <Input placeholder='Last Name' value={lastName}  onChange={(e)=>setlatName(e.target.value)} disabled={disable} />
          </div>
          <Input placeholder='Last Name' value={`${teacherDetail?.email}`} disabled />
          <Input placeholder='Max minutes per week' value={minsPerWeek} onChange={(e)=>setMinsPerWeek(e.target.value)} disabled={disable} />
        </div>
      </div>

      <div className='space-y-4'>
        
        <div className='space-y-3 mt-3'>
          <Card className='w-full p-0 mt-2  shadow-xs'>
           
            <div className='flex p-4 gap-4 items-center'>
               
              <Label className="flex-col items-start gap-1">
                <CardTitle  className='text-sm'>Teacher Active</CardTitle>
                 <CardDescription >
                <span className="text-sm font-normal text-muted-foreground">
                  Inactive teacher won't appear in created schedules. You can disable instead of delete.
                </span>
                 </CardDescription>
              </Label>
              <Switch
                checked={isActive}
                onCheckedChange={(value) => setIsActive(value)}
                disabled={disable}
              />
            </div>
           
          </Card>
          <Card className='p-5' >
            <CardHeader className='p-0' >
              <CardTitle className='text-sm'>
                 Management access
              </CardTitle>
              <CardDescription>
                Set the user's access level. Admins have full control, while Teachers have limited permissions to manage their own classes and students.
              </CardDescription>
              <CardAction >
                <TeacherRolePopover roles={(allRolesData && !allRolesIsLoading) && allRolesData} selectedRole={selectedRole} setSelectedRole={setSelectedRole} disabled={disable}/>
              </CardAction>
            </CardHeader>
          </Card>
          <div className='flex w-full justify-end'>
            {disable ? (
              <div className='flex gap-5'>
              <Button variant='outline' onClick={() => setDisable(!disable)}>
              Edit
              </Button>
              <Button variant='destructive' className='!bg-red-500'>
              Delete
              </Button>
              </div>
            ) : (
              <div className='flex gap-5'>
                <Button variant='secondary' onClick={() => setDisable(!disable)}>Cancel</Button>
                <Button variant='default' onClick={handleUpdate}>Update</Button>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default ProfileInfo
