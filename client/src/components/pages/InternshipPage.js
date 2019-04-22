import React from 'react';
import InternPageForIntern from './sections/InternPageForIntern';
import InternPageForMentor from './sections/InternPageForMentor';


class MentorPage extends React.Component {

  constructor(props) {
        super(props);   
        this.state = {
            role: JSON.parse(sessionStorage.getItem('user')).Role
        };
  }

  render() {
    if(this.state.role === 1)
        return (
            <InternPageForIntern></InternPageForIntern>
            
        );
    else 
        return (
            <InternPageForMentor></InternPageForMentor>
        );
    }
  }

export default MentorPage
