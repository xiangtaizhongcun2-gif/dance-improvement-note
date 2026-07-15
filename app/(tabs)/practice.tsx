import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type DanceCategory = 'standard' | 'latin';

type PracticeRecord = {
  id: string;
  date: string;
  category: DanceCategory;
  dance: string;
  content: string;
  improvement: string;
};

const categoryLabels: Record<DanceCategory, string> = {
  standard: 'スタンダード',
  latin: 'ラテン',
};

const dancesByCategory: Record<DanceCategory, string[]> = {
  standard: ['ワルツ', 'タンゴ', 'スローフォックストロット', 'クイックステップ', 'ヴェニーズワルツ'],
  latin: ['チャチャチャ', 'サンバ', 'ルンバ', 'パソドブレ', 'ジャイブ'],
};

function getTodayText(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default function PracticeScreen() {
  const [date, setDate] = useState(getTodayText);
  const [category, setCategory] = useState<DanceCategory>('standard');
  const [dance, setDance] = useState('');
  const [content, setContent] = useState('');
  const [improvement, setImprovement] = useState('');
  const [records, setRecords] = useState<PracticeRecord[]>([]);

  const selectableDances = dancesByCategory[category];
  const isSaveDisabled = useMemo(
    () => date.trim().length === 0 || dance.length === 0 || improvement.trim().length === 0,
    [date, dance, improvement],
  );

  const handleSelectCategory = (nextCategory: DanceCategory) => {
    setCategory(nextCategory);
    setDance('');
  };

  const handleSave = () => {
    if (isSaveDisabled) {
      return;
    }

    const newRecord: PracticeRecord = {
      id: `${Date.now()}-${records.length}`,
      date: date.trim(),
      category,
      dance,
      content: content.trim(),
      improvement: improvement.trim(),
    };

    setRecords((currentRecords) => [newRecord, ...currentRecords]);
    setDate(getTodayText());
    setCategory('standard');
    setDance('');
    setContent('');
    setImprovement('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>練習記録</Text>
          <Text style={styles.description}>今日の練習内容と次回に向けた改善点を記録します。</Text>

          <View style={styles.card}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>練習日 *</Text>
              <TextInput
                autoCapitalize="none"
                inputMode="numeric"
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9ca3af"
                style={styles.input}
                value={date}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>区分</Text>
              <View style={styles.optionRow}>
                {(['standard', 'latin'] as const).map((item) => {
                  const isSelected = category === item;

                  return (
                    <Pressable
                      accessibilityRole="button"
                      key={item}
                      onPress={() => handleSelectCategory(item)}
                      style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
                    >
                      <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                        {categoryLabels[item]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>種目 *</Text>
              <View style={styles.chipContainer}>
                {selectableDances.map((item) => {
                  const isSelected = dance === item;

                  return (
                    <Pressable
                      accessibilityRole="button"
                      key={item}
                      onPress={() => setDance(item)}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{item}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>練習内容</Text>
              <TextInput
                multiline
                onChangeText={setContent}
                placeholder="練習したステップや意識したこと"
                placeholderTextColor="#9ca3af"
                style={[styles.input, styles.textArea]}
                textAlignVertical="top"
                value={content}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>改善点 *</Text>
              <TextInput
                multiline
                onChangeText={setImprovement}
                placeholder="次回改善したいこと"
                placeholderTextColor="#9ca3af"
                style={[styles.input, styles.textArea]}
                textAlignVertical="top"
                value={improvement}
              />
            </View>

            <Pressable
              accessibilityRole="button"
              disabled={isSaveDisabled}
              onPress={handleSave}
              style={[styles.saveButton, isSaveDisabled && styles.saveButtonDisabled]}
            >
              <Text style={[styles.saveButtonText, isSaveDisabled && styles.saveButtonTextDisabled]}>
                保存する
              </Text>
            </Pressable>
          </View>

          <View style={styles.recordsSection}>
            <Text style={styles.sectionTitle}>保存した練習記録</Text>
            {records.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>まだ練習記録はありません。</Text>
              </View>
            ) : (
              records.map((record) => (
                <View key={record.id} style={styles.recordCard}>
                  <View style={styles.recordHeader}>
                    <Text style={styles.recordDate}>{record.date}</Text>
                    <Text style={styles.recordCategory}>{categoryLabels[record.category]}</Text>
                  </View>
                  <Text style={styles.recordDance}>{record.dance}</Text>
                  {record.content.length > 0 ? (
                    <Text style={styles.recordBody}>練習内容：{record.content}</Text>
                  ) : null}
                  <Text style={styles.recordBody}>改善点：{record.improvement}</Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardAvoidingView: {
    flex: 1,
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
    letterSpacing: -0.5,
    lineHeight: 36,
    marginBottom: 8,
  },
  description: {
    color: '#6b7280',
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 22,
  },
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 12,
    borderWidth: 1,
    color: '#111827',
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  textArea: {
    minHeight: 104,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  optionButton: {
    alignItems: 'center',
    borderColor: '#e5e7eb',
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 12,
  },
  optionButtonSelected: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  optionText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '700',
  },
  optionTextSelected: {
    color: '#ffffff',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderColor: '#e5e7eb',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  chipSelected: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  chipText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#ffffff',
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 14,
    paddingVertical: 15,
  },
  saveButtonDisabled: {
    backgroundColor: '#f3f4f6',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  saveButtonTextDisabled: {
    color: '#9ca3af',
  },
  recordsSection: {
    marginTop: 28,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
    marginBottom: 12,
  },
  emptyCard: {
    borderColor: '#e5e7eb',
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 15,
    lineHeight: 23,
  },
  recordCard: {
    borderColor: '#e5e7eb',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  recordHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recordDate: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '600',
  },
  recordCategory: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '600',
  },
  recordDance: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 25,
    marginBottom: 8,
  },
  recordBody: {
    color: '#374151',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 4,
  },
});
