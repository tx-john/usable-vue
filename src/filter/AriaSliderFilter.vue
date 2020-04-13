<template>

  <div class="slider-filter">

    <label
      class="filter-label"
      :for="filter.name">
      {{filter.label}}
    </label>

    <AriaSlider
      :min="filter.min"
      :max="filter.max"
      :value="filter.value"
      :showProgressBar="filter.options && filter.options.showProgressBar"
      :showTicks="filter.options && filter.options.showTicks"
      @change="updateFilter">
    </AriaSlider>
  </div>

</template>

<script>

import AriaSlider  from '@/components/generic/input/AriaSlider.vue'

export default {
  props : ["filter"],

  components  : {
    AriaSlider
  },

  methods : {
    updateFilter(event) {

      // this.filter.value = event.target.value;
      this.$emit('updateFilter',
        {
          filterName  : this.filter.name,
          value       : event.value
        }
      );
    }
  }
};

</script>

<style lang="scss">

  .slider-filter label {
    margin-bottom: 1.5rem;
  }

</style>