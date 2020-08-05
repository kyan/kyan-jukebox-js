import React from 'react'
import PropTypes from 'prop-types'
import { Comment, Confirm } from 'semantic-ui-react'

const RemoveTrack = props => {
  const [open, setOpen] = React.useState(false)
  const confirm = ev => {
    props.onClick(ev)
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
        content={`Are you sure you want to remove: ${props.name}`}
        cancelButton='No thanks'
        confirmButton='Do it!'
        open={open}
        onCancel={cancel}
        onConfirm={confirm}
      />
    </>
  )
}

RemoveTrack.propTypes = {
  uri: PropTypes.string,
  name: PropTypes.string,
  onClick: PropTypes.func.isRequired
}

export default RemoveTrack
