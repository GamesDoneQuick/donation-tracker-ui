import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import $ from 'jquery';
import { Provider } from 'react-redux';

import App from './app';
import ScheduleEditor from './schedule_editor';
import ajaxSetup from '../public/ajaxsetup';
import DevTools from '../devtools';

if (__DEVTOOLS__) {
    window.store = App.store;
}

$(window).load(() => {
    ajaxSetup($);

    ReactDOM.render(
        <Provider store={App.store}>
            <span>
                <Router history={browserHistory} location={{href: window.ROOT_PATH}}>
                    <Route component={App} path={window.ROOT_PATH}>
                        <Route path="schedule_editor" component={ScheduleEditor}>
                            <Route path=":event" component={ScheduleEditor}/>
                        </Route>
                    </Route>
                </Router>
                { __DEVTOOLS__ ? <DevTools /> : null}
            </span>
        </Provider>,
    document.getElementById("container"));
});
