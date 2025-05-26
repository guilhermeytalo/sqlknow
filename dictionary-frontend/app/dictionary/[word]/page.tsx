'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '../../../lib/api';

export default function WordDetailPage() {
  const { word } = useParams();
  const [definition, setDefinition] = useState<any>(null);

  useEffect(() => {
    api.get(`/entries/en/${word}`).then(res => setDefinition(res.data[0]));
  }, [word]);

  if (!definition) return <p>Carregando...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-3xl mb-2">{definition.word}</h1>
      <p className="italic">{definition.phonetic}</p>
      <button
        onClick={() => api.post(`/entries/en/${word}/favorite`)}
        className="mt-4 bg-yellow-400 p-2 rounded"
      >Favoritar</button>
    </div>
  );
}