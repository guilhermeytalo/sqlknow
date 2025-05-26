'use client';
import { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    api.get('/user/me/favorites').then(res => setFavorites(res.data.results.map((f: any) => f.word)));
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-2xl mb-4">Favoritos</h1>
      <ul className="list-disc pl-5">
        {favorites.map(word => <li key={word}>{word}</li>)}
      </ul>
    </div>
  );
}