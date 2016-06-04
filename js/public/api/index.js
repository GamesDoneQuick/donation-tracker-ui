import { compose, combineReducers, createStore, applyMiddleware } from 'redux';
import { devTools, persistState } from 'redux-devtools';
import thunk from 'redux-thunk';
import _ from 'underscore';

import DevTools from 'ui/devtools';
import actions from './actions';
import reducers from './reducers';
import freeze from 'ui/public/util/freeze';

const combined = combineReducers(reducers);

function freezeReducer(state = {}, action) {
    const newState = combined(state, action);
    if (newState !== state) {
        return freeze(newState);
    } else {
        return state;
    }
}

function getDebugSessionKey() {
    const matches = window.location.href.match(/[?&]debug_session=([^&#]+)\b/);
    return (matches && matches.length > 0)? matches[1] : null;
}

const store = (__DEVTOOLS__ ?
    compose(
        applyMiddleware(thunk),
        DevTools.instrument(),
        persistState(getDebugSessionKey())
    )
    :
    applyMiddleware(thunk)
)(createStore)(freezeReducer);

export {
    actions,
    store,
};
export default {
    actions,
    store,
};
