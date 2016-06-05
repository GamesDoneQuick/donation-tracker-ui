import $ from 'jquery';
import models from './models';

describe('models actions', () => {
    let dispatchSpy;
    let action;

    beforeEach(() => {
        dispatchSpy = jasmine.createSpy('dispatch');
        window.API_ROOT = 'http://localhost:55555/';
    });

    describe('#loadModels', () => {
        const modelType = 'foo';
        const params = {bar: 'baz'};
        beforeEach(() => {
            action = models.loadModels(modelType, params);
        });

        it('returns a thunk', () => {
            expect(action).toEqual(jasmine.any(Function));
        });

        describe('when the thunk is called', () => {
            let d;
            beforeEach(() => {
                d = $.Deferred();
                spyOn($, 'ajax').and.returnValue(d.promise());
                action(dispatchSpy);
            });

            it('dispatches a loading action for the model type', () => {
                expect(dispatchSpy).toHaveBeenCalledWith(jasmine.objectContaining({type: 'MODEL_STATUS', model: modelType, status: 'loading'}));
            });

            it('sends a request to the search endpoint', () => {
                expect($.ajax).toHaveBeenCalledWith(jasmine.objectContaining({url: `${API_ROOT}search`, data: {...params, type: modelType}}));
            });

            describe('when the call succeeds', () => {
                beforeEach(() => {
                    d.resolve([{model: `tracker.${modelType}`, pk: 1, fields: {bar: 'baz'}}]);
                });

                it('dispatches a load complete action for the model type', () => {
                    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.objectContaining({type: 'MODEL_STATUS', model: modelType, status: 'success'}));
                });

                it('dispatches a MODEL_COLLECTION_ADD action with the data', () => {
                    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.objectContaining({type: 'MODEL_COLLECTION_ADD', model: modelType, models: {1: {bar: 'baz'}}}));
                });
            });

            describe('when the call fails', () => {
                beforeEach(() => {
                    d.reject();
                });

                it('dispatches a load error action for the model type', () => {
                    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.objectContaining({type: 'MODEL_STATUS', model: modelType, status: 'error'}));
                });
            });
        });
    });
});
