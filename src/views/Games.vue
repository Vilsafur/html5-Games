<template>
  <div class="games">
    <router-view/>    
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class Games extends Vue {}
</script>
