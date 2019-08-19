import React from 'react';
import styled from 'styled-components';
import axios from 'axios';

import media from '../../components/style-utils';

import PlayerSelector from '../../components/PlayerSelector';
import HexShotchart from '../../components/HexShotchart';
import VShootingSignature from '../../components/VShootingSignature';
import LineChart from '../../components/LineChart';

import {binShots} from '../../lib/binShots';
import {ribbonShots} from '../../lib/ribbonShots';

const Title = styled.h1`
  color: midnightblue;
`;

const ChartsDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  ${media.tablet`flex-direction: column;`}
`;
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
`;

export default class ChartDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activated: 0,
      deactivated: 0,
      binnedData: [],
      dataset: 2544,
      data: undefined,
      maxDistance: 35,
      players: this.getPlayers(),
      ribbonedData: [],
    };
    this.setDataset = this.setDataset.bind(this);
    this.updateActivated = this.updateActivated.bind(this);
    this.updateDeactivated = this.updateDeactivated.bind(this);
  }

  componentDidMount() {
    const {dataset} = this.state;
    this.getShots(dataset);
  }

  getPlayers() {
    const endpoint =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000/api/players'
        : 'https://splash.jackfletch.com/api/players';
    axios.get(endpoint).then(response => {
      this.setPlayers(response.data);
    });
  }

  getShots(playerId) {
    const endpoint =
      process.env.NODE_ENV === 'development'
        ? `http://localhost:5000/api/shots/${playerId}`
        : `https://splash.jackfletch.com/api/shots/${playerId}`;
    axios.get(endpoint).then(response => {
      this.setData(response.data);
    });
  }

  setData(e) {
    this.setState(prevState => ({
      data: e,
      ribbonedData: ribbonShots(e, prevState.maxDistance),
      binnedData: binShots(e, prevState.maxDistance),
    }));
  }

  setDataset(e) {
    this.setState({
      dataset: parseInt(e.target.value),
    });
    this.getShots(e.target.value);
  }

  setPlayers(e) {
    this.setState({
      players: e,
    });
  }

  updateActivated(distance) {
    this.setState({
      activated: distance,
    });
  }

  updateDeactivated(distance) {
    this.setState({
      deactivated: distance,
    });
  }

  render() {
    const {
      activated,
      binnedData,
      data,
      dataset,
      deactivated,
      maxDistance,
      players,
      ribbonedData,
    } = this.state;

    if (data === undefined) {
      return <div>Still fetching data</div>;
    }
    if (data.length === 0) {
      return (
        <div>
          <Title>Chart Dashboard</Title>
          <PlayerSelector
            player={dataset}
            players={players}
            setDataset={this.setDataset}
          />
          <div>No result found for this player</div>
        </div>
      );
    }
    if (data.length <= 50) {
      return (
        <div>
          <Title>Chart Dashboard</Title>
          <PlayerSelector
            player={dataset}
            players={players}
            setDataset={this.setDataset}
          />
          <div>Not enough shots by this player for any meaningful data</div>
        </div>
      );
    }
    const hover = {
      distance: activated,
      toggle: activated !== deactivated,
    };

    return (
      <div>
        <Title>Chart Dashboard</Title>
        <PlayerSelector
          player={dataset}
          players={players}
          setDataset={this.setDataset}
        />
        <ChartsDiv>
          <HexShotchart data={data} hover={hover} />
          <RightChartsDiv>
            <VShootingSignature
              data={ribbonedData}
              hover={hover}
              maxDistance={maxDistance}
            />
            <LineChart
              data={binnedData}
              hover={hover}
              maxDistance={maxDistance}
              activated={this.updateActivated}
              deactivated={this.updateDeactivated}
            />
          </RightChartsDiv>
        </ChartsDiv>
      </div>
    );
  }
}
