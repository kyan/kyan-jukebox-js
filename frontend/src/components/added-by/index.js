import React from 'react'
import PropTypes from 'prop-types'
import { List, Popup, Icon, Image } from 'semantic-ui-react'
import dateFormat from 'dateformat'
import './index.css'

const addedByContent = (users) => (
  <List>
    {
      users.map((data, i) => {
        const fullName = data.user ? data.user.fullname : 'User unknown'

        return (
          <List.Item key={i}>
            {userPicture(data)}
            <List.Content>
              <List.Description>
                <strong>{dateFormat(data.addedAt, 'dd mmm yyyy @ h:MM tt')}</strong> - {fullName}
              </List.Description>
            </List.Content>
          </List.Item>
        )
      })
    }
  </List>
)

const userPicture = data => {
  if (data && data.user && data.user.picture) return <Image avatar className='added_by_avatar_image' src={data.user.picture} />
  return <Icon name='spotify' color='green' />
}

const AddedBy = ({ users = [] }) => {
  const avatar = userPicture(users[0])
  if (!users.length) return avatar

  return (
    <Popup
      wide
      content={addedByContent(users)}
      trigger={avatar}
    />
  )
}

AddedBy.propTypes = {
  users: PropTypes.array
}

export default AddedBy
