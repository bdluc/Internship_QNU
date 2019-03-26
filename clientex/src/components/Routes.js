import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LoginPage from './pages/LoginPage'
import MentorPage from './pages/MentorPage'
import InternPage from './pages/InternsPage'
import CourcePage from './pages/CourcePage'
import AttendencePage from './pages/AttendencePage'
import NotFoundPage from './pages/NotFoundPage';

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route path='/' exact component={MentorPage} />
        <Route path='/login' component={LoginPage}/>
        <Route path='/mentor' component={MentorPage}/>
        <Route path='/intern' component={InternPage}/>
        <Route path='/cource' component={CourcePage}/>
        <Route path='/attendence' component={AttendencePage}/>
        <Route path='/404' component={NotFoundPage} />
      </Switch>
    );
  }
}

export default Routes;
