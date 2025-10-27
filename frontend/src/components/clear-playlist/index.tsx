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
          className='cursor-pointer hover:bg-destructive/90 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg text-xs font-bold px-3 py-1.5 shadow-md'
        >
          CLEAR
        </Badge>
      </AlertDialogTrigger>
      <AlertDialogContent className='shadow-2xl border-border/50 bg-card/95 backdrop-blur-sm'>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-xl font-bold'>Clear Playlist</AlertDialogTitle>
          <AlertDialogDescription className='text-base text-muted-foreground'>
            Are you sure you want to clear the entire playlist? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='transition-all duration-200 hover:scale-105 active:scale-95'>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className='bg-linear-to-r from-destructive to-destructive/90 transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg font-semibold'
          >
            Clear Playlist
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ClearPlaylist
