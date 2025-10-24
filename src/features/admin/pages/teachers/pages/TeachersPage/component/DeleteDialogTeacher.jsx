import React, { useState, useEffect } from 'react'
import {
  AlertDialogDescription,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { TriangleAlert } from "lucide-react"
import { Input } from '@/components/ui/input'
import useGeneratedScheduleGetter from '@/lib/hooks/useGeneratedSchedules'

function DeleteDialogTeacher({ open, handleDelete, selectedRow }) {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>

        <Alert variant="destructive" className="bg-red-100 dark:bg-red-900/30 border-red-500">
          <TriangleAlert />
          <AlertTitle>Proceed with Deletion</AlertTitle>
          <AlertDescription>
            You are about to permanently delete this user's email. This action cannot be undone.
          </AlertDescription>
        </Alert>

        <div className="px-2 mt-2">
          <AlertDialogDescription className="font-semibold mb-1">
            User account:
          </AlertDialogDescription>
          <p className="text-base">{selectedRow.email}</p>
        </div>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleDelete}>
          Continue
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

export default DeleteDialogTeacher
