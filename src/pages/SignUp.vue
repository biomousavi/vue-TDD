<script setup>
import axios from 'axios';
import { ref, computed } from 'vue';
import Input from '../components/Input.vue';

const loading = ref(false);
const success = ref(false);
const email = ref('');
const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const errors = ref({});

const buttonIsDisabled = computed(() => {
  if (password.value && confirmPassword.value && !loading.value) {
    return password.value !== confirmPassword.value;
  } else {
    return true;
  }
});

const passwordMismatch = computed(() => password.value !== confirmPassword.value);

async function submitForm() {
  try {
    loading.value = true;
    await axios.post('/api/1.0/users', {
      username: username.value,
      password: password.value,
      email: email.value,
    });
    success.value = true;
  } catch (error) {
    if (error.response?.data?.validationErrors) {
      errors.value = error.response?.data?.validationErrors;
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="row justify-content-center" data-test="signup-page">
    <form v-if="!success" class="card px-0 mt-5 col-md-4" data-test="signup-form">
      <div class="card-header">
        <h1 class="text-center">{{ $t('signUp') }}</h1>
      </div>

      <div class="card-body">
        <Input
          id="username"
          v-model="username"
          :label="$t('username')"
          :error="errors.username"
          @update:model-value="errors.username = ''"
        />
        <Input
          id="email"
          v-model="email"
          :label="$t('email')"
          :error="errors.email"
          @update:model-value="errors.email = ''"
        />
        <Input
          id="password"
          v-model="password"
          :label="$t('password')"
          :error="errors.password"
          type="password"
          @update:model-value="errors.password = ''"
        />
        <Input
          id="confirm-password"
          v-model="confirmPassword"
          :label="$t('confirmPassword')"
          :error="passwordMismatch ? $t('passwordMismatch') : ''"
          type="password"
        />

        <div class="text-center">
          <button class="btn btn-primary mt-3" :disabled="buttonIsDisabled" @click.prevent="submitForm()">
            <span v-if="loading" class="spinner-border spinner-border-sm" role="status"></span>
            Submit
          </button>
        </div>
      </div>
    </form>
    <div v-if="success" class="alert alert-success" data-test="account-activation">
      Please check your email to activate your account
    </div>
  </div>
</template>
