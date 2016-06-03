import freeze from 'ui/public/util/freeze';
import status from './status';

describe('reducers/status', () => {
    const state = freeze({
        model: 'something else',
        other: 'yup',
    });

    describe('#MODEL_STATUS', () => {
        let newState;
        beforeEach(() => {
            newState = status(state, {type: 'MODEL_STATUS', model: 'model', status: 'success'});
        });

        it('updates the model with the status', () => {
            expect(newState.model).toEqual('success');
        });

        it('returns a new state', () => {
            expect(state).not.toBe(newState);
        });

        it('does not mutate other state', () => {
            expect(state.other).toBe(newState.other);
        });
    });
});
