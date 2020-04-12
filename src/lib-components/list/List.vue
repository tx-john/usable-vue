<template>

  <div class="card-list">

    <div
      style="display:flex;"
      v-if="items.length === 0">
      <strong style="margin:auto;">No Results.</strong>
    </div>

    <ul class="list-unstyled">
      <li
        v-for="item in items">
        <slot name="item" v-bind:item="item"></slot>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  props : ["items"],
};

</script>
