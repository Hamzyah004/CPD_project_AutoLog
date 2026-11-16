import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { ServiceLog } from '@/types';

type ServiceCardProps = {
  service: ServiceLog;
  onSelect?: (service: ServiceLog) => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function ServiceCard({
  service,
  onSelect,
  onLongPress,
  style,
}: ServiceCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => {
        console.log('Open', service.id);
        onSelect?.(service);
      }}
      onLongPress={onLongPress}
      accessibilityRole="button"
      accessibilityLabel={`${service.title}, ${service.shop}, ${service.mileageKm} km, ${service.costBam} KM, ${service.category}`}
      accessibilityHint="Long press to delete"
      android_ripple={{ color: theme.border }}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={[styles.photoContainer, { backgroundColor: theme.photoBg }]}>
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

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>{service.title}</Text>
        <Text style={[styles.details, { color: theme.muted }]}>
          {service.date} · {service.shop}
        </Text>
        <Text style={[styles.meta, { color: theme.primary }]}>
          {service.mileageKm.toLocaleString()} km · {service.costBam} KM
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.6,
  },
  photoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    padding: Spacing.md,
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
  content: {
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  title: {
    fontSize: FontSize.body,
    fontWeight: 'bold',
  },
  details: {
    fontSize: FontSize.small,
  },
  meta: {
    fontSize: FontSize.small,
    fontWeight: '600',
  },
});
