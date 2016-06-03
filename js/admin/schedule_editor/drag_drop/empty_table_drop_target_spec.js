import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { DragSource } from 'react-dnd';

import { DnDWrapper } from 'ui/test/context';

import EmptyTableDropTarget from './empty_table_drop_target';
import sharedStyles from './shared.css';

function makeSource(type, props = {}, endDrag = () => {}) {
    return DragSource(type, { beginDrag: () => props, endDrag: endDrag}, function collect(connect, monitor) {
        return {
            connectDragSource: connect.dragSource(),
            connectDragPreview: connect.dragPreview(),
            isDragging: monitor.isDragging()
        }
    })(React.createClass({render: () => <div />}));
}

const Original = EmptyTableDropTarget.DecoratedComponent;

describe('EmptyTableDropTarget', () => {
    let subject;
    let backend;
    let moveSpeedrun;

    beforeEach(() => {
        moveSpeedrun = jasmine.createSpy('moveSpeedrun');
    });

    describe('wrapped component', () => {
        it('does not render droppable class by default', () => {
            subject = renderOriginal({});
            expect(ReactDOM.findDOMNode(subject).className).not.toContain(sharedStyles.droppable);
        });

        it('renders droppable class when canDrop and isOver are both true', () => {
            subject = renderOriginal({canDrop: true, isOver: true});
            expect(ReactDOM.findDOMNode(subject).className).toContain(sharedStyles.droppable);
        });

        it('renders the specified elementType', () => {
            subject = renderOriginal({elementType: 'span'});
            expect(ReactDOM.findDOMNode(subject).tagName).toBe('SPAN');
        });

        it('renders children', () => {
            subject = renderOriginal({}, [<div key='child' id='child'/>]);
            expect(ReactDOM.findDOMNode(subject).querySelector('#child')).toBeTruthy();
        });
    });

    describe('dnd component', () => {
        it('dragging a Speedrun over sets canDrop', () => {
            const Source = makeSource('Speedrun');
            subject = renderWithDragContext(Source);
            const source = TestUtils.findRenderedComponentWithType(subject, Source);
            const decorated = TestUtils.findRenderedComponentWithType(subject, EmptyTableDropTarget);
            backend.simulateBeginDrag([source.getHandlerId()]);
            backend.simulateHover([decorated.getHandlerId()]);
            const original = TestUtils.findRenderedComponentWithType(subject, Original);
            expect(original.props.canDrop).toBe(true);
            backend.simulateEndDrag();
        });

        it('dropping a Speedrun calls moveSpeedrun', () => {
            const sourceProps = {pk: 4};
            const Source = makeSource('Speedrun', sourceProps, (props, monitor) => {
                const result = monitor.getDropResult();
                if (result && result.action) {
                    result.action(props.pk);
                }
            });
            subject = renderWithDragContext(Source, sourceProps);
            const source = TestUtils.findRenderedComponentWithType(subject, Source);
            const decorated = TestUtils.findRenderedComponentWithType(subject, EmptyTableDropTarget);
            backend.simulateBeginDrag([source.getHandlerId()]);
            backend.simulateHover([decorated.getHandlerId()]);
            backend.simulateDrop();
            backend.simulateEndDrag();
            expect(moveSpeedrun).toHaveBeenCalledWith(sourceProps.pk);
        });

        it('dragging anything else over does not set canDrop', () => {
            const Source = makeSource('NotASpeedrun');
            subject = renderWithDragContext(Source);
            const source = TestUtils.findRenderedComponentWithType(subject, Source);
            const decorated = TestUtils.findRenderedComponentWithType(subject, EmptyTableDropTarget);
            backend.simulateBeginDrag([source.getHandlerId()]);
            backend.simulateHover([decorated.getHandlerId()]);
            const original = TestUtils.findRenderedComponentWithType(subject, Original);
            expect(original.props.canDrop).toBe(false);
            backend.simulateEndDrag();
        });
    });

    function renderOriginal(props = {}, children = []) {
        const defaultProps = {
            isOver: false,
            canDrop: false,
            elementType: 'div',
            connectDropTarget: e => e,
            moveSpeedrun,
        };
        return TestUtils.renderIntoDocument(
            <Original
                {...defaultProps}
                {...props}
            >
                {children}
            </Original>
        );
    }

    function renderWithDragContext(Source, sourceProps = {}, props = {}, children = []) {
        const defaultProps = {
            elementType: 'div',
            moveSpeedrun,
        };
        const ret = TestUtils.renderIntoDocument(
            <DnDWrapper>
                <Source {...sourceProps} />
                <EmptyTableDropTarget
                    {...defaultProps}
                    {...props}
                >
                    {children}
                </EmptyTableDropTarget>
            </DnDWrapper>
        );
        backend = ret.getManager().getBackend();
        return ret;
    }
});
