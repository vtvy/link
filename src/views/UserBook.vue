<template>
    <div class="page row">
        <div class="mt-3 col-md-6">
            <h4>Admin</h4>
            <UserList
                v-if="filteredUsersCount > 0"
                :users="filteredUsers"
                v-model:activeIndex="activeIndex"
            />
            <p v-else>There are no one.</p>
            <div class="mt-3 row justify-content-around align-items-center">
                <button class="btn btn-sm btn-primary" @click="refreshList()">
                    <i class="fas fa-redo"></i> Refresh
                </button>
                <button class="btn btn-sm btn-success" @click="goToAddUser">
                    <i class="fas fa-plus"></i> Create
                </button>
            </div>
        </div>
        <div v-if="activeUser" class="mt-3 col-md-6">
            <div>
                <h4>
                    User detail
                    <i class="fas fa-address-card"></i>
                </h4>
                <div class="p-1">
                    <strong>Name:</strong>
                    {{ activeUser.name }}
                </div>
                <div class="p-1">
                    <strong>Username:</strong>
                    {{ activeUser.username }}
                </div>
                <router-link
                    :to="{
                        name: 'user.edit',
                        params: { id: activeUser.id },
                    }"
                >
                    <span class="mt-2 badge badge-warning">
                        <i class="fas fa-edit"></i> Edit</span
                    >
                </router-link>
            </div>
        </div>
    </div>
</template>
<script>
import UserList from "@/components/UserList.vue";
import { aduserService } from "@/services/aduser.service";
import { useSearchStore } from "@/stores/search";
import { mapState } from "pinia";

export default {
    components: {
        UserList,
    },
    // The full code will be presented below
    data() {
        return {
            users: [],
            activeIndex: -1,
            searchText: "",
        };
    },
    watch: {
        // Monitor changes on searchText.
        // Release the currently selected user.
        searchText() {
            this.activeIndex = -1;
        },
        searchTextStore(newValue) {
            this.searchText = newValue;
        },
    },
    computed: {
        ...mapState(useSearchStore, ["searchTextStore"]),
        // Map users to strings for searching.
        usersAsStrings() {
            return this.users.map((user) => {
                const { name, username } = user;
                return [name, username].join("");
            });
        },
        // Return users filtered by the search box.
        filteredUsers() {
            if (!this.searchText) return this.users;
            return this.users.filter((user, index) =>
                this.usersAsStrings[index].includes(this.searchText)
            );
        },
        activeUser() {
            if (this.activeIndex < 0) return null;
            return this.filteredUsers[this.activeIndex];
        },
        filteredUsersCount() {
            return this.filteredUsers.length;
        },
    },
    methods: {
        async retrieveUsers() {
            try {
                const usersList = await aduserService.getMany();
                this.users = usersList.sort((current, next) =>
                    current.name.localeCompare(next.name)
                );
            } catch (error) {
                console.log(error);
                if (error.response?.status === 403)
                    this.$router.push({ name: "login" });
            }
        },
        refreshList() {
            this.retrieveUsers();
            this.activeIndex = -1;
        },
        goToAddUser() {
            this.$router.push({ name: "user.add" });
        },
    },
    mounted() {
        this.refreshList();
    },
};
</script>
<style scoped>
.page {
    text-align: left;
    max-width: 750px;
}
</style>
