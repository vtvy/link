<template>
    <div v-if="modalType !== 0" class="link-modal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 v-if="modalType === 1" class="modal-title">Add link</h5>
                    <h5 v-if="modalType === 2" class="modal-title">
                        Add image
                    </h5>
                    <h5 v-if="modalType === 3" class="modal-title">Add note</h5>
                    <button type="button" class="close" @click="closeModal">
                        <span class="text-danger">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <Form
                        @submit="submitData"
                        :validation-schema="dataFormSchema"
                    >
                        <div v-if="modalType !== 2" class="form-group">
                            <label for="name">Name</label>
                            <Field
                                name="name"
                                type="text"
                                class="form-control"
                                v-model="dataLocal.name"
                            />
                            <ErrorMessage name="name" class="text-danger" />
                        </div>
                        <div v-if="modalType === 3" class="form-group">
                            <label for="content">Content</label>
                            <textarea
                                name="content"
                                rows="8"
                                class="form-control"
                                v-model="dataLocal.content"
                                @input="this.warningContent = false"
                            ></textarea>
                            <span v-if="warningContent" class="text-danger"
                                >Must input content</span
                            >
                        </div>
                        <div v-if="modalType === 1">
                            <div class="form-group form-check">
                                <label class="w-full text-success">
                                    <input
                                        name="color"
                                        type="color"
                                        v-model="this.dataLocal.color"
                                    />
                                    Choose your color link
                                </label>
                            </div>
                            <ErrorMessage name="color" class="text-danger" />

                            <div class="form-group form-check">
                                <label class="toggler-wrapper w-full">
                                    <input
                                        name="usePassword"
                                        type="checkbox"
                                        v-model="dataLocal.usePassword"
                                    />
                                    <div class="toggler-slider">
                                        <div class="toggler-knob"></div>
                                    </div>
                                    <span class="text-success">
                                        Use Password
                                    </span>
                                </label>
                            </div>
                            <div class="form-group">
                                <label for="url">URL</label>
                                <Field
                                    name="url"
                                    type="text"
                                    class="form-control"
                                    v-model="dataLocal.url"
                                />
                                <ErrorMessage name="url" class="text-danger" />
                            </div>
                            <div class="form-group form-check">
                                <label class="toggler-wrapper w-full">
                                    <input
                                        name="public"
                                        type="checkbox"
                                        v-model="dataLocal.public"
                                    />
                                    <div class="toggler-slider">
                                        <div class="toggler-knob"></div>
                                    </div>
                                    <span class="text-success">
                                        Public link
                                    </span>
                                </label>
                                <label
                                    for="public"
                                    class="form-check-label text-success"
                                >
                                </label>
                            </div>
                            <div v-if="this.dataLocal.usePassword">
                                <div class="form-group">
                                    <label for="passwd">Password</label>
                                    <Field
                                        name="passwd"
                                        type="password"
                                        class="form-control"
                                        v-model="dataLocal.passwd"
                                    />
                                    <ErrorMessage
                                        name="passwd"
                                        class="text-danger"
                                    />
                                </div>
                                <div class="form-group">
                                    <label for="passwordConfirmation">
                                        Comfirm Password
                                    </label>
                                    <Field
                                        name="passwordConfirmation"
                                        type="password"
                                        class="form-control"
                                    />
                                    <ErrorMessage
                                        name="passwordConfirmation"
                                        class="text-danger"
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            v-if="modalType === 2"
                            class="form-group d-flex flex-column"
                        >
                            <div class="custom-file mb-4">
                                <input
                                    type="file"
                                    class="custom-file-input"
                                    @change="addFile"
                                    accept="image/*"
                                />
                                <label class="custom-file-label">
                                    Drag and drop your image here
                                </label>
                            </div>
                            <img
                                src="#"
                                class="align-self-center img-fluid img-thumbnail"
                                hidden
                                alt="your image"
                            />
                            <span v-if="warningFileSelected" class="text-danger"
                                >Must select an image</span
                            >
                        </div>

                        <div class="form-group">
                            <button class="btn btn-primary">Save</button>
                            <button
                                v-if="dataLocal.id"
                                type="button"
                                class="ml-2 btn btn-danger"
                                @click="deleteContact"
                            >
                                Xóa
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    </div>
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
    props: {
        data: { type: Object, required: true },
        modalType: { type: Number, required: true },
    },
    watch: {
        data(newValue) {
            if (this.modalType === 1 && newValue.color.length === 6)
                newValue.color = "#" + newValue.color;
            this.dataLocal = newValue;
        },
    },
    data() {
        const dataFormSchema = yup.object().shape({
            name: yup.string().when({
                is: () => this.modalType !== 2,
                then: yup
                    .string()
                    .required("Name must have value.")
                    .min(2, "Name must have at least 2 characters.")
                    .max(50, "Name must have less than 50 characters."),
            }),
            url: yup.string().when({
                is: () => this.modalType === 1,
                then: yup
                    .string()
                    .matches(
                        /(https:\/\/)(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?/,
                        "Invalid url https://www.example.com!"
                    )
                    .required("Must input url"),
            }),
            passwd: yup.string().when({
                is: () => this.dataLocal.usePassword,
                then: yup
                    .string()
                    .required("Must input password")
                    .min(4, "This password must have at least 4 characters.")
                    .max(
                        20,
                        "This password must have less than 20 characters."
                    ),
            }),
            passwordConfirmation: yup.string().when({
                is: () => this.dataLocal.usePassword,
                then: yup
                    .string()
                    .required("Must input comfirm password")
                    .oneOf([yup.ref("passwd")], "Passwords must match"),
            }),
        });
        var warningFileSelected = false;
        var warningContent = false;
        return {
            dataLocal: {
                ...this.data,
            },

            dataFormSchema,
            warningFileSelected,
            warningContent,
        };
    },
    emits: ["close:modalType", "submit:data", "update:data"],
    methods: {
        closeModal() {
            this.$emit("close:modalType");
        },
        addFile(e) {
            this.warningFileSelected = false;
            this.dataLocal.file = e.target.files[0];
            const fileLabel = e.target.nextSibling;
            fileLabel.classList.add("selected");
            fileLabel.innerText = this.dataLocal.file.name;
            const imgElement = fileLabel.parentElement.nextSibling;
            imgElement.src = URL.createObjectURL(this.dataLocal.file);
            imgElement.removeAttribute("hidden");
        },
        submitData() {
            //when submit file, need to input file
            if (!(this.modalType !== 2 || this.dataLocal.file)) {
                console.log(this.dataLocal);
                this.warningFileSelected = true;
            } else if (this.modalType === 3 && !this.dataLocal.content) {
                this.warningContent = true;
            } else if (!this.dataLocal.id) {
                this.$emit("submit:data", this.dataLocal);
            } else {
                this.$emit("update:data", this.dataLocal);
            }
        },
    },
};
</script>
<style scoped>
.toggler-wrapper input[type="checkbox"] {
    width: 40px;
}

.toggler-wrapper input[type="checkbox"]:checked + .toggler-slider {
    background-color: #44cc66;
}

.toggler-wrapper .toggler-slider {
    background-color: #ccc;
    position: absolute;
    border-radius: 100px;
    top: 0;
    left: 0;
    width: 50px;
    height: 26px;
    -webkit-transition: all 300ms ease;
    transition: all 300ms ease;
}

.toggler-wrapper .toggler-knob {
    position: absolute;
    -webkit-transition: all 300ms ease;
    transition: all 300ms ease;
}

.toggler-wrapper
    input[type="checkbox"]:checked
    + .toggler-slider
    .toggler-knob {
    left: calc(100% - 23px);
}

.toggler-wrapper .toggler-knob {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    left: 3px;
    top: 3px;
    background-color: #fff;
}
</style>
