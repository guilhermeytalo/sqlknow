import { ApiResponse } from "@/domain/entities/ApiResponse";
import { Words } from "@/domain/entities/Words";
import { WordsRepository } from "@/infra/http/repositories/WordsRepository";
import { WordDetail } from "@/domain/entities/WordDetail";

const repository = new WordsRepository();

export async function getWord(page = 1, limit = 50) {
  const response: ApiResponse<Words> = await repository.findAllWords(page, limit);

  if (!response.success || !response.data) {
    throw new Error('Failed to fetch words');
  }
  return response.data;
}

export async function getWordByName(word: string) {
  const response: ApiResponse<WordDetail[]> = await repository.findWordByName(word);

  if (!response.success || !response.data || response.data.length === 0) {
    throw new Error("Failed to fetch word details");
  }

  return response.data[0];
}