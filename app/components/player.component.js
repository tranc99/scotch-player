import React from 'react';
import Classnames from 'classnames';
class Player extends React.Component {

  render() {
    const playPauseClass = Classnames({
      'fa fa-play': this.props.playStatus == 'PLAYING' ? false : true,
      'fa fa-pause': this.props.playStatus == 'PLAYING' ? true : false
    });

    // Return JSX
    return (
      <div className="player">
        <div className="player__backward">
          <button onClick={this.props.backward}><i className="fa fa-backward"></i></button>
        </div>
        <div className="player__main">
          <button onClick={this.props.togglePlay}><i className={playPauseClass}></i></button>
          <button onClick={this.props.stop}><i className="fa fa-stop"></i></button>
          <button onClick={this.props.random}><i className="fa fa-random"></i></button>
        </div>
        <div className="player__forward">
          <button onClick={this.props.forward}><i className="fa fa-forward"></i></button>
        </div>
      </div>
    )
  }
}

export default Player
