import React from 'react'
import styled from 'styled-components'

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
    // TODO: this is temporary setup until db is connected
    // 201939
    const rawDataSteph = require('./../../../data/steph.json') // eslint-disable-line global-require
    // 2544
    const rawDataLebron = require('./../../../data/lebron.json') // eslint-disable-line global-require
    this.state = {
      dataset: 'LeBron James',
      data: {
        'LeBron James': this.cleanData(rawDataLebron),
        'Steph Curry': this.cleanData(rawDataSteph)
      },
      hover: {
        distance: 0,
        toggle: false
      },
      maxDistance: 35
    }
    this.setDataset = this.setDataset.bind(this)
    this.updateHover = this.updateHover.bind(this)
  }

  setDataset(e) {
    this.setState({
      dataset: e.target.value
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

  cleanData(rawData) {
    const data = []
    const shotData = rawData.resultSets[0].rowSet
    for (let i = 0; i < shotData.length; i++) {
      const x = shotData[i][17]
      const y = shotData[i][18]
      const make = shotData[i][20]
      const distance = shotData[i][16]
      data.push({ x, y, make, distance })
    }
    return data
  }

  render() {
    const ribbonedData = calcRibbonStats(this.state.data[this.state.dataset], this.state.maxDistance)
    const binnedData = binStats(this.state.data[this.state.dataset], this.state.maxDistance)

    return (
      <div>
        <Title>Chart Dashboard</Title>
        <PlayerSelector
          player={this.state.dataset}
          setDataset={this.setDataset}
        />
        <ChartsDiv>
          <HexShotchart
            data={this.state.data[this.state.dataset]}
            hover={this.state.hover}
          />
          <RightChartsDiv>
            <VShootingSignature
              data={ribbonedData}
              hover={this.state.hover}
              maxDistance={this.state.maxDistance}
            />
            <LineChart
              data={binnedData}
              updateHover={this.updateHover}
              maxDistance={this.state.maxDistance}
            />
          </RightChartsDiv>
        </ChartsDiv>
      </div>
    )
  }
}
