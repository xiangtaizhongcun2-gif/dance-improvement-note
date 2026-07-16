export type DanceCategory = 'standard' | 'latin';

export type PracticeRecord = {
  id: string;
  date: string;
  category: DanceCategory;
  dance: string;
  content: string;
  improvement: string;
  isImprovementCompleted: boolean;
};
