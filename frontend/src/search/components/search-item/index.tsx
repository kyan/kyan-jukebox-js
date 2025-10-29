import React from 'react'
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

const SearchItem: React.FC<SearchItemProps> = props => {
  const [isAdding, setIsAdding] = React.useState(false)

  const handleAdd = () => {
    if (props.onAdd && !isAdding) {
      setIsAdding(true)
      props.onAdd()
      setTimeout(() => setIsAdding(false), 600)
    }
  }

  return (
    <div
      className={`search-list-item${props.track.explicit ? ' disabled' : ''}${props.className ? ' ' + props.className : ''}`}
    >
      <img
        alt={props.track.name}
        src={props.track.image}
        title={`Click to add - ${props.track.name} - ${props.track.artist.name}`}
        className='search-list-item__image'
        onClick={props.track.explicit ? undefined : props.onClick}
      />
      <div className='search-list-item__content-wrapper'>
        <div className='search-list-item__header'>
          {props.track.name} - {props.track.artist.name}
        </div>
        <div className='search-list-item__content'>{props.track.album.name}</div>
        <VoteInfo metrics={props.track.metrics} />
        {props.onAdd && !props.track.explicit ? (
          <span onClick={handleAdd} className={`search-list-item__add${isAdding ? ' adding' : ''}`}>
            {isAdding ? '✓ Added' : 'Add to mix'}
          </span>
        ) : null}
      </div>
    </div>
  )
}

export default SearchItem
