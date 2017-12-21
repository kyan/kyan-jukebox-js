import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DragDropContext, DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { Divider, Grid, Button, Header, Icon } from 'semantic-ui-react'
import Constants from '../../constants'
import UrlDropArea from '../../components/url-drop-area'
import VolumeButtons from '../../components/volume-buttons'
import * as actions from '../../actions'
import CurrentTrackContainer from '../current-track-container'
import TrackList from '../../components/tracklist'
import { getTracklistImagesInCache } from '../../selectors'

export class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.dispatch = this.props.dispatch
  }

  componentDidMount() {
    this.dispatch(actions.wsConnect())
  }

  componentWillUnmount = () => {
    this.dispatch(actions.wsDisconnect())
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

  skipPlaying = () => {
    this.dispatch(actions.skipPlaying())
  }

  addNewTrack = (uri) => {
    this.dispatch(actions.addNewTrack(uri))
  }

  playButton() {
    return (
      <Button
        content='Play'
        icon='play'
        labelPosition='left'
        onClick={this.startPlaying}
      />
    )
  }

  pauseButton() {
    return (
      <Button
        content='Pause'
        icon='pause'
        labelPosition='left'
        onClick={this.pausePlaying}
      />
    )
  }

  skipButton() {
    return (
      <Button
        content='Skip'
        icon='right arrow'
        labelPosition='right'
        onClick={this.skipPlaying}
      />
    )
  }

  onlineIcon(online) {
    const color = online ? 'green' : 'orange'
    return (
      <Icon
        size='small'
        name='circle'
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

  render() {
    return (
      <div>
        <VolumeButtons
          volume={this.props.jukebox.currentVolume}
          onVolumeChange={this.onVolumeChange}
         />
        {this.playButton()}
        {this.pauseButton()}
        {this.skipButton()}
        {this.onlineIcon(this.props.jukebox.online)}
        <Divider />
        <Grid>
          <Grid.Column width={6}>
            <DragDropContextProvider backend={HTML5Backend}>
              <UrlDropArea accepts={Constants.DROP_TYPES} onDrop={this.handleURLDrop}>
                <Header size='small'>Currently Playing</Header>
                <CurrentTrackContainer/>
              </UrlDropArea>
            </DragDropContextProvider>
          </Grid.Column>
          <Grid.Column width={10}>
            <Header size='small'>Tracklist</Header>
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
