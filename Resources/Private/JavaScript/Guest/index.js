import 'Shared/Styles/style.css';
import 'babel-polyfill';

import {nodeComponent} from 'Guest/Components/index';
import {closestContextPath, findRelatedDOMNode} from 'Guest/Process/DOMUtils.js';
import ckEditor from 'Guest/Components/Editors/CKEditor/index';

import {
    nodeFocused,
    nodeBlurred,
    nodeMouseEntered,
    nodeMouseLeft
} from './Events/index';

//
// Initialize the guest application as soon as the DOM has been fully initialized.
//
document.addEventListener('Neos:UI:ContentLoaded', e => {
    const {api} = e.detail;

    //
    // Initialize node components
    //
    [].slice.call(document.querySelectorAll('[data-__che-node-contextpath]'))
        .forEach(dom => nodeComponent(dom, api));

    //
    // Initialize inline editors
    //
    [].slice.call(document.querySelectorAll('[data-__che-property]')).forEach(dom => {
        const contextPath = closestContextPath(dom);
        const propertyName = dom.dataset.__cheProperty;

        // ckEditor({contextPath, propertyName}, dom, api);
    });

    //
    // Route host signals to dom events
    //
    const {contentView} = api.signals.ui;

    contentView.nodeFocused.add((node, typoScriptPath) => {
        const dom = findRelatedDOMNode(node, typoScriptPath);
        dom && dom.dispatchEvent(nodeFocused());
    });

    contentView.nodeBlurred.add((node, typoScriptPath) => {
        const dom = findRelatedDOMNode(node, typoScriptPath);
        dom && dom.dispatchEvent(nodeBlurred());
    });

    contentView.nodeMouseEntered.add((node, typoScriptPath) => {
        const dom = findRelatedDOMNode(node, typoScriptPath);
        dom && dom.dispatchEvent(nodeMouseEntered());
    });

    contentView.nodeMouseLeft.add((node, typoScriptPath) => {
        const dom = findRelatedDOMNode(node, typoScriptPath);
        dom && dom.dispatchEvent(nodeMouseLeft());
    });
});
