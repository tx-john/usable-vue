<template>

  <div class="pagination">

    <ul>

      <!-- Previous -->
      <li>
        <button
          class="pagination-previous"
          :class="isPrevDisabled ? 'disabled' : ''"
          @click="changePage(1)">

          <slot
            name="previousButton">

            Previous Page
          </slot>

        </button>
      </li>

      <!-- Pagination buttons -->
      <li
        v-for="pageNumber in pageNumbers">

        <button
          :class="pageNumber === activePageNumber ? 'active' : ''"
          @click="changePage(pageNumber)">

          {{pageNumber}}
        </button>

      </li>

      <!-- Next -->
      <li>
        <button
          class="pagination-next"
          :class="isNextDisabled ? 'disabled' : ''"
          @click="changePage(lastPageNumber)">

          <slot
            name="nextButton">

            Next Page
          </slot>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  props : ['activePageNumber', 'numPages'],

  computed : {
    isPrevDisabled() {
      if (this.activePageNumber === 1) {
        return true;
      }
    },

    isNextDisabled() {
      if (this.activePageNumber === this.lastPageNumber) {
        return true;
      }
    },

    pageNumbers() {
      if (!this.numPages || this.numPages === 0) {
        return [];
      }
      return Array.from(new Array(this.numPages), (x,i) => i + 1)
    },

    lastPageNumber() {
      return this.pageNumbers.slice(-1)[0];
    }
  },

  methods : {
    changePage(pageNumber) {
      this.$emit('changePage', pageNumber);
    }
  }
};

</script>

<style lang="scss">
  .pagination {
    ul {
      padding-left: 0;
      margin  : auto;
      display: flex;
      justify-content: space-between;

      li {
        list-style-type: none;

        button {
          cursor            : pointer;

          background-color  : white;
          border            : 1px solid black;
          color             : black;
          font-weight       : bold;

          margin            : .5rem;
          padding           : 0 1rem;

          &.active {
            background-color: black;
            color           : white;
          }

          &.disabled {
            color           : #777;
            border-color    : #bbb;
            cursor          : none;
          }

        }
      }
    }
  }
</style>

