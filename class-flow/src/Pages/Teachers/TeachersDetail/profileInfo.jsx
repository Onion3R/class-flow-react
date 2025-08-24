import React from 'react'
import { Input } from '@/Components/ui/input'
import { Button } from '@/Components/ui/button'
import { Pencil } from 'lucide-react'

function ProfileInfo({ teacherDetail, disable, setDisable }) {
  return (
    <div className='p-4 sm:w-[50%]  w-full space-y-4  '>
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
        <div>
          <h1 className='text-base font-bold'>Password management</h1>
          <p className='text-sm text-muted-foreground'>Manage your password settings here.</p>
        </div>
        <div className='px-1 space-y-4'>
          <Input placeholder='Password' type='password' disabled={disable} />
          <Input placeholder='Confirm password' type='password' disabled={disable} />
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
  )
}

export default ProfileInfo
