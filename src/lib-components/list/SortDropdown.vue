
<template>
  <select
    @change="updateSortOrder">
    <option
      v-for="option in options">

      {{option.label}}
    </option>
  </select>
</template>

<script>

export default {

  props: ["options"],

  methods : {
    updateSortOrder(event) {

      const option = this.options[event.target.selectedIndex];

      this.$emit('updateSortOrder', option);
    }
  }
};

</script>