import models from './models';
import freeze from 'ui/public/util/freeze';

describe('models reducers', () => {
    const state = freeze({
        other: {},
        stuff: {0: 'foo', 1: 'bar'},
    });
    describe('#modelCollectionReplace', () => {
        const newStuff = {2: 'baz'};
        const action = {
            type: 'MODEL_COLLECTION_REPLACE',
            model: 'stuff',
            models: newStuff,
        };
        let newState;
        beforeEach(() => {
            newState = models(state, action);
        });

        it('replaces the models with a copy', () => {
            expect(newState.stuff).toEqual(newStuff);
            expect(newState.stuff).not.toBe(newStuff);
        });

        it('leaves other state alone', () => {
            expect(state.other).toBe(newState.other);
        });
    });

    describe('#modelCollectionAdd', () => {
        const newStuff = {1: 'quux', 2: 'baz'};
        const action = {
            type: 'MODEL_COLLECTION_ADD',
            model: 'stuff',
            models: newStuff,
        };
        let newState;
        beforeEach(() => {
            newState = models(state, action);
        });

        it('adds the new models to the existing state, overwriting matching pks', () => {
            expect(newState.stuff).toEqual({...state.stuff, ...newStuff});
        });

        it('leaves other state alone', () => {
            expect(state.other).toBe(newState.other);
        });
    });

    describe('#modelCollectionRemove', () => {
        const action = {
            type: 'MODEL_COLLECTION_REMOVE',
            model: 'stuff',
            pks: [0],
        };
        let newState;
        beforeEach(() => {
            newState = models(state, action);
        });

        it('removes the desired PKs', () => {
            expect(newState.stuff).toEqual({1: state.stuff[1]});
        });

        it('leaves other state alone', () => {
            expect(state.other).toBe(newState.other);
        });

        it('no op if the models did not exist', () => {
            expect(models(newState, action)).toBe(newState);
        });
    });

    describe('#modelSetInternalField', () => {
        const action = {
            type: 'MODEL_SET_INTERNAL_FIELD',
            model: 'stuff',
            pk: 0,
            field: 'secret',
            value: 'sauce',
        };
        let newState;
        beforeEach(() => {
            newState = models(state, action);
        });

        it('sets the internal value', () => {
            expect(newState.stuff[0]._internal.secret).toBe('sauce');
        });

        it('leaves other state alone', () => {
            expect(state.stuff[1]).toBe(newState.stuff[1]);
            expect(state.other).toBe(newState.other);
        });

        it('no op if the field is already set', () => {
            expect(models(newState, action)).toBe(newState);
        });
    });
});
