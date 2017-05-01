import React from 'react'
import PropTypes from 'prop-types'

class PlayerSelector extends React.Component { // eslint-disable-line
  render() {
    return (
      <form>
        <label htmlFor="LeBron James">LeBron</label>
        <input
          type="radio"
          name="dataset"
          id="LeBron James"
          value="LeBron James"
          onChange={this.props.setDataset}
          checked={this.props.player === 'LeBron James'}
        />
        <label htmlFor="Steph Curry">Steph</label>
        <input
          type="radio"
          name="dataset"
          id="Steph Curry"
          value="Steph Curry"
          onChange={this.props.setDataset}
          checked={this.props.player === 'Steph Curry'}
        />
      </form>
    )
  }
}

PlayerSelector.propTypes = {
  setDataset: PropTypes.func.isRequired,
  player: PropTypes.string.isRequired
}

export default PlayerSelector
