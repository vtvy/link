<script>
export default {
    props: {
        users: { type: Array, default: () => [] },
        activeIndex: { type: Number, default: -1 },
    },
    emits: ["update:activeIndex"],
    methods: {
        updateActiveIndex(index) {
            this.$emit("update:activeIndex", index);
        },
    },
};
</script>
<template>
    <ul class="list-group">
        <li
            class="list-group-item d-flex justify-content-between"
            v-for="(user, index) in users"
            :key="user.id"
            :class="{ active: index === activeIndex }"
            @click="updateActiveIndex(index)"
        >
            <strong>
                {{ user.name }}
            </strong>
        </li>
    </ul>
</template>
