<template>
    <div v-if="user" class="page">
        <h4>Create user</h4>
        <UserForm :user="user" :type="'create'" @submit:user="onCreateUser" />
        <p>{{ message }}</p>
    </div>
</template>
<script>
import UserForm from "@/components/UserForm.vue";
import { aduserService } from "@/services/aduser.service";
export default {
    components: {
        UserForm,
    },
    data() {
        return {
            message: "",
            user: {
                name: "",
                username: "",
                passwd: "",
            },
        };
    },
    methods: {
        async onCreateUser(user) {
            try {
                this.user = await aduserService.create(user);
                this.message = "User account has been added successfully.";
                setTimeout(() => {
                    this.$router.push({ name: "admin" });
                }, 3000);
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
