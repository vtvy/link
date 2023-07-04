<template>
    <Form @submit="submitUser" :validation-schema="userFormSchema">
        <div v-if="type !== 'login'" class="form-group mt-4">
            <label for="name">Name</label>
            <Field
                name="name"
                type="text"
                class="form-control"
                v-model="userLocal.name"
            />
            <ErrorMessage name="name" class="text-danger" />
        </div>
        <div v-if="type !== 'edit'" class="form-group mt-4">
            <label for="username">Username</label>
            <Field
                name="username"
                type="username"
                class="form-control"
                v-model="userLocal.username"
            />
            <ErrorMessage name="username" class="text-danger" />
        </div>
        <div class="form-group mt-4">
            <label for="passwd">Password</label>
            <Field
                name="passwd"
                type="password"
                class="form-control"
                v-model="userLocal.passwd"
            />
            <ErrorMessage name="passwd" class="text-danger" />
        </div>
        <div v-if="type !== 'login'" class="form-group mt-4">
            <label for="passwordConfirmation">Comfirm Password</label>
            <Field
                name="passwordConfirmation"
                type="password"
                class="form-control"
            />
            <ErrorMessage name="passwordConfirmation" class="text-danger" />
        </div>
        <div class="form-group mt-4">
            <button class="btn btn-primary">Submit</button>
            <button
                v-if="userLocal.id && this.type === 'edit'"
                type="button"
                class="ml-2 btn btn-danger"
                @click="deleteUser"
            >
                Xóa
            </button>
        </div>
    </Form>
</template>
<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    emits: ["submit:user", "delete:user"],
    props: {
        user: { type: Object, required: true },
        type: { type: String, required: true },
    },
    data() {
        const userFormSchema = yup.object().shape({
            name: yup.string().when({
                is: () => this.type !== "login",
                then: yup
                    .string()
                    .required("Name must have value.")
                    .min(2, "Name must have at least 2 characters.")
                    .max(50, "Name must have less than 50 characters."),
            }),
            username: yup
                .string()
                .required("You need to input username.")
                .min(4, "This username must have at least 4 characters.")
                .max(20, "This username must have less than 20 characters."),
            passwd: yup
                .string()
                .min(4, "This password must have at least 4 characters.")
                .max(20, "This password must have less than 20 characters."),
            passwordConfirmation: yup.string().when({
                is: () => this.type !== "login",
                then: yup
                    .string()
                    .required("Must input comfirm password")
                    .oneOf([yup.ref("passwd")], "Passwords must match"),
            }),
        });
        return {
            userLocal: {
                ...this.user,
            },

            userFormSchema,
        };
    },
    methods: {
        submitUser() {
            this.$emit("submit:user", this.userLocal);
        },
        deleteUser() {
            this.$emit("delete:user", this.userLocal.id);
        },
    },
};
</script>
