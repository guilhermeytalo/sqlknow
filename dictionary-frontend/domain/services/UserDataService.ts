import { UserDataRepository } from "@/infra/http/repositories/UserDataRepository";

const repository = new UserDataRepository();

export async function getFavorites(page = 1, pageSize = 50): Promise<string[]> {
  return await repository.fetchFavorites(page, pageSize);
}

export async function getHistory(page = 1, pageSize = 50): Promise<{
  results: { word: string; viewedAt: string }[];
  hasNext: boolean;
}> {
  return await repository.fetchHistory(page, pageSize);
}

export async function toggleFavorite(word: string, isFavorite: boolean): Promise<void> {
  if (isFavorite) {
    await repository.removeFavorite(word);
  } else {
    await repository.addFavorite(word);
  }
}