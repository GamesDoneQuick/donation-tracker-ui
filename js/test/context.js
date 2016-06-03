import React from 'react';
import { DragDropContext } from 'react-dnd';
import DnDBackend from 'react-dnd-test-backend';

function wrapInTestContext(DecoratedComponent) {
  return DragDropContext(DnDBackend)(
    React.createClass({
      render: function () {
        return <DecoratedComponent {...this.props} />;
      }
    })
  );
}

export const Wrapper = React.createClass({
    getDefaultProps: () => ({
        STATIC_URL: '//localhost/static/',
    }),

    getChildContext: function() {
        return {
            STATIC_URL: this.props.STATIC_URL,
        };
    },

    childContextTypes: {
        STATIC_URL: React.PropTypes.string,
    },

    render: function() {
        return <div>{this.props.children}</div>;
    },
});

export const DnDWrapper = wrapInTestContext(Wrapper);
