import React from 'react';

let { PropTypes } = React;

class FormField extends React.Component {
    constructor(props) {
        super(props);
        this.onChange_ = this.onChange_.bind(this);
    }

    render() {
        const { name, value } = this.props;
        return (
            <input name={name} value={value} onChange={this.onChange_} />
        );
    }

    onChange_(e) {
        this.props.onChange(this.props.name, e.target.value);
    }
}

FormField.defaultProps = {
    value: ''
};

FormField.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};


module.exports = FormField;
