import React from 'react'
import PropTypes from 'prop-types'

class PlayerSelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = { player: this.props.player }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.player !== this.state.player) {
      this.setState({ player: nextProps.player })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.player !== this.state.player) {
      return true
    }
    return false
  }

  render() {
    return (
      <form>
        <label htmlFor="select1">Select</label>
        <select value={this.state.player} onChange={this.props.setDataset}>
          {this.props.players.map(d =>
            <option key={d.id} value={d.id}>{d.name}</option>
          )}
        </select>
      </form>
    )
  }
}

PlayerSelector.propTypes = {
  player: PropTypes.number.isRequired,
  players: PropTypes.array.isRequired,
  setDataset: PropTypes.func.isRequired
}

export default PlayerSelector
