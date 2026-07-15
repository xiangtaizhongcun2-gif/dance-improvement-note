import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.appName}>Dance Improvement Note</Text>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>次回意識すること</Text>
          <Text style={styles.emptyTitle}>まだ改善点が登録されていません</Text>
          <Text style={styles.emptyDescription}>
            練習記録を追加すると、ここに改善点が表示されます
          </Text>
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
});
