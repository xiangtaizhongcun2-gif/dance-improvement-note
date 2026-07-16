import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { loadPracticeRecords, savePracticeRecords } from '@/lib/practice-record-storage';
import type { DanceCategory, PracticeRecord } from '@/types/practice-record';

const categoryLabels: Record<DanceCategory, string> = {
  standard: 'スタンダード',
  latin: 'ラテン',
};

type ImprovementFilter = 'active' | 'completed';

const filterLabels: Record<ImprovementFilter, string> = {
  active: '取り組み中',
  completed: '改善済み',
};

export default function ImprovementsScreen() {
  const [records, setRecords] = useState<PracticeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<ImprovementFilter>('active');
  const [deleteTarget, setDeleteTarget] = useState<PracticeRecord | null>(null);

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

  const visibleRecords = useMemo(
    () => records.filter((record) => record.isImprovementCompleted === (selectedFilter === 'completed')),
    [records, selectedFilter],
  );

  const handleToggleCompleted = (targetRecord: PracticeRecord) => {
    setRecords((currentRecords) => {
      const nextRecords = currentRecords.map((record) =>
        record.id === targetRecord.id
          ? { ...record, isImprovementCompleted: !record.isImprovementCompleted }
          : record,
      );

      void savePracticeRecords(nextRecords);

      return nextRecords;
    });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget === null) {
      return;
    }

    const targetId = deleteTarget.id;

    setRecords((currentRecords) => {
      const nextRecords = currentRecords.filter((record) => record.id !== targetId);

      void savePracticeRecords(nextRecords);

      return nextRecords;
    });
    setDeleteTarget(null);
  };

  const emptyMessage = selectedFilter === 'active' ? '取り組み中の改善点はありません。' : '改善済みの改善点はありません。';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>改善点</Text>
        <Text style={styles.description}>保存した練習記録から、次回意識したい改善点を確認します。</Text>

        <View style={styles.filterRow}>
          {(['active', 'completed'] as const).map((filter) => {
            const isSelected = selectedFilter === filter;

            return (
              <Pressable
                accessibilityRole="button"
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                style={[styles.filterButton, isSelected && styles.filterButtonSelected]}
              >
                <Text style={[styles.filterButtonText, isSelected && styles.filterButtonTextSelected]}>
                  {filterLabels[filter]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {isLoading ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>保存済みの改善点を読み込んでいます。</Text>
          </View>
        ) : records.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>まだ改善点はありません。</Text>
            <Text style={styles.emptySubText}>練習記録を保存すると、ここに改善点が表示されます。</Text>
          </View>
        ) : visibleRecords.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>{emptyMessage}</Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {visibleRecords.map((record) => (
              <View key={record.id} style={styles.improvementCard}>
                <Text style={styles.improvementText}>{record.improvement}</Text>
                <View style={styles.metaContainer}>
                  <Text style={styles.dateText}>{record.date}</Text>
                  <View style={styles.badgeRow}>
                    <Text style={styles.badge}>{record.dance}</Text>
                    <Text style={styles.badge}>{categoryLabels[record.category]}</Text>
                  </View>
                </View>
                <View style={styles.actionRow}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => handleToggleCompleted(record)}
                    style={styles.secondaryButton}
                  >
                    <Text style={styles.secondaryButtonText}>
                      {record.isImprovementCompleted ? '取り組み中に戻す' : '改善済みにする'}
                    </Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => setDeleteTarget(record)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>完全削除</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal animationType="fade" transparent visible={deleteTarget !== null} onRequestClose={() => setDeleteTarget(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>改善点を完全削除しますか？</Text>
            <Text style={styles.modalImprovement}>{deleteTarget?.improvement}</Text>
            <Text style={styles.modalWarning}>元の練習記録も削除されます</Text>
            <Text style={styles.modalWarning}>この操作は取り消せません</Text>
            <View style={styles.modalActionRow}>
              <Pressable accessibilityRole="button" onPress={() => setDeleteTarget(null)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>キャンセル</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={handleConfirmDelete} style={styles.confirmDeleteButton}>
                <Text style={styles.confirmDeleteButtonText}>完全に削除する</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  filterRow: {
    borderColor: '#e5e7eb',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
    padding: 4,
  },
  filterButton: {
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
    paddingVertical: 10,
  },
  filterButtonSelected: {
    backgroundColor: '#111827',
  },
  filterButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '700',
  },
  filterButtonTextSelected: {
    color: '#ffffff',
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
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    flexGrow: 1,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  secondaryButtonText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },
  deleteButton: {
    alignItems: 'center',
    borderColor: '#dc2626',
    borderRadius: 12,
    borderWidth: 1,
    flexGrow: 1,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  deleteButtonText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '700',
  },
  modalBackdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    maxWidth: 420,
    padding: 22,
    width: '100%',
  },
  modalTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
  },
  modalImprovement: {
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
    borderRadius: 12,
    borderWidth: 1,
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    marginTop: 14,
    padding: 14,
  },
  modalWarning: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
    marginTop: 10,
  },
  modalActionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 18,
  },
  cancelButton: {
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    flexGrow: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '700',
  },
  confirmDeleteButton: {
    alignItems: 'center',
    backgroundColor: '#dc2626',
    borderRadius: 12,
    flexGrow: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  confirmDeleteButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
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
