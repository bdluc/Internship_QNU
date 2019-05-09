import React, { Component } from 'react';
import Routes from '../src/components/Routes';
import { Redirect } from 'react-router-dom'
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

  componentDidMount(){
      document.title = "Internship Management"
    }
  
  onLogin (value) {
    if (value !== null) {
      this.setState({
        user : value
      }); 
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
      <Redirect to='/' />
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
