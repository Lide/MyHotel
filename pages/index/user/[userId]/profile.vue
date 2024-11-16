<script setup>
const { params } = useRoute();
</script>
<template>
	<div>profile: {{ params.userId }}</div>
</template>
<style scoped></style>
