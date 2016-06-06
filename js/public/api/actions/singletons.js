import $ from 'jquery';
import { modelStatus } from './models';

function onLoadMe(me) {
    return {
        type: 'LOAD_ME',
        me
    };
}

export function fetchMe() {
    return (dispatch) => {
        dispatch(modelStatus('me', 'loading'));
        $.get(`${API_ROOT}me`)
            .done((me) => {
                dispatch(modelStatus('me', 'success'));
                dispatch(onLoadMe(me));
            })
            .fail((data) => {
                dispatch(modelStatus('me', 'error'));
                dispatch(onLoadMe({})); // anonymous user
            });
    };
}

export default {
    fetchMe,
};
