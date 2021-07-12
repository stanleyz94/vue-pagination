import { createStore } from 'vuex';
import axios from 'axios';
import { Paginator } from './utils';
import { slice as _slice, isEmpty as _isEmpty } from 'lodash';
export default createStore({
  state: {
    posts: [],
    users: [],
    usersPosts: [],
    pagination: {},
    loadingStatus: false,
  },
  mutations: {
    SET_POSTS(state, posts) {
      state.posts = posts;
    },
    SET_USERS(state, users) {
      state.users = users;
    },
    SET_PAGINATION(state, page) {
      const { currentPage, perPage } = page;
      state.pagination = Paginator(
        state.usersPosts.length,
        currentPage,
        perPage
      );
    },
    SET_LOADING_STATUS(state, newLoadingStatus) {
      state.loadingStatus = newLoadingStatus;
    },
    SET_USERS_POSTS(state) {
      const usersPosts = [];

      state.posts.forEach((post) => {
        state.users.map((user) => {
          if (post.userId === user.id) {
            usersPosts.push({
              body: post.body,
              title: post.title,
              name: user.name,
              isTruncated: true,
            });
          }
        });
      });

      state.usersPosts = usersPosts;
    },
    REMOVE_USER_POST(state, givenIndex) {
      let usersPostsIndex = state.usersPosts.indexOf(givenIndex);
      state.usersPosts.splice(usersPostsIndex, 1);
    },
    UPDATE_PAGINATION(state, page) {
      const { currentPage, perPage } = page;
      state.pagination = Paginator(
        state.usersPosts.length,
        currentPage,
        perPage
      );
    },
    SET_CURRENT_PAGE(state, page) {
      state.pagination.currentPage = page;
    },
  },
  actions: {
    loadPosts({ commit }) {
      return axios
        .get('https://jsonplaceholder.typicode.com/posts?_start=0&_limit=100')
        .then((response) => {
          commit('SET_POSTS', response.data);
          commit('SET_PAGINATION', { currentPage: 1, perPage: 10 });
        });
    },
    loadUsers({ commit }) {
      return axios
        .get('https://jsonplaceholder.typicode.com/users')
        .then((response) => {
          commit('SET_USERS', response.data);
        });
    },
    loadAllPosts({ commit, dispatch }) {
      const posts = dispatch('loadPosts');
      const users = dispatch('loadUsers');

      Promise.all([posts, users])
        .then(() => {
          commit('SET_USERS_POSTS');
          commit('SET_LOADING_STATUS', false);
        })
        .catch((error) => console.log(`Error in promises ${error}`));
    },
  },
  getters: {
    getPosts: (state) => state.usersPosts,
    getPaginatedPosts: (state) =>
      _slice(
        state.usersPosts,
        state.pagination.startIndex,
        state.pagination.endIndex + 1
      ),
    getNumberOfPages: (state) => state.pagination.range,
    getPagination: (state) => state.pagination,
    isNextButtonDisabled: (state) => {
      if (!_isEmpty(state.pagination)) {
        return state.pagination.currentPage === state.pagination.range.length;
      }
    },
    isPreviousButtonDisabled: (state) => {
      if (!_isEmpty(state.pagination)) {
        return state.pagination.currentPage === 1;
      }
    },
    isLoading: (state) => state.loadingStatus,
  },
  modules: {},
});
