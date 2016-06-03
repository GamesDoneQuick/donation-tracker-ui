import jQuery from 'jquery';

const $ = window.$ || jQuery;

function onLoadMe(me) {
    return {
        type: 'LOAD_ME',
        me
    };
}

export function fetchMe() {
    return (dispatch) => {
        dispatch({
            type: 'MODEL_STATUS',
            model: {
                type: 'me',
                status: 'loading',
            }
        });
        $.get(`${API_ROOT}me`)
            .done((me) => {
                dispatch({
                    type: 'MODEL_STATUS',
                    model: {
                        type: 'me',
                        status: 'success',
                    }
                });
                dispatch(onLoadMe(me));
            })
            .fail((data) => {
                dispatch({
                    type: 'MODEL_STATUS',
                    model: {
                        type: 'me',
                        status: 'error',
                    }
                });
                dispatch(onLoadMe({})); // anonymous user
            });
    };
}

export default {
    fetchMe,
};
