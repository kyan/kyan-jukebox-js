import React from 'react'
import { Label } from 'semantic-ui-react'

interface ClearPlaylistProps {
  disabled?: boolean
  onClear: (event: React.MouseEvent) => void
}

const ClearPlaylist: React.FC<ClearPlaylistProps> = ({ disabled, onClear }) => {
  const [open, setOpen] = React.useState(false)

  if (disabled) {
    return null
  }

  const confirm = (ev: React.MouseEvent) => {
    onClear(ev)
    setOpen(false)
  }
  const cancel = () => setOpen(false)
  const show = () => setOpen(true)

  return (
    <>
      <Label horizontal size='mini' as='a' color='red' onClick={show} className='jb-clear-button'>
        CLEAR
      </Label>
      {open && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
              minWidth: '300px',
              textAlign: 'center'
            }}
          >
            <p style={{ marginBottom: '20px' }}>Are you sure you want to nuke the playlist?</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={cancel}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ccc',
                  backgroundColor: '#f8f8f8',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                No thanks
              </button>
              <button
                onClick={confirm}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #d32f2f',
                  backgroundColor: '#d32f2f',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Do it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ClearPlaylist
