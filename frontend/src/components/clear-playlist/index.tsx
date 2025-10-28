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
        <Badge variant='destructive' className='clear-playlist-badge'>
          CLEAR
        </Badge>
      </AlertDialogTrigger>
      <AlertDialogContent className='clear-playlist-dialog'>
        <AlertDialogHeader>
          <AlertDialogTitle className='clear-playlist-title'>Clear Playlist</AlertDialogTitle>
          <AlertDialogDescription className='clear-playlist-description'>
            Are you sure you want to clear the entire playlist? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='clear-playlist-cancel'>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className='clear-playlist-confirm'>
            Clear Playlist
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ClearPlaylist
