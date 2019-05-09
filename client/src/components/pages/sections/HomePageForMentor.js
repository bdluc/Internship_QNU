import React from 'react';
import AttendanceDashboard from './components/AttendanceDashboard'
import ListInternAbsent from './components/ListInternAbsent'
import CourseCompleted from './CourseCompleted';
import { Container, Row, Col } from 'react-bootstrap';
import InternReportDay from './components/InternReportDay';

class HomePageForMentor extends React.Component {

  render() {
    return (

      <div>
      <CourseCompleted id = {this.props.id} role = {this.props.role}/>
        <Container>
          <InternReportDay></InternReportDay>
          <Row className="show-grid">
            <Col xs={12} md={6} className="custom-align-left"><AttendanceDashboard></AttendanceDashboard></Col>
            <Col xs={12} md={6} className="custom-align-left"><ListInternAbsent></ListInternAbsent></Col>
          </Row>
        </Container>
      </div>

    );
  }
}

export default HomePageForMentor
