import React from 'react'
import PropTypes from 'prop-types'
import { List, Popup, Icon } from 'semantic-ui-react'
import dateFormat from 'dateformat'

const addedByContent = users => {
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

const currentInfo = users => {
  return (
    <span className='added-by'><Icon name='user outline' />{users[users.length-1].fullname}</span>
  )
}

const AddedBy = props => {
  const { addedBy } = props;
  if (addedBy) {
    return <Popup content={addedByContent(addedBy)} trigger={currentInfo(addedBy)} />
  }
  return <Icon name='spotify' />
}

AddedBy.propTypes = {
  addedBy: PropTypes.array
}

export default AddedBy
