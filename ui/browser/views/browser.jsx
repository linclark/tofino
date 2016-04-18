/*
Copyright 2016 Mozilla

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
*/

import React, { PropTypes, Component } from 'react';

import TabBar from './tabbar/tabbar.jsx';
import NavBar from './navbar/navbar.jsx';
import Page from './page/page.jsx';

import {
  menuLocationContext, updateMenu, menuBrowser, maximize, minimize, close,
} from '../actions/external';

import {
  setPageAreaVisibility as setPageAreaVisibilityAction,
  createTab, attachTab, closeTab, setPageDetails,
} from '../actions/main-actions';

import * as mainActions from '../actions/main-actions';
import * as profileCommands from '../../../app/shared/profile-commands';

import { getCurrentWebView } from '../browser-util';

import '../../shared/web-view';

/**
 *
 */
class BrowserWindow extends Component {
  constructor(props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeyDown);

    updateMenu();
    attachIPCRendererListeners(this.props);
  }

  handleKeyDown({ metaKey, keyCode }) {
    const { dispatch, currentPageIndex } = this.props;

    if (metaKey && keyCode === 70) { // cmd+f
      dispatch(setPageDetails(currentPageIndex, { isSearching: true }));
    } else if (keyCode === 27) { // esc
      dispatch(setPageDetails(currentPageIndex, { isSearching: false }));
    }
  }

  render() {
    const { dispatch, pages, currentPageIndex, ipcRenderer,
            profile,
            pageAreaVisible } = this.props;
    const navBack = e => getCurrentWebView(e.target.ownerDocument).goBack();
    const navForward = e => getCurrentWebView(e.target.ownerDocument).goForward();
    const navRefresh = e => getCurrentWebView(e.target.ownerDocument).reload();
    const openMenu = () => menuBrowser(dispatch);
    const isBookmarked = (url) => profile.bookmarks.has(url);
    const bookmark = (title, url) => {
      // Update this window's state before telling the profile service.
      dispatch(mainActions.bookmark(url, title));
      ipcRenderer.send('profile-command',
        profileCommands.bookmark(url, title));
    };
    const unbookmark = (url) => {
      // Update this window's state before telling the profile service.
      dispatch(mainActions.unbookmark(url));
      ipcRenderer.send('profile-command',
        profileCommands.unbookmark(url));
    };
    const onLocationChange = e => dispatch(setPageDetails({ userTyped: e.target.value }));
    const onLocationContextMenu = e => menuLocationContext(e.target, dispatch);
    const onLocationReset = () => dispatch(setPageDetails({ userTyped: void 0 }));
    const setPageAreaVisibility = (visible) => dispatch(setPageAreaVisibilityAction(visible));

    return (
      <div id="browser-chrome">
        <NavBar page={pages.get(currentPageIndex)}
          {...{ pages, navBack, navForward, navRefresh, minimize, maximize,
            close, openMenu, onLocationChange, onLocationContextMenu,
            onLocationReset, isBookmarked, bookmark, unbookmark, pageAreaVisible, ipcRenderer,
            setPageAreaVisibility }} />
        <TabBar {...{ pages, currentPageIndex, pageAreaVisible, dispatch }} />
        <div id="content-area">
          {pages.map((page, pageIndex) => (
            <Page key={`page-${pageIndex}`}
              page={page}
              pageIndex={pageIndex}
              isActive={pageIndex === currentPageIndex}
              ipcRenderer={ipcRenderer}
              dispatch={dispatch} />
          ))}
        </div>
      </div>
    );
  }
}

BrowserWindow.propTypes = {
  pages: PropTypes.object.isRequired,
  currentPageIndex: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  ipcRenderer: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  pageAreaVisible: PropTypes.bool.isRequired,
};

export default BrowserWindow;

function attachIPCRendererListeners({ dispatch, currentPageIndex, ipcRenderer }) {
  ipcRenderer.on('profile-diff', (event, args) => {
    dispatch(args);
  });

  ipcRenderer.on('new-tab', () => dispatch(createTab()));

  // TODO: Avoid this re-dispatch back to the main process
  ipcRenderer.on('new-window', () => {
    ipcRenderer.send('new-window');
  });

  ipcRenderer.on('show-bookmarks', () => {
    dispatch(createTab('atom://bookmarks'));
  });

  ipcRenderer.on('open-bookmark', (e, bookmark) => {
    dispatch(createTab(bookmark.url));
  });

  ipcRenderer.on('tab-attach', (e, tabInfo) => {
    const page = tabInfo.page;
    page.guestInstanceId = tabInfo.guestInstanceId;
    dispatch(attachTab(page));
  });

  ipcRenderer.on('close-tab', () => {
    dispatch(closeTab(currentPageIndex));
  });

  ipcRenderer.on('page-reload', () => {
    getCurrentWebView(document).reload();
  });
}
