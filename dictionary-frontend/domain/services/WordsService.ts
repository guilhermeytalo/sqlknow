import { ApiResponse } from "@/domain/entities/ApiResponse";
import { Words } from "@/domain/entities/Words";
import { WordsRepository } from "@/infra/http/repositories/WordsRepository";

const repository = new WordsRepository();

export async function getWord(page = 1, limit = 50) {
  const response: ApiResponse<Words> = await repository.findAllWords(page, limit);

  if (!response.success || !response.data) {
    throw new Error('Failed to fetch words');
  }
  return response.data;
}
