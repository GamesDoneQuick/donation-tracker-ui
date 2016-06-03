import drafts from './drafts';
import freeze from 'ui/public/util/freeze';

describe('reducers/drafts', () => {
    const CPK = 50;
    const PK = 10;
    const state = freeze({
        other: {
            [CPK]: {
                some: 'draft'
            },
        },
        _cpk: CPK,
    });
    let newState;

    describe('#MODEL_NEW_DRAFT', () => {
        beforeEach(() => {
            newState = drafts(state, {
                type: 'MODEL_NEW_DRAFT',
                model: {
                    type: 'model',
                    pk: PK,
                    fields: {
                        _private: 'private',
                        public: 'public',
                    },
                },
            });
        });

        it('creates a new draft, skipping the private fields, copying the public fields, and with an incremented cpk', () => {
            expect(newState.model[CPK+1]).toEqual({pk: PK, cpk: CPK+1, public: 'public'});
        });

        it('increments the cpk', () => {
            expect(newState._cpk).toBe(state._cpk+1);
        });

        it('returns a new state', () => {
            expect(state).not.toBe(newState);
        });

        it('does not mutate other state', () => {
            expect(state.other).toBe(newState.other);
        });
    });

    describe('#MODEL_DELETE_DRAFT', () => {
        beforeEach(() => {
            newState = drafts(state, {
                type: 'MODEL_DELETE_DRAFT',
                model: {
                    type: 'other',
                    cpk: CPK,
                },
            });
        });

        it('deletes the requested model', () => {
            expect(newState.other).toEqual({});
        });

        xit('no-op if the draft does not exist', () => {
           expect(true).toBe(false);
        });
    });

    describe('#MODEL_DRAFT_UPDATE_FIELD', () => {
        const action = {
            type: 'MODEL_DRAFT_UPDATE_FIELD',
            model: {
                type: 'updated',
                cpk: CPK,
            },
            field: 'foo',
            value: 'bar',
        };

        beforeEach(() => {
            newState = drafts(state, action);
        });

        it('updates the draft', () => {
            expect(newState.updated[CPK].foo).toBe('bar');
        });

        it('returns a new state', () => {
            expect(state).not.toBe(newState);
        });

        it('does not mutate other state', () => {
            expect(state.other).toBe(newState.other);
        });

        it('detects no-op', () => {
            expect(drafts(newState, action)).toBe(newState);
        });

        it('ignores setting private fields', () => {
            expect(drafts(state, {
                type: 'MODEL_DRAFT_UPDATE_FIELD',
                model: {
                    type: 'updated',
                    cpk: CPK,
                },
                field: '_foo',
                value: 'bar',
            })).toBe(state);
        });
    });

    describe('#MODEL_SAVE_DRAFT_ERROR', () => {
        const action = {
            type: 'MODEL_SAVE_DRAFT_ERROR',
            model: {
                type: 'updated',
                cpk: CPK,
            },
            error: 'Cannot save this model.',
            fields: {
                name: 'Cannot be blank',
                rent: 'Is too damn high.',
            },
        };

        beforeEach(() => {
            newState = drafts(state, action);
        });

        it('adds error fields to the draft', () => {
            expect(newState.updated[CPK]._errors).toEqual(action.errors);
            expect(newState.updated[CPK]._fields).toEqual(action.fields);
        });
    });
});
