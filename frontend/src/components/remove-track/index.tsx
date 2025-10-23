import React from 'react'
import { Comment, Confirm } from 'semantic-ui-react'

interface RemoveTrackProps {
  uri?: string
  name?: string
  onClick: (event: React.MouseEvent) => void
}

const RemoveTrack: React.FC<RemoveTrackProps> = ({ uri: _uri, name, onClick }) => {
  const [open, setOpen] = React.useState(false)

  const confirm = (ev: React.MouseEvent) => {
    onClick(ev)
    setOpen(false)
  }
  const cancel = () => setOpen(false)
  const show = () => setOpen(true)

  return (
    <>
      <Comment.Action className='remove-track' onClick={show}>
        Remove
      </Comment.Action>
      <Confirm
        content={`Are you sure you want to remove: ${name}`}
        cancelButton='No thanks'
        confirmButton='Do it!'
        open={open}
        onCancel={cancel}
        onConfirm={confirm}
      />
    </>
  )
}

export default RemoveTrack
