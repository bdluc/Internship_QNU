import React, { Component } from 'react';
import Dashboard from './components/pages/DashBoard';
import Routes from '../src/components/Routes';
// import './App.css';
import './components/Routes'

class App extends Component {
  render() {
    return (
        <div className="flexible-content">
            <main id="content" className="p-5">
                <Dashboard/>
              <Routes></Routes>
            </main>

        </div>
    );
  }
}

export default App;
