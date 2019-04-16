import React, { Component } from 'react';
import Routes from '../src/components/Routes';
import TopNavigation from './components/topNavigation';
import SideNavigation from './components/sideNavigation';
import Login from './components/pages/LoginPage'
import Footer from './components/Footer';
import './index.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      user : JSON.parse(sessionStorage.getItem('user')),
      dataLogin : ""
    };
    }

  onLogin (value) {
    if (value !== null) {
      this.setState({
        user : value
      });
      var user = this.state.user;
      if (user.Role === 1){
        fetch('http://localhost:8080/attendance',
            {
                method: "POST",
                headers:{
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({"InternID": user.ID})
            })
      }
      
    } 
  }

  onLogout(){
    this.setState({
      user : null
    });
    sessionStorage.clear();
  }

  changeComponent () {
    if (this.state.user === null) {
      return (
      <div className="flexible-content">
      <main id="content" className="p-5">
      <Login onLogin = {this.onLogin.bind(this)}></Login>
      </main>
      </div>
      )
    } else {
      return (
        <div className="flexible-content">
          <TopNavigation onLogout = {this.onLogout.bind(this)} name = {this.state.user.UserName}/>
          <SideNavigation />
          <div>
          <main id="content" className="p-5">
            <Routes></Routes>
          </main>
          <Footer />
          </div>        
        </div>
      )
    }
  }
  
  render() {
    let component = this.changeComponent();
    return (
      <div>
          {component}
      </div>
    );
  }
}

export default App;
