import React from 'react';
import './attendance.css';
import MentorAttendance from './sections/MentorAttendance';
import InternAttendance from './sections/InternAttendance';
import $ from 'jquery';


class AttendancePage extends React.Component {

  constructor(props) {
        super(props);   
        this.state = {
            role: 1
        };
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
  }
}

export default AttendancePage