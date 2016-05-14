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


const data = {
  response: {
    viewer: {
      _widgets2AAzH1: {
        edges: [
          {
            cursor: 'YXJyYXljb25uZWN0aW9uOjA=',
            node: {
              id: 'V2lkZ2V0OjA=',
              name: 'Foo',
            },
          },
          {
            cursor: 'YXJyYXljb25uZWN0aW9uOjE=',
            node: {
              id: 'V2lkZ2V0OjE=',
              name: 'Bar',
            },
          },
          {
            cursor: 'YXJyYXljb25uZWN0aW9uOjI=',
            node: {
              id: 'V2lkZ2V0OjI=',
              name: 'Baz',
            },
          },
        ],
      },
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
      id: 'VXNlcjox',
    },
  },
};

export default function(query) {
  return new Promise(() => {
    query.resolve(data);
  });
}
