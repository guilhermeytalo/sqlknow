export type SearchWord = Word[]

export interface Word {
  word: string
  phonetic: string
  phonetics: Phonetic[]
  meanings: Meaning[]
  license: License
  sourceUrls: string[]
}

export interface Phonetic {
  text: string
  audio: string
}

export interface Meaning {
  partOfSpeech: string
  definitions: Definition[]
}

export interface Definition {
  definitionText: any
  example?: string
}

export interface License {
  name: string
  url: string
}
