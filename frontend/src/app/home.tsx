import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Linking,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Screen } from '../components/Screen';
import { colors, radius, spacing } from '../constants/theme';
import { getCurrentUser } from '../services/authService';

enum City {
  Kathmandu = 'Kathmandu',
  NewYork = 'New York',
  SanFrancisco = 'San Francisco',
  Seattle = 'Seattle',
  Austin = 'Austin',
  Chicago = 'Chicago',
  Boston = 'Boston',
  Dallas = 'Dallas',
}

enum CountryCode {
  NP = 'NP',
  US = 'US',
}

type HomeLocation = {
  city: City;
  countryCode: CountryCode;
};

type CityInfo = HomeLocation & {
  id: string;
  timeZone: string;
  weather: string;
  temperature: string;
  imageUrl?: string;
};

const cityImageUrls: Record<string, string> = {
  'kathmandu-np': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=160&h=160&fit=crop',
  'new-york-us': 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=160&h=160&fit=crop',
  'san-francisco-us': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=160&h=160&fit=crop',
  'seattle-us': 'https://images.unsplash.com/photo-1502175353174-a7a70e73b362?w=160&h=160&fit=crop',
  'austin-us': 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=160&h=160&fit=crop',
  'chicago-us': 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=160&h=160&fit=crop',
  'boston-us': 'https://images.unsplash.com/photo-1501979376754-2ff867a4f659?w=160&h=160&fit=crop',
  'dallas-us': 'https://images.unsplash.com/photo-1541475960355-54c4e7d7e92f?w=160&h=160&fit=crop',
};

const homeLocationOptions: HomeLocation[] = [
  { city: City.Kathmandu, countryCode: CountryCode.NP },
  { city: City.NewYork, countryCode: CountryCode.US },
  { city: City.SanFrancisco, countryCode: CountryCode.US },
  { city: City.Seattle, countryCode: CountryCode.US },
  { city: City.Austin, countryCode: CountryCode.US },
];

const cityCatalog: CityInfo[] = [
  {
    id: 'kathmandu-np',
    city: City.Kathmandu,
    countryCode: CountryCode.NP,
    timeZone: 'Asia/Kathmandu',
    weather: 'Mild with mountain haze',
    temperature: '68 F',
  },
  {
    id: 'new-york-us',
    city: City.NewYork,
    countryCode: CountryCode.US,
    timeZone: 'America/New_York',
    weather: 'Partly cloudy',
    temperature: '72 F',
  },
  {
    id: 'san-francisco-us',
    city: City.SanFrancisco,
    countryCode: CountryCode.US,
    timeZone: 'America/Los_Angeles',
    weather: 'Cool coastal breeze',
    temperature: '61 F',
  },
  {
    id: 'seattle-us',
    city: City.Seattle,
    countryCode: CountryCode.US,
    timeZone: 'America/Los_Angeles',
    weather: 'Light rain nearby',
    temperature: '58 F',
  },
  {
    id: 'austin-us',
    city: City.Austin,
    countryCode: CountryCode.US,
    timeZone: 'America/Chicago',
    weather: 'Warm and clear',
    temperature: '84 F',
  },
  {
    id: 'chicago-us',
    city: City.Chicago,
    countryCode: CountryCode.US,
    timeZone: 'America/Chicago',
    weather: 'Breezy afternoon',
    temperature: '66 F',
  },
  {
    id: 'boston-us',
    city: City.Boston,
    countryCode: CountryCode.US,
    timeZone: 'America/New_York',
    weather: 'Crisp and sunny',
    temperature: '64 F',
  },
  {
    id: 'dallas-us',
    city: City.Dallas,
    countryCode: CountryCode.US,
    timeZone: 'America/Chicago',
    weather: 'Dry and hot',
    temperature: '89 F',
  },
];

const defaultHomePreferences = {
  location: {
    city: City.Kathmandu,
    countryCode: CountryCode.NP,
  },
  timeCityIds: ['kathmandu-np', 'new-york-us', 'san-francisco-us'],
  exchangeRateCodes: ['USD'],
  preciousMetalCodes: ['GOLD', 'SILVER'],
  horoscopeId: 'mesh',
};
const avatarAccent = '#003577';

type NepaliDateResponse = {
  status: number;
  message: string;
  data: string;
};

type ExchangeRate = {
  code: string;
  name: string;
  flag: string;
  unit: number;
  buy: string;
  sell?: string;
};

type PreciousMetalRate = {
  code: string;
  name: string;
  symbol: string;
  unit: string;
  price: string;
};

type GoldVendor = {
  id: string;
  name: string;
  phone: string;
};

type NepaliHoroscope = {
  id: string;
  name: string;
  englishName: string;
  symbol: string;
  summary: string;
};

const placeholderNepaliDateResponse: NepaliDateResponse = {
  status: 200,
  message: 'Placeholder until Spring Boot provides today date.',
  data: '२३ वैशाख २०८३, बुधवार',
};

const exchangeRates: ExchangeRate[] = [
  { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳', unit: 100, buy: '160.00', sell: '160.15' },
  { code: 'USD', name: 'U.S. Dollar', flag: '🇺🇸', unit: 1, buy: '152.16', sell: '152.76' },
  { code: 'EUR', name: 'European Euro', flag: '🇪🇺', unit: 1, buy: '177.92', sell: '178.62' },
  { code: 'GBP', name: 'UK Pound Sterling', flag: '🇬🇧', unit: 1, buy: '206.11', sell: '206.92' },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', unit: 1, buy: '194.22', sell: '194.98' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', unit: 1, buy: '109.15', sell: '109.58' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', unit: 1, buy: '111.82', sell: '112.26' },
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬', unit: 1, buy: '119.18', sell: '119.65' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', unit: 10, buy: '9.65', sell: '9.69' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳', unit: 1, buy: '22.28', sell: '22.37' },
  { code: 'SAR', name: 'Saudi Arabian Riyal', flag: '🇸🇦', unit: 1, buy: '40.55', sell: '40.71' },
  { code: 'QAR', name: 'Qatari Riyal', flag: '🇶🇦', unit: 1, buy: '41.74', sell: '41.91' },
  { code: 'THB', name: 'Thai Baht', flag: '🇹🇭', unit: 1, buy: '4.66', sell: '4.68' },
  { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪', unit: 1, buy: '41.43', sell: '41.59' },
  { code: 'MYR', name: 'Malaysian Ringgit', flag: '🇲🇾', unit: 1, buy: '38.40', sell: '38.55' },
  { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷', unit: 100, buy: '10.33', sell: '10.37' },
  { code: 'SEK', name: 'Swedish Kroner', flag: '🇸🇪', unit: 1, buy: '16.41', sell: '16.48' },
  { code: 'DKK', name: 'Danish Kroner', flag: '🇩🇰', unit: 1, buy: '23.81', sell: '23.90' },
  { code: 'HKD', name: 'Hong Kong Dollar', flag: '🇭🇰', unit: 1, buy: '19.42', sell: '19.49' },
  { code: 'KWD', name: 'Kuwaiti Dinar', flag: '🇰🇼', unit: 1, buy: '496.52', sell: '498.48' },
  { code: 'BHD', name: 'Bahrain Dinar', flag: '🇧🇭', unit: 1, buy: '402.91', sell: '404.50' },
  { code: 'OMR', name: 'Omani Rial', flag: '🇴🇲', unit: 1, buy: '395.19' },
];

const preciousMetalRates: PreciousMetalRate[] = [
  { code: 'GOLD', name: 'Gold', symbol: 'Au', unit: '1 tola', price: '235,400' },
  { code: 'SILVER', name: 'Silver', symbol: 'Ag', unit: '1 tola', price: '3,050' },
  { code: 'PLATINUM', name: 'Platinum', symbol: 'Pt', unit: '1 tola', price: '142,800' },
  { code: 'PALLADIUM', name: 'Palladium', symbol: 'Pd', unit: '1 tola', price: '129,600' },
];

const goldVendorsByLocation: Record<string, GoldVendor[]> = {
  [`${City.Kathmandu}-${CountryCode.NP}`]: [
    { id: 'new-road-gold-center', name: 'New Road Gold Center', phone: '+9779800000001' },
    { id: 'bishal-bazaar-jewellers', name: 'Bishal Bazaar Jewellers', phone: '+9779800000002' },
    { id: 'durbar-marg-gold-house', name: 'Durbar Marg Gold House', phone: '+9779800000003' },
  ],
};

const nepaliHoroscopes: NepaliHoroscope[] = [
  { id: 'mesh', name: 'मेष', englishName: 'Aries', symbol: '♈', summary: 'नयाँ काम सुरु गर्न राम्रो समय देखिन्छ। परिवार वा साथीबाट सहयोग मिल्न सक्छ। हतारमा निर्णय नगर्नुहोला।' },
  { id: 'brish', name: 'वृष', englishName: 'Taurus', symbol: '♉', summary: 'धन, घरायसी काम, र व्यवहारिक योजनामा ध्यान जानेछ। पुरानो काम पूरा गर्ने अवसर मिल्न सक्छ। खर्चमा संयम राख्नु राम्रो।' },
  { id: 'mithun', name: 'मिथुन', englishName: 'Gemini', symbol: '♊', summary: 'सञ्चार, भेटघाट, र नयाँ जानकारीले दिन उपयोगी बन्नेछ। नजिकका मानिससँग राम्रो संवाद हुनेछ। योजनालाई स्पष्ट बनाएर अघि बढ्नुहोस्।' },
  { id: 'karkat', name: 'कर्कट', englishName: 'Cancer', symbol: '♋', summary: 'धैर्य राख्दा रोकिएका काम सहज बन्दै जानेछन्। मनमा केही चिन्ता आए पनि सहयोगी वातावरण रहन्छ। स्वास्थ्य र आराममा ध्यान दिनुहोस्।' },
  { id: 'singha', name: 'सिंह', englishName: 'Leo', symbol: '♌', summary: 'आत्मविश्वास बढ्ने दिन छ। काममा आफ्नो भूमिका बलियो देखाउन सकिनेछ। प्रशंसा पाउने सम्भावना भए पनि नम्रता कायम राख्नुहोस्।' },
  { id: 'kanya', name: 'कन्या', englishName: 'Virgo', symbol: '♍', summary: 'योजना मिलाएर अघि बढ्दा फाइदा हुनेछ। साना विवरणमा ध्यान दिनु पर्ने समय छ। अधुरो काम पूरा गर्न आजको समय उपयोगी हुन सक्छ।' },
  { id: 'tula', name: 'तुला', englishName: 'Libra', symbol: '♎', summary: 'सम्बन्ध र सहकार्यमा सुधार आउनेछ। अरूको कुरा सुनेर निर्णय गर्दा राम्रो परिणाम मिल्न सक्छ। सामाजिक काममा मन जानेछ।' },
  { id: 'brischik', name: 'वृश्चिक', englishName: 'Scorpio', symbol: '♏', summary: 'महत्वपूर्ण निर्णयमा सोचविचार आवश्यक छ। भावनामा बगेर प्रतिक्रिया नदिनु राम्रो। काममा गहिरो ध्यान दिए राम्रो उपलब्धि मिल्नेछ।' },
  { id: 'dhanu', name: 'धनु', englishName: 'Sagittarius', symbol: '♐', summary: 'यात्रा, सिकाइ, वा नयाँ अनुभवको अवसर आउन सक्छ। खुला मनले अघि बढ्दा फाइदा हुनेछ। लामो योजनामा सानो प्रगति हुन सक्छ।' },
  { id: 'makar', name: 'मकर', englishName: 'Capricorn', symbol: '♑', summary: 'काममा अनुशासनले राम्रो परिणाम दिनेछ। जिम्मेवारी बढ्न सक्छ तर पूरा गर्ने ऊर्जा पनि रहनेछ। समय व्यवस्थापनमा ध्यान दिनुहोस्।' },
  { id: 'kumbha', name: 'कुम्भ', englishName: 'Aquarius', symbol: '♒', summary: 'नयाँ विचारले सहयोग पाउने सम्भावना छ। साथी वा समूहसँगको काम फलदायी हुन सक्छ। पुरानो सोच छोडेर फरक दृष्टिकोण अपनाउनुहोस्।' },
  { id: 'meen', name: 'मीन', englishName: 'Pisces', symbol: '♓', summary: 'भावना र स्वास्थ्यमा ध्यान दिनु राम्रो। रचनात्मक काममा मन लाग्न सक्छ। नजिकका मानिससँग नरम व्यवहार गर्दा सम्बन्ध बलियो हुनेछ।' },
];

function formatTime(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone,
  }).format(date);
}

function formatDate(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone,
  }).format(date);
}

export default function HomeScreen() {
  const currentUser = getCurrentUser();
  const [homeLocation, setHomeLocation] = useState<HomeLocation>(defaultHomePreferences.location);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [isTimeExpanded, setIsTimeExpanded] = useState(false);
  const [visibleTimeCityIds, setVisibleTimeCityIds] = useState(
    defaultHomePreferences.timeCityIds,
  );
  const [selectedTimeCityId, setSelectedTimeCityId] = useState<string | null>(null);
  const [isAddCityOpen, setIsAddCityOpen] = useState(false);
  const [isForeignExchangeExpanded, setIsForeignExchangeExpanded] = useState(false);
  const [visibleExchangeRateCodes, setVisibleExchangeRateCodes] = useState(
    defaultHomePreferences.exchangeRateCodes,
  );
  const [isAddExchangeOpen, setIsAddExchangeOpen] = useState(false);
  const [isPreciousMetalExpanded, setIsPreciousMetalExpanded] = useState(false);
  const [visiblePreciousMetalCodes, setVisiblePreciousMetalCodes] =
    useState(defaultHomePreferences.preciousMetalCodes);
  const [isAddPreciousMetalOpen, setIsAddPreciousMetalOpen] = useState(false);
  const [isHoroscopeExpanded, setIsHoroscopeExpanded] = useState(false);
  const nepaliDate = placeholderNepaliDateResponse.data;
  const defaultExchangeRate = exchangeRates.find((rate) => rate.code === 'USD') ?? exchangeRates[0];
  const defaultPreciousMetal = preciousMetalRates[0];
  const defaultHoroscope =
    nepaliHoroscopes.find((horoscope) => horoscope.id === defaultHomePreferences.horoscopeId) ??
    nepaliHoroscopes[0];
  const visibleExchangeRates = exchangeRates.filter((rate) =>
    visibleExchangeRateCodes.includes(rate.code),
  );
  const hiddenExchangeRates = exchangeRates.filter(
    (rate) => !visibleExchangeRateCodes.includes(rate.code),
  );
  const visiblePreciousMetalRates = preciousMetalRates.filter((metal) =>
    visiblePreciousMetalCodes.includes(metal.code),
  );
  const hiddenPreciousMetalRates = preciousMetalRates.filter(
    (metal) => !visiblePreciousMetalCodes.includes(metal.code),
  );
  const goldVendors = goldVendorsByLocation[`${homeLocation.city}-${homeLocation.countryCode}`] ?? [];
  const avatarInitial = currentUser?.displayName.trim().charAt(0).toUpperCase();
  const nepalCity = cityCatalog[0];
  const visibleTimeCities = cityCatalog.filter((city) => visibleTimeCityIds.includes(city.id));
  const hiddenTimeCities = cityCatalog.filter((city) => !visibleTimeCityIds.includes(city.id));
  const selectedTimeCity = cityCatalog.find((city) => city.id === selectedTimeCityId);
  const swipeToPeopleResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          gestureState.dx > 12 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.4,
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx > 48 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.4) {
            router.replace('/people');
          }
        },
      }),
    [],
  );

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  function handleRemoveTimeCity(cityId: string) {
    setVisibleTimeCityIds((cityIds) => cityIds.filter((id) => id !== cityId));

    if (selectedTimeCityId === cityId) {
      setSelectedTimeCityId(null);
    }
  }

  function handleAddTimeCity(cityId: string) {
    setVisibleTimeCityIds((cityIds) => [...cityIds, cityId]);
    setIsAddCityOpen(false);
  }

  function handleRemoveExchangeRate(code: string) {
    setVisibleExchangeRateCodes((codes) => codes.filter((visibleCode) => visibleCode !== code));
  }

  function handleAddExchangeRate(code: string) {
    setVisibleExchangeRateCodes((codes) => [...codes, code]);
    setIsAddExchangeOpen(false);
  }

  function handleRemovePreciousMetal(code: string) {
    setVisiblePreciousMetalCodes((codes) => codes.filter((visibleCode) => visibleCode !== code));
  }

  function handleAddPreciousMetal(code: string) {
    setVisiblePreciousMetalCodes((codes) => [...codes, code]);
    setIsAddPreciousMetalOpen(false);
  }

  function handleCallVendor(phone: string) {
    Linking.openURL(`tel:${phone}`);
  }

  return (
    <Screen scrollProps={swipeToPeopleResponder.panHandlers}>
      <View style={styles.homeContent}>
        <View style={styles.topBar}>
          <View style={styles.brandBlock}>
            <Link href="/people" replace asChild>
              <Pressable style={({ pressed }) => [styles.brandButton, pressed && styles.brandPressed]}>
                <Text style={styles.appName}>Namaste</Text>
              </Pressable>
            </Link>

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: isLocationPickerOpen }}
              onPress={() => setIsLocationPickerOpen((isOpen) => !isOpen)}
              style={({ pressed }) => [
                styles.locationButton,
                isLocationPickerOpen && styles.locationButtonOpen,
                pressed && styles.brandPressed,
              ]}
            >
              <Ionicons name="location-outline" size={15} color={colors.primary} />
              <Text style={styles.locationText}>
                {homeLocation.city}, {homeLocation.countryCode}
              </Text>
              <Ionicons
                name={isLocationPickerOpen ? 'chevron-up' : 'chevron-down'}
                size={15}
                color={colors.mutedText}
              />
            </Pressable>
          </View>

          <Link href={currentUser ? '/profile' : '/register'} asChild>
            <Pressable style={({ pressed }) => [styles.avatarButton, pressed && styles.avatarPressed]}>
              {avatarInitial ? (
                <Text style={styles.avatarInitial}>{avatarInitial}</Text>
              ) : (
                <Ionicons name="person-outline" size={22} color={avatarAccent} />
              )}
            </Pressable>
          </Link>
        </View>

        <View pointerEvents="none" style={styles.flagAccent}>
          <View style={styles.flagLineBlue} />
          <View style={styles.flagLineRed} />
          <View style={styles.flagLineWhite} />
        </View>

        <View style={styles.header}>
          {isLocationPickerOpen ? (
            <View style={styles.locationMenu}>
              {homeLocationOptions.map((location) => {
                const isSelected =
                  location.city === homeLocation.city &&
                  location.countryCode === homeLocation.countryCode;

                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    key={`${location.city}-${location.countryCode}`}
                    onPress={() => {
                      setHomeLocation(location);
                      setIsLocationPickerOpen(false);
                    }}
                    style={({ pressed }) => [
                      styles.locationOption,
                      isSelected && styles.locationOptionSelected,
                      pressed && styles.locationOptionPressed,
                    ]}
                  >
                    <View style={styles.locationOptionText}>
                      <Text
                        style={[
                          styles.locationOptionCity,
                          isSelected && styles.locationOptionCitySelected,
                        ]}
                      >
                        {location.city}
                      </Text>
                      <Text style={styles.locationOptionCountry}>{location.countryCode}</Text>
                    </View>
                    {isSelected ? (
                      <Ionicons name="checkmark" size={18} color={colors.primary} />
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          ) : null}
        </View>

        <View style={styles.moduleCard}>
          <View style={styles.moduleHeader}>
            <View style={styles.cardIcon}>
              <Ionicons name="calendar-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>आजको मिति</Text>
              <Text style={styles.cardDescription}>{nepaliDate}</Text>
            </View>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: isTimeExpanded }}
          onPress={() => setIsTimeExpanded((isExpanded) => !isExpanded)}
          style={({ pressed }) => [
            styles.moduleCard,
            isTimeExpanded && styles.moduleCardExpanded,
            pressed && styles.moduleCardPressed,
          ]}
        >
          <View style={styles.moduleHeader}>
            <View style={styles.cardIcon}>
              <Ionicons name="time-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>
                {nepalCity.city}, {nepalCity.countryCode}
              </Text>
              <Text style={styles.cardDescription}>
                {nepalCity.temperature} · {nepalCity.weather}
              </Text>
            </View>
            <Text style={styles.cardSideValue}>{formatTime(now, nepalCity.timeZone)}</Text>
            <Ionicons
              name={isTimeExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.mutedText}
            />
          </View>
        </Pressable>

        {isTimeExpanded ? (
          <View style={styles.expandedPanel}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>City list</Text>
              <Text style={styles.panelHint}>Tap a city for date and weather</Text>
            </View>

            <View style={styles.cityList}>
              {visibleTimeCities.map((city) => {
                const isSelected = selectedTimeCityId === city.id;

                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    key={city.id}
                    onPress={() => setSelectedTimeCityId(isSelected ? null : city.id)}
                    style={({ pressed }) => [
                      styles.cityRow,
                      isSelected && styles.cityRowSelected,
                      pressed && styles.locationOptionPressed,
                    ]}
                  >
                    {cityImageUrls[city.id] ? (
                      <Image
                        accessibilityIgnoresInvertColors
                        source={{ uri: cityImageUrls[city.id] }}
                        style={styles.cityImage}
                      />
                    ) : (
                      <View style={styles.cityImageFallback}>
                        <Ionicons name="location-outline" size={20} color={colors.primary} />
                      </View>
                    )}
                    <View style={styles.cityRowMain}>
                      <Text style={[styles.cityName, isSelected && styles.cityNameSelected]}>
                        {city.city}, {city.countryCode}
                      </Text>
                      <Text style={styles.cityWeather}>{city.temperature} · {city.weather}</Text>
                    </View>
                    <View style={styles.cityRowSide}>
                      <Text style={styles.cityTime}>{formatTime(now, city.timeZone)}</Text>
                      <Ionicons name="chevron-forward" size={16} color={colors.mutedText} />
                    </View>
                    <Pressable
                      accessibilityLabel={`Remove ${city.city}`}
                      onPress={() => handleRemoveTimeCity(city.id)}
                      style={({ pressed }) => [
                        styles.iconButton,
                        pressed && styles.locationOptionPressed,
                      ]}
                    >
                      <Ionicons name="remove" size={18} color={colors.mutedText} />
                    </Pressable>
                  </Pressable>
                );
              })}
            </View>

            {hiddenTimeCities.length ? (
              <View style={styles.addCitySection}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ expanded: isAddCityOpen }}
                  onPress={() => setIsAddCityOpen((isOpen) => !isOpen)}
                  style={({ pressed }) => [styles.addCityToggle, pressed && styles.locationOptionPressed]}
                >
                  <View style={styles.addCityToggleText}>
                    <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
                    <Text style={styles.addCityTitle}>Add city</Text>
                  </View>
                  <Ionicons
                    name={isAddCityOpen ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={colors.mutedText}
                  />
                </Pressable>

                {isAddCityOpen ? (
                  <View style={styles.addCityGrid}>
                    {hiddenTimeCities.map((city) => (
                      <Pressable
                        accessibilityRole="button"
                        key={city.id}
                        onPress={() => handleAddTimeCity(city.id)}
                        style={({ pressed }) => [
                          styles.addCityButton,
                          pressed && styles.locationOptionPressed,
                        ]}
                      >
                        <Ionicons name="add" size={16} color={colors.primary} />
                        <Text style={styles.addCityText}>
                          {city.city}, {city.countryCode}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                ) : null}
              </View>
            ) : null}

            {selectedTimeCity ? (
              <View style={styles.cityDetail}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={18} color={colors.primary} />
                  <Text style={styles.detailText}>
                    {formatDate(now, selectedTimeCity.timeZone)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="partly-sunny-outline" size={18} color={colors.primary} />
                  <Text style={styles.detailText}>
                    {selectedTimeCity.temperature} · {selectedTimeCity.weather}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        ) : null}

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: isForeignExchangeExpanded }}
          onPress={() => setIsForeignExchangeExpanded((isExpanded) => !isExpanded)}
          style={({ pressed }) => [
            styles.moduleCard,
            isForeignExchangeExpanded && styles.moduleCardExpanded,
            pressed && styles.moduleCardPressed,
          ]}
        >
          <View style={styles.moduleHeader}>
            <View style={styles.cardIcon}>
              <Text style={styles.flagIcon}>{defaultExchangeRate.flag}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>Foreign Exchange</Text>
              <Text style={styles.cardDescription}>
                {defaultExchangeRate.unit} {defaultExchangeRate.code} to Nepalese Rupee
              </Text>
            </View>
            <Text style={styles.cardSideValue}>{defaultExchangeRate.sell}</Text>
            <Ionicons
              name={isForeignExchangeExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.mutedText}
            />
          </View>
        </Pressable>

        {isForeignExchangeExpanded ? (
          <View style={styles.expandedPanel}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Currency list</Text>
              <Text style={styles.panelHint}>Add currencies to track sell rates in Nepalese Rupee</Text>
            </View>

            <View style={styles.exchangeList}>
              {visibleExchangeRates.map((rate) => (
                <View key={rate.code} style={styles.exchangeRow}>
                  <Text style={styles.exchangeFlag}>{rate.flag}</Text>
                  <View style={styles.exchangeMain}>
                    <Text style={styles.exchangeTitle}>
                      {rate.code} · {rate.name}
                    </Text>
                    <Text style={styles.exchangeMeta}>
                      {rate.unit} {rate.code} to Nepalese Rupee
                    </Text>
                  </View>
                  <View style={styles.exchangeRowSide}>
                    <Text style={styles.exchangeValue}>{rate.sell ?? '-'}</Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.mutedText} />
                  </View>
                  <Pressable
                    accessibilityLabel={`Remove ${rate.code}`}
                    onPress={() => handleRemoveExchangeRate(rate.code)}
                    style={({ pressed }) => [styles.iconButton, pressed && styles.locationOptionPressed]}
                  >
                    <Ionicons name="remove" size={18} color={colors.mutedText} />
                  </Pressable>
                </View>
              ))}
            </View>

            {hiddenExchangeRates.length ? (
              <View style={styles.addCitySection}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ expanded: isAddExchangeOpen }}
                  onPress={() => setIsAddExchangeOpen((isOpen) => !isOpen)}
                  style={({ pressed }) => [styles.addCityToggle, pressed && styles.locationOptionPressed]}
                >
                  <View style={styles.addCityToggleText}>
                    <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
                    <Text style={styles.addCityTitle}>Add currency</Text>
                  </View>
                  <Ionicons
                    name={isAddExchangeOpen ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={colors.mutedText}
                  />
                </Pressable>

                {isAddExchangeOpen ? (
                  <View style={styles.addCurrencyGrid}>
                    {hiddenExchangeRates.map((rate) => (
                      <Pressable
                        accessibilityRole="button"
                        key={rate.code}
                        onPress={() => handleAddExchangeRate(rate.code)}
                        style={({ pressed }) => [
                          styles.addCurrencyButton,
                          pressed && styles.locationOptionPressed,
                        ]}
                      >
                        <Text style={styles.addCurrencyFlag}>{rate.flag}</Text>
                        <Text style={styles.addCityText}>{rate.code}</Text>
                      </Pressable>
                    ))}
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>
        ) : null}

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: isPreciousMetalExpanded }}
          onPress={() => setIsPreciousMetalExpanded((isExpanded) => !isExpanded)}
          style={({ pressed }) => [
            styles.moduleCard,
            isPreciousMetalExpanded && styles.moduleCardExpanded,
            pressed && styles.moduleCardPressed,
          ]}
        >
          <View style={styles.moduleHeader}>
            <View style={styles.cardIcon}>
              <Text style={styles.metalIcon}>{defaultPreciousMetal.symbol}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>Gold Price</Text>
              <Text style={styles.cardDescription}>
                {defaultPreciousMetal.unit} {defaultPreciousMetal.name} to Nepalese Rupee
              </Text>
            </View>
            <Text style={styles.cardSideValue}>{defaultPreciousMetal.price}</Text>
            <Ionicons
              name={isPreciousMetalExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.mutedText}
            />
          </View>
        </Pressable>

        {isPreciousMetalExpanded ? (
          <View style={styles.expandedPanel}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Precious metals</Text>
              <Text style={styles.panelHint}>Add metals to track prices in Nepalese Rupee</Text>
            </View>

            <View style={styles.exchangeList}>
              {visiblePreciousMetalRates.map((metal) => (
                <View key={metal.code} style={styles.exchangeRow}>
                  <View style={styles.metalBadge}>
                    <Text style={styles.metalBadgeText}>{metal.symbol}</Text>
                  </View>
                  <View style={styles.exchangeMain}>
                    <Text style={styles.exchangeTitle}>{metal.name}</Text>
                    <Text style={styles.exchangeMeta}>
                      {metal.unit} to Nepalese Rupee
                    </Text>
                  </View>
                  <View style={styles.exchangeRowSide}>
                    <Text style={styles.exchangeValue}>{metal.price}</Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.mutedText} />
                  </View>
                  <Pressable
                    accessibilityLabel={`Remove ${metal.name}`}
                    onPress={() => handleRemovePreciousMetal(metal.code)}
                    style={({ pressed }) => [styles.iconButton, pressed && styles.locationOptionPressed]}
                  >
                    <Ionicons name="remove" size={18} color={colors.mutedText} />
                  </Pressable>
                </View>
              ))}
            </View>

            {hiddenPreciousMetalRates.length ? (
              <View style={styles.addCitySection}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ expanded: isAddPreciousMetalOpen }}
                  onPress={() => setIsAddPreciousMetalOpen((isOpen) => !isOpen)}
                  style={({ pressed }) => [styles.addCityToggle, pressed && styles.locationOptionPressed]}
                >
                  <View style={styles.addCityToggleText}>
                    <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
                    <Text style={styles.addCityTitle}>Add metal</Text>
                  </View>
                  <Ionicons
                    name={isAddPreciousMetalOpen ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={colors.mutedText}
                  />
                </Pressable>

                {isAddPreciousMetalOpen ? (
                  <View style={styles.addCurrencyGrid}>
                    {hiddenPreciousMetalRates.map((metal) => (
                      <Pressable
                        accessibilityRole="button"
                        key={metal.code}
                        onPress={() => handleAddPreciousMetal(metal.code)}
                        style={({ pressed }) => [
                          styles.addCurrencyButton,
                          pressed && styles.locationOptionPressed,
                        ]}
                      >
                        <Text style={styles.addCityText}>{metal.symbol}</Text>
                        <Text style={styles.addCityText}>{metal.name}</Text>
                      </Pressable>
                    ))}
                  </View>
                ) : null}
              </View>
            ) : null}

            {goldVendors.length ? (
              <View style={styles.vendorSection}>
                <View style={styles.panelHeader}>
                  <Text style={styles.panelTitle}>Vendors</Text>
                  <Text style={styles.panelHint}>Call vendors to buy and find the local price</Text>
                </View>

                <View style={styles.vendorList}>
                  {goldVendors.map((vendor) => (
                    <View key={vendor.id} style={styles.vendorRow}>
                      <View style={styles.vendorMain}>
                        <Text style={styles.vendorName}>{vendor.name}</Text>
                        <Text style={styles.vendorPhone}>{vendor.phone}</Text>
                      </View>
                      <Pressable
                        accessibilityLabel={`Call ${vendor.name}`}
                        onPress={() => handleCallVendor(vendor.phone)}
                        style={({ pressed }) => [styles.callButton, pressed && styles.locationOptionPressed]}
                      >
                        <Ionicons name="call" size={20} color={colors.primary} />
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}
          </View>
        ) : null}

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: isHoroscopeExpanded }}
          onPress={() => setIsHoroscopeExpanded((isExpanded) => !isExpanded)}
          style={({ pressed }) => [
            styles.moduleCard,
            isHoroscopeExpanded && styles.moduleCardExpanded,
            pressed && styles.moduleCardPressed,
          ]}
        >
          <View style={styles.moduleHeader}>
            <View style={styles.cardIcon}>
              <Text style={styles.horoscopeIcon}>{defaultHoroscope.symbol}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>आजको राशिफल</Text>
              <Text style={styles.cardDescription}>
                {defaultHoroscope.name} · {defaultHoroscope.summary}
              </Text>
            </View>
            <Ionicons
              name={isHoroscopeExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.mutedText}
            />
          </View>
        </Pressable>

        {isHoroscopeExpanded ? (
          <View style={styles.expandedPanel}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>सबै राशिफल</Text>
            </View>

            <View style={styles.horoscopeList}>
              {nepaliHoroscopes.map((horoscope) => (
                <View key={horoscope.id} style={styles.horoscopeRow}>
                  <Text style={styles.horoscopeSymbol}>{horoscope.symbol}</Text>
                  <View style={styles.horoscopeMain}>
                    <Text style={styles.horoscopeTitle}>
                      {horoscope.name} · {horoscope.englishName}
                    </Text>
                    <Text style={styles.horoscopeSummary}>{horoscope.summary}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {Platform.OS === 'web' ? (
          <View style={styles.notice}>
            <Text style={styles.noticeText}>
              Web preview: this target is intentionally secondary and may become read-only.
            </Text>
          </View>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  homeContent: {
    gap: spacing.sm,
  },
  topBar: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  brandButton: {
    alignSelf: 'flex-start',
    minHeight: 34,
    justifyContent: 'center',
    marginLeft: -spacing.sm,
    paddingLeft: spacing.sm,
    paddingRight: spacing.md,
    borderRadius: radius.md,
  },
  brandBlock: {
    flex: 1,
    gap: 0,
    minWidth: 0,
  },
  appName: {
    color: avatarAccent,
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 34,
  },
  brandPressed: {
    opacity: 0.72,
  },
  locationButton: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginLeft: -spacing.sm,
    paddingLeft: spacing.sm,
    paddingRight: spacing.xs,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: radius.md,
  },
  locationButtonOpen: {
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  locationText: {
    flexShrink: 1,
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  avatarButton: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: avatarAccent,
    borderRadius: 23,
    backgroundColor: '#EEF6FF',
  },
  avatarPressed: {
    backgroundColor: '#DCEEFF',
  },
  avatarInitial: {
    color: avatarAccent,
    fontSize: 18,
    fontWeight: '900',
  },
  flagAccent: {
    width: 132,
    height: 6,
    flexDirection: 'row',
    marginTop: -spacing.sm,
    marginBottom: 0,
    overflow: 'hidden',
    borderRadius: 4,
  },
  flagLineBlue: {
    flex: 3,
    backgroundColor: avatarAccent,
  },
  flagLineRed: {
    flex: 5,
    backgroundColor: '#DC143C',
  },
  flagLineWhite: {
    flex: 2,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
  },
  header: {
    gap: spacing.sm,
    paddingTop: 0,
  },
  locationMenu: {
    alignSelf: 'stretch',
    gap: spacing.xs,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  locationOption: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
  },
  locationOptionSelected: {
    backgroundColor: '#EFF6FF',
  },
  locationOptionPressed: {
    backgroundColor: '#F1F5F9',
  },
  locationOptionText: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  locationOptionCity: {
    flexShrink: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  locationOptionCitySelected: {
    color: colors.primary,
  },
  locationOptionCountry: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 24,
  },
  moduleCard: {
    minHeight: 82,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  moduleCardExpanded: {
    borderColor: '#BFDBFE',
    backgroundColor: '#F8FBFF',
  },
  moduleCardPressed: {
    backgroundColor: '#F1F5F9',
  },
  moduleHeader: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  cardIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: '#DBEAFE',
  },
  flagIcon: {
    fontSize: 24,
    lineHeight: 30,
  },
  metalIcon: {
    color: avatarAccent,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 24,
  },
  horoscopeIcon: {
    color: avatarAccent,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 30,
  },
  cardBody: {
    flex: 1,
    gap: spacing.xs,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  cardText: {
    color: colors.mutedText,
    fontSize: 15,
    lineHeight: 22,
  },
  cardDescription: {
    color: colors.mutedText,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  cardSideValue: {
    color: avatarAccent,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 22,
  },
  expandedPanel: {
    gap: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  panelHeader: {
    gap: spacing.xs,
  },
  panelTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  panelHint: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
  },
  cityList: {
    gap: spacing.xs,
  },
  cityRow: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  cityRowSelected: {
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
  },
  cityRowMain: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  cityImage: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: radius.sm,
    backgroundColor: '#EFF6FF',
  },
  cityImageFallback: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: radius.sm,
    backgroundColor: '#EFF6FF',
  },
  cityName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  cityNameSelected: {
    color: colors.primary,
  },
  cityWeather: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  cityRowSide: {
    minWidth: 76,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 2,
  },
  cityTime: {
    color: avatarAccent,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 22,
  },
  iconButton: {
    width: 30,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
  },
  addCitySection: {
    gap: spacing.sm,
  },
  addCityToggle: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  addCityToggleText: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  addCityTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  addCityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  addCityButton: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  addCityText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  cityDetail: {
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: radius.md,
    backgroundColor: '#F0FDF4',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailText: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  exchangeList: {
    gap: spacing.xs,
  },
  exchangeRow: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  exchangeFlag: {
    width: 34,
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'center',
  },
  metalBadge: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: radius.sm,
    backgroundColor: '#EFF6FF',
  },
  metalBadgeText: {
    color: avatarAccent,
    fontSize: 13,
    fontWeight: '900',
  },
  vendorSection: {
    gap: spacing.md,
  },
  vendorList: {
    gap: spacing.xs,
  },
  vendorRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  vendorMain: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  vendorName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  vendorPhone: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  callButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: radius.md,
    backgroundColor: '#EFF6FF',
  },
  exchangeMain: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  exchangeTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  exchangeMeta: {
    color: colors.mutedText,
    fontSize: 12,
    lineHeight: 16,
  },
  exchangeRowSide: {
    minWidth: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 2,
  },
  exchangeValue: {
    color: avatarAccent,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 22,
  },
  addCurrencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  addCurrencyButton: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  addCurrencyFlag: {
    fontSize: 16,
    lineHeight: 20,
  },
  horoscopeList: {
    gap: spacing.xs,
  },
  horoscopeRow: {
    minHeight: 112,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  horoscopeSymbol: {
    width: 34,
    color: avatarAccent,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 30,
    textAlign: 'center',
    paddingTop: 2,
  },
  horoscopeMain: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  horoscopeTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  horoscopeSummary: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
  },
  placeholderCard: {
    minHeight: 74,
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  placeholderTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  placeholderText: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
  },
  notice: {
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: '#EFF6FF',
  },
  noticeText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
});
