export type NepaliCalendarDay = {
  bs_day: number;
  bs_day_ne: string;
  gregorian_date: string;
  weekday: string;
  weekday_ne: string;
  tithi: string;
  events: string[];
  truncated_events?: boolean;
  color: 'red' | 'gray';
};

export type NepaliCalendarMonth = {
  calendar: string;
  year: number;
  month: {
    number: number;
    name_en: string;
    name_ne: string;
  };
  gregorian_range: {
    start: string;
    end: string;
  };
  days: NepaliCalendarDay[];
};

export type NepaliDateResponse = {
  status: number;
  message: string;
  data: string;
};

export const placeholderNepaliDateResponse: NepaliDateResponse = {
  status: 200,
  message: 'Placeholder until Spring Boot provides today date.',
  data: '२३ वैशाख २०८३, बुधवार',
};

export const nepaliCalendarWeekdays = [
  'आइतबार',
  'सोमबार',
  'मङ्गलबार',
  'बुधबार',
  'बिहिबार',
  'शुक्रबार',
  'शनिबार',
];

export const nepaliCalendarWeekdayLabels: Record<string, { ne: string; en: string }> = {
  आइतबार: { ne: 'आइत', en: 'Sun' },
  सोमबार: { ne: 'सोम', en: 'Mon' },
  मङ्गलबार: { ne: 'मङ्गल', en: 'Tue' },
  बुधबार: { ne: 'बुध', en: 'Wed' },
  बिहिबार: { ne: 'बिहि', en: 'Thu' },
  शुक्रबार: { ne: 'शुक्र', en: 'Fri' },
  शनिबार: { ne: 'शनि', en: 'Sat' },
};

export const placeholderNepaliCalendarMonth: NepaliCalendarMonth = {
  calendar: 'Bikram Sambat',
  year: 2081,
  month: {
    number: 1,
    name_en: 'Baishakh',
    name_ne: 'वैशाख',
  },
  gregorian_range: {
    start: '2024-04-13',
    end: '2024-05-13',
  },
  days: [
    { bs_day: 1, bs_day_ne: '१', gregorian_date: '2024-04-13', weekday: 'Saturday', weekday_ne: 'शनिबार', tithi: 'पञ्चमी', events: ['नयाँ वर्ष', 'मेष संक्रान्ति', 'बिस्का: जात्रा'], color: 'red' },
    { bs_day: 2, bs_day_ne: '२', gregorian_date: '2024-04-14', weekday: 'Sunday', weekday_ne: 'आइतबार', tithi: 'षष्ठी', events: [], color: 'red' },
    { bs_day: 3, bs_day_ne: '३', gregorian_date: '2024-04-15', weekday: 'Monday', weekday_ne: 'सोमबार', tithi: 'सप्तमी', events: ['विश्व कला दिवस'], color: 'gray' },
    { bs_day: 4, bs_day_ne: '४', gregorian_date: '2024-04-16', weekday: 'Tuesday', weekday_ne: 'मङ्गलबार', tithi: 'अष्टमी', events: ['जनबहा द्यः जात्रा', 'सेतो मच्छिन्द्रनाथ जात्रा', 'चैते दशैं', 'भोगाष्टमी व्रत'], truncated_events: true, color: 'gray' },
    { bs_day: 5, bs_day_ne: '५', gregorian_date: '2024-04-17', weekday: 'Wednesday', weekday_ne: 'बुधबार', tithi: 'नवमी', events: ['श्री राम नवमी व्रत'], color: 'red' },
    { bs_day: 6, bs_day_ne: '६', gregorian_date: '2024-04-18', weekday: 'Thursday', weekday_ne: 'बिहिबार', tithi: 'दशमी', events: ['विश्व सम्पदा दिवस'], color: 'gray' },
    { bs_day: 7, bs_day_ne: '७', gregorian_date: '2024-04-19', weekday: 'Friday', weekday_ne: 'शुक्रबार', tithi: 'एकादशी', events: ['कामदा एकादशी व्रत'], color: 'gray' },
    { bs_day: 8, bs_day_ne: '८', gregorian_date: '2024-04-20', weekday: 'Saturday', weekday_ne: 'शनिबार', tithi: 'द्वादशी', events: ['छन्द दिवस'], color: 'red' },
    { bs_day: 9, bs_day_ne: '९', gregorian_date: '2024-04-21', weekday: 'Sunday', weekday_ne: 'आइतबार', tithi: 'त्रयोदशी', events: ['महावीर जयन्ती', 'प्रदोष व्रत'], color: 'red' },
    { bs_day: 10, bs_day_ne: '१०', gregorian_date: '2024-04-22', weekday: 'Monday', weekday_ne: 'सोमबार', tithi: 'चतुर्दशी', events: ['विश्व पृथ्वी दिवस'], color: 'gray' },
    { bs_day: 11, bs_day_ne: '११', gregorian_date: '2024-04-23', weekday: 'Tuesday', weekday_ne: 'मङ्गलबार', tithi: 'पूर्णिमा', events: ['लोकतन्त्र दिवस', 'पूर्णिमा व्रत', 'हनुमान जयन्ती', 'बैशाख स्नान प्रारम्भ'], truncated_events: true, color: 'gray' },
    { bs_day: 12, bs_day_ne: '१२', gregorian_date: '2024-04-24', weekday: 'Wednesday', weekday_ne: 'बुधबार', tithi: 'प्रतिपदा*', events: ['विसं २०८१ सालको महामुकुम्भको सम्झना', 'विश्व खोप सप्ताह'], color: 'gray' },
    { bs_day: 13, bs_day_ne: '१३', gregorian_date: '2024-04-25', weekday: 'Thursday', weekday_ne: 'बिहिबार', tithi: 'प्रतिपदा', events: ['विश्व औंलो दिवस'], color: 'gray' },
    { bs_day: 14, bs_day_ne: '१४', gregorian_date: '2024-04-26', weekday: 'Friday', weekday_ne: 'शुक्रबार', tithi: 'द्वितीया', events: ['विश्व बौद्धिक सम्पत्ति दिवस'], color: 'gray' },
    { bs_day: 15, bs_day_ne: '१५', gregorian_date: '2024-04-27', weekday: 'Saturday', weekday_ne: 'शनिबार', tithi: 'तृतीया', events: ['स्वामी शशिधर जन्मजयन्ती'], color: 'red' },
    { bs_day: 16, bs_day_ne: '१६', gregorian_date: '2024-04-28', weekday: 'Sunday', weekday_ne: 'आइतबार', tithi: 'चतुर्थी', events: ['काममा सुरक्षा र स्वास्थ्यको लागि विश्व दिवस'], color: 'red' },
    { bs_day: 17, bs_day_ne: '१७', gregorian_date: '2024-04-29', weekday: 'Monday', weekday_ne: 'सोमबार', tithi: 'पञ्चमी', events: ['अन्तर्राष्ट्रिय नृत्य दिवस'], color: 'gray' },
    { bs_day: 18, bs_day_ne: '१८', gregorian_date: '2024-04-30', weekday: 'Tuesday', weekday_ne: 'मङ्गलबार', tithi: 'सप्तमी*', events: [], color: 'gray' },
    { bs_day: 19, bs_day_ne: '१९', gregorian_date: '2024-05-01', weekday: 'Wednesday', weekday_ne: 'बुधबार', tithi: 'अष्टमी*', events: ['अन्तर्राष्ट्रिय श्रमिक दिवस', 'बुधाष्टमी व्रत', 'गोरखकाली पूजा'], color: 'red' },
    { bs_day: 20, bs_day_ne: '२०', gregorian_date: '2024-05-02', weekday: 'Thursday', weekday_ne: 'बिहिबार', tithi: 'नवमी', events: [], color: 'gray' },
    { bs_day: 21, bs_day_ne: '२१', gregorian_date: '2024-05-03', weekday: 'Friday', weekday_ne: 'शुक्रबार', tithi: 'दशमी', events: ['विश्व प्रेस स्वतन्त्रता दिवस'], color: 'gray' },
    { bs_day: 22, bs_day_ne: '२२', gregorian_date: '2024-05-04', weekday: 'Saturday', weekday_ne: 'शनिबार', tithi: 'एकादशी', events: ['बरुथिनी एकादशी व्रत'], color: 'red' },
    { bs_day: 23, bs_day_ne: '२३', gregorian_date: '2024-05-05', weekday: 'Sunday', weekday_ne: 'आइतबार', tithi: 'द्वादशी', events: ['प्रदोष व्रत', 'विश्व हाँसो दिवस'], color: 'red' },
    { bs_day: 24, bs_day_ne: '२४', gregorian_date: '2024-05-06', weekday: 'Monday', weekday_ne: 'सोमबार', tithi: 'त्रयोदशी', events: ['किराँत समाज सुधार दिवस'], color: 'gray' },
    { bs_day: 25, bs_day_ne: '२५', gregorian_date: '2024-05-07', weekday: 'Tuesday', weekday_ne: 'मङ्गलबार', tithi: 'चतुर्दशी', events: [], color: 'gray' },
    { bs_day: 26, bs_day_ne: '२६', gregorian_date: '2024-05-08', weekday: 'Wednesday', weekday_ne: 'बुधबार', tithi: 'औंसी', events: ['मातातीर्थ औंसी', 'आमाको मुख हेर्ने दिन', 'विश्व रेडक्रस दिवस'], truncated_events: true, color: 'gray' },
    { bs_day: 27, bs_day_ne: '२७', gregorian_date: '2024-05-09', weekday: 'Thursday', weekday_ne: 'बिहिबार', tithi: 'प्रतिपदा', events: ['बुंगद्यः रथारोहण', 'रातो मच्छिन्द्रनाथ रथारोहण'], color: 'gray' },
    { bs_day: 28, bs_day_ne: '२८', gregorian_date: '2024-05-10', weekday: 'Friday', weekday_ne: 'शुक्रबार', tithi: 'द्वितीया*', events: ['अक्षय तृतीया व्रत', 'परशुराम जयन्ती', 'महिला ज्योतिष संघ स्थापना'], truncated_events: true, color: 'gray' },
    { bs_day: 29, bs_day_ne: '२९', gregorian_date: '2024-05-11', weekday: 'Saturday', weekday_ne: 'शनिबार', tithi: 'चतुर्थी', events: ['बुंगद्यः जात्रा', 'रातो मच्छिन्द्रनाथ जात्रा'], color: 'red' },
    { bs_day: 30, bs_day_ne: '३०', gregorian_date: '2024-05-12', weekday: 'Sunday', weekday_ne: 'आइतबार', tithi: 'पञ्चमी', events: ['आद्यगुरु शंकराचार्य जयन्ती', 'रामानुजाचार्य जयन्ती'], truncated_events: true, color: 'red' },
    { bs_day: 31, bs_day_ne: '३१', gregorian_date: '2024-05-13', weekday: 'Monday', weekday_ne: 'सोमबार', tithi: 'षष्ठी', events: [], color: 'gray' },
  ],
};
