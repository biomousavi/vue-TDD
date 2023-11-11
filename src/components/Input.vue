<script setup>
import { defineProps } from 'vue';

defineEmits(['update:modelValue']);
defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  error: { type: String, required: false, default: '' },
  type: { type: String, required: false, default: 'text' },
  modelValue: {
    type: String,
    default: '',
    required: false,
  },
});
</script>

<template>
  <div class="mb-3">
    <label class="form-label" :for="id">{{ label }}</label>
    <input
      :id="id"
      class="form-control"
      :class="{ 'is-invalid': error }"
      :placeholder="label"
      :value="modelValue"
      :type="type"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <span class="invalid-feedback">{{ error }}</span>
  </div>
</template>
