import React, { useEffect } from 'react';
import './App.css';
import YTForm from './components/YTForm'
import Admin from './components/Admin'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from 'axios'

const App =() => {
  useEffect(() => {
    axios.get('/api')
    .then(res => console.log(res.data))
    .catch(err => console.log(err))
  }, [])
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/:guildId" component={YTForm} />
          <Route path="/admin/:guildId" component={Admin} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
