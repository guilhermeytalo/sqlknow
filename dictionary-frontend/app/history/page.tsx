'use client';
import { useEffect, useState } from 'react';
import api from '../../infra/http/api';

export default function HistoryPage() {
  const [history, setHistory] = useState<{ word: string; viewedAt: string }[]>([]);

  useEffect(() => {
    api.get('/user/me/history').then(res => setHistory(res.data));
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-2xl mb-4">Histórico</h1>
      <ul className="list-disc pl-5">
        {history.map(h => (
          <li key={h.viewedAt}>{h.word} - {new Date(h.viewedAt).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
}