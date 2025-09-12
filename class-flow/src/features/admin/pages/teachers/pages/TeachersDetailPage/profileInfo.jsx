import React, {useState} from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import ShareDialog from '@/components/ShareDialog/shareDialog' 
import TeacherRolePopover from '@/components/ShareDialog/TeacherRolePopover'
import { Card, CardContent, CardHeader, CardDescription, CardTitle, CardAction } from '@/components/ui/card'

import Profile from './profile'


const roles = [
    { value: 'admin', label: 'Admin', desc: 'Has full access to all features and settings.' },
    { value: 'teacher', label: 'Teacher', desc: 'Can edit content but not manage settings.' }
    ]



function ProfileInfo({ teacherDetail, disable, setDisable }) {
  const [selectedRole, setSelectedRole] = useState(roles[0].label)
  return (
    <div className=' sm:w-[50%]  w-full space-y-4  '>
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
            <Input placeholder='First Name' value={teacherDetail?.first_name} disabled={disable} />
            <Input placeholder='Last Name' value={teacherDetail?.last_name} disabled={disable} />
          </div>
          <Input placeholder='Last Name' value={`${teacherDetail?.last_name}@gmail.com`} disabled />
          <Input placeholder='Max minutes per week' value={teacherDetail?.base_max_minutes_per_week} disabled={disable} />
        </div>
      </div>

      <div className='space-y-4'>
        
        <div className='space-y-4'>
          <Card className='p-5 mt-5' >
            <CardHeader className='p-0' >
              <CardTitle>
                 Management access
              </CardTitle>
              <CardDescription>
                Set the user's access level. Admins have full control, while Teachers have limited permissions to manage their own classes and students.
              </CardDescription>
              <CardAction >
                <TeacherRolePopover roles={roles} selectedRole={selectedRole} setSelectedRole={setSelectedRole} disabled={disable}/>
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
                <Button variant='default'>Update</Button>
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
