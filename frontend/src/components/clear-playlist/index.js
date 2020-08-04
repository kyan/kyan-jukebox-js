import React from 'react'
import PropTypes from 'prop-types'
import { Confirm, Label } from 'semantic-ui-react'

const ClearPlaylist = props => {
  const [open, setOpen] = React.useState(false)
  if (props.disabled) {
    return null
  }

  const confirm = ev => {
    props.onClear(ev)
    setOpen(false)
  }
  const cancel = () => setOpen(false)
  const show = () => setOpen(true)

  return (
    <>
      <Label horizontal size='mini' as='a' color='red' onClick={show} className='jb-clear-button'>
        CLEAR
      </Label>
      <Confirm
        content='Are you sure you want to nuke the playlist?'
        cancelButton='No thanks'
        confirmButton='Do it!'
        open={open}
        onCancel={cancel}
        onConfirm={confirm}
      />
    </>
  )
}

ClearPlaylist.propTypes = {
  disabled: PropTypes.bool,
  onClear: PropTypes.func.isRequired
}

export default ClearPlaylist
