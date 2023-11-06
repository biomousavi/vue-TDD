<script setup>
import axios from 'axios';
import { ref, computed } from 'vue';

const buttonDisable = ref(false);
const email = ref('');
const username = ref('');
const password = ref('');
const confirmPassword = ref('');

const buttonIsDisabled = computed(() => {
  if (password.value && confirmPassword.value && !buttonDisable.value) {
    return password.value !== confirmPassword.value;
  } else {
    return true;
  }
});

function submitForm() {
  buttonDisable.value = true;
  axios.post('/api/1.0/users', {
    username: username.value,
    password: password.value,
    email: email.value,
  });
}
</script>

<template>
  <div class="row justify-content-center">
    <form class="card mt-5 col-md-4">
      <div class="card-header">
        <h1 class="text-center">SignUp page</h1>
      </div>

      <div class="card-body">
        <label class="form-label" for="username">Username</label>
        <input id="username" v-model="username" class="form-control" placeholder="username" />

        <label class="form-label" for="e-mail">E-mail</label>
        <input id="e-mail" v-model="email" class="form-control" placeholder="e-mail" />

        <label class="form-label" for="password">Password</label>
        <input id="password" v-model="password" class="form-control" placeholder="password" type="password" />

        <label class="form-label" for="confirm-password">Confirm Password</label>
        <input
          id="confirm-password"
          v-model="confirmPassword"
          class="form-control"
          placeholder="Confirm Password"
          type="password"
        />

        <div class="text-center">
          <button class="btn btn-primary mt-3" :disabled="buttonIsDisabled" @click.prevent="submitForm">
            <span class="spinner-border spinner-border-sm" role="status"></span>
            Submit
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
