<script>
import { imageService } from "@/services/image.service";
export default {
    props: {
        items: { type: Array, default: () => [] },
        activeIndex: { type: Number, default: -1 },
    },
    emits: ["update:activeIndex"],
    methods: {
        updateActiveIndex(index) {
            this.$emit("update:activeIndex", index);
        },
        handleDbClick(url) {
            if (url)
                location.href =
                    "https://spzg-my.sharepoint.com/personal/vy_votri_onmicrosoft_com/Documents/IT_CTU/y4s1/web/6.Vue.js.pdf";
        },
        getSrc(name, author) {
            const imageSrc = imageService.get(name, author);
            return imageSrc;
        },
    },
};
</script>
<template>
    <ul
        v-for="(item, index) in items"
        :key="item.id + item.type"
        class="my-4 d-flex flex-column align-items-center"
        @click="updateActiveIndex(index)"
        :class="{ active: index === activeIndex }"
    >
        <button
            v-if="item.type === 1"
            class="link item"
            :style="{ background: `#${item.color}` }"
            @dblclick="handleDbClick(item.url)"
        >
            {{ item.name }}
        </button>
        <img
            v-if="item.type === 2"
            class="item img-fluid"
            :src="getSrc(item.name, item.author)"
            :title="item.name.slice(10)"
            alt="{{item.name}}"
        />
        <div v-if="item.type === 3" class="note item">
            <div class="card-body">
                <h5 class="card-title">{{ item.name }}</h5>
                <p class="card-text">
                    {{ item.content }}
                </p>
            </div>
        </div>
    </ul>
</template>
<style scoped>
ul {
    padding: 0;
}

.link {
    border-width: 0;
    color: #9b9b9b;
    mix-blend-mode: hard-light;
    height: 44px;
    line-height: 1.15;
    overflow: hidden;
}

.item {
    text-align: center;
    width: 100%;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}
.active > .item {
    box-shadow: 0 8px 10px rgba(20, 129, 53, 0.3);
}

.note {
    background-color: rgba(39, 124, 177, 0.3);
}
</style>
