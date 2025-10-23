import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

interface RemoveTrackProps {
  uri?: string
  name?: string
  onClick: (event: React.MouseEvent) => void
}

const RemoveTrack: React.FC<RemoveTrackProps> = ({ uri: _uri, name, onClick }) => {
  const handleConfirm = (ev: React.MouseEvent) => {
    onClick(ev)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className='text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors'>
          Remove
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <VisuallyHidden>
            <AlertDialogTitle>Remove Track</AlertDialogTitle>
          </VisuallyHidden>
          <AlertDialogDescription>Are you sure you want to remove: {name}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No thanks</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Do it!</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default RemoveTrack
