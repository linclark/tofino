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

import Style from '../browser-style';
import TabBar from './tabbar/tabbar';
import DeveloperBar from './developerbar';
import NavBar from './navbar/navbar';
import Page from './page/page';
import WebViewController from '../lib/webview-controller';

const BROWSER_WINDOW_STYLE = Style.registerStyle({
  flex: 1,
  flexDirection: 'column',
});

const CHROME_AREA_STYLE = Style.registerStyle({
  flexDirection: 'column',
});

const CONTENT_AREA_STYLE = Style.registerStyle({
  flex: 1,
});

class BrowserWindow extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.webViewController = new WebViewController(() => this.props.pages);
  }

  render() {
    const {
      currentPage, ipcRenderer, dispatch, profile, pages, currentPageIndex, viewer,
    } = this.props;

    const webViewController = this.webViewController;

    return (
      <div className={BROWSER_WINDOW_STYLE}>
        <div className={CHROME_AREA_STYLE}>
          <NavBar page={currentPage} />
          <TabBar
            {...this.props } />
        </div>
        <div className={CONTENT_AREA_STYLE}>
          {pages.map(({ node }, pageIndex) => (
            <Page key={`page-${node.id}`}
              isActive={pageIndex === currentPageIndex}
              page={node}
              webViewController={webViewController}
              {...this.props} />
          ))}
        </div>
        <DeveloperBar />
      </div>
    );
  }
}

BrowserWindow.displayName = 'BrowserWindow';

BrowserWindow.propTypes = {
  pages: PropTypes.object.isRequired,
};

export default BrowserWindow;
