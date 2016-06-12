import React from 'react';

class Footer extends React.Component {
  render() {
    return(
      <div className="footer">
        <p>Deps from <img src="public/img/spaceship.jpg" className="logo" />
          & <img src="public/img/soundcloud.png" className="soundcloud" />
        </p>
      </div>
    )
  }
}

export default Footer
