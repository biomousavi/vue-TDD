<template>
  <div class="my-4">
    <span class="locale" title="فارسی" @click="$i18n.locale = 'fa'">
      فارسی
      <img src="https://flagsapi.com/IR/flat/24.png" />
    </span>

    <span class="locale" title="English" @click="$i18n.locale = 'en'">
      English
      <img src="https://flagsapi.com/US/flat/24.png" />
    </span>
  </div>
</template>

<style scoped>
.locale {
  cursor: pointer;
}
</style>
