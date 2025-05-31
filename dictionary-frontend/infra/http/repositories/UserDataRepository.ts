import { IUserDataRepository } from "@/domain/repositories/IUserDataRepository";
import api from "@/infra/http/api";

export class UserDataRepository implements IUserDataRepository {
    async fetchFavorites(page = 1, pageSize = 50): Promise<string[]> {
        const response = await api.get(`/user/me/favorites?page=${page}&pageSize=${pageSize}`);
        return response.data.results.map((f: { word: string }) => f.word);
    }

    async fetchHistory(page = 1, pageSize = 50): Promise<{
        results: { word: string; viewedAt: string }[];
        hasNext: boolean;
    }> {
        const response = await api.get(`/user/me/history?page=${page}&pageSize=${pageSize}`);
        return {
            results: response.data.results,
            hasNext: response.data.hasNext,
        };
    }

    async addFavorite(word: string): Promise<void> {
        await api.post(`/entries/en/${word}/favorite`);
    }

    async removeFavorite(word: string): Promise<void> {
        await api.delete(`/entries/en/${word}/favorite`);
    }
}