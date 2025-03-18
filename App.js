import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Home from "./pages/home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Vote from "./pages/Vote";
import Results from "./pages/Results";
import "./App.css"; // New global styles

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* NAVIGATION BAR */}
        <nav className="navbar">
          <div className="logo">🗳️ Kenya Voting</div>
          <ul className="nav-links">
            <li><Link to="/">🏠 Home</Link></li>
            <li><Link to="/register">📝 Register</Link></li>
            <li><Link to="/login">🔑 Login</Link></li>
            <li><Link to="/vote">🗳️ Vote</Link></li>
            <li><Link to="/results">📊 Results</Link></li>
          </ul>
        </nav>

        {/* PAGE CONTENT */}
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/vote" component={Vote} />
          <Route path="/results" component={Results} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
