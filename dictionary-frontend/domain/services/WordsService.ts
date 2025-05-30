import { ApiResponse } from "@/domain/entities/ApiResponse";
import { Words } from "@/domain/entities/Words";
import { WordsRepository } from "@/infra/http/repositories/WordsRepository";

const repository = new WordsRepository();

export async function getWord() {
  const response: ApiResponse<Words> = await repository.findAllWords();

  if (!response.success || !response.data) {
    throw new Error('Failed to fetch words');
  }
  return response.data;
}
