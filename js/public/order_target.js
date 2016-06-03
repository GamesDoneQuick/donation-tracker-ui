import React from 'react';
const { PropTypes } = React;

import styles from './order_target.css';

class OrderTarget extends React.Component {
    render() {
        const {
            target,
            targetProps,
            connectDragSource,
            nullOrder,
        } = this.props;
        const TargetType = this.props.targetType; // needs to be uppercase or the compiler will think it's an html tag
        return connectDragSource(
            <span style={{cursor: 'move'}}>
            { target ?
                [
                <TargetType
                    key='before'
                    before={true}
                    {...targetProps}
                />,
                <TargetType
                    key='after'
                    before={false}
                    {...targetProps}
                />,
                nullOrder ?
                    <div
                        key='null'
                        className={styles.nullOrder}
                        onClick={nullOrder}
                    /> :
                    null,
                ]
                :
                <div className={styles.nontargetDrag} />
            }
            </span>
        );
    }
}

OrderTarget.propTypes = {
    target: PropTypes.bool.isRequired,
    targetProps: PropTypes.object.isRequired,
    targetType: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    nullOrder: PropTypes.func,
};

export default OrderTarget;
