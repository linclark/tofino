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

import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { ipcRenderer } from '../../../shared/electron';

import Style from '../browser-style';
import BrowserWindow from './browser';

const APP_STYLE = Style.registerStyle({
  width: '100%',
  height: '100%',
});

const App = function(props) {
  return (
    <div className={APP_STYLE}>
      <BrowserWindow ipcRenderer={ipcRenderer}
        pages={props.viewer.allPages.edges}
        currentPageIndex={props.viewer.allBrowserWindows.edges[0].node.currentPageIndex} />
      <Style.Element />
    </div>
  );
};

App.displayName = 'App';

App.propTypes = {
  pages: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  currentPageIndex: PropTypes.number.isRequired,
  currentPage: PropTypes.object.isRequired,
};

export default Relay.createContainer(Style.component(App), {
  fragments: {
    viewer: () => {
      return Relay.QL`
      fragment on ReindexViewer {
        allPages(first: 10) {
          count,
          edges {
            node {
              id,
              location
            },
          },
        },
        allBrowserWindows(first: 1) {
          edges {
            node {
              currentPageIndex
            },
          },
        }
      }
    `},
  },
});

