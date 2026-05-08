export enum City {
  Kathmandu = 'Kathmandu',
  NewYork = 'New York',
  SanFrancisco = 'San Francisco',
  Seattle = 'Seattle',
  Austin = 'Austin',
  Chicago = 'Chicago',
  Boston = 'Boston',
  Dallas = 'Dallas',
}

export enum CountryCode {
  NP = 'NP',
  US = 'US',
}

export type HomeLocation = {
  city: City;
  countryCode: CountryCode;
};

export type HeaderFlag = {
  countryCode: CountryCode;
  label: string;
  imageUrl: string;
};

export type CityInfo = HomeLocation & {
  id: string;
  timeZone: string;
  weather: string;
  temperature: string;
  imageUrl?: string;
};

export type ExchangeRate = {
  code: string;
  name: string;
  flag: string;
  unit: number;
  buy: string;
  sell?: string;
};

export type PreciousMetalRate = {
  code: string;
  name: string;
  symbol: string;
  unit: string;
  price: string;
};

export type GoldVendor = {
  id: string;
  name: string;
  phone: string;
};

export type SuchanaPatiPreview = {
  id: string;
  name: string;
  category: string;
  info: string;
  phoneNumber: string;
  photo: string;
  rating: number;
  showOnHome: boolean;
  homeOrder: number;
  adType: string;
};

export type HomeRoomPreview = {
  id: string;
  title: string;
  listingType: string;
  price: string;
  location: string;
  phoneNumber: string;
  description: string;
  photo: string;
  showOnHome: boolean;
  homeOrder: number;
};

export type HomeKathaKabitaPreview = {
  id: string;
  title: string;
  contentType: 'Katha' | 'Kabita' | 'Gazal';
  writer: string;
  publishedDate: string;
  excerpt: string;
  likeCount: number;
  showOnHome: boolean;
  homeOrder: number;
};

export type HomeBuySellPreview = {
  id: string;
  title: string;
  category: string;
  condition: string;
  price: string;
  location: string;
  phoneNumber: string;
  description: string;
  photo: string;
  showOnHome: boolean;
  homeOrder: number;
};

export type HomeFeedItem =
  | { id: string; kind: 'suchana'; item: SuchanaPatiPreview; homeOrder: number }
  | { id: string; kind: 'room'; item: HomeRoomPreview; homeOrder: number }
  | { id: string; kind: 'katha-kabita'; item: HomeKathaKabitaPreview; homeOrder: number }
  | { id: string; kind: 'buy-sell'; item: HomeBuySellPreview; homeOrder: number };

export type NepaliHoroscope = {
  id: string;
  name: string;
  englishName: string;
  symbol: string;
  summary: string;
};

export const cityImageUrls: Record<string, string> = {
  'kathmandu-np': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=160&h=160&fit=crop',
  'new-york-us': 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=160&h=160&fit=crop',
  'san-francisco-us': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=160&h=160&fit=crop',
  'seattle-us': 'https://images.unsplash.com/photo-1502175353174-a7a70e73b362?w=160&h=160&fit=crop',
  'austin-us': 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=160&h=160&fit=crop',
  'chicago-us': 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=160&h=160&fit=crop',
  'boston-us': 'https://images.unsplash.com/photo-1501979376754-2ff867a4f659?w=160&h=160&fit=crop',
  'dallas-us': 'https://images.unsplash.com/photo-1541475960355-54c4e7d7e92f?w=160&h=160&fit=crop',
};

export const headerFlag: HeaderFlag = {
  countryCode: CountryCode.NP,
  label: 'Nepal flag',
  imageUrl: 'https://flagcdn.com/w160/np.png',
};

export const homeLocationOptions: HomeLocation[] = [
  { city: City.Kathmandu, countryCode: CountryCode.NP },
  { city: City.NewYork, countryCode: CountryCode.US },
  { city: City.SanFrancisco, countryCode: CountryCode.US },
  { city: City.Seattle, countryCode: CountryCode.US },
  { city: City.Austin, countryCode: CountryCode.US },
];

export const cityCatalog: CityInfo[] = [
  { id: 'kathmandu-np', city: City.Kathmandu, countryCode: CountryCode.NP, timeZone: 'Asia/Kathmandu', weather: 'Mild with mountain haze', temperature: '68 F' },
  { id: 'new-york-us', city: City.NewYork, countryCode: CountryCode.US, timeZone: 'America/New_York', weather: 'Partly cloudy', temperature: '72 F' },
  { id: 'san-francisco-us', city: City.SanFrancisco, countryCode: CountryCode.US, timeZone: 'America/Los_Angeles', weather: 'Cool coastal breeze', temperature: '61 F' },
  { id: 'seattle-us', city: City.Seattle, countryCode: CountryCode.US, timeZone: 'America/Los_Angeles', weather: 'Light rain nearby', temperature: '58 F' },
  { id: 'austin-us', city: City.Austin, countryCode: CountryCode.US, timeZone: 'America/Chicago', weather: 'Warm and clear', temperature: '84 F' },
  { id: 'chicago-us', city: City.Chicago, countryCode: CountryCode.US, timeZone: 'America/Chicago', weather: 'Breezy afternoon', temperature: '66 F' },
  { id: 'boston-us', city: City.Boston, countryCode: CountryCode.US, timeZone: 'America/New_York', weather: 'Crisp and sunny', temperature: '64 F' },
  { id: 'dallas-us', city: City.Dallas, countryCode: CountryCode.US, timeZone: 'America/Chicago', weather: 'Dry and hot', temperature: '89 F' },
];

export const defaultHomePreferences = {
  location: {
    city: City.Kathmandu,
    countryCode: CountryCode.NP,
  },
  timeCityIds: ['kathmandu-np', 'new-york-us', 'san-francisco-us'],
  exchangeRateCodes: ['USD'],
  preciousMetalCodes: ['GOLD', 'SILVER'],
  horoscopeId: 'mesh',
  homeFeed: {
    enabled: true,
    maxItems: 16,
    allowedSuchanaTypes: ['inline-card'],
  },
};

export const exchangeRates: ExchangeRate[] = [
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

export const preciousMetalRates: PreciousMetalRate[] = [
  { code: 'GOLD', name: 'Gold', symbol: 'Au', unit: '1 tola', price: '235,400' },
  { code: 'SILVER', name: 'Silver', symbol: 'Ag', unit: '1 tola', price: '3,050' },
  { code: 'PLATINUM', name: 'Platinum', symbol: 'Pt', unit: '1 tola', price: '142,800' },
  { code: 'PALLADIUM', name: 'Palladium', symbol: 'Pd', unit: '1 tola', price: '129,600' },
];

export const goldVendorsByLocation: Record<string, GoldVendor[]> = {
  [`${City.Kathmandu}-${CountryCode.NP}`]: [
    { id: 'new-road-gold-center', name: 'New Road Gold Center', phone: '+9779800000001' },
    { id: 'bishal-bazaar-jewellers', name: 'Bishal Bazaar Jewellers', phone: '+9779800000002' },
    { id: 'durbar-marg-gold-house', name: 'Durbar Marg Gold House', phone: '+9779800000003' },
  ],
};

export const suchanaPatiPreviews: SuchanaPatiPreview[] = [
  { id: 'himalayan-momo-house', name: 'Himalayan Momo House', category: 'Restaurant', info: 'Fresh momo and Nepali snacks near the local market.', phoneNumber: '+9779800001001', photo: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=240&h=240&fit=crop', rating: 4.6, showOnHome: true, homeOrder: 2, adType: 'inline-card' },
  { id: 'new-road-gold-care', name: 'New Road Gold Care', category: 'Jewellery', info: 'Gold, silver, repair, polish, and custom orders.', phoneNumber: '+9779800001003', photo: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=240&h=240&fit=crop', rating: 4.8, showOnHome: true, homeOrder: 5, adType: 'inline-card' },
  { id: 'namaste-remit', name: 'Namaste Remit & Travel', category: 'Remittance', info: 'Money transfer, ticket booking, and document help for local families.', phoneNumber: '+9779800001002', photo: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?w=240&h=240&fit=crop', rating: 4.4, showOnHome: true, homeOrder: 7, adType: 'inline-card' },
  { id: 'everest-tax-service', name: 'Everest Tax Service', category: 'Tax', info: 'Tax filing, ITIN support, translation, and appointment help.', phoneNumber: '+19730001004', photo: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=240&h=240&fit=crop', rating: 4.7, showOnHome: true, homeOrder: 8, adType: 'inline-card' },
];

export const roomPreviews: HomeRoomPreview[] = [
  { id: 'kathmandu-single-room-balaju', title: 'Sunny single room near Balaju', listingType: 'Single room', price: 'रु 12,000 / month', location: 'Balaju, Kathmandu, NP', phoneNumber: '+9779800002101', description: 'Clean furnished room with shared kitchen, attached balcony, and easy bus access.', photo: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=240&h=240&fit=crop', showOnHome: true, homeOrder: 1 },
  { id: 'kathmandu-apartment-baneshwor', title: '2BHK apartment in Baneshwor', listingType: 'Apartment', price: 'रु 38,000 / month', location: 'New Baneshwor, Kathmandu, NP', phoneNumber: '+9779800002102', description: 'Two-bedroom apartment with parking, water tank, sunlight, and nearby grocery stores.', photo: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=240&h=240&fit=crop', showOnHome: true, homeOrder: 4 },
  { id: 'kathmandu-shared-space-patan', title: 'Shared space for student or worker', listingType: 'Shared space', price: 'रु 8,500 / month', location: 'Patan, Lalitpur, NP', phoneNumber: '+9779800002103', description: 'Shared room in a quiet home. Wi-Fi, drinking water, and simple cooking area included.', photo: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=240&h=240&fit=crop', showOnHome: true, homeOrder: 6 },
  { id: 'queens-basement-room', title: 'Private basement room in Queens', listingType: 'Single room', price: '$850 / month', location: 'Queens, New York, US', phoneNumber: '+17180002104', description: 'Private room near transit with shared kitchen, laundry access, and utilities included.', photo: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=240&h=240&fit=crop', showOnHome: true, homeOrder: 9 },
];

export const kathaKabitaPreviews: HomeKathaKabitaPreview[] = [
  {
    id: 'chiya-pasal-ko-katha',
    title: 'चिया पसलको कथा',
    contentType: 'Katha',
    writer: 'मिलन गुरुङ',
    publishedDate: '२०८३ वैशाख २४',
    excerpt: 'पुरानो चिया पसलमा हरेक बिहान एउटै गीत बज्थ्यो। त्यही गीतसँगै मानिसहरू आफ्ना साना सपना र ठूला चिन्ता लिएर आउँथे। पसलेले सबैको कुरा सुन्थ्यो, तर कहिल्यै हतारमा जवाफ दिँदैनथ्यो।\n\nएक दिन बिहानै पानी परिरहेको थियो। सडक सुनसान थियो, तर पसलको कुनामा बसेको वृद्ध मानिसले चिया समातेर भन्यो, घर भनेको कहिलेकाहीँ पर्खिरहेको ठाउँ होइन, सुन्ने मान्छे हो। त्यो वाक्य सुनेपछि पसलमा बसेका सबै एकछिन चुप भए।\n\nत्यस दिनदेखि चिया पसलमा आउनेहरू चिया मात्र पिउन आउँदैनथे। कसैले कामको थकान ल्याउँथ्यो, कसैले घरको सम्झना, कसैले नयाँ सुरुवातको डर। पसले मुस्कुराएर कप अगाडि सार्थ्यो र भन्थ्यो, बिस्तारै भन, आज समय छ।\n\nत्यो पसलमा एउटा पुरानो कापी पनि थियो। कोही धेरै बोल्न नसक्ने भयो भने त्यो कापी खोलेर दुई लाइन लेख्थ्यो। कसैले लेख्थ्यो, आमा सम्झिएँ। कसैले लेख्थ्यो, आज काम पाएँ। कसैले लेख्थ्यो, म फेरि सुरु गर्छु। पसले बेलुका पसल बन्द गर्नु अघि ती पानाहरू पल्टाउँथ्यो र बत्ती निभाउनु अघि एकछिन मुस्कुराउँथ्यो।\n\nधेरै वर्षपछि त्यो चिया पसल सानो पुस्तकालय जस्तै बन्यो। भित्तामा पुराना कपका दाग थिए, टेबलमा वर्षौंको आवाज अडिएको थियो, र ढोकामा अझै त्यही गीत बज्थ्यो। आउने मान्छे फेरिए, मौसम फेरियो, शहरको बाटो फेरियो, तर पसलभित्र पस्दा सबैलाई लाग्थ्यो, यहाँ कसैले सुन्छ।',
    likeCount: 63,
    showOnHome: true,
    homeOrder: 3,
  },
  { id: 'sajha-ko-ghazal', title: 'साँझको गजल', contentType: 'Gazal', writer: 'अनुप शर्मा', publishedDate: '२०८३ वैशाख २३', excerpt: 'साँझ झर्दा सम्झनाले ढोका ढकढक्यायो, मनको आँगनमा तिम्रो नामले दीप बाल्यो।', likeCount: 128, showOnHome: true, homeOrder: 6 },
  { id: 'phool-ra-bato', title: 'फूल र बाटो', contentType: 'Kabita', writer: 'रीना श्रेष्ठ', publishedDate: '२०८३ वैशाख २०', excerpt: 'बाटोले भन्यो, हिँडिराख। फूलले भन्यो, मुस्कुराइराख। जीवनले बिस्तारै सिकायो।', likeCount: 94, showOnHome: true, homeOrder: 7 },
  { id: 'home-road', title: 'Road Back Home', contentType: 'Kabita', writer: 'Suman Rai', publishedDate: 'May 6, 2026', excerpt: 'I carry a small map of home in my chest, a street of rain, a window of light.', likeCount: 76, showOnHome: true, homeOrder: 10 },
  { id: 'aama-ko-chithi', title: 'आमाको चिठी', contentType: 'Katha', writer: 'सविना लामा', publishedDate: '२०८३ वैशाख १९', excerpt: 'टाढा सहरमा बसेको छोराले हरेक आइतबार आमाको चिठी पढ्थ्यो। अक्षरहरू साना थिए, तर त्यसमा घरको आँगन, तुलसीको बोट, र भान्साको न्यानो गन्ध अटाएको हुन्थ्यो।', likeCount: 87, showOnHome: true, homeOrder: 12 },
  { id: 'pahadko-bato', title: 'पहाडको बाटो', contentType: 'Kabita', writer: 'दिपक खत्री', publishedDate: '२०८३ वैशाख १८', excerpt: 'पहाडको बाटो बिस्तारै उकालो लाग्छ। पाइला थाक्छन्, तर आँखाले टाढाको उज्यालो देखिरहन्छ।', likeCount: 52, showOnHome: true, homeOrder: 13 },
  { id: 'parkhaiko-geet', title: 'पर्खाइको गीत', contentType: 'Gazal', writer: 'निमा शेर्पा', publishedDate: '२०८३ वैशाख १७', excerpt: 'पर्खाइको गीत सुनसान रातले गुनगुनायो। मुटुले पुरानो सम्झनाको ढोका फेरि खोल्यो।', likeCount: 109, showOnHome: true, homeOrder: 14 },
  { id: 'naya-bihan', title: 'नयाँ बिहान', contentType: 'Kabita', writer: 'किरण राई', publishedDate: '२०८३ वैशाख १६', excerpt: 'नयाँ बिहान झ्यालबाट भित्र आयो। मनले बिस्तारै भन्यो, आज फेरि सुरु गर्न सकिन्छ।', likeCount: 71, showOnHome: true, homeOrder: 15 },
  { id: 'sunaulo-sajh', title: 'सुनौलो साँझ', contentType: 'Kabita', writer: 'प्रकाश थापा', publishedDate: '२०८३ वैशाख १५', excerpt: 'सुनौलो साँझले छानोमा बिस्तारै उज्यालो राख्यो। दिनभरको थकानले पनि मनमा सानो आशा छोडेर गयो।', likeCount: 65, showOnHome: true, homeOrder: 16 },
  { id: 'bato-ko-manche', title: 'बाटोको मान्छे', contentType: 'Katha', writer: 'आरती खड्का', publishedDate: '२०८३ वैशाख १४', excerpt: 'हरेक दिन एउटै बाटो हिँड्ने मानिसले एक दिन रोकिएर सडकछेउको फूल हेर्‍यो। त्यसपछि उसलाई लाग्यो, व्यस्तताले कति कुरा चुपचाप लुकाउँदो रहेछ।', likeCount: 83, showOnHome: true, homeOrder: 17 },
  { id: 'junko-chhaya', title: 'जूनको छाया', contentType: 'Gazal', writer: 'महेन्द्र कार्की', publishedDate: '२०८३ वैशाख १३', excerpt: 'जूनको छायाले पुरानो आँगन छोयो। सम्झनाले फेरि मनको ढोका खोल्यो।', likeCount: 92, showOnHome: true, homeOrder: 18 },
  { id: 'gaunko-samjhana', title: 'गाउँको सम्झना', contentType: 'Kabita', writer: 'सरिता राई', publishedDate: '२०८३ वैशाख १२', excerpt: 'गाउँको सम्झना आउँदा खोलाको आवाज पनि नजिक लाग्छ। टाढा बसेको मनले माटोको गन्ध खोजिरहन्छ।', likeCount: 118, showOnHome: true, homeOrder: 19 },
  { id: 'aakashko-rang', title: 'आकाशको रंग', contentType: 'Kabita', writer: 'बिशाल गुरुङ', publishedDate: '२०८३ वैशाख ११', excerpt: 'आकाशको रंग फेरिँदा मनले पनि नयाँ भाषा सिक्छ। बादलहरू टाढा गएपछि उज्यालो आफैं बोल्छ।', likeCount: 57, showOnHome: true, homeOrder: 20 },
  { id: 'sano-diyo', title: 'सानो दियो', contentType: 'Katha', writer: 'माया श्रेष्ठ', publishedDate: '२०८३ वैशाख १०', excerpt: 'बत्ती गएको रातमा हजुरआमाले सानो दियो बालिन्। त्यो दियोले कोठा मात्र होइन, बच्चाको डर पनि बिस्तारै उज्यालो बनायो।', likeCount: 104, showOnHome: true, homeOrder: 21 },
  { id: 'pardesko-bihan', title: 'परदेशको बिहान', contentType: 'Kabita', writer: 'रोशन पौडेल', publishedDate: '२०८३ वैशाख ९', excerpt: 'परदेशको बिहान फरक सुनिन्छ। घडीले काम सम्झाउँछ, तर मनले घरको ढोका।', likeCount: 89, showOnHome: true, homeOrder: 22 },
  { id: 'khali-kursi', title: 'खाली कुर्सी', contentType: 'Gazal', writer: 'इशा बस्नेत', publishedDate: '२०८३ वैशाख ८', excerpt: 'खाली कुर्सीले अझै तिम्रो नाम सम्झन्छ। चियाको कप चिसो भयो, तर पर्खाइ तातै छ।', likeCount: 132, showOnHome: true, homeOrder: 23 },
  { id: 'pustak-ra-pankha', title: 'पुस्तक र पङ्खा', contentType: 'Katha', writer: 'सागर लामा', publishedDate: '२०८३ वैशाख ७', excerpt: 'पुरानो पुस्तक पसलमा एउटा पङ्खा सधैं ढिलो घुम्थ्यो। त्यसको आवाजसँगै कथाहरू झन् नजिक सुनिन्थे।', likeCount: 78, showOnHome: true, homeOrder: 24 },
  { id: 'hawa-ko-sandesh', title: 'हावाको सन्देश', contentType: 'Kabita', writer: 'लुना तामाङ', publishedDate: '२०८३ वैशाख ६', excerpt: 'हावाले आज झ्यालमा सानो सन्देश छोड्यो। कसैले भन्यो, बिर्सनु पनि कहिलेकाहीँ निको हुनु हो।', likeCount: 96, showOnHome: true, homeOrder: 25 },
];

export const buySellPreviews: HomeBuySellPreview[] = [
  { id: 'wooden-dining-table-kathmandu', title: 'Wooden dining table with 4 chairs', category: 'Furniture', condition: 'Used', price: 'रु 18,000', location: 'Baneshwor, Kathmandu, NP', phoneNumber: '+9779800003101', description: 'Solid wooden dining set in good condition. Buyer can inspect before pickup.', photo: 'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=240&h=240&fit=crop', showOnHome: true, homeOrder: 5 },
  { id: 'iphone-14-queens', title: 'iPhone 14, 128GB unlocked', category: 'Electronics', condition: 'Like new', price: '$520', location: 'Queens, New York, US', phoneNumber: '+17180003102', description: 'Unlocked phone with box and charger. No repair history, small case marks only.', photo: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=240&h=240&fit=crop', showOnHome: true, homeOrder: 7 },
  { id: 'scooter-lalitpur', title: 'Honda Dio scooter', category: 'Vehicle', condition: 'Used', price: 'रु 145,000', location: 'Patan, Lalitpur, NP', phoneNumber: '+9779800003103', description: 'Regularly serviced scooter, blue book clear, suitable for daily commute.', photo: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=240&h=240&fit=crop', showOnHome: true, homeOrder: 11 },
  { id: 'study-desk-kathmandu', title: 'Study desk with bookshelf', category: 'Furniture', condition: 'Good', price: 'रु 7,500', location: 'Koteshwor, Kathmandu, NP', phoneNumber: '+9779800003104', description: 'Compact study desk with attached shelf. Good for students or home office setup.', photo: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=240&h=240&fit=crop', showOnHome: true, homeOrder: 16 },
  { id: 'rice-cooker-bhaktapur', title: 'Electric rice cooker 1.8L', category: 'Appliance', condition: 'Used', price: 'रु 2,200', location: 'Suryabinayak, Bhaktapur, NP', phoneNumber: '+9779800003105', description: 'Working rice cooker with steaming tray. Selling because of upgrade.', photo: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=240&h=240&fit=crop', showOnHome: true, homeOrder: 17 },
  { id: 'winter-jacket-queens', title: 'North face winter jacket', category: 'Clothing', condition: 'Like new', price: '$75', location: 'Queens, New York, US', phoneNumber: '+17180003106', description: 'Warm winter jacket, size medium. Clean and barely worn.', photo: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=240&h=240&fit=crop', showOnHome: true, homeOrder: 18 },
  { id: 'baby-stroller-dallas', title: 'Foldable baby stroller', category: 'Baby', condition: 'Used', price: '$90', location: 'Irving, Dallas, US', phoneNumber: '+19720003107', description: 'Lightweight foldable stroller with storage basket. Smooth wheels and clean fabric.', photo: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=240&h=240&fit=crop', showOnHome: true, homeOrder: 19 },
  { id: 'mountain-bike-lalitpur', title: 'Mountain bike 21 speed', category: 'Sports', condition: 'Good', price: 'रु 22,000', location: 'Jawalakhel, Lalitpur, NP', phoneNumber: '+9779800003108', description: 'Maintained mountain bike with new brake pads. Suitable for city and trail rides.', photo: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=240&h=240&fit=crop', showOnHome: true, homeOrder: 20 },
  { id: 'microwave-seattle', title: 'Countertop microwave', category: 'Appliance', condition: 'Used', price: '$45', location: 'Bellevue, Seattle, US', phoneNumber: '+14250003109', description: 'Clean working microwave. Pickup only, available this weekend.', photo: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=240&h=240&fit=crop', showOnHome: true, homeOrder: 21 },
  { id: 'nepali-books-boston', title: 'Nepali books bundle', category: 'Books', condition: 'Good', price: '$30', location: 'Somerville, Boston, US', phoneNumber: '+16170003110', description: 'Bundle of Nepali novels, poems, and exam prep books. Prefer selling together.', photo: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=240&h=240&fit=crop', showOnHome: true, homeOrder: 22 },
  { id: 'gas-heater-kathmandu', title: 'Portable gas heater', category: 'Appliance', condition: 'Used', price: 'रु 6,800', location: 'Maharajgunj, Kathmandu, NP', phoneNumber: '+9779800003111', description: 'Portable gas heater in working condition. Includes pipe and regulator.', photo: 'https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?w=240&h=240&fit=crop', showOnHome: true, homeOrder: 23 },
  { id: 'monitor-austin', title: '24 inch Dell monitor', category: 'Electronics', condition: 'Good', price: '$85', location: 'Round Rock, Austin, US', phoneNumber: '+15120003112', description: 'Full HD Dell monitor with HDMI cable and stand. No dead pixels.', photo: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=240&h=240&fit=crop', showOnHome: true, homeOrder: 24 },
  { id: 'guitar-kathmandu', title: 'Acoustic guitar with bag', category: 'Music', condition: 'Good', price: 'रु 9,500', location: 'Boudha, Kathmandu, NP', phoneNumber: '+9779800003113', description: 'Acoustic guitar with soft bag and extra strings. Good sound, minor scratches.', photo: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=240&h=240&fit=crop', showOnHome: true, homeOrder: 25 },
];

export const nepaliHoroscopes: NepaliHoroscope[] = [
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

export function getHomeFeedItems() {
  if (!defaultHomePreferences.homeFeed.enabled) {
    return [];
  }

  const suchanaItems: HomeFeedItem[] = suchanaPatiPreviews
    .filter(
      (item) =>
        item.showOnHome &&
        defaultHomePreferences.homeFeed.allowedSuchanaTypes.includes(item.adType),
    )
    .map((item) => ({ id: item.id, kind: 'suchana', item, homeOrder: item.homeOrder }));

  const roomItems: HomeFeedItem[] = roomPreviews
    .filter((item) => item.showOnHome)
    .map((item) => ({ id: item.id, kind: 'room', item, homeOrder: item.homeOrder }));

  const kathaKabitaItems: HomeFeedItem[] = kathaKabitaPreviews
    .filter((item) => item.showOnHome)
    .map((item) => ({ id: item.id, kind: 'katha-kabita', item, homeOrder: item.homeOrder }));

  const buySellItems: HomeFeedItem[] = buySellPreviews
    .filter((item) => item.showOnHome)
    .map((item) => ({ id: item.id, kind: 'buy-sell', item, homeOrder: item.homeOrder }));

  return [...suchanaItems, ...roomItems, ...kathaKabitaItems, ...buySellItems]
    .sort((firstItem, secondItem) => firstItem.homeOrder - secondItem.homeOrder);
}

export function formatTime(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone,
  }).format(date);
}

export function formatDate(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone,
  }).format(date);
}
