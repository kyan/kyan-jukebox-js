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
import { Badge } from '@/components/ui/badge'

interface ClearPlaylistProps {
  disabled?: boolean
  onClear: (event: React.MouseEvent) => void
}

const ClearPlaylist: React.FC<ClearPlaylistProps> = ({ disabled, onClear }) => {
  if (disabled) {
    return null
  }

  const handleConfirm = (ev: React.MouseEvent) => {
    onClear(ev)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Badge
          variant='destructive'
          className='cursor-pointer hover:bg-destructive/90 text-xs font-semibold px-2 py-1'
        >
          CLEAR
        </Badge>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear Playlist</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to nuke the playlist?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No thanks</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Do it!</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ClearPlaylist
