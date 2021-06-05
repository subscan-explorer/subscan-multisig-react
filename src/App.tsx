import React from 'react';
import logo from './logo.svg';
import './App.scss';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <img src={logo} className="app-logo" alt="logo" />
        <p>
          Edit <code>src/app.tsx</code> and save to reload.
        </p>
        <a className="app-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
        <a className="text-green-500">The text style controlled by tailwind css</a>
      </header>
    </div>
  );
}

export default App;
