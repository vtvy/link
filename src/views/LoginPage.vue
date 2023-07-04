<template>
    <div class="page">
        <h4>Login</h4>
        <UserForm :user="user" :type="'login'" @submit:user="login" />
        <p>{{ message }}</p>
    </div>
</template>
<script>
import UserForm from "@/components/UserForm.vue";
import { userService } from "@/services/user.service";

export default {
    components: {
        UserForm,
    },
    data() {
        return {
            message: "",
            user: {
                username: "",
                passwd: "",
            },
        };
    },
    methods: {
        async login(user) {
            this.message = "";
            try {
                await userService.login(user);
                this.$router.push({ name: "item" });
            } catch (error) {
                this.message = error.response?.data?.message;
            }
        },
    },
    created() {
        this.message = "";
    },
};
</script>
