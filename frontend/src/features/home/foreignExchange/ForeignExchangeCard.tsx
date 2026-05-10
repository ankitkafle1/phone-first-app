import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radius, spacing } from '../../../constants/theme';
import { defaultHomePreferences, exchangeRates, type ExchangeRate } from '../homeData';

const avatarAccent = '#003577';

const orderedExchangeRates = [
  ...exchangeRates.filter((rate) => rate.code === 'USD'),
  ...exchangeRates.filter((rate) => rate.code !== 'USD'),
];

export function ForeignExchangeCard() {
  const [visibleRateCodes, setVisibleRateCodes] = useState(
    defaultHomePreferences.exchangeRateCodes,
  );
  const [isAddCurrencyOpen, setIsAddCurrencyOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [converterAmount, setConverterAmount] = useState('1');
  const [fromCurrencyCode, setFromCurrencyCode] = useState(
    defaultHomePreferences.exchangeRateCodes[0] ?? 'USD',
  );
  const [toCurrencyCode, setToCurrencyCode] = useState('NPR');
  const visibleRates = orderedExchangeRates.filter((rate) => visibleRateCodes.includes(rate.code));
  const hiddenRates = orderedExchangeRates.filter((rate) => !visibleRateCodes.includes(rate.code));
  const converterCurrencies = getConverterCurrencies();
  const fromCurrency = converterCurrencies.find((currency) => currency.code === fromCurrencyCode);
  const toCurrency = converterCurrencies.find((currency) => currency.code === toCurrencyCode);
  const convertedAmount =
    fromCurrency && toCurrency ? formatConvertedAmount(converterAmount, fromCurrency, toCurrency) : '-';

  function handleRemoveRate(code: string) {
    setVisibleRateCodes((codes) => codes.filter((visibleCode) => visibleCode !== code));

    setFromCurrencyCode((currentCode) => (currentCode === code ? 'USD' : currentCode));
    setToCurrencyCode((currentCode) => (currentCode === code ? 'NPR' : currentCode));
  }

  function handleAddRate(code: string) {
    setVisibleRateCodes((codes) => [...codes, code]);
    setFromCurrencyCode(code);
    setIsAddCurrencyOpen(false);
  }

  return (
    <View style={styles.card}>
      <View style={styles.accent} />

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        onPress={() => setIsExpanded((expanded) => !expanded)}
        style={({ pressed }) => [styles.header, pressed && styles.pressed]}
      >
        <View style={styles.headerIcon}>
          <Text style={styles.headerFlag}>🇺🇸</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Foreign Exchange</Text>
          <Text style={styles.headerMeta}>{visibleRates.length} currencies</Text>
        </View>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.mutedText}
        />
      </Pressable>

      <View style={styles.rows}>
        {visibleRates.map((rate) => (
          <ExchangeRateRow
            isSelected={fromCurrencyCode === rate.code || toCurrencyCode === rate.code}
            key={rate.code}
            onRemove={() => handleRemoveRate(rate.code)}
            onSelect={() => {
              setFromCurrencyCode(rate.code);
              setIsExpanded(true);
            }}
            rate={rate}
          />
        ))}
      </View>

      {isExpanded ? (
        <>
          <View style={styles.converterCard}>
            <View style={styles.converterHeader}>
              <Ionicons name="calculator-outline" size={18} color="#4F46E5" />
              <Text style={styles.converterTitle}>Money converter</Text>
            </View>
            <View style={styles.converterBody}>
              <View style={styles.amountField}>
                <TextInput
                  keyboardType="decimal-pad"
                  onChangeText={setConverterAmount}
                  placeholder="Amount"
                  placeholderTextColor={colors.mutedText}
                  style={styles.amountInput}
                  value={converterAmount}
                />
                <Text style={styles.currencyCode}>{fromCurrency?.code ?? '-'}</Text>
              </View>
              <Ionicons name="swap-horizontal" size={18} color={colors.mutedText} />
              <View style={styles.resultField}>
                <Text style={styles.resultValue}>{convertedAmount}</Text>
                <Text style={styles.resultLabel}>{toCurrency?.code ?? '-'}</Text>
              </View>
            </View>
            <View style={styles.currencyPickerGrid}>
              <CurrencyPicker
                currencies={converterCurrencies}
                label="From"
                selectedCode={fromCurrencyCode}
                onSelect={setFromCurrencyCode}
              />
              <CurrencyPicker
                currencies={converterCurrencies}
                label="To"
                selectedCode={toCurrencyCode}
                onSelect={setToCurrencyCode}
              />
            </View>
            <Text style={styles.converterHint}>
              Based on NPR sell rates from the selected currency list.
            </Text>
          </View>

          {hiddenRates.length ? (
            <View style={styles.addCurrencySection}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded: isAddCurrencyOpen }}
                onPress={() => setIsAddCurrencyOpen((isOpen) => !isOpen)}
                style={({ pressed }) => [styles.addCurrencyToggle, pressed && styles.pressed]}
              >
                <View style={styles.addCurrencyToggleText}>
                  <Ionicons name="add-circle-outline" size={18} color="#4F46E5" />
                  <Text style={styles.addCurrencyTitle}>Add currency</Text>
                </View>
                <Ionicons
                  name={isAddCurrencyOpen ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={colors.mutedText}
                />
              </Pressable>

              {isAddCurrencyOpen ? (
                <View style={styles.addCurrencyGrid}>
                  {hiddenRates.map((rate) => (
                    <Pressable
                      accessibilityRole="button"
                      key={rate.code}
                      onPress={() => handleAddRate(rate.code)}
                      style={({ pressed }) => [styles.addCurrencyButton, pressed && styles.pressed]}
                    >
                      <Text style={styles.addCurrencyFlag}>{rate.flag}</Text>
                      <Text style={styles.addCurrencyText}>{rate.code}</Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </View>
          ) : null}
        </>
      ) : null}
    </View>
  );
}

function ExchangeRateRow({
  isSelected,
  onRemove,
  onSelect,
  rate,
}: {
  isSelected: boolean;
  onRemove: () => void;
  onSelect: () => void;
  rate: ExchangeRate;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      onPress={onSelect}
      style={({ pressed }) => [
        styles.rateRow,
        isSelected && styles.rateRowSelected,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.rateFlag}>{rate.flag}</Text>
      <View style={styles.rateMain}>
        <Text style={styles.rateTitle}>
          {rate.code} · {rate.name}
        </Text>
        <Text style={styles.rateMeta}>
          {rate.unit} {rate.code} to Nepalese Rupee
        </Text>
      </View>
      <Text style={styles.rateValue}>{rate.sell ?? '-'}</Text>
      <Pressable
        accessibilityLabel={`Remove ${rate.code}`}
        onPress={onRemove}
        style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
      >
        <Ionicons name="remove" size={18} color={colors.mutedText} />
      </Pressable>
    </Pressable>
  );
}

type ConverterCurrency = {
  code: string;
  flag: string;
  name: string;
  nprPerUnit: number;
};

function CurrencyPicker({
  currencies,
  label,
  onSelect,
  selectedCode,
}: {
  currencies: ConverterCurrency[];
  label: string;
  onSelect: (code: string) => void;
  selectedCode: string;
}) {
  return (
    <View style={styles.pickerBlock}>
      <Text style={styles.pickerLabel}>{label}</Text>
      <View style={styles.pickerGrid}>
        {currencies.map((currency) => {
          const isSelected = currency.code === selectedCode;

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              key={`${label}-${currency.code}`}
              onPress={() => onSelect(currency.code)}
              style={({ pressed }) => [
                styles.pickerChip,
                isSelected && styles.pickerChipSelected,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.pickerChipText}>
                {currency.flag} {currency.code}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function getConverterCurrencies(): ConverterCurrency[] {
  const nprCurrency: ConverterCurrency = {
    code: 'NPR',
    flag: '🇳🇵',
    name: 'Nepalese Rupee',
    nprPerUnit: 1,
  };

  const rateCurrencies = orderedExchangeRates
    .filter((rate) => rate.sell)
    .map((rate) => ({
      code: rate.code,
      flag: rate.flag,
      name: rate.name,
      nprPerUnit: Number.parseFloat((rate.sell ?? '0').replace(/,/g, '')) / rate.unit,
    }));

  return [nprCurrency, ...rateCurrencies];
}

function formatConvertedAmount(
  amount: string,
  fromCurrency: ConverterCurrency,
  toCurrency: ConverterCurrency,
) {
  const parsedAmount = Number.parseFloat(amount.replace(/,/g, ''));

  if (
    !Number.isFinite(parsedAmount) ||
    !Number.isFinite(fromCurrency.nprPerUnit) ||
    !Number.isFinite(toCurrency.nprPerUnit) ||
    toCurrency.nprPerUnit <= 0
  ) {
    return '-';
  }

  const converted = (parsedAmount * fromCurrency.nprPerUnit) / toCurrency.nprPerUnit;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(converted);
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    overflow: 'hidden',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#A5B4FC',
    borderRadius: radius.md,
    backgroundColor: '#F8FAFF',
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: '#4F46E5',
  },
  header: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  headerFlag: {
    fontSize: 23,
    lineHeight: 30,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  headerMeta: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: '800',
  },
  rows: {
    gap: spacing.sm,
  },
  rateRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  rateRowSelected: {
    borderColor: '#818CF8',
    backgroundColor: '#EEF2FF',
  },
  rateFlag: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: radius.sm,
    backgroundColor: '#EEF2FF',
    fontSize: 24,
    lineHeight: 54,
    textAlign: 'center',
  },
  rateMain: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  rateTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  rateMeta: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  rateValue: {
    minWidth: 76,
    color: avatarAccent,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 22,
    textAlign: 'right',
  },
  iconButton: {
    width: 28,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
  },
  converterCard: {
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  converterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  converterTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  converterBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  amountField: {
    flex: 1,
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: radius.md,
    backgroundColor: '#F8FAFF',
  },
  amountInput: {
    flex: 1,
    minWidth: 0,
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  currencyCode: {
    color: '#4F46E5',
    fontSize: 13,
    fontWeight: '900',
  },
  resultField: {
    flex: 1,
    minHeight: 46,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: radius.md,
    backgroundColor: '#EEF2FF',
  },
  resultValue: {
    color: avatarAccent,
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 22,
  },
  resultLabel: {
    color: colors.mutedText,
    fontSize: 11,
    fontWeight: '900',
    lineHeight: 15,
  },
  converterHint: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
  currencyPickerGrid: {
    gap: spacing.sm,
  },
  pickerBlock: {
    gap: spacing.xs,
  },
  pickerLabel: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '900',
  },
  pickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  pickerChip: {
    minHeight: 32,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  pickerChipSelected: {
    borderColor: '#818CF8',
    backgroundColor: '#EEF2FF',
  },
  pickerChipText: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '900',
  },
  addCurrencySection: {
    gap: spacing.sm,
  },
  addCurrencyToggle: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  addCurrencyToggleText: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  addCurrencyTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  addCurrencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  addCurrencyButton: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  addCurrencyFlag: {
    fontSize: 16,
    lineHeight: 20,
  },
  addCurrencyText: {
    color: '#4F46E5',
    fontSize: 13,
    fontWeight: '800',
  },
  pressed: {
    backgroundColor: '#F1F5F9',
  },
});
