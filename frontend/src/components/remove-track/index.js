import React from 'react'
import PropTypes from 'prop-types'
import { Confirm } from 'semantic-ui-react'

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
      <button className='remove-track' onClick={show}>
        Remove
      </button>
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
