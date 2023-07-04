import { defineStore } from "pinia";

export const useSearchStore = defineStore("searchText", {
    state() {
        return {
            searchTextStore: "",
        };
    },

    actions: {
        setSearchText(text) {
            this.searchTextStore = text;
        },
    },
    getters: {
        getSearchText: (state) => {
            return state.searchTextStore;
        },
    },
});
