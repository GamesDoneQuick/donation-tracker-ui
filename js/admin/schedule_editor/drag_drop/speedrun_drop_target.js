import React from 'react';
const { PropTypes } = React;
import { DropTarget } from 'react-dnd';
import cn from 'classnames';

import sharedStyles from './shared.css';
import styles from './speedrun_drop_target.css';

class SpeedrunDropTarget extends React.Component {
    render() {
        const { before, isOver, canDrop, connectDropTarget } = this.props;
        const { STATIC_URL } = this.context;
        const classes = [
            {
                [sharedStyles.droppable]: isOver && canDrop,
            },
            styles[before ? 'before' : 'after'],
            styles.default,
        ];
        return connectDropTarget(
            <span className={cn(classes)}>
                <img src={this.context.STATIC_URL + (before ? 'prev.png' : 'next.png')} />
            </span>
        );
    }
}

SpeedrunDropTarget.propTypes = {
    before: PropTypes.bool.isRequired,
    pk: PropTypes.number.isRequired,
};

SpeedrunDropTarget.contextTypes = {
    STATIC_URL: PropTypes.string.isRequired,
};

const speedrunTarget = {
    drop: function(props, monitor) {
        return {
            action: function(source_pk) {
                props.moveSpeedrun(source_pk, props.pk, props.before);
            }
        };
    },

    canDrop: function(props, monitor) {
        return props.legalMove(monitor.getItem() ? monitor.getItem().source_pk : null);
    },
};

SpeedrunDropTarget = DropTarget('Speedrun', speedrunTarget, function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
    };
})(SpeedrunDropTarget);

export default SpeedrunDropTarget;
