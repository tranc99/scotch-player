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

    )
  }
}
