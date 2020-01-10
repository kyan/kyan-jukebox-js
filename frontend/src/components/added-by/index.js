import React from 'react'
import PropTypes from 'prop-types'
import { List, Popup, Icon, Image } from 'semantic-ui-react'
import dateFormat from 'dateformat'
import './index.css'

const addedByContent = (users) => {
  if (users.length) {
    return (
      <List>
        {
          users.map(user => {
            return (
              <List.Item key={user.addedAt}>
                {userPicture(user)}
                <List.Content>
                  <List.Description>
                    <strong>{dateFormat(user.addedAt, 'dd mmm yyyy @ h:MM tt')}</strong> - {user.fullname}
                  </List.Description>
                </List.Content>
              </List.Item>
            )
          })
        }
      </List>
    )
  }

  return 'First time played.'
}

const userPicture = user => {
  if (user && user.picture) return <Image avatar className='added_by_avatar_image' src={user.picture} />
  return <Icon name='spotify' color='green' />
}

const AddedBy = ({ users = [] }) => {
  return (
    <Popup
      wide
      content={addedByContent(users)}
      trigger={userPicture(users[0])}
    />
  )
}

AddedBy.propTypes = {
  users: PropTypes.array
}

export default AddedBy
