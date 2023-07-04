<template>
    <nav class="navbar navbar-expand-md bg-light" :class="{ navbarOpen: show }">
        <div class="container-fluid">
            <a class="navbar-brand d-flex align-items-center" href="/">
                <img width="20" src="../assets/link.png" />&nbsp;
                <strong> Link </strong>
            </a>
            <button
                class="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                @click.stop="toggleNavbar()"
            >
                <i class="btn btn-light fa-solid fa-bars"></i>
            </button>
            <div
                class="collapse navbar-collapse"
                id="navbarSupportedContent"
                :class="{ show: show }"
            >
                <ul class="navbar-nav me-auto mb-2 mb-md-0">
                    <li class="nav-item">
                        <router-link :to="{ name: 'home' }" class="nav-link">
                            Home
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link :to="{ name: 'item' }" class="nav-link">
                            Items
                        </router-link>
                    </li>
                </ul>
                <InputSearch
                    v-if="
                        this.$route.name === 'admin' ||
                        this.$route.name === 'item' ||
                        this.$route.name === 'home'
                    "
                    v-model="searchText"
                />
                <router-link
                    v-if="!userStore.id"
                    :to="{ name: 'login' }"
                    class="btn btn-primary nav-link ml-auto"
                >
                    Login
                </router-link>
                <button
                    v-if="userStore.id"
                    class="btn btn-primary nav-link ml-auto"
                    @click="logout()"
                >
                    Logout
                </button>
                <ul class="navbar-nav me-auto mb-2 mb-md-0">
                    <li class="nav-item dropdown">
                        <a
                            class="nav-link dropdown-toggle"
                            href="#"
                            id="navbarDropdown"
                            role="button"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            Hi
                            <span v-if="userStore">{{ userStore.name }}</span>
                        </a>
                        <ul class="dropdown-menu menu-index">
                            <li>
                                <a class="dropdown-item" href="#">Profile</a>
                            </li>
                            <li><hr class="dropdown-divider" /></li>
                            <router-link
                                v-if="userStore.role"
                                :to="{ name: 'admin' }"
                                class="dropdown-item"
                            >
                                Admin page
                            </router-link>
                        </ul>
                    </li>
                </ul>
                <img
                    :src="
                        getSrc(userStore.avatar, userStore.id) || '/avatar.png'
                    "
                    class="rounded-circle d-md-block d-none"
                    width="60"
                    alt="Avatar"
                />
            </div>
        </div>
    </nav>
</template>
<script>
import InputSearch from "@/components/InputSearch.vue";
import { mapActions } from "pinia";
import { useSearchStore } from "@/stores/search";
import { imageService } from "@/services/image.service";
export default {
    components: {
        InputSearch,
    },
    data() {
        return {
            searchText: "",
            show: false,
            userStore: {},
        };
    },

    watch: {
        searchText(text) {
            console.log(this.userStore);
            this.setSearchText(text);
        },
    },
    methods: {
        ...mapActions(useSearchStore, ["setSearchText"]),

        toggleNavbar() {
            this.show = !this.show;
        },
        getSrc(name, author) {
            if (
                !name &&
                !author &&
                this.$route.name !== "home" &&
                this.$route.name !== "login"
            ) {
                this.$router.push({ name: "login" });
            }
            const imageSrc = imageService.get(name, author);
            if (!imageSrc) this.resetStore = true;
            return imageSrc;
        },
        getUser() {
            const userStoreName = import.meta.env.VITE_APP_STORE;
            const userStore = localStorage.getItem(userStoreName);
            if (userStore) {
                this.userStore = JSON.parse(userStore);
            } else {
                imageService.logout();
            }
        },
        logout() {
            imageService.logout();
        },
    },
    created() {
        this.getUser();
    },
};
</script>
<style scoped>
.menu-index {
    z-index: 1055;
}
</style>
