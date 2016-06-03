import _ from 'underscore';

function modelNewDraft(state, action) {
    const {
        _cpk = 0,
    } = state;

    const cpk = _cpk + 1;

    const {
        type,
        fields,
        pk,
    } = action.model;

    const newState = {
        [type]: {
            ...state[type],
            [cpk]: {
                ...Object.keys(fields).reduce((memo, key) => {
                    if(!key.startsWith('_')) {
                        memo[key] = fields[key];
                    }
                    return memo;
                }, {}),
                pk,
                cpk,
            },
        },
    };

    return {
        ...state,
        ...newState,
        _cpk: cpk,
    };
}

function modelDeleteDraft(state, action) {
    // TODO: no-op if the draft does not exist
    // TODO?: delete the model section if it ends up empty?
    const {
        type,
        cpk,
    } = action.model;

    const models = state[type] || {};

    const newState = {
        [type]: Object.intKeys(models).reduce((memo, key) => {
            if (key !== cpk) {
                memo[key] = models[key];
            }
            return memo;
        }, {}),
    };

    return {
        ...state,
        ...newState,
    };
}

function modelDraftUpdateField(state, action) {
    // TODO: no-op if the draft field isn't changed
    let newState = {};
    const type = action.model;
    let models = newState[type] = _.extend({}, state[type]);
    let model = _.extend({}, models[action.pk]);
    model[action.field] = action.value;
    newState[type][action.pk] = model;
    return _.extend({}, state, newState);
}

function modelSaveError(state, action) {
    const m = action.model;
    const type = m.type;
    let newState = {};
    let models = newState[m.type] = _.extend({}, state[type] || {});
    models[m.pk] = _.extend({}, models[m.pk] || {}, { _error: action.error, _fields: action.fields}, _.omit(action.model, ['type']));
    return _.extend({}, state, newState);
}

const modelDraftFunctions = {
    MODEL_NEW_DRAFT: modelNewDraft,
    MODEL_DELETE_DRAFT: modelDeleteDraft,
    MODEL_DRAFT_UPDATE_FIELD: modelDraftUpdateField,
    MODEL_SAVE_DRAFT_ERROR: modelSaveError,
};

export default function drafts(state, action) {
    if (modelDraftFunctions[action.type]) {
        return modelDraftFunctions[action.type](state, action);
    } else {
        return state || {};
    }
}
