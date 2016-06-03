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
    if (((state[action.model.type] || {})[action.model.cpk] || {})[action.field] === action.value) {
        return state;
    }
    if (action.field.startsWith('_')) {
        return state;
    }
    return {
        ...state,
        [action.model.type]: {
            ...state[action.model.type],
            [action.model.cpk]: {
                ...state[action.model.cpk],
                [action.field]: action.value,
            }
        }
    };
}

function modelSaveError(state, action) {
    return {
        ...state,
        [action.model.type]: {
            ...state[action.model.type],
            [action.model.cpk]: {
                ...state[action.model.cpk],
                _error: action.error,
                _fields: action.fields,
            }
        }
    };
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
