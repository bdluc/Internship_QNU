import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router'
import MentorPage from './pages/MentorPage';
import InternshipPage from './pages/InternshipPage'
import CoursePage from './pages/CoursePage'
import CoursePages from './pages/CoursePages'

import Attendance from './pages/Attendance'
import Login from './pages/LoginPage'

import NotFoundPage from './pages/NotFoundPage';

class Routes extends React.Component {
  constructor() {
    super();
    this.state = {
        user : JSON.parse(sessionStorage.getItem('user')),
        isIntern : false,
        courseID : ""
    };
  }

  CheckIntern = ()=> {
    let hihi = this.state.user.Role 
    if( hihi === 1){
      this.setState ({
          isIntern : true
        })
    }
  }
  render() {
    return (
      <Switch>
        <Route path='/mentor' exact component={MentorPage} />
        <Route path='/internship' exact component={InternshipPage}  />
        {
          this.state.isIntern === true && 
          <Switch>
            <Redirect from='/courses' to='/course/:id'/>
            <Route path='/courses' component={CoursePage}/>
          </Switch>
        }
        {
          this.state.isIntern === false && 
          <Switch>
          <Route path='/course/:id' exact component={CoursePage}  />
          <Route path='/courses' exact component={CoursePages}  />
          </Switch>
        }
        <Route path='/attendance' exact component={Attendance}  />
        <Route path='/login' exact component={Login}  />

        <Route path='/404' component={NotFoundPage} />
      </Switch>
    );
  }
}

export default Routes;
