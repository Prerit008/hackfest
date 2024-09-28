// App.js
import React from 'react';
import EventList from './components/EventList';
import './App.css';
import Nav from './components/Nav.js';
function App() {
  return (
    <div className="App">
      <Nav/>
      <EventList />
    </div>
  );
}

export default App;
