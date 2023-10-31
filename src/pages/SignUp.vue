<script setup>
import axios from 'axios';
import { ref, computed } from 'vue';

const email = ref('');
const username = ref('');
const password = ref('');
const confirmPassword = ref('');

const buttonIsDisabled = computed(() => {
  if (password.value && confirmPassword.value) {
    return password.value !== confirmPassword.value;
  } else {
    return true;
  }
});

function submitForm() {
  axios.post('/api/1.0/users', {
    username: username.value,
    password: password.value,
    email: email.value,
  });
}
</script>

<template>
  <form>
    <h1>SignUp page</h1>

    <label for="username">Username</label>
    <input id="username" v-model="username" placeholder="username" />

    <label for="e-mail">E-mail</label>
    <input id="e-mail" v-model="email" placeholder="e-mail" />

    <label for="password">Password</label>
    <input id="password" v-model="password" placeholder="password" type="password" />

    <label for="confirm-password">Confirm Password</label>
    <input id="confirm-password" v-model="confirmPassword" placeholder="Confirm Password" type="password" />

    <button :disabled="buttonIsDisabled" @click.prevent="submitForm">Submit</button>
  </form>
</template>
