import React from 'react';
import MentorPageForSup from './sections/MentorPageForSup';
import EditInforForMentor from './sections/EditInforForMentor';
import MentorPageForIntern from './sections/MentorPageForIntern';


// import SupervisorAttendance from './sections/SupervisorAttendance';
// import $ from 'jquery';


class MentorPage extends React.Component {

  constructor(props) {
        super(props);   
        this.state = {
            role: JSON.parse(sessionStorage.getItem('user')).Role
        };
  }

  render() {
    if(this.state.role === 3)
        return (
            <MentorPageForSup></MentorPageForSup>
            
        );
    else if(this.state.role === 2)
        return (
            <EditInforForMentor></EditInforForMentor>
        );
    else{
        return (
            <MentorPageForIntern></MentorPageForIntern>
        );
    }
  }
}

export default MentorPage
