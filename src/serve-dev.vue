<script>
import Vue from 'vue';
import { UsableVueSample } from '@/entry';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    UsableVueSample,
  }
});
</script>

<template>
  <div id="app">
    <usable-vue-sample />
  </div>
</template>
