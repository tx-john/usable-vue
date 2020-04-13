<template>

  <fieldset
    class="range"
    v-if="filter && filter.lowerBound">

    <legend
      class="filter-label">

      {{filter.label}}
    </legend>

    <div
      class="d-flex justify-content-between">
      <label
        class="sr-only"
        :for="'lowerBound-' + filter.name">
        {{filter.label}} Lower Bound
      </label>
      <select
        :value="filter.lowerBound.value"
        :id="'lowerBound-' + filter.name"
        ref="lowerBoundSelect"
        @change="updateFilter">

        <option
          v-for="option in filter.lowerBound.options"
          :value="option.value">
          {{option.label}}
        </option>
      </select>

      <label
        class="sr-only"
        :for="'upperBound-' + filter.name">

        {{filter.label}} Upper Bound
      </label>
      <select
        :value="filter.upperBound.value"
        :id="'upperBound-' + filter.name"
        ref="upperBoundSelect"
        @change="updateFilter">

        <option
          v-for="option in filter.upperBound.options"
          :value="option.value">
          {{option.label}}
        </option>
      </select>
    </div>
  </fieldset>

</template>

<script>

export default {

  props : ["filter"],

  methods : {
    updateFilter(event) {
      this.$emit('updateRangeFilter', {
          filterName      : this.filter.name,
          lowerBoundValue : this.$refs.lowerBoundSelect.value,
          upperBoundValue : this.$refs.upperBoundSelect.value
        }
      );
    }
  }
};

</script>;

<style lang="scss">

.range {
  select {
    width : 100px;
  }
}

</style>
