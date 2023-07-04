<template>
    <div class="page">
        <div class="mt-3">
            <div class="row sticky-top bg-white py-3 mx-0 func-bar">
                <button
                    class="btn btn-xl btn-success col-3"
                    @click="
                        (addModal = true),
                            (this.formData = { color: '#aaaaaa' })
                    "
                >
                    <i class="fas fa-plus"></i> Add new
                </button>

                <div
                    v-if="activeIndex !== -1"
                    class="d-flex text-secondary col-9 pr-0 justify-content-end"
                >
                    <button
                        v-if="this.activeItem.type !== 2"
                        class="btn btn-sm btn-primary mr-2"
                        @click="editModal"
                    >
                        <i class="fas fa-edit"></i> Edit
                    </button>

                    <button
                        class="btn btn-xl btn-danger mr-2"
                        @click="this.showConfirm = true"
                    >
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    <div class="align-self-center">
                        <i class="fa-regular fa-clock"></i>
                        {{ ItemList[activeIndex].createAt.substring(0, 10) }}
                    </div>
                </div>
            </div>
            <ItemList
                v-if="filteredItemsCount > 0"
                :items="filteredItems"
                v-model:activeIndex="activeIndex"
            />
            <p v-else>{{ message }}</p>
        </div>
    </div>
    <div v-if="addModal" class="link-modal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Add</h5>
                    <button
                        type="button"
                        class="close"
                        @click="addModal = false"
                    >
                        <span class="text-danger">&times;</span>
                    </button>
                </div>
                <div class="modal-body d-flex justify-content-around w-full">
                    <button
                        type="button"
                        class="btn btn-primary"
                        @click="(modalType = 1), (addModal = false)"
                    >
                        <i class="fas fa-plus"></i> New link
                    </button>
                    <button
                        type="button"
                        class="btn btn-success"
                        @click="(modalType = 2), (addModal = false)"
                    >
                        <i class="fas fa-plus"></i> New image
                    </button>
                    <button
                        type="button"
                        class="btn btn-warning"
                        @click="(modalType = 3), (addModal = false)"
                    >
                        <i class="fas fa-plus"></i> New note
                    </button>
                </div>
            </div>
        </div>
    </div>
    <DataModal
        :modalType="modalType"
        :data="formData"
        @close:modalType="closeSubModel"
        @submit:data="submitData"
        @update:data="updateData"
    />

    <ConfirmModal
        v-if="showConfirm"
        @check="deleteItem"
        :field="field[activeItem.type]"
        :type="'Delete'"
    />
</template>
<script>
import ItemList from "@/components/ItemList.vue";
import DataModal from "@/components/DataModal.vue";
import { linkService } from "@/services/link.service";
import { imageService } from "@/services/image.service";
import { noteService } from "@/services/note.service";
import { useSearchStore } from "@/stores/search";
import { mapState } from "pinia";
import ConfirmModal from "@/components/ConfirmModal.vue";

export default {
    components: {
        ItemList,
        DataModal,
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
            message: "",
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
                const LinksList = await linkService.getMany();
                const imagesList = await imageService.getMany();
                const notesList = await noteService.getMany();
                const ItemList = LinksList.concat(imagesList, notesList);
                if (ItemList.length) {
                    this.ItemList = ItemList.sort((current, next) =>
                        current.name.localeCompare(next.name)
                    );
                } else {
                    this.message = "There is no item to show";
                }
            } catch (error) {
                console.log(error);
            }
        },

        refreshList() {
            this.retrieveLinks();
            this.activeIndex = -1;
        },
        async deleteItem(confirm) {
            if (confirm) {
                if (this.activeItem.type === 1) {
                    const link = await linkService.delete(this.activeItem.id);
                    console.log(link);
                }
                if (this.activeItem.type === 2) {
                    await imageService.delete(this.activeItem.id);
                }
                if (this.activeItem.type === 3) {
                    const note = await noteService.delete(this.activeItem.id);
                    console.log(note);
                }
                this.ItemList = this.ItemList.filter(
                    (element, index) => index !== this.activeIndex
                );
                this.showConfirm = false;
            } else {
                this.showConfirm = false;
            }
        },
        goToAddUser() {
            this.$router.push({ name: "user.add" });
        },
        closeSubModel() {
            this.modalType = 0;
        },
        async submitData(data) {
            data.author = 1;
            try {
                if (this.modalType === 1) {
                    const link = await linkService.create(data);
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
                    this.ItemList.push(note);
                }
                this.closeSubModel();
            } catch (error) {
                console.log(error);
            }
        },
        async updateData(data) {
            try {
                if (this.modalType === 1) {
                    await linkService.update(data);
                } else if (this.modalType === 3) {
                    await noteService.update(data);
                }
                this.ItemList[this.activeIndex] = data;
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

.func-bar {
    top: 4rem;
    right: 0;
    left: 0;
}
</style>
