import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import ErrorList from './error_list';

describe('ErrorList', () => {
    it('renders an element for each error', () => {
        const subject = TestUtils.renderIntoDocument(
            <ErrorList errors={['bacon', 'eggs']} />
        );
        const node = ReactDOM.findDOMNode(subject);
        expect(node.children.length).toBe(2);
        expect(node.innerText).toContain('bacon');
        expect(node.innerText).toContain('eggs');
    });
});
