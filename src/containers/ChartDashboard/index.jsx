import React from 'react'
import styled from 'styled-components'
import axios from 'axios'

import media from './../../components/style-utils'

import PlayerSelector from '../../components/PlayerSelector'
import HexShotchart from '../../components/HexShotchart'
import VShootingSignature from '../../components/VShootingSignature'
import LineChart from '../../components/LineChart'

import { binStats } from './../../js/bin'
import { calcRibbonStats } from './../../js/ribbonStats'


const Title = styled.h1`
  color: midnightblue;
`

const ChartsDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  ${media.tablet`flex-direction: column;`}
`
const RightChartsDiv = styled.div`
  flex: 1;
  box-sizing: border-box;
  background-color: #7e8000;
  display: flex;
  flex-wrap: wrap;
  align-self: stretch;
  align-items: center;
  height: auto;
  width: 100%;
  ${media.tablet`flex-direction: column;`}
`

export default class ChartDashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      binnedData: [],
      dataset: 2544,
      data: undefined,
      hover: {
        distance: 0,
        toggle: false
      },
      maxDistance: 35,
      players: this.getPlayers(),
      ribbonedData: []
    }
    this.setDataset = this.setDataset.bind(this)
    this.updateHover = this.updateHover.bind(this)
  }

  componentDidMount() {
    this.getShots(this.state.dataset)
  }

  getPlayers() {
    axios.get('http://localhost:3000/api/players')
      .then((response) => {
        this.setPlayers(response.data)
      })
  }

  getShots(playerId) {
    this.setRendering(true)
    axios.get(`http://localhost:3000/api/shots/${playerId}`)
      .then((response) => {
        this.setData(response.data)
        this.setRendering(false)
      })
  }

  setRendering(toggle) {
    this.setState({ rendering: toggle })
  }

  setData(e) {
    this.setState({
      data: e,
      ribbonedData: calcRibbonStats(e, this.state.maxDistance),
      binnedData: binStats(e, this.state.maxDistance)
    })
  }

  setDataset(e) {
    this.setState({
      dataset: parseInt(e.target.value)
    })
    this.getShots(e.target.value)
  }

  setPlayers(e) {
    this.setState({
      players: e
    })
  }

  updateHover(e) {
    this.setState({
      hover: {
        distance: e.distance,
        toggle: e.toggle
      }
    })
  }

  render() {
    if (this.state.data === undefined) {
      return (<div>Still fetching data</div>)
    }
    if (this.state.data.length === 0) {
      return <div>No result found for this player</div>
    }

    return (
      <div>
        <Title>Chart Dashboard</Title>
        <PlayerSelector
          player={this.state.dataset}
          players={this.state.players}
          setDataset={this.setDataset}
        />
        <ChartsDiv>
          <HexShotchart
            data={this.state.data}
            hover={this.state.hover}
          />
          <RightChartsDiv>
            <VShootingSignature
              data={this.state.ribbonedData}
              hover={this.state.hover}
              maxDistance={this.state.maxDistance}
            />
            <LineChart
              data={this.state.binnedData}
              updateHover={this.updateHover}
              maxDistance={this.state.maxDistance}
            />
          </RightChartsDiv>
        </ChartsDiv>
      </div>
    )
  }
}
