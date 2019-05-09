import React from 'react';
import AttendanceDashboard from './components/AttendanceDashboard'
import ListInternAbsent from './components/ListInternAbsent'
import CourseCompleted from './CourseCompleted';

class HomePageForMentor extends React.Component {

  render() {
    return (

      <div>
        <CourseCompleted id = {this.props.id} role = {this.props.role}/>
        <AttendanceDashboard></AttendanceDashboard>
        <ListInternAbsent></ListInternAbsent>
      </div>

    );
  }
}

export default HomePageForMentor
