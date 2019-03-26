import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
// import ProfilePage from './pages/ProfilePage';
// import UserPage from './pages/UserPage';
// import MapsPage from './pages/MapsPage';
// import ReportPage from './pages/ReportPage';
// import TraineeAttendancePage from './pages/TraineeAttendancePage';
// import AttendancePage from './pages/AttendancePage';
// import TakeAttendancePage from './pages/TakeAttendancePage';
// import Golang from './pages/Golang';
// import RegistrationCourse from './pages/RegistrationCourse';
// import Java from './pages/Java';
// import CSharp from './pages/CSharp';
// import Login from './pages/Login';

class Routes extends React.Component {

    render() {
        return (
            <BrowserRouter>
            <Switch>
                <Route path='/' exact component={LoginPage} />
                <Route path='/login' component={LoginPage} />
                {/*<Route path='/profile' component={ProfilePage} />*/}
                {/*<Route path='/tables' component={() => <UserPage dataLogin = {this.props.dataLogin}></UserPage>} />*/}
                {/*<Route path='/maps' component={MapsPage} />*/}
                {/*<Route path='/trainee/attendance' component={TraineeAttendancePage}/>*/}
                {/*<Route path='/attendance' component={AttendancePage} />*/}
                {/*<Route path='/takeattendance' component={TakeAttendancePage} />*/}
                {/*<Route path='/course/golang' component={Golang} />*/}
                {/*<Route path='/course/java' component={Java} />*/}
                {/*<Route path='/course/csharp' component={CSharp} />*/}
                {/*<Route path='/regiscourse' component={RegistrationCourse} />*/}
                {/*<Route path='/report' component={ReportPage} />*/}
                {/*<Route path='/404' component={Login} />*/}
            </Switch>
            </BrowserRouter>
        );
    }
}

export default Routes;
