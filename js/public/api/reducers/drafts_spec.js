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
        it('is untested', () => {
            expect(true).toBe(false);
        });
    });

    describe('#MODEL_DRAFT_SAVE_ERROR', () => {
        it('is untested', () => {
            expect(true).toBe(false);
        });
    });
});
