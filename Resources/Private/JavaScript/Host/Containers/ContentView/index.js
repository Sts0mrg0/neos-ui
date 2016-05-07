import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';

import {Frame} from 'Components/index';
import createApi from 'Host/Expose/API/index';
import {actions} from 'Host/Redux/index';

import style from './style.css';

//
// Expose the UI API to the guest frame via an event, so it
// does not pollute global scope
//
const exposeApiToGuestFrame = (dispatch, frame) => {
    const loadEvent = frame.document.createEvent('CustomEvent');
    loadEvent.initCustomEvent('Neos:UI:ContentLoaded', true, true, {
        api: createApi(dispatch)
    });

    frame.document.dispatchEvent(loadEvent);
};

//
// Extract document information from the guest frame. The
// Frame is expected to expose that information in a global
// variable called '@PackageFactory.Guevara:DocumentInformation'.
//
// Reason for the naming choice is, that this name is unlikely to
// be accidentally overwritten by third-party code, since it can't
// be accessed via dot notation.
//
const consumeDocumentInformationFromGuestFrame = (dispatch, frame) => {
    const documentInformation = frame['@PackageFactory.Guevara:DocumentInformation'];

    if (!documentInformation) {
        throw new Error('The guest frame doesn\'t seem to contain any document information.');
    }

    dispatch(actions.UI.ContentView.setContextPath(documentInformation.metaData.contextPath));
    dispatch(actions.UI.ContentView.setPreviewUrl(documentInformation.metaData.previewUrl));

    Object.keys(documentInformation.nodes).forEach(contextPath => {
        const node = documentInformation.nodes[contextPath];
        dispatch(actions.CR.Nodes.add(contextPath, node));
    });
};

@connect($transform({
    isFringeLeft: $get('ui.leftSideBar.isHidden'),
    isFringeRight: $get('ui.rightSideBar.isHidden'),
    isFullScreen: $get('ui.fullScreen.isFullScreen'),
    src: $get('ui.contentView.src'),
    contextPath: $get('ui.contentView.contextPath')
}))
export default class ContentView extends Component {
    static propTypes = {
        isFringeLeft: PropTypes.bool.isRequired,
        isFringeRight: PropTypes.bool.isRequired,
        isFullScreen: PropTypes.bool.isRequired,
        src: PropTypes.string.isRequired,
        contextPath: PropTypes.string.isRequired,

        dispatch: PropTypes.func.isRequired
    };

    initializeGuestFrame(frame) {
        const {dispatch} = this.props;

        consumeDocumentInformationFromGuestFrame(dispatch, frame);
        exposeApiToGuestFrame(dispatch, frame);
    }

    render() {
        const {
            isFringeLeft,
            isFringeRight,
            isFullScreen,
            src,
            contextPath,
            dispatch
        } = this.props;
        const classNames = mergeClassNames({
            [style.contentView]: true,
            [style['contentView--isFringeLeft']]: isFringeLeft,
            [style['contentView--isFringeRight']]: isFringeRight,
            [style['contentView--isFullScreen']]: isFullScreen
        });

        return (
            <div className={classNames} id="neos__contentView">
                <Frame
                    src={src}
                    frameBorder="0"
                    name="neos-content-main"
                    data-context-path={contextPath}
                    className={style.contentView__item}
                    onContentLoad={frame => this.initializeGuestFrame(frame)}
                    />
            </div>
        );
    }
}
