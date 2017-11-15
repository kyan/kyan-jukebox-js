import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import * as actions from '../../actions'
import CurrentTrack from '../../components/current-track'
import PayloadLogger from '../../components/payload-logger'

class Dashboard extends Component {
  componentDidMount() {
    this.props.dispatch(actions.wsConnect());
  }

  componentWillUnmount = () => {
    this.props.dispatch(actions.wsDisconnect());
  }

  getCurrentTrackList = () => {
    this.props.dispatch(actions.getTrackList());
  }

  getCurrentTrack = () => {
    this.props.dispatch(actions.getCurrentTrack());
  }

  startPlaying = () => {
    this.props.dispatch(actions.startPlaying());
  }

  pausePlaying = () => {
    this.props.dispatch(actions.pausePlaying());
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

  render() {
    return (
      <div>
        <Button
          content='TrackList'
          icon='music'
          labelPosition='left'
          onClick={this.getCurrentTrackList}
        />
        <Button
          content='Current Track'
          icon='music'
          labelPosition='left'
          onClick={this.getCurrentTrack}
        />
        {this.playButton()}
        {this.pauseButton()}
        <CurrentTrack
          image={this.props.currentTrackImage}
          track={this.props.currentTrack}
        />
        <PayloadLogger payload={this.props.payload}/>
      </div>
    )
  }
}

export default connect(state => ({
  currentTrack: state.track,
  currentTrackImage: state.assets.currentTrack,
  payload: state.payload
}))(Dashboard)
