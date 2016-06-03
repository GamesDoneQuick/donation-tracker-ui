import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import $ from 'jquery';
import { Provider } from 'react-redux';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

import App from './app';
import ScheduleEditor from './schedule_editor';
import ajaxSetup from '../public/ajaxsetup';

if (__DEVTOOLS__) {
    window.store = App.store;
}

$(window).load(() => {
    ajaxSetup($);

    ReactDOM.render(
        <Provider store={App.store}>
            <span>
                <Router history={browserHistory}>
                    <Route component={App} path={window.ROOT_PATH}>
                        <Route name="schedule_editor" component={ScheduleEditor}>
                            <Route path=":event" component={ScheduleEditor}/>
                        </Route>
                    </Route>
                </Router>
                { __DEVTOOLS__ && false ?
                    <DebugPanel top right bottom>
                        <DevTools store={App.store} monitor={LogMonitor} />
                    </DebugPanel>
                : null}
            </span>
        </Provider>,
    document.getElementById("container"));
});
