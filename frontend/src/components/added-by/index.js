import React from 'react'
import PropTypes from 'prop-types'
import { Popup, Icon } from 'semantic-ui-react'
import dateFormat from 'dateformat'
import './index.scss'

const addedByContent = users => (
  <ul className='addedByList'>
    {users.map((data, i) => {
      const fullName = data.user ? data.user.fullname : 'User unknown'

      return (
        <li className='addedByList__item' key={i}>
          <span className='addedByList__image'>{userPicture(data, 'small')}</span>
          {dateFormat(data.addedAt, 'dd mmm yyyy @ h:MM tt')} - {fullName}
        </li>
      )
    })}
  </ul>
)

const userPicture = (data, size = 'default') => {
  if (data && data.user && data.user.picture)
    return (
      <img
        className={`userIcon userIcon--${size}Size`}
        alt={data.user.fullname}
        src={data.user.picture}
      />
    )

  return <Icon name='user' />
}

const AddedBy = ({ users = [] }) => {
  const avatar = userPicture(users[0])
  if (!users.length) return avatar

  return <Popup hoverable wide content={addedByContent(users)} trigger={avatar} />
}

AddedBy.propTypes = {
  users: PropTypes.array
}

export default AddedBy
