import _ from 'underscore';

function modelCollectionReplace(state, action) {
    return {
        ...state,
        [action.model]: {...action.models},
    };
}

function modelCollectionAdd(state, action) {
    return {
        ...state,
        [action.model]: {...state[action.model], ...action.models},
    };
}

function modelCollectionRemove(state, action) {
    const newModels = {...state[action.model]};
    let removed = false;
    action.pks.forEach(pk => {
        removed = removed || !!newModels[pk];
        delete newModels[pk];
    });
    return removed ? {
        ...state,
        [action.model]: newModels,
    } : state;
}

function modelSetInternalField(state, action) {
    if (state[action.model] &&
        state[action.model][action.pk] &&
        state[action.model][action.pk]._internal &&
        state[action.model][action.pk]._internal[action.field] === action.value) {
        return state;
    }
    return {
        ...state,
        [action.model]: {
            ...state[action.model],
            [action.pk]: {
                ...state[action.model][action.pk],
                _internal: {
                    ...state[action.model][action.pk]._internal,
                    [action.field]: action.value,
                }
            }
        }
    };
}

let modelCollectionFunctions = {
    MODEL_COLLECTION_REPLACE: modelCollectionReplace,
    MODEL_COLLECTION_ADD: modelCollectionAdd,
    MODEL_COLLECTION_REMOVE: modelCollectionRemove,
    MODEL_SET_INTERNAL_FIELD: modelSetInternalField,
};

export default function models(state, action) {
    if (modelCollectionFunctions[action.type]) {
        return modelCollectionFunctions[action.type](state, action);
    } else {
        return state || {};
    }
}
