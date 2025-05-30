'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Words } from '@/domain/entities/Words';
import { getWord } from '@/domain/services/WordsService';
import api from '@/infra/http/api';
import { chunkArray } from '@/types/ word';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';

export default function DictionaryPage() {
  const [words, setWords] = useState<Words | null>(null);
  const [favoriteWords, setFavoriteWords] = useState<string[]>([]);

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/user/me/favorites').then(res => res.data);
      setFavoriteWords(response.data.results);
    } catch (error) {
      console.error('Error fetching favorite words:', error);
    }
  };

  const fetchWords = async () => {
    const response = await getWord()
    setWords(response);
  }

  useEffect(() => {
    fetchFavorites();
    fetchWords();
  }, []);

  const rows = chunkArray(words?.results || [], 5)
  const favoriteRows = chunkArray(favoriteWords, 5);

  return (
    <div>
      <Tabs defaultValue="wordlist" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="wordlist">Word List</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        <TabsContent value="wordlist">
          <Card>
            <CardContent className="space-y-2">
              <div>
                {rows.map((row, rowIndex) => (
                  <div key={rowIndex}>
                    <div className="flex h-5 items-center space-x-4 text-sm">
                      {row.map((word, i) => (
                        <Fragment key={word}>
                          <Link href={`/dictionary/${word}`}>{word}</Link>
                          {i < row.length - 1 && (
                            <Separator orientation="vertical" />
                          )}
                        </Fragment>
                      ))}
                    </div>
                    {rowIndex < rows.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="favorites">
          <Card>
            <CardContent className="space-y-2">
              <div>
                {favoriteRows.map((favorite, favoriteRowIndex) => (
                  <div key={favoriteRowIndex}>
                    <div className="flex h-5 items-center space-x-4 text-sm">
                      {favorite.map((word, i) => (
                        <Fragment key={word}>
                          <Link href={`/dictionary/${word}`}>{word}</Link>
                          {i < favorite.length - 1 && (
                            <Separator orientation="vertical" />
                          )}
                        </Fragment>
                      ))}
                    </div>
                    {favoriteRowIndex < favoriteRows.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
