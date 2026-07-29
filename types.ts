export type CategoryType = 
  | 'Характер и ум'
  | 'Внешность и размер'
  | 'Эмоции и состояние'
  | 'Качество и оценка'
  | 'Цвета и ощущения'
  | 'Время и скорость'
  | 'Погода и природа';

export interface Adjective {
  id: string;
  russian: string; // Мужской род ед.ч. на русском (например: "высокий")
  russianFeminine?: string; // "высокая"
  russianPlural?: string; // "высокие"
  
  spanishMasculine: string; // "alto"
  spanishFeminine: string; // "alta"
  spanishPluralMasculine: string; // "altos"
  spanishPluralFeminine: string; // "altas"
  
  category: CategoryType;
  difficulty: 'easy' | 'medium' | 'hard';
  
  antonymId?: string; // ID противоположного слова (например, "bajo")
  
  exampleEs: string; // "El chico es alto y simpático."
  exampleRu: string; // "Мальчик высокий и симпатичный."
  
  ruleNote?: string; // Особенность рода/формы (например, "-e не меняет род")
}

export type MasteryStatus = 'new' | 'learning' | 'mastered';

export interface WordProgress {
  wordId: string;
  status: MasteryStatus;
  correctCount: number;
  incorrectCount: number;
  lastReviewed?: number; // timestamp
  isFavorite?: boolean;
}

export type ActiveTab = 'flashcards' | 'games' | 'dictionary' | 'grammar';

export type GameMode = 'quiz' | 'matching' | 'agreement' | 'antonyms' | 'spelling';

export interface UserStats {
  streak: number;
  lastActiveDate: string;
  totalAnswered: number;
  correctAnswered: number;
}
