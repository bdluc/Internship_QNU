import React from 'react';
// import HomePageForSup from './sections/HomePageForSup';
import HomePageForMentor from './sections/HomePageForMentor';
// import HomePageForIntern from './sections/HomePageForIntern';


class HomePage extends React.Component {

  constructor(props) {
        super(props);   
        this.state = {
            role: JSON.parse(sessionStorage.getItem('user')).Role
        };
  }

  render() {
    if(this.state.role === 2)
        return (
          <HomePageForMentor></HomePageForMentor>
            
        );
    if(this.state.role === 3)
        return (
          null
        );
    if(this.state.role === 1)
        return (
          null
        );
    }
  }
}

export default HomePage
