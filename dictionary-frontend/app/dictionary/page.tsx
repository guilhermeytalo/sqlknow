'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WordDetails } from "@/components/WordDetails";
import { WordDetail } from '@/domain/entities/WordDetail';
import { Words } from '@/domain/entities/Words';
import { getWord } from '@/domain/services/WordsService';
import api from '@/infra/http/api';
import { WordsRepository } from '@/infra/http/repositories/WordsRepository';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from "sonner";

interface FavoriteResponse {
  results: Array<{ word: string }>;
}

export default function DictionaryPage() {
  const [words, setWords] = useState<Words | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordDetail, setWordDetail] = useState<WordDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  const fetchWords = async (pageNum = 1) => {
    const response = await getWord(pageNum, 50);
    setWords(prev => {
      if (!prev) return response;
      return {
        ...prev,
        results: [...prev.results, ...(response.results || [])]
      };
    });
    setHasMore(response.hasNext ?? false);
  };

  useEffect(() => {
    fetchWords(1);
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoadingFavorites(true);
      const response = await api.get<FavoriteResponse>('/user/me/favorites');
      setFavorites(response.data.results.map(f => f.word));
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Erro ao carregar favoritos');
    } finally {
      setLoadingFavorites(false);
    }
  };

  const toggleFavorite = async (word: string) => {
    try {
      if (favorites.includes(word)) {
        await api.delete(`/entries/en/${word}/favorite`);
        setFavorites(prev => prev.filter(w => w !== word));
        toast.success('Palavra removida dos favoritos');
      } else {
        await api.post(`/entries/en/${word}/favorite`);
        setFavorites(prev => [...prev, word]);
        toast.success('Palavra adicionada aos favoritos');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Erro ao atualizar favoritos');
    }
  };

  const fetchNext = async () => {
    const nextPage = page + 1;
    await fetchWords(nextPage);
    setPage(nextPage);
  };

  const playAudio = (wordDetail: WordDetail) => {
    const validAudio = wordDetail.phonetics?.find(p => p.audio)?.audio;
    if (validAudio) {
      const audio = new Audio(validAudio);
      audio.play().catch((err) => {
        console.error('Audio playback failed:', err);
      });
    } else {
      toast('Áudio não disponível para esta palavra.');
    }
  };

  const handleWordClick = async (word: string) => {
    setSelectedWord(word);
    setLoadingDetail(true);
    setWordDetail(null);
    try {
      const repo = new WordsRepository();
      const response = await repo.findWordByName(word);
      setWordDetail(response.data?.[0] || null);
    } finally {
      setLoadingDetail(false);
    }
  };

  const renderWordDetails = () => {
    return (
      <WordDetails
        wordDetail={wordDetail}
        loadingDetail={loadingDetail}
        selectedWord={selectedWord}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onPlayAudio={playAudio}
      />
    );
  };

  return (
    <div className="flex flex-col md:flex-row items-start justify-center p-4 gap-6">
      <Card className="w-full md:w-1/2 p-4 space-y-4">
        {renderWordDetails()}
      </Card>

      <Tabs defaultValue="wordlist">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="wordlist">Word List</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        <TabsContent value="wordlist">
          <Card>
            <CardContent className="space-y-2">
              <div
                id="scrollableWords"
                className="h-[300px] overflow-y-auto pr-2"
              >
                <InfiniteScroll
                  dataLength={words?.results?.length || 0}
                  next={fetchNext}
                  hasMore={hasMore}
                  loader={<h4 className="text-center py-2">Loading...</h4>}
                  scrollableTarget="scrollableWords"
                >
                  <div className="grid grid-cols-5 gap-2">
                    {words?.results?.map((word: string, idx: number) => (
                      <span
                        key={word + idx}
                        className={selectedWord === word ? 'font-bold underline cursor-pointer' : 'cursor-pointer'}
                        onClick={() => handleWordClick(word)}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </InfiniteScroll>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="favorites">
          <Card>
            <CardContent className="space-y-2">
              {loadingFavorites ? (
                <div className="text-center">Carregando favoritos...</div>
              ) : favorites.length === 0 ? (
                <div className="text-center text-gray-500">Nenhum favorito</div>
              ) : (
                <div className="grid grid-cols-5 gap-2">
                  {favorites.map((word) => (
                    <span
                      key={word}
                      className={selectedWord === word ? 'font-bold underline cursor-pointer' : 'cursor-pointer'}
                      onClick={() => handleWordClick(word)}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
