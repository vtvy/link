import axios from "axios";

const url = import.meta.env.VITE_APP_API_URL;
const tokenName = import.meta.env.VITE_APP_TOKEN_NAME;
const userStoreName = import.meta.env.VITE_APP_STORE;
const userToken = localStorage.getItem(tokenName);
class UserService {
    constructor() {
        this.baseUrl = `${url}/api/user`;
        this.api = axios.create({
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        this.fileApi = axios.create({
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${userToken}`,
            },
        });
    }

    async login(user) {
        let result = await this.api.post(this.baseUrl, user);
        localStorage.setItem(tokenName, result.data.token);
        localStorage.setItem(userStoreName, JSON.stringify(result.data.user));
    }

    async get(id) {
        return (await this.api.get(`${this.baseUrl}/${id}`)).data;
    }

    async update(id, user) {
        return (await this.fileApi.put(`${this.baseUrl}/${id}`, user)).data;
    }

    async delete(id) {
        return (await this.api.delete(`${this.baseUrl}/${id}`)).data;
    }
}
export const userService = new UserService();
