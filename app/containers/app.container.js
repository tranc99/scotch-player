import React from 'react';
import Axios from 'axios';
import Sound from 'react-sound';
import Search from '../components/search.component';
import Details from '../components/details.component';

class AppContainer extends React.Component {

  constructor(props) {
    super(props);
    this.client_id = 'b8428bbfb1a5d926fdd92fbb6e45f480';

    this.state = {
      track: stream_url: '', title: '', artwork_url: '',
      playStatus: Sound.status.STOPPED,
      elapsed: '00:00',
      total: '00:00',
      position: 0,
      playFromPosition: 0,
      autoCompleteValue: '',
      tracks: []
    };
  }

  randomTrack() {
    let _this = this;

    // Request for a playlist via Soundcloud using a client ID
    Axios.get(`https://api.soundcloud.com/playlists/209262931?client_id=${this.client_id}`)
      .then(function (response) {
        const trackLength = response.data.tracks.length;
        const randomNumber = Math.floor((Math.random() * trackLength) + 1);
        _this.setState({track:  response.data.tracks[randomNumber]});
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  componentDidMount() {
    this.randomTrack();
  }

  prepareUrl(url) {
    return `${url}?client_id=${this.client_id}`;
  }

  formatMilliseconds(milliseconds) {
    var hours = Math.floor(milliseconds / 3600000);
    milliseconds = milliseconds % 3600000;
    var minutes = Math.floor(milliseconds / 60000);
    milliseconds = milliseconds % 60000;
    var seconds = Math.floor(milliseconds / 1000);
    milliseconds = Math.floor(milliseconds % 1000);

    return (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '' + seconds);
  }

  handleSongPlaying(audio) {
    this.setState({
      elapsed: this.formatMilliseconds(audio.position),
      total: this.formatMilliseconds(audio.duration),
      position: audio.position / audio.duration
    });
  }

  handleSongFinished() {
    // call random track
    this.randomTrack();
  }

  handleSelect(value, item) {
    this.setState({ autoCompleteValue: value, track: item});
  }

  handleChange(event, value) {
    // update input box
    this.setState({autoCompleteValue: event.target.value});
    let _this = this;
    // search for song with entered value
    Axios.get(`https://api.soundcloud.com/tracks?client_id=${this.client_id}&q=${value}`)
      .then(function(response) {
        _this.setState({tracks: response.data});
      })
      .catch(function(err) {
        console.log(err);
      })
  }

  render() {
    return (
      <div className="scotch_music">
        <Search
          autoCompleteValue={this.state.autoCompleteValue}
          tracks={this.state.tracks}
          handleSelect={this.handleSelect.bind(this)}
          handleChange={this.handleChange.bind(this)}

        />
        <Details
          title={this.state.track.title}
        />
        <Sound
          url={this.prepareUrl(this.state.track.stream_url)}
          playStatus={this.state.playStatus}
          onPlaying={this.handleSongPlaying.bind(this)}
          playFromPosition={this.state.playFromPosition}
          onFinishedPlaying={this.handleSongFinished.bind(this)}
        />

      </div>
    );
  }
}

default export AppContainer
