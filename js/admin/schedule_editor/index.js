import React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';

import { actions } from 'ui/public/api';
import Spinner from 'ui/public/spinner';
import SpeedrunTable from './speedrun_table'
import authHelper from 'ui/public/api/helpers/auth';

const { PropTypes } = React;

class ScheduleEditor extends React.Component {
    constructor(props) {
        super(props);

        this.saveModel_ = this.saveModel_.bind(this);
        this.editModel_ = this.editModel_.bind(this);
        this.cancelEdit_ = this.cancelEdit_.bind(this);
        this.newSpeedrun_ = this.newSpeedrun_.bind(this);
        this.updateField_ = this.updateField_.bind(this);
        this.saveField = (model, field, value) => this.props.saveField({type: 'speedrun', ...model}, field, value);
    }

    render() {
        const { speedruns, event, drafts, status, moveSpeedrun, editable } = this.props;
        const { saveField, saveModel_, editModel_, cancelEdit_, newSpeedrun_, updateField_, } = this;
        const loading = (status.speedrun === 'loading' || status.event === 'loading' || status.me === 'loading');
        return (
            <Spinner spinning={loading}>
                {(status.speedrun === 'success' ?
                    <SpeedrunTable
                        event={event}
                        drafts={drafts}
                        speedruns={speedruns}
                        saveModel={editable && saveModel_}
                        editModel={editable && editModel_}
                        cancelEdit={editable && cancelEdit_}
                        newSpeedrun={editable && newSpeedrun_}
                        moveSpeedrun={editable && moveSpeedrun}
                        saveField={editable && saveField}
                        updateField={editable && updateField_} />
                    : null)}
            </Spinner>
        );
    }

    componentWillReceiveProps(newProps) {
        if (this.props.params.event !== newProps.params.event) {
            this.refreshSpeedruns_(newProps.params.event);
        }
    }

    componentWillMount() {
        this.refreshSpeedruns_(this.props.params.event);
    }

    refreshSpeedruns_(event) {
        const { status } = this.props;
        if (status.event !== 'loading' && status.event !== 'success') {
            this.props.loadModels('event');
        }
        if ((status.speedrun !== 'loading' && status.speedrun !== 'success') || event !== this.props.event) {
            this.props.loadModels(
                'speedrun',
                {event: event, all: 1}
            );
        }
    }

    saveModel_(pk, fields) {
        this.props.saveDraftModels([{type: 'speedrun', pk, fields}]);
    }

    editModel_(model) {
        this.props.newDraftModel({type: 'speedrun', ...model});
    }

    cancelEdit_(model) {
        this.props.deleteDraftModel({type: 'speedrun', ...model});
    }

    newSpeedrun_() {
        this.props.newDraftModel({type: 'speedrun'});
    }

    updateField_(pk, field, value) {
        this.props.updateDraftModelField('speedrun', pk, field, value);
    }
}

ScheduleEditor.childContextTypes = {
    editable: PropTypes.bool.isRequired,
};

function select(state, props) {
    const { models, drafts, status, singletons } = state;
    const { speedrun } = models;
    const event = _.findWhere(models.event, {pk: parseInt(props.params.event)}) || null;
    const { me } = singletons;
    return {
        event,
        speedruns: speedrun,
        status,
        drafts: drafts.speedrun || {},
        editable: authHelper.hasPermission(me, `${APP_NAME}.change_speedrun`) && (!(event && event.locked) || authHelper.hasPermission(me, `${APP_NAME}.can_edit_locked_events`)),
    };
}

function dispatch(dispatch) {
    return {
        loadModels: (model, params, additive) => {
            dispatch(actions.models.loadModels(model, params, additive));
        },
        moveSpeedrun: (source, destination, before) => {
            dispatch(actions.models.setInternalModelField('speedrun', source, 'moving', true));
            dispatch(actions.models.setInternalModelField('speedrun', destination, 'moving', true));
            dispatch(actions.models.command({
                    type: 'MoveSpeedRun',
                    params: {
                        moving: source,
                        other: destination,
                        before: before ? 1 : 0,
                    },
                    always: () => {
                        dispatch(actions.models.setInternalModelField('speedrun', source, 'moving', false));
                        dispatch(actions.models.setInternalModelField('speedrun', destination, 'moving', false));
                    }
                }));
        },
        saveField: (model, field, value) => {
            dispatch(actions.models.saveField(model, field, value));
        },
        newDraftModel: (model) => {
            dispatch(actions.models.newDraftModel(model));
        },
        deleteDraftModel: (model) => {
            dispatch(actions.models.deleteDraftModel(model));
        },
        updateDraftModelField: (type, pk, field, value) => {
            dispatch(actions.models.updateDraftModelField(type, pk, field, value));
        },
        saveDraftModels: (models) => {
            dispatch(actions.models.saveDraftModels(models));
        },
    };
}

ScheduleEditor = connect(select, dispatch)(ScheduleEditor);

export default ScheduleEditor;
