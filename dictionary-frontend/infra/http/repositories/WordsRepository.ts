import { ApiResponse } from "@/domain/entities/ApiResponse";
import { Words } from "@/domain/entities/Words";
import { IWordsRepository } from "@/domain/repositories/IWordsRepository";
import api from "@/infra/http/api";


export class WordsRepository implements IWordsRepository {
    async findAllWords(): Promise<ApiResponse<Words>> {
        try {
            const response = await api.get('/entries/en');
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error fetching words:', error);
            throw error;
        }
    }

    async findWordByName(word: string): Promise<ApiResponse<Words>> {
        try {
            const data = await api.get<ApiResponse<Words>>(`/entries/en/${word}`);
            return data.data;
        } catch (error) {
            console.error('Error fetching word by ID:', error);
            throw error;
        }
    }
}