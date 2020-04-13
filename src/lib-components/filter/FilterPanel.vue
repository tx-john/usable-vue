<template>

  <div class="filter-panel">

    <ul class="list-unstyled text-left p-4">

      <li
        v-for="filter in filters"
        class="filter-wrapper">

        <!-- Yay, vue! fun. -->
        <component
          :is="filter.type"
          :filter="filter"
          @updateFilter="updateFilter"
          @updateRangeFilter="updateRangeFilter"
          ></component>

      </li>

    </ul>

  </div>

</template>

<script>

  // NOTE on some weirdness... any components defined in "filter.type" must
  // be imported here in this file.
  import AriaSliderFilter           from '@/components/generic/filter/AriaSliderFilter.vue'
  import CheckboxGroupFilter        from '@/components/generic/filter/CheckboxGroupFilter.vue'

  import RangeFilter                from '@/components/generic/filter/RangeFilter.vue'

  // TODO: remove this dependency, somehow, from the generic filter panel.
  //
  // Is it possible to inject cmp dependencies?
  import ZipCodeAutocompleteFilter  from '@/components/generic/filter/ZipCodeAutocompleteFilter.vue'

  export default {

    props : ["filters"],

    components : {
      AriaSliderFilter,
      CheckboxGroupFilter,
      RangeFilter,
      ZipCodeAutocompleteFilter
    },

    methods: {

      updateFilter({filterName, value}) {
        this.$emit('updateFilter', {
          filterName,
          value
        });
      },

      updateRangeFilter({filterName, lowerBoundValue, upperBoundValue}) {
        this.$emit('updateRangeFilter', {
          filterName,
          lowerBoundValue,
          upperBoundValue
        });
      },

    }
  };


</script>

<style lang="scss">

</style>
