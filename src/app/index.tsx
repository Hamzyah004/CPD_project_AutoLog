import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ServiceCard from '@/components/ServiceCard';
import ServiceDetails from '@/components/ServiceDetails';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { cars, services } from '@/data/services';
import { useTheme } from '@/hooks/use-theme';
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
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [screen, setScreen] = useState<ScreenName>('auth');
  const [previousScreen, setPreviousScreen] = useState<ScreenName>('select-car');
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car>(cars[0]);
  const [activeTab, setActiveTab] = useState<BottomTab>('services');
  const [selectedService, setSelectedService] = useState<ServiceLog | null>(null);

  // Responsive grid columns (Task 6): 1 on phones, 2 from 600 dp, 3 from 900 dp
  const columns = width >= 900 ? 3 : width >= 600 ? 2 : 1;
  const cardWidth = (width - 2 * Spacing.md - (columns - 1) * Spacing.md) / columns;

  // Filter services for the selected car and calculate summary values with reduce (Task 5)
  const carServices = services.filter((item) => item.carId === selectedCar.id);
  const totalExpenses = carServices.reduce((sum, item) => sum + item.costBam, 0);
  const maxServiceCost = carServices.reduce(
    (max, item) => (item.costBam > max ? item.costBam : max),
    0
  );

  // 1. LOGIN / REGISTER SCREEN
  if (screen === 'auth') {
    return (
      <ScrollView
        style={{ backgroundColor: theme.background }}
        contentContainerStyle={[
          styles.authContainer,
          { paddingBottom: Spacing.xl + insets.bottom },
        ]}
      >
        <View style={styles.maxWidthBox}>
          <View style={styles.authHeader}>
            <Image
              source={require('@/assets/AutoLog_logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <View
            style={[
              styles.cardBox,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {isRegistering ? 'Create New Account' : 'Welcome Back'}
            </Text>

            {isRegistering ? (
              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Full Name</Text>
                <TextInput
                  placeholder="Hamza Hodžić"
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.surface,
                      color: theme.text,
                      borderColor: theme.border,
                    },
                  ]}
                  placeholderTextColor={theme.muted}
                />
              </View>
            ) : null}

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Email</Text>
              <TextInput
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholderTextColor={theme.muted}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Password</Text>
              <TextInput
                placeholder="••••••••"
                secureTextEntry
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholderTextColor={theme.muted}
              />
            </View>

            <Pressable
              onPress={() => setScreen('select-car')}
              style={({ pressed }) => [
                styles.primaryButton,
                { backgroundColor: theme.primary },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.primaryButtonText, { color: theme.onPrimary }]}>
                {isRegistering ? 'Register & Continue' : 'Sign In'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setIsRegistering(!isRegistering)}
              style={({ pressed }) => [
                styles.secondaryButton,
                { backgroundColor: theme.secondaryBg, borderColor: theme.border },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.secondaryButtonText, { color: theme.text }]}>
                {isRegistering
                  ? 'Already have an account? Sign In'
                  : 'New user? Create an Account'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    );
  }

  // 2. CHOOSE CAR SCREEN (OR ADD NEW CAR)
  if (screen === 'select-car') {
    return (
      <ScrollView
        style={{ backgroundColor: theme.background }}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Spacing.md + insets.bottom },
        ]}
      >
        <View style={styles.rowBetween}>
          <View style={styles.headerTextCol}>
            <Text style={[styles.pageTitle, { color: theme.text }]}>
              Select Your Car
            </Text>
            <Text style={[styles.subtitleText, { color: theme.muted }]}>
              Choose a previously added vehicle or add a new one
            </Text>
          </View>
          <Pressable
            onPress={() => {
              setPreviousScreen('select-car');
              setScreen('settings');
            }}
            style={({ pressed }) => [
              styles.smallButton,
              { backgroundColor: theme.secondaryBg, borderColor: theme.border },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.smallButtonText, { color: theme.text }]}>
              Settings
            </Text>
          </Pressable>
        </View>

        <View style={styles.grid}>
          {cars.map((car) => (
            <Pressable
              key={car.id}
              onPress={() => {
                setSelectedCar(car);
                setSelectedService(null);
                setActiveTab('services');
                setScreen('home');
              }}
              style={({ pressed }) => [
                styles.carCard,
                { backgroundColor: theme.card, borderColor: theme.border },
                pressed && styles.pressed,
                { width: cardWidth },
              ]}
            >
              <View
                style={[styles.carImageBanner, { backgroundColor: theme.photoBg }]}
              >
                <Image
                  source={{ uri: car.photoUrl }}
                  style={styles.carImage}
                  resizeMode="contain"
                />
                <Text
                  style={[
                    styles.carBadge,
                    { backgroundColor: theme.primary, color: theme.onPrimary },
                  ]}
                >
                  {car.year}
                </Text>
              </View>
              <View style={styles.carCardBody}>
                <Text style={[styles.carCardTitle, { color: theme.text }]}>
                  {car.year} {car.make} {car.model}
                </Text>
                <Text style={[styles.carCardDetails, { color: theme.muted }]}>
                  {car.engine}
                </Text>
                <Text style={[styles.carCardMeta, { color: theme.primary }]}>
                  Plate: {car.licensePlate} · {car.currentMileageKm.toLocaleString()} km
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={() => setScreen('add-car')}
          style={({ pressed }) => [
            styles.primaryButton,
            { backgroundColor: theme.primary },
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.primaryButtonText, { color: theme.onPrimary }]}>
            + Add New Car
          </Text>
        </Pressable>
      </ScrollView>
    );
  }

  // 3. ADD NEW CAR SCREEN (STATIC PREVIEW)
  if (screen === 'add-car') {
    return (
      <ScrollView
        style={{ backgroundColor: theme.background }}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Spacing.md + insets.bottom },
        ]}
      >
        <View style={styles.maxWidthBox}>
          <Pressable
            onPress={() => setScreen('select-car')}
            style={({ pressed }) => [
              styles.smallButton,
              { backgroundColor: theme.secondaryBg, borderColor: theme.border },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.smallButtonText, { color: theme.text }]}>
              ← Back to My Cars
            </Text>
          </Pressable>

          <Text style={[styles.pageTitle, { color: theme.text }]}>
            Add a New Car
          </Text>

          <View
            style={[
              styles.cardBox,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Make & Model</Text>
              <TextInput
                placeholder="e.g. Škoda Octavia 2.0 TDI"
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholderTextColor={theme.muted}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Year</Text>
              <TextInput
                placeholder="e.g. 2020"
                keyboardType="numeric"
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholderTextColor={theme.muted}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>VIN Number</Text>
              <TextInput
                placeholder="e.g. TMBJJ7NE0L0123456"
                autoCapitalize="characters"
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholderTextColor={theme.muted}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                Current Mileage (km)
              </Text>
              <TextInput
                placeholder="e.g. 95000"
                keyboardType="numeric"
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholderTextColor={theme.muted}
              />
            </View>

            <Pressable
              onPress={() => setScreen('select-car')}
              style={({ pressed }) => [
                styles.primaryButton,
                { backgroundColor: theme.primary },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.primaryButtonText, { color: theme.onPrimary }]}>
                Save Car
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    );
  }

  // 4. ADD SERVICE SCREEN (STATIC PREVIEW WITH MEDIA / RECEIPT CAMERA OPTION)
  if (screen === 'add-service') {
    return (
      <ScrollView
        style={{ backgroundColor: theme.background }}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Spacing.md + insets.bottom },
        ]}
      >
        <View style={styles.maxWidthBox}>
          <Pressable
            onPress={() => setScreen('home')}
            style={({ pressed }) => [
              styles.smallButton,
              { backgroundColor: theme.secondaryBg, borderColor: theme.border },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.smallButtonText, { color: theme.text }]}>
              ← Back to Services Log
            </Text>
          </Pressable>

          <Text style={[styles.pageTitle, { color: theme.text }]}>
            Add Service Record
          </Text>
          <Text style={[styles.subtitleText, { color: theme.muted }]}>
            Vehicle: {selectedCar.year} {selectedCar.make} {selectedCar.model}
          </Text>

          <View
            style={[
              styles.cardBox,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Service Title</Text>
              <TextInput
                placeholder="e.g. Small Service – Oil & Filters"
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholderTextColor={theme.muted}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Service Shop</Text>
              <TextInput
                placeholder="e.g. AC Quattro Sarajevo"
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholderTextColor={theme.muted}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Mileage (km)</Text>
              <TextInput
                placeholder="e.g. 125500"
                keyboardType="numeric"
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholderTextColor={theme.muted}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Cost (KM)</Text>
              <TextInput
                placeholder="e.g. 250"
                keyboardType="numeric"
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholderTextColor={theme.muted}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                Notes (Optional)
              </Text>
              <TextInput
                placeholder="Parts replaced, oil brand, warranty notes..."
                multiline
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholderTextColor={theme.muted}
              />
            </View>

            <Pressable
              onPress={() => console.log('Open phone camera for receipt media')}
              style={({ pressed }) => [
                styles.mediaButton,
                {
                  backgroundColor: theme.accentBg,
                  borderColor: theme.accentBorder,
                },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.mediaButtonText, { color: theme.accentText }]}>
                📷 Add Receipt / Media (Phone Camera - Optional)
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setScreen('home')}
              style={({ pressed }) => [
                styles.primaryButton,
                { backgroundColor: theme.primary },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.primaryButtonText, { color: theme.onPrimary }]}>
                Save Service Entry
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    );
  }

  // 5. SETTINGS SCREEN
  if (screen === 'settings') {
    return (
      <ScrollView
        style={{ backgroundColor: theme.background }}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Spacing.md + insets.bottom },
        ]}
      >
        <View style={styles.maxWidthBox}>
          <Pressable
            onPress={() => setScreen(previousScreen)}
            style={({ pressed }) => [
              styles.smallButton,
              { backgroundColor: theme.secondaryBg, borderColor: theme.border },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.smallButtonText, { color: theme.text }]}>
              {previousScreen === 'select-car' ? '← Back to My Cars' : '← Back'}
            </Text>
          </Pressable>

          <Text style={[styles.pageTitle, { color: theme.text }]}>
            App Settings
          </Text>

          <View
            style={[
              styles.cardBox,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: theme.muted }]}>
                Currency
              </Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                BAM (KM)
              </Text>
            </View>
            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: theme.muted }]}>
                Distance Unit
              </Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                Kilometers (km)
              </Text>
            </View>
            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: theme.muted }]}>
                Sort Order
              </Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                Oldest to Newest
              </Text>
            </View>
            <View style={styles.detailRowLast}>
              <Text style={[styles.detailLabel, { color: theme.muted }]}>
                Service Reminders
              </Text>
              <Text style={[styles.detailValue, { color: theme.primary }]}>
                Enabled
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => setScreen('select-car')}
            style={({ pressed }) => [
              styles.secondaryButton,
              { backgroundColor: theme.secondaryBg, borderColor: theme.border },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.secondaryButtonText, { color: theme.text }]}>
              Switch Selected Car
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setScreen('auth')}
            style={({ pressed }) => [
              styles.logoutButton,
              { backgroundColor: theme.dangerBg, borderColor: theme.border },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.logoutButtonText, { color: theme.dangerText }]}>
              Log Out
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  // 6. MAIN HOME SCREEN WITH SELECTED CAR + 3 BOTTOM NAVIGATION TABS
  return (
    <View style={[styles.homeWrapper, { backgroundColor: theme.background }]}>
      {/* Top Selected Car Banner */}
      <View
        style={[
          styles.selectedCarBanner,
          { backgroundColor: theme.banner, borderBottomColor: theme.border },
        ]}
      >
        <View style={styles.bannerTextContainer}>
          <Text style={[styles.bannerLabel, { color: theme.bannerMuted }]}>
            Selected Vehicle
          </Text>
          <Text
            style={[styles.bannerCarName, { color: theme.onBanner }]}
            numberOfLines={1}
          >
            {selectedCar.year} {selectedCar.make} {selectedCar.model}
          </Text>
        </View>
        <View style={styles.bannerActions}>
          <Pressable
            onPress={() => setScreen('select-car')}
            style={({ pressed }) => [
              styles.bannerBtn,
              { backgroundColor: theme.bannerButton },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.bannerBtnText, { color: theme.onBanner }]}>
              Cars
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setPreviousScreen('home');
              setScreen('settings');
            }}
            style={({ pressed }) => [
              styles.bannerBtn,
              { backgroundColor: theme.bannerButton },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.bannerBtnText, { color: theme.onBanner }]}>
              Settings
            </Text>
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
            <ScrollView
              contentContainerStyle={[
                styles.scrollContent,
                { paddingBottom: Spacing.md + insets.bottom },
              ]}
            >
              <View style={styles.rowBetween}>
                <View style={styles.headerTextCol}>
                  <Text style={[styles.pageTitle, { color: theme.text }]}>
                    Services Log
                  </Text>
                  <Text style={[styles.count, { color: theme.muted }]}>
                    {carServices.length} services (Oldest → Newest)
                  </Text>
                </View>
                <Pressable
                  onPress={() => setScreen('add-service')}
                  style={({ pressed }) => [
                    styles.addServiceBtn,
                    { backgroundColor: theme.primary },
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    style={[styles.addServiceBtnText, { color: theme.onPrimary }]}
                  >
                    + Add Service
                  </Text>
                </Pressable>
              </View>

              {/* Task 5: Summary Row of 3 equal-width boxes calculated with reduce */}
              <View style={styles.summaryRow}>
                <View
                  style={[
                    styles.summaryBox,
                    { backgroundColor: theme.card, borderColor: theme.border },
                  ]}
                >
                  <Text style={[styles.summaryBoxValue, { color: theme.primary }]}>
                    {carServices.length}
                  </Text>
                  <Text style={[styles.summaryBoxLabel, { color: theme.muted }]}>
                    services
                  </Text>
                </View>

                <View
                  style={[
                    styles.summaryBox,
                    { backgroundColor: theme.card, borderColor: theme.border },
                  ]}
                >
                  <Text style={[styles.summaryBoxValue, { color: theme.primary }]}>
                    {totalExpenses}
                  </Text>
                  <Text style={[styles.summaryBoxLabel, { color: theme.muted }]}>
                    total KM
                  </Text>
                </View>

                <View
                  style={[
                    styles.summaryBox,
                    { backgroundColor: theme.card, borderColor: theme.border },
                  ]}
                >
                  <Text style={[styles.summaryBoxValue, { color: theme.primary }]}>
                    {maxServiceCost}
                  </Text>
                  <Text style={[styles.summaryBoxLabel, { color: theme.muted }]}>
                    max KM
                  </Text>
                </View>
              </View>

              {/* Task 6: Responsive 1, 2, or 3 column grid */}
              <View style={styles.grid}>
                {carServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onSelect={(item) => setSelectedService(item)}
                    style={{ width: cardWidth }}
                  />
                ))}
              </View>
            </ScrollView>
          ))}

        {activeTab === 'car-info' && (
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: Spacing.md + insets.bottom },
            ]}
          >
            <View style={styles.maxWidthBox}>
              <Text style={[styles.pageTitle, { color: theme.text }]}>
                Car Information
              </Text>
              <View
                style={[
                  styles.carDetailBanner,
                  { backgroundColor: theme.photoBg, borderColor: theme.border },
                ]}
              >
                <Image
                  source={{ uri: selectedCar.photoUrl }}
                  style={styles.carDetailImage}
                  resizeMode="contain"
                />
              </View>
              <View
                style={[
                  styles.cardBox,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.detailLabel, { color: theme.muted }]}>
                    Make
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>
                    {selectedCar.make}
                  </Text>
                </View>
                <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.detailLabel, { color: theme.muted }]}>
                    Model
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>
                    {selectedCar.model}
                  </Text>
                </View>
                <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.detailLabel, { color: theme.muted }]}>
                    Year
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>
                    {selectedCar.year}
                  </Text>
                </View>
                <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.detailLabel, { color: theme.muted }]}>
                    Engine
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>
                    {selectedCar.engine}
                  </Text>
                </View>
                <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.detailLabel, { color: theme.muted }]}>
                    VIN
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>
                    {selectedCar.vin}
                  </Text>
                </View>
                <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.detailLabel, { color: theme.muted }]}>
                    License Plate
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.primary }]}>
                    {selectedCar.licensePlate}
                  </Text>
                </View>
                <View style={styles.detailRowLast}>
                  <Text style={[styles.detailLabel, { color: theme.muted }]}>
                    Current Mileage
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>
                    {selectedCar.currentMileageKm.toLocaleString()} km
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        )}

        {activeTab === 'summary' && (
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: Spacing.md + insets.bottom },
            ]}
          >
            <View style={styles.maxWidthBox}>
              <Text style={[styles.pageTitle, { color: theme.text }]}>
                Expense Summary
              </Text>
              <Text style={[styles.subtitleText, { color: theme.muted }]}>
                {selectedCar.year} {selectedCar.make} {selectedCar.model}
              </Text>

              <View
                style={[
                  styles.summaryHighlight,
                  { backgroundColor: theme.primary },
                ]}
              >
                <Text
                  style={[
                    styles.summaryHighlightLabel,
                    { color: theme.onPrimary },
                  ]}
                >
                  Total Maintenance Expenses
                </Text>
                <Text
                  style={[
                    styles.summaryHighlightValue,
                    { color: theme.onPrimary },
                  ]}
                >
                  {totalExpenses} KM
                </Text>
              </View>

              <View
                style={[
                  styles.cardBox,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Overview
                </Text>
                <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.detailLabel, { color: theme.muted }]}>
                    Total Services Logged
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>
                    {carServices.length}
                  </Text>
                </View>
                <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.detailLabel, { color: theme.muted }]}>
                    Average Cost per Service
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.primary }]}>
                    {carServices.length > 0
                      ? Math.round(totalExpenses / carServices.length)
                      : 0}{' '}
                    KM
                  </Text>
                </View>
                <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.detailLabel, { color: theme.muted }]}>
                    Highest Single Service
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>
                    {maxServiceCost} KM
                  </Text>
                </View>
                <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.detailLabel, { color: theme.muted }]}>
                    First Logged Mileage
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>
                    {carServices[0]?.mileageKm.toLocaleString() ?? '-'} km
                  </Text>
                </View>
                <View style={styles.detailRowLast}>
                  <Text style={[styles.detailLabel, { color: theme.muted }]}>
                    Latest Logged Mileage
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>
                    {carServices[
                      carServices.length - 1
                    ]?.mileageKm.toLocaleString() ?? '-'}{' '}
                    km
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
      </View>

      {/* Bottom Navigation Bar with 3 Buttons (respects insets.bottom) */}
      <View
        style={[
          styles.bottomNav,
          {
            backgroundColor: theme.surface,
            borderTopColor: theme.border,
            paddingBottom: Spacing.sm + insets.bottom,
          },
        ]}
      >
        <Pressable
          onPress={() => {
            setSelectedService(null);
            setActiveTab('services');
          }}
          style={[
            styles.navButton,
            {
              backgroundColor:
                activeTab === 'services' ? theme.primary : theme.secondaryBg,
            },
          ]}
        >
          <Text
            style={[
              styles.navButtonText,
              {
                color:
                  activeTab === 'services' ? theme.onPrimary : theme.text,
              },
            ]}
          >
            Services Log
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('car-info')}
          style={[
            styles.navButton,
            {
              backgroundColor:
                activeTab === 'car-info' ? theme.primary : theme.secondaryBg,
            },
          ]}
        >
          <Text
            style={[
              styles.navButtonText,
              {
                color:
                  activeTab === 'car-info' ? theme.onPrimary : theme.text,
              },
            ]}
          >
            Car Info
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('summary')}
          style={[
            styles.navButton,
            {
              backgroundColor:
                activeTab === 'summary' ? theme.primary : theme.secondaryBg,
            },
          ]}
        >
          <Text
            style={[
              styles.navButtonText,
              {
                color:
                  activeTab === 'summary' ? theme.onPrimary : theme.text,
              },
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
  },
  mainArea: {
    flex: 1,
  },
  maxWidthBox: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    gap: Spacing.md,
  },
  authContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  authHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs,
  },
  logoImage: {
    width: 170,
    height: 170,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerTextCol: {
    flex: 1,
  },
  pageTitle: {
    fontSize: FontSize.title,
    fontWeight: 'bold',
  },
  subtitleText: {
    fontSize: FontSize.small,
  },
  count: {
    fontSize: FontSize.small,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  summaryBox: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  summaryBoxValue: {
    fontSize: FontSize.title,
    fontWeight: 'bold',
  },
  summaryBoxLabel: {
    fontSize: FontSize.small,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  cardBox: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.title,
    fontWeight: 'bold',
  },
  fieldGroup: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: FontSize.small,
    fontWeight: '600',
  },
  input: {
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.body,
    borderWidth: 1,
  },
  textArea: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  primaryButton: {
    borderRadius: Radius.sm,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  primaryButtonText: {
    fontSize: FontSize.body,
    fontWeight: 'bold',
  },
  secondaryButton: {
    borderRadius: Radius.sm,
    borderWidth: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: FontSize.small,
    fontWeight: '600',
  },
  mediaButton: {
    borderRadius: Radius.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  mediaButtonText: {
    fontSize: FontSize.small,
    fontWeight: '600',
  },
  logoutButton: {
    borderRadius: Radius.sm,
    borderWidth: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: FontSize.body,
    fontWeight: 'bold',
  },
  smallButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  smallButtonText: {
    fontSize: FontSize.small,
    fontWeight: '600',
  },
  addServiceBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
  },
  addServiceBtnText: {
    fontWeight: 'bold',
    fontSize: FontSize.small,
  },
  carCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  carImageBanner: {
    width: '100%',
    aspectRatio: 16 / 9,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  carBadge: {
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
  carCardBody: {
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  carCardTitle: {
    fontSize: FontSize.body,
    fontWeight: 'bold',
  },
  carCardDetails: {
    fontSize: FontSize.small,
  },
  carCardMeta: {
    fontSize: FontSize.small,
    fontWeight: '600',
  },
  selectedCarBanner: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    gap: Spacing.sm,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerLabel: {
    fontSize: FontSize.small,
    textTransform: 'uppercase',
  },
  bannerCarName: {
    fontSize: FontSize.body,
    fontWeight: 'bold',
  },
  bannerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  bannerBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
  },
  bannerBtnText: {
    fontSize: FontSize.small,
    fontWeight: '600',
  },
  carDetailBanner: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carDetailImage: {
    width: '100%',
    height: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
  },
  detailRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.md,
  },
  detailLabel: {
    fontSize: FontSize.body,
  },
  detailValue: {
    fontSize: FontSize.body,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  summaryHighlight: {
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  summaryHighlightLabel: {
    fontSize: FontSize.small,
  },
  summaryHighlightValue: {
    fontSize: FontSize.hero,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  navButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: FontSize.small,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.6,
  },
});
