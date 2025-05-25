'use client';
import { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function DictionaryPage() {
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    api.get('/entries/en').then(res => setWords(res.data.results));
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl mb-4">Palavras</h1>
      <ul className="list-disc pl-5">
        {words.map(word => (
          <li key={word}>{word}</li>
        ))}
      </ul>
    </div>
  );
}