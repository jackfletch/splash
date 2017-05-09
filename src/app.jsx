import React from 'react'
import styled from 'styled-components'

import ChartDashboard from './containers/ChartDashboard'

const Div = styled.div`
  padding: 0 2em
`
const H2 = styled.h2`
  color: midnightblue
  padding: 0 0
  margin: 0
`
const Ul = styled.ul`
  margin: 0
`

class App extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Div className="App">
        <h1>Splash</h1>
        <p>a basketball shotchart generator</p>
        <p>this is a work in progress</p>
        <H2>TODO:</H2>
        <Ul>
          <li>add fancy player selection</li>
          <li>add more charts</li>
          <li>style everything</li>
        </Ul>
        <ChartDashboard id="chartdashboard" />
      </Div>
    )
  }
}

export default App
