import React from 'react';

export default class Dropdown extends React.Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
    }

    getInitialState() {
        return {
            open: false,
        };
    }

    render() {
        return (
            <span style={{position: 'relative'}}>
                <img src={STATIC_URL + (this.state.open ? this.props.openFile : this.props.closedFile)}
                    onClick={this.toggle} />
            { this.props.open ?
                (<div onClick={this.toggle}>
                    { this.props.children }
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
    closedFile: 'next.png',
    openFile: 'dsc.png',
};
