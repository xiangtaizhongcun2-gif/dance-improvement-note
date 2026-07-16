import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { loadPracticeRecords } from '@/lib/practice-record-storage';
import type { DanceCategory, PracticeRecord } from '@/types/practice-record';

const categoryLabels: Record<DanceCategory, string> = {
  standard: 'スタンダード',
  latin: 'ラテン',
};

export default function ImprovementsScreen() {
  const [records, setRecords] = useState<PracticeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadSavedImprovements = async () => {
        setIsLoading(true);
        const savedRecords = await loadPracticeRecords();

        if (isActive) {
          setRecords(savedRecords);
          setIsLoading(false);
        }
      };

      void loadSavedImprovements();

      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>改善点</Text>
        <Text style={styles.description}>保存した練習記録から、次回意識したい改善点を確認します。</Text>

        {isLoading ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>保存済みの改善点を読み込んでいます。</Text>
          </View>
        ) : records.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>まだ改善点はありません。</Text>
            <Text style={styles.emptySubText}>練習記録を保存すると、ここに改善点が表示されます。</Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {records.map((record) => (
              <View key={record.id} style={styles.improvementCard}>
                <Text style={styles.improvementText}>{record.improvement}</Text>
                <View style={styles.metaContainer}>
                  <Text style={styles.dateText}>{record.date}</Text>
                  <View style={styles.badgeRow}>
                    <Text style={styles.badge}>{record.dance}</Text>
                    <Text style={styles.badge}>{categoryLabels[record.category]}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  title: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '700',
  },
  description: {
    color: '#6b7280',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 24,
    padding: 24,
  },
  emptyText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubText: {
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    textAlign: 'center',
  },
  listContainer: {
    gap: 14,
    marginTop: 24,
  },
  improvementCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    shadowColor: '#000000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  improvementText: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 25,
  },
  metaContainer: {
    gap: 10,
    marginTop: 14,
  },
  dateText: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '600',
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
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});
