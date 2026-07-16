import AsyncStorage from '@react-native-async-storage/async-storage';

import type { DanceCategory, PracticeRecord } from '@/types/practice-record';

export const PRACTICE_RECORDS_STORAGE_KEY = 'practice-records';

const danceCategories: readonly DanceCategory[] = ['standard', 'latin'];

function isDanceCategory(value: unknown): value is DanceCategory {
  return typeof value === 'string' && danceCategories.includes(value as DanceCategory);
}

function normalizePracticeRecord(value: unknown): PracticeRecord | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const candidate = value as Record<string, unknown>;

  if (
    typeof candidate.id !== 'string' ||
    typeof candidate.date !== 'string' ||
    !isDanceCategory(candidate.category) ||
    typeof candidate.dance !== 'string' ||
    typeof candidate.content !== 'string' ||
    typeof candidate.improvement !== 'string'
  ) {
    return null;
  }

  return {
    id: candidate.id,
    date: candidate.date,
    category: candidate.category,
    dance: candidate.dance,
    content: candidate.content,
    improvement: candidate.improvement,
    isImprovementCompleted: candidate.isImprovementCompleted === true,
  };
}

function parsePracticeRecords(value: string): PracticeRecord[] {
  try {
    const parsed: unknown = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.reduce<PracticeRecord[]>((records, item) => {
      const normalizedRecord = normalizePracticeRecord(item);

      if (normalizedRecord !== null) {
        records.push(normalizedRecord);
      }

      return records;
    }, []);
  } catch {
    return [];
  }
}

export async function loadPracticeRecords(): Promise<PracticeRecord[]> {
  try {
    const savedRecords = await AsyncStorage.getItem(PRACTICE_RECORDS_STORAGE_KEY);

    if (savedRecords === null) {
      return [];
    }

    return parsePracticeRecords(savedRecords);
  } catch (error) {
    console.warn('Failed to load practice records.', error);
    return [];
  }
}

export async function savePracticeRecords(records: PracticeRecord[]): Promise<void> {
  try {
    await AsyncStorage.setItem(PRACTICE_RECORDS_STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.warn('Failed to save practice records.', error);
  }
}
