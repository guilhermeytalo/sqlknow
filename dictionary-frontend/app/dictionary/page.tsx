'use client';
import { useEffect, useState } from 'react';
import api from '../../lib/api';
import Link from 'next/link';

export default function DictionaryPage() {
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    api.get('/entries/en').then(res => setWords(res.data.results));
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-2xl mb-4">Dicionário</h1>
      <ul className="list-disc pl-5">
        {words.map(word => (
          <li key={word}>
            <Link href={`/dictionary/${word}`}>{word}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
