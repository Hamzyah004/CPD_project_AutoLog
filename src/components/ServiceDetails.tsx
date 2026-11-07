import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { ServiceLog } from '@/types';

type ServiceDetailsProps = {
  service: ServiceLog;
  onBack?: () => void;
};

export default function ServiceDetails({ service, onBack }: ServiceDetailsProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {
          backgroundColor: theme.background,
          paddingBottom: Spacing.lg + insets.bottom,
        },
      ]}
    >
      <View style={styles.maxWidthBox}>
        {onBack ? (
          <View style={styles.topBar}>
            <Pressable
              onPress={onBack}
              style={({ pressed }) => [
                styles.backButton,
                { backgroundColor: theme.secondaryBg, borderColor: theme.border },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.backText, { color: theme.text }]}>
                ← Back to Services Log
              </Text>
            </Pressable>
          </View>
        ) : null}

        <View style={[styles.photoWrapper, { backgroundColor: theme.photoBg }]}>
          <Image
            source={{ uri: service.photoUrl }}
            style={styles.photo}
            resizeMode="contain"
          />
          <Text
            style={[
              styles.badge,
              { backgroundColor: theme.primary, color: theme.onPrimary },
            ]}
          >
            {service.category}
          </Text>
        </View>

        <View style={styles.body}>
          <Text style={[styles.title, { color: theme.text }]}>{service.title}</Text>
          <Text style={[styles.car, { color: theme.primary }]}>{service.car}</Text>

          <View
            style={[
              styles.infoBox,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <View style={[styles.row, { borderBottomColor: theme.border }]}>
              <Text style={[styles.rowLabel, { color: theme.muted }]}>Service shop</Text>
              <Text style={[styles.rowValue, { color: theme.text }]}>{service.shop}</Text>
            </View>

            <View style={[styles.row, { borderBottomColor: theme.border }]}>
              <Text style={[styles.rowLabel, { color: theme.muted }]}>Date</Text>
              <Text style={[styles.rowValue, { color: theme.text }]}>{service.date}</Text>
            </View>

            <View style={[styles.row, { borderBottomColor: theme.border }]}>
              <Text style={[styles.rowLabel, { color: theme.muted }]}>Mileage</Text>
              <Text style={[styles.rowValue, { color: theme.text }]}>
                {service.mileageKm.toLocaleString()} km
              </Text>
            </View>

            <View style={[styles.row, { borderBottomColor: theme.border }]}>
              <Text style={[styles.rowLabel, { color: theme.muted }]}>Cost</Text>
              <Text style={[styles.rowValue, { color: theme.primary }]}>
                {service.costBam} KM
              </Text>
            </View>

            <View style={styles.rowLast}>
              <Text style={[styles.rowLabel, { color: theme.muted }]}>Category</Text>
              <Text style={[styles.rowValue, { color: theme.text }]}>
                {service.category}
              </Text>
            </View>
          </View>

          {service.notes ? (
            <View
              style={[
                styles.notesSection,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.notesHeading, { color: theme.text }]}>
                Service Notes
              </Text>
              <Text style={[styles.notes, { color: theme.muted }]}>
                {service.notes}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  maxWidthBox: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  topBar: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.6,
  },
  backText: {
    fontSize: FontSize.small,
    fontWeight: '600',
  },
  photoWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
    fontSize: FontSize.small,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  body: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  title: {
    fontSize: FontSize.hero,
    fontWeight: 'bold',
  },
  car: {
    fontSize: FontSize.body,
    fontWeight: '600',
  },
  infoBox: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
  },
  rowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.md,
  },
  rowLabel: {
    fontSize: FontSize.body,
  },
  rowValue: {
    fontSize: FontSize.body,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  notesSection: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  notesHeading: {
    fontSize: FontSize.body,
    fontWeight: 'bold',
  },
  notes: {
    fontSize: FontSize.body,
    lineHeight: 22,
  },
});
