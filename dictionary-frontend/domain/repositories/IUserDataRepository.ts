export interface IUserDataRepository {
  fetchFavorites(page?: number, pageSize?: number): Promise<string[]>;
  fetchHistory(page?: number, pageSize?: number): Promise<{
    results: { word: string; viewedAt: string }[];
    hasNext: boolean;
  }>;
  addFavorite(word: string): Promise<void>;
  removeFavorite(word: string): Promise<void>;
}
