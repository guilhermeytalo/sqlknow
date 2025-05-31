import { useEffect, useState } from "react";

export function useDictionaryWord(word: string) {
  const [entry, setEntry] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!word) return;

    setLoading(true);
    fetch(`/entries/en/${word}`)
      .then((res) => res.json())
      .then((data) => {
        setEntry(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [word]);

  return { entry, loading };
}
