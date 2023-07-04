<script>
import AppHeader from "@/components/AppHeader.vue";
export default {
    components: {
        AppHeader,
    },
};
document.addEventListener("contextmenu", (event) => event.preventDefault());
</script>
<template>
    <AppHeader />
    <div class="container mt-3 link">
        <router-view />
    </div>
</template>
<style>
body {
    min-width: 512px;
}
.page {
    max-width: 400px;
    margin: auto;
}
.link {
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
}
</style>
