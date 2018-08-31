import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { Dimmer, Divider, Grid, Header } from 'semantic-ui-react'
import VolumeButtons from '../../components/volume-buttons'
import ClearPlaylist from '../../components/clear-playlist'
import * as actions from '../../actions'
import CurrentTrackContainer from '../current-track-container'
import Settings from '../settings'
import TrackList from '../../components/tracklist'
import { getTracklistImagesInCache } from '../../selectors'
import Controls from '../../components/controls'
import DragInTrack from '../../components/drag-in-track'
import RadioStream from '../../components/radio-stream'

export class Dashboard extends Component {
  constructor (props) {
    super(props)
    this.dispatch = this.props.dispatch
  }

  componentDidMount () {
    this.fireDispatch('wsConnect')()
  }

  componentWillUnmount () {
    this.fireDispatch('wsDisconnect')()
  }

  fireDispatch (key) {
    return (evt) => {
      this.dispatch(actions[key](evt))
    }
  }

  handleURLDrop = (_item, monitor) => {
    if (monitor) {
      this.fireDispatch('addNewTrack')(monitor.getItem().urls[0])
    }
  }

  render () {
    return (
      <Dimmer.Dimmable
        blurring
        className='jukebox-dashboard'
        dimmed={!this.props.jukebox.online}
      >
        <Settings />
        <VolumeButtons
          disabled={!this.props.settings.token}
          volume={this.props.jukebox.volume}
          onVolumeChange={this.fireDispatch('setVolume')}
        />
        <Controls
          disabled={!this.props.settings.token}
          state={this.props.jukebox}
          onPlay={this.fireDispatch('startPlaying')}
          onPause={this.fireDispatch('pausePlaying')}
          onNext={this.fireDispatch('nextPlaying')}
          onPrevious={this.fireDispatch('previousPlaying')}
          onStreaming={this.fireDispatch('toggleStreamingState')}
        />
        <Divider />
        <Grid>
          <Grid.Column width={6}>
            <DragInTrack
              disabled={!this.props.settings.token}
              onDrop={this.handleURLDrop}
            >
              <Header size='small'>Current Track</Header>
              <CurrentTrackContainer />
            </DragInTrack>
          </Grid.Column>
          <Grid.Column width={10}>
            <Header size='small'>
              Playlist <ClearPlaylist
                disabled={!this.props.settings.token}
                onClear={this.fireDispatch('clearTrackList')}
              />
            </Header>
            <TrackList
              disabled={!this.props.settings.token}
              images={this.props.tracklistImages}
              tracks={this.props.tracklist}
              currentTrack={this.props.currentTrack}
              onRemoveTrack={this.fireDispatch('removeFromTracklist')}
            />
          </Grid.Column>
        </Grid>
        <ToastContainer />
        <RadioStream active={this.props.jukebox.radioStreamPlaying} />
      </Dimmer.Dimmable>
    )
  }
}

const mapStateToProps = state => {
  return {
    settings: state.settings,
    jukebox: state.jukebox,
    currentTrack: state.track,
    tracklist: state.tracklist,
    tracklistImages: getTracklistImagesInCache(state)
  }
}

export default connect(
  mapStateToProps
)(DragDropContext(HTML5Backend)(Dashboard))
