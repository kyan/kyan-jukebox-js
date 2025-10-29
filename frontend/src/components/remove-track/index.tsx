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
        <button className='track-remove-button'>Remove</button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Track?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove <strong>{name}</strong> from the playlist?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Remove</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default RemoveTrack
