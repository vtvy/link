import axios from "axios";

const url = import.meta.env.VITE_APP_API_URL;
const tokenName = import.meta.env.VITE_APP_TOKEN_NAME;
const userToken = localStorage.getItem(tokenName);

class NoteService {
    constructor() {
        this.baseUrl = `${url}/api/note`;
        this.api = axios.create({
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${userToken}`,
            },
        });
    }
    async getMany() {
        return (await this.api.get(this.baseUrl)).data;
    }
    async create(note) {
        return (await this.api.post(this.baseUrl, note)).data;
    }
    async login(user) {
        return (await this.api.get(this.baseUrl, user)).data;
    }
    async deleteMany() {
        return (await this.api.delete(this.baseUrl)).data;
    }
    async get(id) {
        return (await this.api.get(`${this.baseUrl}/${id}`)).data;
    }
    async update(note) {
        return (await this.api.put(`${this.baseUrl}/${note.id}`, note)).data;
    }
    async delete(id) {
        return (await this.api.delete(`${this.baseUrl}/${id}`)).data;
    }
}
export const noteService = new NoteService();
