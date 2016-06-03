export default function status(state = {}, action = {}) {
    if (action.type === 'MODEL_STATUS') {
        return {...state, ...{[action.model]: action.status}};
    } else {
        return state;
    }
}
