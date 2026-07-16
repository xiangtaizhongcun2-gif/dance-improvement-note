import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { loadPracticeRecords } from '@/lib/practice-record-storage';
import type { DanceCategory, PracticeRecord } from '@/types/practice-record';

const categoryLabels: Record<DanceCategory, string> = {
  standard: 'スタンダード',
  latin: 'ラテン',
};

export default function HomeScreen() {
  const [nextActiveImprovement, setNextActiveImprovement] = useState<PracticeRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadNextActiveImprovement = async () => {
        setIsLoading(true);
        const savedRecords = await loadPracticeRecords();
        const activeImprovement = savedRecords.find((record) => record.isImprovementCompleted === false) ?? null;

        if (isActive) {
          setNextActiveImprovement(activeImprovement);
          setIsLoading(false);
        }
      };

      void loadNextActiveImprovement();

      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.appName}>Dance Improvement Note</Text>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>次回意識すること</Text>
          {isLoading ? (
            <Text style={styles.emptyDescription}>保存済みの改善点を読み込んでいます。</Text>
          ) : nextActiveImprovement === null ? (
            <View>
              <Text style={styles.emptyTitle}>取り組み中の改善点はありません</Text>
              <Text style={styles.emptyDescription}>
                練習記録を追加するか、改善済み項目を取り組み中へ戻すとここに表示されます。
              </Text>
            </View>
          ) : (
            <View>
              <Text style={styles.improvementText}>{nextActiveImprovement.improvement}</Text>
              <View style={styles.metaContainer}>
                <Text style={styles.dateText}>{nextActiveImprovement.date}</Text>
                <View style={styles.badgeRow}>
                  <Text style={styles.badge}>{nextActiveImprovement.dance}</Text>
                  <Text style={styles.badge}>{categoryLabels[nextActiveImprovement.category]}</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  appName: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 36,
    marginBottom: 28,
  },
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 18,
    borderWidth: 1,
    padding: 22,
  },
  sectionLabel: {
    color: '#374151',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
    marginBottom: 18,
  },
  emptyTitle: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 25,
    marginBottom: 8,
  },
  emptyDescription: {
    color: '#6b7280',
    fontSize: 15,
    lineHeight: 23,
  },
  improvementText: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 27,
  },
  metaContainer: {
    gap: 12,
    marginTop: 18,
  },
  dateText: {
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    backgroundColor: '#f3f4f6',
    borderRadius: 999,
    color: '#374151',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
