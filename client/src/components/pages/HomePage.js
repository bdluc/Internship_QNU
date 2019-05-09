import React from 'react';
// import HomePageForSup from './sections/HomePageForSup';
import HomePageForMentor from './sections/HomePageForMentor';
// import HomePageForIntern from './sections/HomePageForIntern';
import HomePageForIntern from './sections/HomePageForIntern';

class HomePage extends React.Component {

  constructor(props) {
        super(props);   
        this.state = {
            role: JSON.parse(sessionStorage.getItem('user')).Role,
            id: JSON.parse(sessionStorage.getItem('user')).ID
        };
  }

  render() {
    if(this.state.role === 2)
        return (
          <HomePageForMentor id = {this.state.id} role = {this.state.role}></HomePageForMentor>
            
        );
    if(this.state.role === 3)
        return (
          null
        );
    if(this.state.role === 1)
        return (
          <HomePageForIntern id = {this.state.id} role = {this.state.role}></HomePageForIntern>
        );
    }
  }


export default HomePage
