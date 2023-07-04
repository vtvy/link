<template>
    <div class="page">
        <div class="mt-3">
            <div v-if="filteredItemsCount > 0">
                <ul
                    v-for="(item, index) in filteredItems"
                    :key="item.id"
                    class="my-4 d-flex flex-column align-items-center"
                    @click="handleDbClick(index)"
                >
                    <button
                        class="link item"
                        :style="{ background: `#${item.color}` }"
                    >
                        {{ item.name }}
                    </button>
                </ul>
            </div>
            <p v-else>There is no item to show</p>
        </div>
    </div>
    <ConfirmModal
        v-if="showConfirm"
        @check="deleteItem"
        :field="field[activeItem.type]"
        :type="'Delete'"
    />
</template>
<script>
import { linkService } from "@/services/link.service";
import { imageService } from "@/services/image.service";
import { noteService } from "@/services/note.service";
import { useSearchStore } from "@/stores/search";
import { mapState } from "pinia";
import ConfirmModal from "@/components/ConfirmModal.vue";

export default {
    components: {
        ConfirmModal,
    },
    data() {
        return {
            ItemList: [],
            activeIndex: -1,
            searchText: "",
            modalType: 0, // 1 = link, 2 = image, 3 = note
            addModal: false,
            formData: {},
            field: ["user", "link", "image", "note"],
            showConfirm: false,
        };
    },

    watch: {
        searchText() {
            this.activeIndex = -1;
        },
        searchTextStore(newValue) {
            this.searchText = newValue;
        },
    },
    computed: {
        ...mapState(useSearchStore, ["searchTextStore"]),
        // Map Links to strings for searching.
        ItemsAsStrings() {
            return this.ItemList.map((Item) => {
                const { name, url, content, createAt } = Item;
                return [name, url, content, createAt].join("");
            });
        },
        // Return Links filtered by the search box.
        filteredItems() {
            if (!this.searchText) return this.ItemList;
            return this.ItemList.filter((item, index) =>
                this.ItemsAsStrings[index].includes(this.searchText)
            );
        },
        activeItem() {
            if (this.activeIndex < 0) return null;
            return this.filteredItems[this.activeIndex];
        },
        filteredItemsCount() {
            return this.ItemList.length;
        },
    },
    methods: {
        async retrieveLinks() {
            try {
                const linksList = await linkService.guest();
                this.ItemList = linksList.sort((current, next) =>
                    current.name.localeCompare(next.name)
                );
            } catch (error) {
                console.log(error);
            }
        },

        refreshList() {
            this.retrieveLinks();
            this.activeIndex = -1;
        },
        closeSubModel() {
            this.modalType = 0;
        },
        async submitData(data) {
            data.author = 1;
            try {
                if (this.modalType === 1) {
                    const link = await linkService.create(data);
                    console.log(link);
                    this.ItemList.push(link);
                }
                if (this.modalType === 2) {
                    let file = new FormData();
                    file.append("file", data.file);
                    const image = await imageService.create(data);
                    this.ItemList.push(image);
                }
                if (this.modalType === 3) {
                    const note = await noteService.create(data);
                    console.log(note);
                    this.ItemList.push(note);
                }
                this.closeSubModel();
            } catch (error) {
                console.log(error);
            }
        },
        editModal() {
            this.formData = this.activeItem;
            this.modalType = this.activeItem.type;
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
.link-modal {
    position: fixed;
    z-index: 1055;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
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

.func-bar {
    top: 4rem;
    right: 0;
    left: 0;
}
</style>
