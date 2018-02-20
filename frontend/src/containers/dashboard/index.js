import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { DragDropContext, DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { Dimmer, Divider, Grid, Header } from 'semantic-ui-react'
import Constants from '../../constants'
import UrlDropArea from '../../components/url-drop-area'
import VolumeButtons from '../../components/volume-buttons'
import ClearPlaylist from '../../components/clear-playlist'
import * as actions from '../../actions'
import CurrentTrackContainer from '../current-track-container'
import Settings from '../settings'
import TrackList from '../../components/tracklist'
import { getTracklistImagesInCache } from '../../selectors'
import Controls from '../../components/controls'

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
          volume={this.props.jukebox.currentVolume}
          onVolumeChange={this.fireDispatch('setVolume')}
        />
        <Controls
          onPlay={this.fireDispatch('startPlaying')}
          onPause={this.fireDispatch('pausePlaying')}
          onNext={this.fireDispatch('nextPlaying')}
          onPrevious={this.fireDispatch('previousPlaying')}
        />
        <Divider />
        <Grid>
          <Grid.Column width={6}>
            <DragDropContextProvider backend={HTML5Backend}>
              <UrlDropArea accepts={Constants.DROP_TYPES} onDrop={this.handleURLDrop}>
                <Header size='small'>Currently Playing</Header>
                <CurrentTrackContainer />
              </UrlDropArea>
            </DragDropContextProvider>
          </Grid.Column>
          <Grid.Column width={10}>
            <Header size='small'>
              Playlist <ClearPlaylist
                onClear={this.fireDispatch('clearTrackList')}
              />
            </Header>
            <TrackList
              images={this.props.tracklistImages}
              tracks={this.props.tracklist}
              currentTrack={this.props.currentTrack}
              onRemoveTrack={this.fireDispatch('removeFromTracklist')}
            />
          </Grid.Column>
        </Grid>
        <ToastContainer />
      </Dimmer.Dimmable>
    )
  }
}

const mapStateToProps = state => {
  return {
    jukebox: state.jukebox,
    currentTrack: state.track,
    tracklist: state.tracklist,
    tracklistImages: getTracklistImagesInCache(state)
  }
}

export default connect(
  mapStateToProps
)(DragDropContext(HTML5Backend)(Dashboard))
