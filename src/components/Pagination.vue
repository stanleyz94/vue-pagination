<template>
  <div class="pagination">
    <template v-if="!isLoading">
      <ul class="pagination__posts">
        <li
          class="pagination__post"
          v-for="(post, index) in getPaginatedPosts"
          :key="index"
        >
          <h2 class="pagination__title">Title: {{ post.title }}</h2>
          <p class="pagination__name">Author: {{ post.name }}</p>
          <p class="pagination__body" v-if="post.isTruncated">
            {{ truncate(post.body) }}
          </p>
          <p class="pagination__body" v-else>{{ post.body }}</p>
          <button
            class="pagination__btn-more"
            @click="post.isTruncated = !post.isTruncated"
          >
            {{ post.isTruncated ? 'Show more' : 'Show less' }}
          </button>
          <button class="pagination__btn-delete" @click="removePost(post)">
            Delete post
          </button>
        </li>
      </ul>
      <nav class="pagination__footer">
        <ul class="pagination__pages">
          <li class="pagination__page">
            <button
              class="pagination__btn"
              :disabled="isPreviousButtonDisabled"
              @click="setPage(paginationObject.currentPage - 1)"
            >
              &laquo;
            </button>
          </li>
          <li
            v-for="(page, index) in getNumberOfPages"
            :key="index"
            class="pagination__page"
          >
            <button
              class="pagination__btn"
              :class="{
                'pagination__btn-active': paginationObject.currentPage === page,
              }"
              @click="setPage(page)"
            >
              {{ page }}
            </button>
          </li>
          <li class="pagination__page">
            <button
              class="pagination__btn"
              :disabled="isNextButtonDisabled"
              @click="setPage(paginationObject.currentPage + 1)"
            >
              &raquo;
            </button>
          </li>
        </ul>
      </nav>
    </template>
    <template v-else>Loading..</template>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  data() {
    return {
      perPage: 10,
    };
  },
  methods: {
    ...mapMutations([
      'SET_PAGINATION',
      'SET_LOADING_STATUS',
      'UPDATE_PAGINATION',
      'REMOVE_USER_POST',
      'SET_CURRENT_PAGE',
    ]),
    ...mapActions(['loadAllPosts']),
    setPage(page) {
      this.SET_PAGINATION({
        currentPage: page,
        perPage: this.perPage,
      });
    },
    truncate(text, length) {
      if (!length) length = 50;
      if (text.length < length) return text;
      return text.substring(0, length) + '...';
    },
    removePost(post) {
      this.REMOVE_USER_POST(post);
    },
  },

  computed: {
    ...mapGetters([
      'isNextButtonDisabled',
      'isPreviousButtonDisabled',
      'getPosts',
      'isLoading',
      'getPaginatedPosts',
      'getNumberOfPages',
    ]),

    paginationObject() {
      return this.$store.getters.getPagination;
    },
  },
  watch: {
    getPosts: {
      deep: true,
      handler() {
        this.UPDATE_PAGINATION({
          currentPage: this.paginationObject.currentPage,
          perPage: this.perPage,
        });
      },
    },
    getPaginatedPosts: {
      deep: true,
      handler(value) {
        if (this.$store.state.loadingStatus === false) {
          if (!Array.isArray(value) || !value.length) {
            this.SET_CURRENT_PAGE(this.paginationObject.currentPage - 1);
            this.setPage(this.paginationObject.currentPage);
          }
        }
      },
    },
  },
  mounted() {
    this.SET_LOADING_STATUS(true);
    this.loadAllPosts();
  },
};
</script>

<style lang="scss">
@import '@/scss/base/_media-queries.scss';
@import '@/scss/components/pagination/_pagination.scss';
</style>
