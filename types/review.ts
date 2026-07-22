export interface Review {
  id: string;
  authorName: string;
  rating: number; // 1 à 5
  text: string;
  date: string; // ISO date
}
