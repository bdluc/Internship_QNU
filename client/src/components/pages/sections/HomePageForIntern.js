import React from 'react';
import ReportPage from './components/ReportPage';
import CourseCompleted from './CourseCompleted';
class HomePageForIntern extends React.Component {

  render() {
    return (

      <div>
        <CourseCompleted id = {this.props.id} role = {this.props.role}/>
        <ReportPage></ReportPage>
      </div>

    );
  }
}

export default HomePageForIntern