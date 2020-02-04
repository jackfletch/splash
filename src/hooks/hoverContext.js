import React, {createContext, useContext, useReducer} from 'react';
import PropTypes from 'prop-types';

const HoverStateContext = createContext();
const HoverDispatchContext = createContext();

const defaultState = {
  distance: -1,
  toggle: false,
};

function hoverReducer(state, action) {
  switch (action.type) {
    case 'activate': {
      return {
        distance: action.value,
        toggle: true,
      };
    }
    case 'deactivate': {
      return {
        distance: state.distance,
        toggle: state.distance !== action.value,
      };
    }
    case 'reset': {
      return defaultState;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function HoverProvider({children}) {
  const [state, dispatch] = useReducer(hoverReducer, defaultState);

  return (
    <HoverStateContext.Provider value={state}>
      <HoverDispatchContext.Provider value={dispatch}>
        {children}
      </HoverDispatchContext.Provider>
    </HoverStateContext.Provider>
  );
}

HoverProvider.propTypes = {
  children: PropTypes.node,
};

function useHoverState() {
  const context = useContext(HoverStateContext);
  if (context === undefined) {
    throw new Error('useHoverState must be used within a HoverProvider');
  }
  return context;
}

function useHoverDispatch() {
  const context = useContext(HoverDispatchContext);
  if (context === undefined) {
    throw new Error('useHoverDispatch must be used within a HoverProvider');
  }
  return context;
}

function useHover() {
  return [useHoverState(), useHoverDispatch()];
}

export {HoverProvider, useHover, useHoverState, useHoverDispatch};
