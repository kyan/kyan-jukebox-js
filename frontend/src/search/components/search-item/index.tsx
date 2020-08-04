import React from 'react'
import classnames from 'classnames'
import { List, Image } from 'semantic-ui-react'
import VotedBy from 'components/voted-by'

type SearchItemProps = {
  className?: string
  track: any
  onAdd?: () => void
  onClick?: () => void
}

type VoteInfoProps = {
  metrics: any
}

const VoteInfo: React.FC<VoteInfoProps> = props => {
  if (!props.metrics) return null
  return <VotedBy size='mini' total={props.metrics.votesAverage} show={props.metrics.votes > 0} />
}

const SearchItem: React.FC<SearchItemProps> = props => (
  <div
    className={classnames(props.className, 'search-list-item', { disabled: props.track.explicit })}
  >
    <Image
      floated='left'
      src={props.track.image}
      size='tiny'
      title={`Click to add - ${props.track.name} - ${props.track.artist.name}`}
      className='search-list-item__image'
      disabled={props.track.explicit}
      onClick={props.track.explicit ? undefined : props.onClick}
    />
    <List.Content>
      <div className='search-list-item__header'>
        {props.track.name} - {props.track.artist.name}
      </div>
      <div className='search-list-item__content'>{props.track.album.name}</div>
      <VoteInfo metrics={props.track.metrics} />
      {props.onAdd ? (
        <span onClick={props.onAdd} className='search-list-item__add'>
          Add to mix
        </span>
      ) : null}
    </List.Content>
  </div>
)

export default SearchItem
