<template>
    <div v-if="user" class="page">
        <h4>Edit user</h4>
        <UserForm
            :user="user"
            :type="'edit'"
            @submit:user="onUpdateUser"
            @delete:user="onDeleteUser"
        />
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
    props: {
        userId: { type: Number, required: true },
    },
    data() {
        return {
            message: "",
            user: null,
        };
    },
    methods: {
        async getUser(id) {
            try {
                let getUser = await aduserService.get(id);
                this.user = { id: this.userId, ...getUser };
            } catch (error) {
                console.log(error);
                // Redirect to NotFound page and keep URL intact
                this.$router.push({
                    name: "notfound",
                    params: {
                        pathMatch: this.$route.path.split("/").slice(1),
                    },
                    query: this.$route.query,
                    hash: this.$route.hash,
                });
            }
        },
        async onUpdateUser(user) {
            try {
                this.user = await aduserService.create(user);
                this.message = "User account has been added successfully.";
                setTimeout(function () {
                    this.$router.push({ name: "userbook" });
                }, 5000);
            } catch (error) {
                console.log(error);
            }
        },
        async onDeleteUser(id) {
            if (confirm("Do you want to delete this user?")) {
                try {
                    await aduserService.delete(id);
                    this.$router.push({ name: "admin" });
                } catch (error) {
                    console.log(error);
                }
            }
        },
    },
    created() {
        this.getUser(this.userId);
        this.message = "";
    },
};
</script>
