import React from 'react';
import './attendance.css';
import MentorAttendance from './sections/MentorAttendance';
import InternAttendance from './sections/InternAttendance';
import SupervisorAttendance from './sections/SupervisorAttendance';
import $ from 'jquery';


class AttendancePage extends React.Component {

  constructor(props) {
        super(props);   
        this.state = {
            role: JSON.parse(sessionStorage.getItem('user')).Role
        };
        console.log("OK")
  }

  render() {
    if(this.state.role === 1)
        return (
            
            <InternAttendance></InternAttendance>
            
        );
    else if(this.state.role === 2)
        return (
            <MentorAttendance></MentorAttendance>
        );
    else{
        return (
            <SupervisorAttendance></SupervisorAttendance>
        );
    }
  }
}

export default AttendancePage