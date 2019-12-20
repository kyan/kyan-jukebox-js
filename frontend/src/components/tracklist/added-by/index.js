import React from 'react'
import PropTypes from 'prop-types'
import { List, Popup, Icon, Image } from 'semantic-ui-react'
import dateFormat from 'dateformat'

const firstTime = (user) => {
  if (!user) return 'First time played.'

  return <strong>Added: {dateFormat(user.addedAt, 'dd mmm yyyy @ h:MM tt')}</strong>
}

const addedByContent = (user, users) => {
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

  return firstTime(user)
}

const userPicture = user => {
  if (user && user.picture) return <Image avatar className='tracklist_avatar_image' src={user.picture} />
  return <Icon name='spotify' color='green' />
}

const AddedBy = ({ users = [] }) => {
  const currentUser = users[0]
  const previousUsers = users.slice(0, -1)

  return (
    <Popup
      wide
      content={addedByContent(currentUser, previousUsers)}
      trigger={userPicture(currentUser)}
    />
  )
}

AddedBy.propTypes = {
  users: PropTypes.array
}

export default AddedBy
