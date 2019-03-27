import React from 'react';
import { Route, Switch } from 'react-router-dom';
import MentorPage from './pages/MentorPage';
import InternshipPage from './pages/InternshipPage'
import CoursePage from './pages/CoursePage'
import CoursePages from './pages/CoursePages'

import Attendance from './pages/Attendance'
import Login from './pages/LoginPage'

import NotFoundPage from './pages/NotFoundPage';

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route path='/mentor' exact component={MentorPage} />
        <Route path='/internship' exact component={InternshipPage}  />
        <Route path='/course' exact component={CoursePage}  />
        <Route path='/courses' exact component={CoursePages}  />

        <Route path='/attendance' exact component={Attendance}  />
        <Route path='/login' exact component={Login}  />

        <Route path='/404' component={NotFoundPage} />
      </Switch>
    );
  }
}

export default Routes;
