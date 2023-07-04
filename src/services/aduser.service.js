import axios from "axios";

const url = import.meta.env.VITE_APP_API_URL;
const tokenName = import.meta.env.VITE_APP_TOKEN_NAME;
const adminToken = localStorage.getItem(tokenName);
class AdUserService {
    constructor() {
        this.baseUrl = `${url}/api/aduser`;
        this.api = axios.create({
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${adminToken}`,
            },
        });
    }

    async getMany() {
        return (await this.api.get(this.baseUrl)).data;
    }
    async create(user) {
        return (await this.api.post(this.baseUrl, user)).data;
    }
    async get(id) {
        return (await this.api.get(`${this.baseUrl}/${id}`)).data;
    }
    async update(id, user) {
        return (await this.api.put(`${this.baseUrl}/${id}`, user)).data;
    }
    async delete(id) {
        return (await this.api.delete(`${this.baseUrl}/${id}`)).data;
    }
}
export const aduserService = new AdUserService();
