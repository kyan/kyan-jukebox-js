import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Divider, Grid, Button, Header, Icon } from 'semantic-ui-react'
import * as actions from '../../actions'
import CurrentTrack from '../../components/current-track'
import TrackList from '../../components/tracklist'
import { getCurrentTrackImageInCache, getTracklistImagesInCache } from '../../selectors/images'
import { timerToPercentage } from '../../utils/time'

class Dashboard extends Component {
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

  startPlaying = () => {
    this.dispatch(actions.startPlaying())
  }

  pausePlaying = () => {
    this.dispatch(actions.pausePlaying())
  }

  skipPlaying = () => {
    this.dispatch(actions.skipPlaying())
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
      <Icon size='small' name='circle' color={color} />
    )
  }

  render() {
    return (
      <div>
        {this.playButton()}
        {this.pauseButton()}
        {this.skipButton()}
        {this.onlineIcon(this.props.jukebox.online)}
        <Divider />
        <Grid columns={2}>
          <Grid.Column>
            <Header size='small'>Currently Playing</Header>
            <CurrentTrack
              image={this.props.currentTrackImage}
              track={this.props.currentTrack}
              progress={this.props.currentPosition}
            />
          </Grid.Column>
          <Grid.Column>
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
    currentTrackImage: getCurrentTrackImageInCache(state),
    tracklist: state.tracklist,
    tracklistImages: getTracklistImagesInCache(state),
    currentPosition: timerToPercentage(state.timer)
  }
}

export default connect(
  mapStateToProps
)(Dashboard)
