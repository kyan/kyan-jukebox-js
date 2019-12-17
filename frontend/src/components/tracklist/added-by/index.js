import React from 'react'
import PropTypes from 'prop-types'
import { List, Popup, Icon } from 'semantic-ui-react'
import dateFormat from 'dateformat'

const addedByContent = users => {
  console.log('USERERES', users)
  if (users) {
    return (
      <List>
        {
          users.map(user => {
            return (
              <List.Item key={user.addedAt}>
                {user.fullname} on {dateFormat(user.addedAt, 'longDate')}
              </List.Item>
            )
          })
        }
      </List>
    )
  }
  return 'This is the first play!'
}

const currentPlayInfo = user => {
  return (
    <span className='added-by'><Icon name='user outline' />{user.fullname}</span>
  )
}

const AddedBy = props => {
  const { addedBy: users } = props
  if (users) {
    console.log('USERSS BEFORE I POP U', users)
    const current = users.pop()
    console.log('USERSS DID I POP U', users)
    return <Popup content={addedByContent(users)} trigger={currentPlayInfo(current)} />
  }
  return <Icon name='spotify' />
}

AddedBy.propTypes = {
  addedBy: PropTypes.array
}

export default AddedBy
