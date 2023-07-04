<template>
    <div class="link-modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 v-if="type === 'Delete'" class="modal-title">
                        Are you sure?
                    </h4>
                    <h4 v-if="type === 'Confirm'" class="modal-title">
                        Enter the link password
                    </h4>
                    <button class="close" @click="submit(false)">
                        &times;
                    </button>
                </div>
                <div class="modal-body">
                    <p>
                        Do you really want to {{ type.toLowerCase() }} this
                        {{ field }}?
                    </p>
                </div>
                <div class="modal-footer justify-content-around">
                    <button
                        type="button"
                        class="btn btn-secondary"
                        @click="submit(false)"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        @click="submit(true)"
                        class="btn btn-danger"
                    >
                        {{ type }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        field: { type: String, required: true },
        type: { type: String, required: true },
    },

    emits: ["check"],
    methods: {
        submit(confirm) {
            this.$emit("check", confirm);
        },
    },
};
</script>
