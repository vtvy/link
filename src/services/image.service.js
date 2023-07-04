import axios from "axios";

const url = import.meta.env.VITE_APP_API_URL;
const tokenName = import.meta.env.VITE_APP_TOKEN_NAME;
const userStoreName = import.meta.env.VITE_APP_STORE;
const userToken = localStorage.getItem(tokenName);

class ImageService {
    constructor() {
        this.baseUrl = `${url}/api/image`;
        this.fileApi = axios.create({
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${userToken}`,
            },
        });
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
    async create(image) {
        return (await this.fileApi.post(this.baseUrl, image)).data;
    }
    get(name, author) {
        if (name && author && userToken)
            return `${url}/image/${author}/${name}`;
        return null;
    }

    async logout() {
        localStorage.removeItem(tokenName);
        localStorage.removeItem(userStoreName);
    }

    async delete(name) {
        return (await this.api.delete(`${this.baseUrl}/${name}`)).data;
    }
}
export const imageService = new ImageService();
