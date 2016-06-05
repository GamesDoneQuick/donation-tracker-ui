import React, { Component } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import { Link, RouteHandler } from 'react-router';
import { connect } from 'react-redux';
import _ from 'underscore';
import Spinner from '../public/spinner';
import Dropdown from '../public/dropdown';
import { actions, store } from '../public/api';
import { sortByDateField } from '../public/util';

class App extends Component {
    getChildContext() {
        return { STATIC_URL: window.STATIC_URL };
    }

    render() {
        const {
            events,
            status,
            children,
        } = this.props;
        return (
            <div style={{position: 'relative'}}>
                <Link to={window.ROOT_PATH + "schedule_editor"}>Schedule Editor</Link>
                <Spinner spinning={status.event === 'loading'}>
                    <Dropdown>
                        <div style={{border: '1px solid', position: 'absolute', backgroundColor: 'white', minWidth: '200px', maxHeight: '120px', overflowY: 'auto' }}>
                            <ul style={{display: 'block'}}>
                                {events ? sortByDateField(events).map((pk, event) => {
                                    return (
                                        <li key={pk}>
                                            <Link to={window.ROOT_PATH + 'schedule_editor/' + pk}>{event.short}</Link>
                                        </li>
                                    );
                                })
                                    : null
                                }
                            </ul>
                        </div>
                    </Dropdown>
                </Spinner>
                {children}
            </div>
        );
    }

    componentWillMount() {
        this.props.loadModels('event');
    }
}

App.childContextTypes = {
    STATIC_URL: React.PropTypes.string,
};

function select(state) {
    const { saving, status, dropdowns } = state;
    const { event } = state.models;
    return {
        events: event,
        saving,
        status,
        dropdowns,
    };
}

function dispatch(dispatch) {
    return {
        loadModels: (model, params, additive) => {
            dispatch(actions.models.loadModels(model, params, additive));
        },
        saveModels: (models) => {
            dispatch(actions.models.saveModels(models));
        },
        toggleDropdown: (dropdown) => {
            dispatch(actions.dropdowns.toggleDropdown(dropdown));
        },
    };
}

App = DragDropContext(HTML5Backend)(connect(select, dispatch)(App));
App.store = store;

export default App;
