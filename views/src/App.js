import React from 'react';
import './App.scss';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    );
  }
}

export default App;
