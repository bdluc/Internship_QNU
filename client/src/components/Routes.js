import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router'
import MentorPage from './pages/MentorPage';
import InternshipPage from './pages/InternshipPage'
import CoursePage from './pages/CoursePage'
import CoursePages from './pages/CoursePages'
import EditInfor from './pages/EditInfor'
import Home from './pages/HomePage'

import AttendancePage from './pages/Attendance'
import Login from './pages/LoginPage'

import NotFoundPage from './pages/NotFoundPage';
import InternshipInfor from './pages/InternshipInfor';
import ReportPage from './pages/sections/components/ReportPage';

class Routes extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <Switch>
        <Route path='/mentor' exact component={MentorPage} />
        <Route path='/internship' exact component={InternshipPage}  />
        <Route path='/course/:id' exact component={CoursePage}  />
        <Route path='/courses' exact component={CoursePages}  />
        <Route path='/editinfor' exact component={EditInfor}  />
        <Route path='/attendance' exact component={AttendancePage}  />
        <Route path='/' exact component={Home} />
        <Route path='/profile/:id' component={InternshipInfor} />
        <Route path='/404' component={NotFoundPage} />
        <Route path='/:something' component={NotFoundPage} />
        
      </Switch>
    );
  }
}

export default Routes;
