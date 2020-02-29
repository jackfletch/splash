import {useCallback} from 'react';

/**
 * Apply the dispatch function as an input to the activator events and pass the
 * output activator functions into `useCallback` so React knows the functions
 * have not changed.
 * @param {Function} dispatch the dispatch function.
 * @param {Object} events the activator events that need a dispatch function.
 * @param {Function} events.onActivated
 * @param {Function} events.onDeactivated
 */
function useActivatorEventss(dispatch, events) {
  const onActivated = useCallback(events.onActivated(dispatch), [dispatch]);
  const onDeactivated = useCallback(events.onDeactivated(dispatch), [dispatch]);

  return {onActivated, onDeactivated};
}

export default useActivatorEventss;
