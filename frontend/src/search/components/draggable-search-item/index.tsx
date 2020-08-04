import React from 'react'
import classnames from 'classnames'
import SearchItem from '../search-item'

type DraggableSearchItemProps = {
  i: number
  track: any
  action: (a: number, b: number) => void
  onClick: () => void
  onRemove: () => void
}

const DraggableSearchItem: React.FC<DraggableSearchItemProps> = props => {
  const { i } = props

  const onDragStart = (ev: React.DragEvent, i: string): void => {
    ev.dataTransfer && ev.dataTransfer.setData('text/plain', i)
  }
  const onDragOver = (ev: React.DragEvent): void => {
    ev.preventDefault()
  }

  const onDrop = (ev: React.DragEvent, a: string): void => {
    const b = ev.dataTransfer && ev.dataTransfer.getData('text/plain')
    if (b) props.action(parseInt(a, 10), parseInt(b, 10))
  }

  return (
    <div
      draggable
      className={classnames('draggable', 'search-list-item-draggable')}
      onDragStart={e => onDragStart(e, String(i))}
      onDragOver={e => onDragOver(e)}
      onDrop={e => onDrop(e, String(i))}
      title='You can drag this to sort.'
    >
      <SearchItem key={props.track.uri} track={props.track} onClick={props.onClick} />
      <span onClick={props.onRemove} className='search-list-item__remove'>
        Remove
      </span>
    </div>
  )
}

export default DraggableSearchItem
