import { ApiResponse } from "@/domain/entities/ApiResponse";
import { Words } from "@/domain/entities/Words";
import { WordDetail } from "@/domain/entities/WordDetail";
import { IWordsRepository } from "@/domain/repositories/IWordsRepository";
import api from "@/infra/http/api";


export class WordsRepository implements IWordsRepository {
    async findAllWords(page = 1, limit = 50): Promise<ApiResponse<Words>> {
        try {
            const response = await api.get(`/entries/en?page=${page}&limit=${limit}`);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error fetching words:', error);
            throw error;
        }
    }

    async findWordByName(word: string): Promise<ApiResponse<WordDetail[]>> {
        try {
            const response = await api.get(`/entries/en/${word}`);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error fetching word by name:', error);
            throw error;
        }
    }
}