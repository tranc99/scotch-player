import React from 'react';
import Axios from 'axios';
import Sound from 'react-sound';
import Search from '../components/search.component';
import Details from '../components/details.component';
import Player from '../components/player.component';
import Progress from '../components/progress.component';
import Footer from '../components/footer.component';

class AppContainer extends React.Component {

  constructor(props) {
    super(props);
    this.client_id = 'b8428bbfb1a5d926fdd92fbb6e45f480';

    this.state = {
      track: {stream_url: '', title: '', artwork_url: ''},
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
    Axios.get(`https://api.soundcloud.com/playlists/233123443?client_id=${this.client_id}`)
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

  togglePlay() {
    if(this.state.playStatus === Sound.status.PLAYING) {
      this.setState({playStatus: Sound.status.PAUSED});
    } else {
      this.setState({playStatus: Sound.status.PLAYING});
    }
  }

  stop() {
    this.setState({playStatus: Sound.status.STOPPED});
  }

  forward() {
    this.setState({playFromPosition: this.state.playFromPosition+=1000*10});
  }

  backward() {
    this.setState({playFromPosition: this.state.playFromPosition-=1000*10});
  }

  xlArtwork(url) {
    return url.replace(/large/, 't500x500');
  }

  render() {

    const scotchStyle = {
      width: '500px',
      height: '500px',
      backgroundImage: `linear-gradient(
        rgba(0, 0, 0, 0.7),
        rgba(0, 0, 0, 0.7)
      ), url(${this.xlArtwork(this.state.track.artwork_url)})`
    }

    return (
      <div className="scotch_music" style={scotchStyle}>
        <Search
          autoCompleteValue={this.state.autoCompleteValue}
          tracks={this.state.tracks}
          handleSelect={this.handleSelect.bind(this)}
          handleChange={this.handleChange.bind(this)}

        />
        <Details
          title={this.state.track.title}
        />
        <Player
          togglePlay={this.togglePlay.bind(this)}
          stop={this.stop.bind(this)}
          playStatus={this.state.playStatus}
          forward={this.forward.bind(this)}
          backward={this.backward.bind(this)}
          random={this.randomTrack.bind(this)}
        />
        <Progress
          elapsed={this.state.elapsed}
          total={this.state.total}
          position={this.state.position}/>
        <Sound
          url={this.prepareUrl(this.state.track.stream_url)}
          playStatus={this.state.playStatus}
          onPlaying={this.handleSongPlaying.bind(this)}
          playFromPosition={this.state.playFromPosition}
          onFinishedPlaying={this.handleSongFinished.bind(this)}
        />
        <Footer />

      </div>
    );
  }
}

export default AppContainer
