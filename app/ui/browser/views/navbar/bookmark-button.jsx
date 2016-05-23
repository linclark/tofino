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

import React, { Component } from 'react';
import Relay from 'react-relay';

import Btn from '../../widgets/btn';
import AddBookmarkMutation from '../../mutations/AddBookmarkMutation';

import Style from '../../browser-style';

const BUTTON_STYLE = Style.registerStyle({
  bottom: 0,
  left: 0,
  zIndex: 1,
  padding: '2px 10px',
  border: '1px solid var(--theme-splitter-color)',
  borderTopRightRadius: 'var(--theme-default-roundness)',
  borderBottomWidth: 0,
  borderLeftWidth: 0,
  backgroundColor: 'var(--theme-body-color)',
  color: 'var(--theme-content-color)',
});

/**
 * The star in the location bar.
 */
class BookmarkButton extends Component {
  getBookmarkIcon = () => {
    // const { page, isBookmarked } = this.props;
    // if (page.state === Page.PAGE_STATE_LOADING) {
    //   return 'glyph-bookmark-unknown-16.svg';
    // }
    // if (isBookmarked(page.location)) {
    //   return 'glyph-bookmark-filled-16.svg';
    // }
    return 'glyph-bookmark-hollow-16.svg';
  }

  handleBookmarkClick = () => {
    Relay.Store.commitUpdate(
      new AddBookmarkMutation({
        uri: this.props.location,
        viewer: this.props.viewer
      }),
    );
  }

  render() {
    return (<Btn title="Bookmark"
      className={BUTTON_STYLE}
      image={this.getBookmarkIcon()}
      onClick={this.handleBookmarkClick} />);
  }
}

BookmarkButton.displayName = 'BookmarkButton';

export default Relay.createContainer(BookmarkButton, {
  fragments: {
    viewer: () => {
      return Relay.QL`
      fragment on ReindexViewer {
        ${AddBookmarkMutation.getFragment('viewer')},
      }
    `},
  },
});

