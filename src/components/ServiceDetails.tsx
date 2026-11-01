import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ServiceLog } from '@/types';

type ServiceDetailsProps = {
  service: ServiceLog;
  onBack?: () => void;
};

export default function ServiceDetails({ service, onBack }: ServiceDetailsProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {onBack ? (
        <View style={styles.topBar}>
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <Text style={styles.backText}>← Back to Services Log</Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.imageBanner}>
        <Image
          source={{ uri: service.photoUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{service.title}</Text>
        <Text style={styles.car}>{service.car}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.row}>Service shop: {service.shop}</Text>
          <Text style={styles.row}>Date: {service.date}</Text>
          <Text style={styles.row}>Mileage: {service.mileageKm.toLocaleString()} km</Text>
          <Text style={styles.row}>Cost: {service.costBam} KM</Text>
          <Text style={styles.row}>Category: {service.category}</Text>
        </View>

        {service.notes ? (
          <View style={styles.notesSection}>
            <Text style={styles.notesHeading}>Service Notes</Text>
            <Text style={styles.notes}>{service.notes}</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  pressed: {
    opacity: 0.6,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  imageBanner: {
    backgroundColor: '#DAE4F0',
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 130,
  },
  body: {
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  car: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
  },
  infoBox: {
    backgroundColor: '#E6EEF7',
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  row: {
    fontSize: 15,
    color: '#1E293B',
  },
  notesSection: {
    marginTop: 4,
    gap: 6,
  },
  notesHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  notes: {
    fontSize: 15,
    lineHeight: 22,
    color: '#334155',
  },
});
