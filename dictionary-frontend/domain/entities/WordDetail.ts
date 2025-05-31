export interface Phonetic {
  text: string;
  audio: string;
}

export interface Definition {
  definitionText: string | null;
  example: string | null;
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

export interface WordDetail {
  word: string;
  phonetic: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
} 