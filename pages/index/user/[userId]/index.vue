<script setup>
const { params } = useRoute();
</script>

<template>
	<div>user: {{ params.userId }}</div>
	<NuxtPage />
</template>
<style scoped></style>
