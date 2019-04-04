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
      isLogin : false,
      dataLogin : "",
    };
  }

  onLogin (value) {
    if (value !== null) {
      this.setState({
        isLogin : value
      });
    }    
  }

  changeComponent () {
    console.log(localStorage.getItem('user') )
    if (localStorage.getItem('user') === null) {
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
          <TopNavigation onLogin = {this.onLogin.bind(this)}/>
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
