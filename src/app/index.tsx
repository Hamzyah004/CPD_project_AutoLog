import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import ServiceCard from '@/components/ServiceCard';
import ServiceDetails from '@/components/ServiceDetails';
import { cars, services } from '@/data/services';
import type { Car, ServiceLog } from '@/types';

type ScreenName =
  | 'auth'
  | 'select-car'
  | 'add-car'
  | 'home'
  | 'add-service'
  | 'settings';

type BottomTab = 'services' | 'car-info' | 'summary';

export default function HomeScreen() {
  const [screen, setScreen] = useState<ScreenName>('auth');
  const [previousScreen, setPreviousScreen] = useState<ScreenName>('select-car');
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car>(cars[0]);
  const [activeTab, setActiveTab] = useState<BottomTab>('services');
  const [selectedService, setSelectedService] = useState<ServiceLog | null>(null);

  // Filter services for the selected car (ordered oldest to newest in mock data)
  const carServices = services.filter((item) => item.carId === selectedCar.id);
  const totalExpenses = carServices.reduce((sum, item) => sum + item.costBam, 0);

  // 1. LOGIN / REGISTER SCREEN
  if (screen === 'auth') {
    return (
      <ScrollView contentContainerStyle={styles.authContainer}>
        <View style={styles.authHeader}>
          <Image
            source={require('@/assets/AutoLog_logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.cardBox}>
          <Text style={styles.sectionTitle}>
            {isRegistering ? 'Create New Account' : 'Welcome Back'}
          </Text>

          {isRegistering ? (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                placeholder="Hamza Hodžić"
                style={styles.input}
                placeholderTextColor="#94A3B8"
              />
            </View>
          ) : null}

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="••••••••"
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#94A3B8"
            />
          </View>

          <Pressable
            onPress={() => setScreen('select-car')}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          >
            <Text style={styles.primaryButtonText}>
              {isRegistering ? 'Register & Continue' : 'Sign In'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setIsRegistering(!isRegistering)}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
          >
            <Text style={styles.secondaryButtonText}>
              {isRegistering
                ? 'Already have an account? Sign In'
                : 'New user? Create an Account'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  // 2. CHOOSE CAR SCREEN (OR ADD NEW CAR)
  if (screen === 'select-car') {
    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.rowBetween}>
          <View style={styles.headerTextCol}>
            <Text style={styles.pageTitle}>Select Your Car</Text>
            <Text style={styles.subtitleText}>
              Choose a previously added vehicle or add a new one
            </Text>
          </View>
          <Pressable
            onPress={() => {
              setPreviousScreen('select-car');
              setScreen('settings');
            }}
            style={({ pressed }) => [styles.smallButton, pressed && styles.pressed]}
          >
            <Text style={styles.smallButtonText}>Settings</Text>
          </Pressable>
        </View>

        {cars.map((car) => (
          <Pressable
            key={car.id}
            onPress={() => {
              setSelectedCar(car);
              setSelectedService(null);
              setActiveTab('services');
              setScreen('home');
            }}
            style={({ pressed }) => [styles.carCard, pressed && styles.pressed]}
          >
            <View style={styles.carImageBanner}>
              <Image
                source={{ uri: car.photoUrl }}
                style={styles.carImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.carCardBody}>
              <Text style={styles.carCardTitle}>
                {car.year} {car.make} {car.model}
              </Text>
              <Text style={styles.carCardDetails}>{car.engine}</Text>
              <Text style={styles.carCardMeta}>
                Plate: {car.licensePlate} · {car.currentMileageKm.toLocaleString()} km
              </Text>
            </View>
          </Pressable>
        ))}

        <Pressable
          onPress={() => setScreen('add-car')}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
        >
          <Text style={styles.primaryButtonText}>+ Add New Car</Text>
        </Pressable>
      </ScrollView>
    );
  }

  // 3. ADD NEW CAR SCREEN (STATIC PREVIEW)
  if (screen === 'add-car') {
    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable
          onPress={() => setScreen('select-car')}
          style={({ pressed }) => [styles.smallButton, pressed && styles.pressed]}
        >
          <Text style={styles.smallButtonText}>← Back to My Cars</Text>
        </Pressable>

        <Text style={styles.pageTitle}>Add a New Car</Text>

        <View style={styles.cardBox}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Make & Model</Text>
            <TextInput
              placeholder="e.g. Škoda Octavia 2.0 TDI"
              style={styles.input}
              placeholderTextColor="#94A3B8"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Year</Text>
            <TextInput
              placeholder="e.g. 2020"
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor="#94A3B8"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>VIN Number</Text>
            <TextInput
              placeholder="e.g. TMBJJ7NE0L0123456"
              autoCapitalize="characters"
              style={styles.input}
              placeholderTextColor="#94A3B8"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Current Mileage (km)</Text>
            <TextInput
              placeholder="e.g. 95000"
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor="#94A3B8"
            />
          </View>

          <Pressable
            onPress={() => setScreen('select-car')}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          >
            <Text style={styles.primaryButtonText}>Save Car</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  // 4. ADD SERVICE SCREEN (STATIC PREVIEW WITH MEDIA / RECEIPT CAMERA OPTION)
  if (screen === 'add-service') {
    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable
          onPress={() => setScreen('home')}
          style={({ pressed }) => [styles.smallButton, pressed && styles.pressed]}
        >
          <Text style={styles.smallButtonText}>← Back to Services Log</Text>
        </Pressable>

        <Text style={styles.pageTitle}>Add Service Record</Text>
        <Text style={styles.subtitleText}>
          Vehicle: {selectedCar.year} {selectedCar.make} {selectedCar.model}
        </Text>

        <View style={styles.cardBox}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Service Title</Text>
            <TextInput
              placeholder="e.g. Small Service – Oil & Filters"
              style={styles.input}
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Service Shop</Text>
            <TextInput
              placeholder="e.g. AC Quattro Sarajevo"
              style={styles.input}
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Mileage (km)</Text>
            <TextInput
              placeholder="e.g. 125500"
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Cost (KM)</Text>
            <TextInput
              placeholder="e.g. 250"
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              placeholder="Parts replaced, oil brand, warranty notes..."
              multiline
              style={[styles.input, styles.textArea]}
              placeholderTextColor="#94A3B8"
            />
          </View>

          <Pressable
            onPress={() => console.log('Open phone camera for receipt media')}
            style={({ pressed }) => [styles.mediaButton, pressed && styles.pressed]}
          >
            <Text style={styles.mediaButtonText}>
              📷 Add Receipt / Media (Phone Camera - Optional)
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setScreen('home')}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          >
            <Text style={styles.primaryButtonText}>Save Service Entry</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  // 5. SETTINGS SCREEN
  if (screen === 'settings') {
    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable
          onPress={() => setScreen(previousScreen)}
          style={({ pressed }) => [styles.smallButton, pressed && styles.pressed]}
        >
          <Text style={styles.smallButtonText}>
            {previousScreen === 'select-car' ? '← Back to My Cars' : '← Back'}
          </Text>
        </Pressable>

        <Text style={styles.pageTitle}>App Settings</Text>

        <View style={styles.cardBox}>
          <Text style={styles.infoLine}>Currency: BAM (KM)</Text>
          <Text style={styles.infoLine}>Distance Unit: Kilometers (km)</Text>
          <Text style={styles.infoLine}>Service Sort Order: Oldest to Newest</Text>
          <Text style={styles.infoLine}>Service Reminders: Enabled</Text>
        </View>

        <Pressable
          onPress={() => setScreen('select-car')}
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
        >
          <Text style={styles.secondaryButtonText}>Switch Selected Car</Text>
        </Pressable>

        <Pressable
          onPress={() => setScreen('auth')}
          style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}
        >
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </Pressable>
      </ScrollView>
    );
  }

  // 6. MAIN HOME SCREEN WITH SELECTED CAR + 3 BOTTOM NAVIGATION TABS
  return (
    <View style={styles.homeWrapper}>
      {/* Top Selected Car Banner */}
      <View style={styles.selectedCarBanner}>
        <View style={styles.bannerTextContainer}>
          <Text style={styles.bannerLabel}>Selected Vehicle</Text>
          <Text style={styles.bannerCarName}>
            {selectedCar.year} {selectedCar.make} {selectedCar.model}
          </Text>
        </View>
        <View style={styles.bannerActions}>
          <Pressable
            onPress={() => setScreen('select-car')}
            style={({ pressed }) => [styles.bannerBtn, pressed && styles.pressed]}
          >
            <Text style={styles.bannerBtnText}>Cars</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setPreviousScreen('home');
              setScreen('settings');
            }}
            style={({ pressed }) => [styles.bannerBtn, pressed && styles.pressed]}
          >
            <Text style={styles.bannerBtnText}>Settings</Text>
          </Pressable>
        </View>
      </View>

      {/* Main Content Area based on active Bottom Tab */}
      <View style={styles.mainArea}>
        {activeTab === 'services' &&
          (selectedService ? (
            <ServiceDetails
              service={selectedService}
              onBack={() => setSelectedService(null)}
            />
          ) : (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.rowBetween}>
                <View style={styles.headerTextCol}>
                  <Text style={styles.pageTitle}>Services Log</Text>
                  <Text style={styles.count}>
                    {carServices.length} services (Oldest → Newest)
                  </Text>
                </View>
                <Pressable
                  onPress={() => setScreen('add-service')}
                  style={({ pressed }) => [styles.addServiceBtn, pressed && styles.pressed]}
                >
                  <Text style={styles.addServiceBtnText}>+ Add Service</Text>
                </Pressable>
              </View>

              {carServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onSelect={(item) => setSelectedService(item)}
                />
              ))}
            </ScrollView>
          ))}

        {activeTab === 'car-info' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.pageTitle}>Car Information</Text>
            <View style={styles.carDetailBanner}>
              <Image
                source={{ uri: selectedCar.photoUrl }}
                style={styles.carDetailImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.cardBox}>
              <Text style={styles.infoLine}>Make: {selectedCar.make}</Text>
              <Text style={styles.infoLine}>Model: {selectedCar.model}</Text>
              <Text style={styles.infoLine}>Year: {selectedCar.year}</Text>
              <Text style={styles.infoLine}>Engine: {selectedCar.engine}</Text>
              <Text style={styles.infoLine}>VIN: {selectedCar.vin}</Text>
              <Text style={styles.infoLine}>License Plate: {selectedCar.licensePlate}</Text>
              <Text style={styles.infoLine}>
                Current Mileage: {selectedCar.currentMileageKm.toLocaleString()} km
              </Text>
            </View>
          </ScrollView>
        )}

        {activeTab === 'summary' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.pageTitle}>Expense Summary</Text>
            <Text style={styles.subtitleText}>
              {selectedCar.year} {selectedCar.make} {selectedCar.model}
            </Text>

            <View style={styles.summaryHighlight}>
              <Text style={styles.summaryHighlightLabel}>Total Maintenance Expenses</Text>
              <Text style={styles.summaryHighlightValue}>{totalExpenses} KM</Text>
            </View>

            <View style={styles.cardBox}>
              <Text style={styles.sectionTitle}>Overview</Text>
              <Text style={styles.infoLine}>Total Services Logged: {carServices.length}</Text>
              <Text style={styles.infoLine}>
                Average Cost per Service:{' '}
                {carServices.length > 0 ? Math.round(totalExpenses / carServices.length) : 0} KM
              </Text>
              <Text style={styles.infoLine}>
                First Logged Mileage:{' '}
                {carServices[0]?.mileageKm.toLocaleString() ?? '-'} km
              </Text>
              <Text style={styles.infoLine}>
                Latest Logged Mileage:{' '}
                {carServices[carServices.length - 1]?.mileageKm.toLocaleString() ?? '-'} km
              </Text>
            </View>
          </ScrollView>
        )}
      </View>

      {/* Bottom Navigation Bar with 3 Buttons */}
      <View style={styles.bottomNav}>
        <Pressable
          onPress={() => {
            setSelectedService(null);
            setActiveTab('services');
          }}
          style={[
            styles.navButton,
            activeTab === 'services' && styles.navButtonActive,
          ]}
        >
          <Text
            style={[
              styles.navButtonText,
              activeTab === 'services' && styles.navButtonTextActive,
            ]}
          >
            Services Log
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('car-info')}
          style={[
            styles.navButton,
            activeTab === 'car-info' && styles.navButtonActive,
          ]}
        >
          <Text
            style={[
              styles.navButtonText,
              activeTab === 'car-info' && styles.navButtonTextActive,
            ]}
          >
            Car Info
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('summary')}
          style={[
            styles.navButton,
            activeTab === 'summary' && styles.navButtonActive,
          ]}
        >
          <Text
            style={[
              styles.navButtonText,
              activeTab === 'summary' && styles.navButtonTextActive,
            ]}
          >
            Summary
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  homeWrapper: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  mainArea: {
    flex: 1,
  },
  authContainer: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 40,
    gap: 20,
  },
  authHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  logoImage: {
    width: 170,
    height: 170,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 32,
    gap: 14,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  headerTextCol: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  subtitleText: {
    fontSize: 14,
    color: '#475569',
  },
  count: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginTop: 2,
  },
  cardBox: {
    backgroundColor: '#E6EEF7',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  textArea: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#1E293B',
    fontSize: 14,
    fontWeight: '600',
  },
  mediaButton: {
    backgroundColor: '#DBEAFE',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#93C5FD',
  },
  mediaButtonText: {
    color: '#1D4ED8',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#B91C1C',
    fontSize: 15,
    fontWeight: 'bold',
  },
  smallButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  smallButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  addServiceBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addServiceBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  carCard: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E6EEF7',
  },
  carImageBanner: {
    backgroundColor: '#DAE4F0',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carImage: {
    width: '100%',
    height: 95,
  },
  carCardBody: {
    padding: 12,
    gap: 4,
  },
  carCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  carCardDetails: {
    fontSize: 14,
    color: '#334155',
  },
  carCardMeta: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
  selectedCarBanner: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerLabel: {
    fontSize: 11,
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  bannerCarName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bannerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  bannerBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  bannerBtnText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  carDetailBanner: {
    backgroundColor: '#DAE4F0',
    borderRadius: 12,
    paddingVertical: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carDetailImage: {
    width: '100%',
    height: 120,
  },
  infoLine: {
    fontSize: 15,
    color: '#1E293B',
  },
  summaryHighlight: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 18,
    gap: 4,
  },
  summaryHighlightLabel: {
    fontSize: 14,
    color: '#DBEAFE',
  },
  summaryHighlightValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#CBD5E1',
    paddingTop: 10,
    paddingBottom: 24,
    paddingHorizontal: 12,
    gap: 8,
  },
  navButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  navButtonActive: {
    backgroundColor: '#2563EB',
  },
  navButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  navButtonTextActive: {
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.6,
  },
});
