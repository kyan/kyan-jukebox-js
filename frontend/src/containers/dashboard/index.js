import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DragDropContext, DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { Divider, Grid, Button, Header, Icon } from 'semantic-ui-react'
import Constants from '../../constants'
import UrlDropArea from '../../components/url-drop-area'
import VolumeButtons from '../../components/volume-buttons'
import SkipButtons from '../../components/skip-buttons'
import ClearPlaylist from '../../components/clear-playlist'
import * as actions from '../../actions'
import CurrentTrackContainer from '../current-track-container'
import TrackList from '../../components/tracklist'
import { getTracklistImagesInCache } from '../../selectors'

export class Dashboard extends Component {
  constructor (props) {
    super(props)
    this.dispatch = this.props.dispatch
  }

  componentDidMount () {
    this.dispatch(actions.wsConnect())
  }

  componentWillUnmount () {
    this.dispatch(actions.wsDisconnect())
  }

  onClearChange = () => {
    this.dispatch(actions.clearTrackList())
  }

  onVolumeChange = (volume) => {
    this.dispatch(actions.setVolume(volume))
  }

  startPlaying = () => {
    this.dispatch(actions.startPlaying())
  }

  pausePlaying = () => {
    this.dispatch(actions.pausePlaying())
  }

  nextPlaying = () => {
    this.dispatch(actions.nextPlaying())
  }

  previousPlaying = () => {
    this.dispatch(actions.previousPlaying())
  }

  addNewTrack = (uri) => {
    this.dispatch(actions.addNewTrack(uri))
  }

  playButton () {
    return (
      <Button
        onClick={this.startPlaying}
        animated='vertical'
      >
        <Button.Content hidden>Play</Button.Content>
        <Button.Content visible>
          <Icon name='play' />
        </Button.Content>
      </Button>
    )
  }

  pauseButton () {
    return (
      <Button
        onClick={this.pausePlaying}
        animated='vertical'
      >
        <Button.Content hidden>Pause</Button.Content>
        <Button.Content visible>
          <Icon name='pause' />
        </Button.Content>
      </Button>
    )
  }

  onlineIcon (online) {
    const color = online ? 'green' : 'orange'
    return (
      <Icon
        size='large'
        name='power'
        color={color}
        className='jukebox-status-icon'
      />
    )
  }

  handleURLDrop = (_item, monitor) => {
    if (monitor) {
      this.addNewTrack(monitor.getItem().urls[0])
    }
  }

  render () {
    return (
      <div>
        <ClearPlaylist
          onClear={this.onClearChange}
        />
        <VolumeButtons
          volume={this.props.jukebox.currentVolume}
          onVolumeChange={this.onVolumeChange}
        />
        <SkipButtons
          onPreviousPlayingClick={this.previousPlaying}
          onNextPlayingClick={this.nextPlaying}
        />
        {this.playButton()}
        {this.pauseButton()}
        {this.onlineIcon(this.props.jukebox.online)}
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
            <Header size='small'>Playlist</Header>
            <TrackList
              images={this.props.tracklistImages}
              tracks={this.props.tracklist}
              currentTrack={this.props.currentTrack}
            />
          </Grid.Column>
        </Grid>
      </div>
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
