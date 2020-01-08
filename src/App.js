import React from 'react';
import styled from 'styled-components';
import {BrowserRouter as Router} from 'react-router-dom';

import ChartDashboard from './containers/ChartDashboard';
import Footer from './containers/Footer';

const Div = styled.div`
  padding: 0 1em;
  @media only screen and (min-width: 768px) {
    padding: 0 2em;
  }
`;

const H1 = styled.h1`
  color: midnightblue;
`;

const App = () => (
  <Router>
    <Div className="App">
      <H1>Splash</H1>
      <ChartDashboard />
      <Footer />
    </Div>
  </Router>
);

export default App;
