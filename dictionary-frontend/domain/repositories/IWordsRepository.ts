import { ApiResponse } from "@/domain/entities/ApiResponse";
import { Words } from "@/domain/entities/Words";
import { WordDetail } from "@/domain/entities/WordDetail";

export interface IWordsRepository {
    findAllWords(): Promise<ApiResponse<Words>>;
    findWordByName(name: string): Promise<ApiResponse<WordDetail[]>>;
}