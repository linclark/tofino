import Relay from 'react-relay';

export default class AddPageMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`fragment on ReindexViewer {
      id
      allPages {
        count,
      }
    }`
  };

  getMutation() {
    return Relay.QL`mutation{ createPage }`;
  }

  getVariables() {
    return {
      location: 'tofino://mozilla',
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on _PagePayload {
        changedPageEdge,
        viewer {
          id,
          allPages {
            count
          }
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentID: this.props.viewer.id,
      connectionName: 'allPages',
      edgeName: 'changedPageEdge',
      rangeBehaviors: {
        '': 'prepend',
      },
    }, {
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        viewer: this.props.viewer.id,
      },
    }];
  }

  getOptimisticResponse() {
    return {
      changedPageEdge: {
        node: {
          location: this.props.location,
        },
      },
      viewer: {
        id: this.props.viewer.id,
        allPages: {
          count: this.props.viewer.allPages.count + 1,
        },
      },
    };
  }
}
