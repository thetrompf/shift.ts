import * as React from 'react';
import { Route } from 'react-router';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import './App.css';
import { BootstrapPage } from './pages/Bootstrap';
import { FormPage } from './pages/Form';
import { HomePage } from './pages/Home';

const logo = require('./logo.svg');

class App extends React.Component {
    public render() {
        return (
            <Router>
                <div className="App">
                    <div className="App-header">
                        <img alt="logo" className="App-logo" src={logo} />
                        <h2>Welcome to React</h2>
                    </div>
                    <div className="App-menu">
                        <Link to="/">Home</Link> <Link to="/form">Form</Link> <Link to="/bootstrap">Bootstrap</Link>
                    </div>
                    <Route component={HomePage} exact path="/" />
                    <Route component={FormPage} path="/form" />
                    <Route component={BootstrapPage} path="/bootstrap" />
                </div>
            </Router>
        );
    }
}

export default App;
