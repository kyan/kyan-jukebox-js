import React from 'react'
import PropTypes from 'prop-types'
import { List, Popup, Icon } from 'semantic-ui-react'
import dateFormat from 'dateformat'

const addedByContent = users => {
  if (users.length) {
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

const AddedBy = ({ users = [] }) => {
  if (!users.length) return <Icon name='spotify' />
  const curentUser = users[users.length - 1]
  const previousUSers = users.slice(0, -1)
  return <Popup content={addedByContent(previousUSers)} trigger={currentPlayInfo(curentUser)} />
}

AddedBy.propTypes = {
  users: PropTypes.array
}

export default AddedBy
