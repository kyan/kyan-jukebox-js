import React from 'react'
import { cn } from '@/lib/utils'
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
    className={cn(
      'flex text-white',
      props.track.explicit && 'text-[#a6a6a6] cursor-default',
      props.className
    )}
  >
    <img
      alt={props.track.name}
      src={props.track.image}
      title={`Click to add - ${props.track.name} - ${props.track.artist.name}`}
      className={cn(
        'float-left w-[80px] h-[80px] object-cover cursor-pointer',
        props.track.explicit && 'opacity-50 cursor-default'
      )}
      onClick={props.track.explicit ? undefined : props.onClick}
    />
    <div className='w-[80%] ml-4'>
      <div className='leading-[18px] whitespace-nowrap overflow-hidden text-ellipsis'>
        {props.track.name} - {props.track.artist.name}
      </div>
      <div className='mb-1.5 whitespace-nowrap overflow-hidden text-ellipsis'>
        {props.track.album.name}
      </div>
      <VoteInfo metrics={props.track.metrics} />
      {props.onAdd ? (
        <span
          onClick={props.onAdd}
          className='cursor-pointer text-[10px] hover:text-[#999] transition-colors'
        >
          Add to mix
        </span>
      ) : null}
    </div>
  </div>
)

export default SearchItem
