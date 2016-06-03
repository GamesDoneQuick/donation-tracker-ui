import { compose, combineReducers, createStore, applyMiddleware } from 'redux';
import { devTools, persistState } from 'redux-devtools';
import thunk from 'redux-thunk';
import _ from 'underscore';

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

const store = (__DEVTOOLS__ ?
    compose(
        applyMiddleware(thunk),
        devTools(),
        persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )
    :
    applyMiddleware(thunk)
)(createStore)(freezeReducer);

module.exports = {
    actions,
    store,
};
