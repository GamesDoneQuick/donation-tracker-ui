import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import OrderTarget from './order_target';
import styles from './order_target.css';

import 'babel-polyfill';

class DummyTargetType extends React.Component {
    render() {
        return <div {...this.props} />;
    }
}

describe('OrderTarget', () => {
    let subject;

    describe('when target is true', () => {
        const targetProps = {foo: 'bar'};
        beforeEach(() => {
            subject = render({target: true, targetProps});
        });

        it('renders two TargetTypes with provided targetProps, one true and one false', () => {
            const targetTypes = TestUtils.scryRenderedComponentsWithType(subject, DummyTargetType);
            expect(targetTypes.length).toBe(2);
            expect(targetTypes.find(e => e.props.before === true)).toBeTruthy();
            expect(targetTypes.find(e => e.props.before === false)).toBeTruthy();
            expect(targetTypes[0].props).toEqual(jasmine.objectContaining(targetProps));
            expect(targetTypes[1].props).toEqual(jasmine.objectContaining(targetProps));
        });

        describe('when nullOrder is not provided', () => {
            it('does not render the nullOrder element', () => {
                expect(ReactDOM.findDOMNode(subject).querySelector(`.${styles.nullOrder}`)).toBe(null);
            });
        });

        describe('when nullOrder is provided', () => {
            let nullOrder;
            beforeEach(() => {
                nullOrder = jasmine.createSpy('nullOrder');
                subject = render({target: true, targetProps, nullOrder});
            });

            it('renders the nullOrder element', () => {
                expect(ReactDOM.findDOMNode(subject).querySelector(`.${styles.nullOrder}`)).toBeTruthy();
            });

            it('clicking the nullOrder element calls the callback', () => {
                TestUtils.Simulate.click(ReactDOM.findDOMNode(subject).querySelector(`.${styles.nullOrder}`));
                expect(nullOrder).toHaveBeenCalled();
            })
        });
    });

    describe('when target is false', () => {
        beforeEach(() => {
            subject = render({target: false});
        });

        it('does not render TargetType', () => {
            expect(TestUtils.scryRenderedComponentsWithType(subject, DummyTargetType).length).toBe(0);
        });

        it('renders the non-target drag button', () => {
            expect(ReactDOM.findDOMNode(subject).querySelector(`.${styles.nontargetDrag}`)).toBeTruthy();
        });

        describe('when nullOrder is provided', () => {
            beforeEach(() => {
                subject = render({target: false, nullOrder: () => {}});
            });

            it('does not render the nullOrder element', () => {
                expect(ReactDOM.findDOMNode(subject).querySelector(`.${styles.nullOrder}`)).toBe(null);
            });
        });
    });

    function render(props = {}) {
        const defaultProps = {
            targetProps: {},
            targetType: DummyTargetType,
            connectDragSource: e => e,
        };
        return TestUtils.renderIntoDocument(
            <OrderTarget
                {...defaultProps}
                {...props}
            />
        );
    }
});
