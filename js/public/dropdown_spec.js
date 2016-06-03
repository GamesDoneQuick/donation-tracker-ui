import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import Dropdown from './dropdown';

describe('Dropdown', () => {
    let subject;

    describe('when open', () => {
        beforeEach(() => {
            subject = render({openClass: 'openClass', closedClass: 'closedClass'});
            subject.setState({open: true});
        });

        it('uses the openClass on the expander', () => {
            expect(ReactDOM.findDOMNode(subject).querySelector('[data-aid=expander]').className).toContain('openClass');
        });

        it('does not use the closedClass on the expander', () => {
            expect(ReactDOM.findDOMNode(subject).querySelector('[data-aid=expander]').className).not.toContain('closedClass');
        });

        it('renders the children', () => {
            expect(ReactDOM.findDOMNode(subject).querySelector('#child')).toBeTruthy();
        });

        it('clicking the expander closes the dropdown', () => {
            TestUtils.Simulate.click(ReactDOM.findDOMNode(subject).querySelector('[data-aid=expander]'));
            expect(subject.state.open).toBe(false);
        });

        it('clicking a child closes the dropdown', () => {
            TestUtils.Simulate.click(ReactDOM.findDOMNode(subject).querySelector('#child'));
            expect(subject.state.open).toBe(false);
        });
    });

    describe('when closed', () => {
        beforeEach(() => {
            subject = render({openClass: 'openClass', closedClass: 'closedClass'});
            subject.setState({open: false});
        });

        it('does not use the openClass on the expander', () => {
            expect(ReactDOM.findDOMNode(subject).querySelector('[data-aid=expander]').className).not.toContain('openClass');
        });

        it('uses the closedClass on the expander', () => {
            expect(ReactDOM.findDOMNode(subject).querySelector('[data-aid=expander]').className).toContain('closedClass');
        });

        it('does not render the children', () => {
            expect(ReactDOM.findDOMNode(subject).querySelector('#child')).toBeNull();
        });

        it('clicking the expander opens the dropdown', () => {
            TestUtils.Simulate.click(ReactDOM.findDOMNode(subject).querySelector('[data-aid=expander]'));
            expect(subject.state.open).toBe(true);
        });
    });

    function render(props = {}) {
        return TestUtils.renderIntoDocument(
            <Dropdown
                {...props}
            >
                <div id='child' />
            </Dropdown>
        );
    }
});
