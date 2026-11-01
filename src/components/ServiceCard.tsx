import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { ServiceLog } from '@/types';

type ServiceCardProps = {
  service: ServiceLog;
  onSelect?: (service: ServiceLog) => void;
};

export default function ServiceCard({ service, onSelect }: ServiceCardProps) {
  return (
    <Pressable
      onPress={() => {
        console.log('Open', service.id);
        onSelect?.(service);
      }}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.imageBanner}>
        <Image
          source={{ uri: service.photoUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{service.title}</Text>
        <Text style={styles.details}>
          {service.date} · {service.shop}
        </Text>
        <Text style={styles.meta}>
          {service.mileageKm.toLocaleString()} km · {service.costBam} KM · {service.category}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E6EEF7',
  },
  pressed: {
    opacity: 0.6,
  },
  imageBanner: {
    backgroundColor: '#DAE4F0',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 90,
  },
  content: {
    padding: 12,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  details: {
    fontSize: 14,
    color: '#475569',
  },
  meta: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
});
