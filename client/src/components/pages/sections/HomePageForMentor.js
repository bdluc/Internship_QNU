import React from 'react';
import AttendanceDashboard from './components/AttendanceDashboard'
import ListInternAbsent from './components/ListInternAbsent'


class HomePageForMentor extends React.Component {

  render() {
    return (
      <div>
        <AttendanceDashboard></AttendanceDashboard>
        <ListInternAbsent></ListInternAbsent>
      </div>
    );
  }
}

export default HomePageForMentor
