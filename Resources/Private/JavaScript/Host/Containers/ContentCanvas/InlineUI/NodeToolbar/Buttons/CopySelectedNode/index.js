import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import IconButton from '@neos-project/react-ui-components/lib/IconButton/';

export default class CopySelectedNode extends Component {
    static propTypes = {
        isDisabled: PropTypes.bool,
        className: PropTypes.string
    };

    static defaultProps = {
        isDisabled: true
    };

    constructor(props) {
        super(props);

        this.handleCopySelectedNodeClick = this.copySelectedNode.bind(this);
    }

    shouldComponentUpdate(newProps, newState) {
        return shallowCompare(this, newProps, newState);
    }

    render() {
        const {
            isDisabled,
            className
        } = this.props;

        return (
            <IconButton
                className={className}
                isDisabled={isDisabled}
                onClick={this.handleCopySelectedNodeClick}
                icon="copy"
                hoverStyle="clean"
                />
        );
    }

    copySelectedNode() {
        console.log('copy selected node');
    }
}
