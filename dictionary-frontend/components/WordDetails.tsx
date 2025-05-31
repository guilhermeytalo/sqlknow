import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { WordDetail } from "@/domain/entities/WordDetail";

interface WordDetailsProps {
    wordDetail: WordDetail | null;
    loadingDetail: boolean;
    selectedWord: string | null;
    favorites: string[];
    onToggleFavorite: (word: string) => void;
    onPlayAudio: (wordDetail: WordDetail) => void;
}

export function WordDetails({ 
    wordDetail, 
    loadingDetail, 
    selectedWord,
    favorites,
    onToggleFavorite,
    onPlayAudio
}: WordDetailsProps) {
    if (!selectedWord) return <div className="text-center text-gray-500">Selecione uma palavra para ver detalhes</div>;
    if (loadingDetail) return <div className="text-center">Carregando...</div>;
    if (!wordDetail) return <div className="text-center text-red-500">Detalhes não encontrados</div>;

    const validAudioUrl = wordDetail.phonetics?.find(p => p.audio)?.audio;
    const isFavorite = favorites.includes(wordDetail.word);

    return (
        <>
            <div className="bg-pink-200 p-4 text-center rounded">
                <div className="flex justify-between items-center">
                    <div className="flex-1">
                        <h2 className="text-xl font-bold">{wordDetail.word}</h2>
                        <p className="text-lg text-gray-600">{wordDetail.phonetic}</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onToggleFavorite(wordDetail.word)}
                        className={`hover:text-red-500 ${isFavorite ? 'text-red-500' : 'text-gray-500'}`}
                    >
                        <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
                    </Button>
                </div>
            </div>

            {validAudioUrl && (
                <div className="flex items-center space-x-2">
                    <Button
                        onClick={() => onPlayAudio(wordDetail)}
                        className="hover:text-grey-700"
                    >
                        ▶️ Ouvir
                    </Button>
                </div>
            )}

            <div>
                <p className="font-semibold">Meanings</p>
                {wordDetail.meanings.map((meaning, idx) => (
                    <div key={idx}>
                        <p>{meaning.partOfSpeech}</p>
                        <ul>
                            {meaning.definitions.map((def, j) => (
                                <li key={j}>
                                    {def.definitionText && <span>{def.definitionText}</span>}
                                    {def.example && <span> — <i>{def.example}</i></span>}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </>
    );
}
