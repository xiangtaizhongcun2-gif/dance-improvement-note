import AsyncStorage from '@react-native-async-storage/async-storage';

import type { DanceCategory, PracticeRecord } from '@/types/practice-record';

export const PRACTICE_RECORDS_STORAGE_KEY = 'practice-records';

const danceCategories: readonly DanceCategory[] = ['standard', 'latin'];

function isDanceCategory(value: unknown): value is DanceCategory {
  return typeof value === 'string' && danceCategories.includes(value as DanceCategory);
}

function isPracticeRecord(value: unknown): value is PracticeRecord {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.date === 'string' &&
    isDanceCategory(candidate.category) &&
    typeof candidate.dance === 'string' &&
    typeof candidate.content === 'string' &&
    typeof candidate.improvement === 'string'
  );
}

function parsePracticeRecords(value: string): PracticeRecord[] {
  try {
    const parsed: unknown = JSON.parse(value);

    if (!Array.isArray(parsed) || !parsed.every(isPracticeRecord)) {
      return [];
    }

    return parsed;
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
