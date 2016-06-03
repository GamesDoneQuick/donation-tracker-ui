import React from 'react';
import cn from 'classnames';

import styles from './dropdown.css';

export default class Dropdown extends React.Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            open: this.props.initiallyOpen,
        };
    }

    render() {
        const {
            open,
        } = this.state;

        const {
            openClass,
            closedClass,
            children,
        } = this.props;

        const classes = {
            [openClass]: open,
            [closedClass]: !open,
            [styles.default]: true,
        };

        return (
            <span style={{position: 'relative'}}>
                <div data-aid='expander' className={cn(classes)} onClick={this.toggle} />
            { open ?
                (<div data-aid='children' onClick={this.toggle}>
                    { children }
                </div>)
                :
                null
            }
            </span>
        );
    }

    toggle() {
        this.setState({open: !this.state.open});
    }
}

Dropdown.defaultProps = {
    initiallyOpen: false,
    closedClass: styles.closed,
    openClass: styles.open,
};
