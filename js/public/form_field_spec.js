import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import FormField from './form_field';

describe('FormField', () => {
    let subject;
    let onChange;

    beforeEach(() => {
        onChange = jasmine.createSpy('onChange');
        subject = render({name: 'great', value: 'good', onChange});
    });

    it('renders an input with the provided name and value', () => {
        expect(ReactDOM.findDOMNode(subject).attributes.name.value).toBe('great');
        expect(ReactDOM.findDOMNode(subject).attributes.value.value).toBe('good');
    });

    it('calls the onChange callback', () => {
        const node = ReactDOM.findDOMNode(subject);
        node.value = 'amazing';
        TestUtils.Simulate.change(ReactDOM.findDOMNode(subject));
        expect(onChange).toHaveBeenCalledWith('great', 'amazing');
    });

    function render(props = {}) {
        return TestUtils.renderIntoDocument(
            <FormField {...props} />
        );
    }
});
