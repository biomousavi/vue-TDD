<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const failed = ref(false);
const loading = ref(true);
const success = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const route = useRoute();
    const token = route.params.token;
    await axios.post(`/api/1.0/users/token/${token}`, {});
    success.value = true;
  } catch (error) {
    failed.value = true;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div data-test="activation-page">
    <span v-if="loading" class="spinner-border spinner-border-sm" role="status"></span>

    <h2 v-if="success" class="alert alert-success mt-3">Account is Activated</h2>
    <h2 v-if="failed" class="alert alert-success mt-3">Account was Failed</h2>
  </div>
</template>
