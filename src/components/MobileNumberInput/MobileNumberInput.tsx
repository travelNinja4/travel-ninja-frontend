/**
 * A reusable input component for entering mobile numbers with a selectable country code and dynamic validation.
 *
 * @example
 * ```tsx
 * import MobileNumberInput from '@src/components/MobileNumberInput'
 *
 * export default function MobileNumberInput() {
 *  const [mobile, setMobile] = useState<{ country: string; number: string }>({
 *     country: 'IN',
 *     number: '',
 *   });
 *
 *   return (
 *     <MobileNumberInput
 *       value={mobile}
 *       onChange={setMobile}
 *       maxLength={10}
 *       error={mobile.number.length > 0 && mobile.number.length < 10 ? "Number too short" : ""}
 *       countryError={!mobile.country ? "Please select a country" : ""}
 *     />
 * }
 * ```
 */
'use client';

import { useEffect, useMemo, useState } from 'react';
import TextField from '../TextField';
import Autocomplete from '../Autocomplete';
import { STRINGS } from '@/constants/strings';
import { Country } from '@/constants/types';
import clsx from 'clsx';
import styles from './MobileNumberInput.module.scss';

// Stable default, so the effect below doesn't re-run on every render when no countries are passed
const EMPTY_COUNTRIES: Country[] = [];

/**
 * Define the props available for the MobileNumberInput component.
 */
interface MobileNumberInputProps {
  /**
   * The current value of the input.
   *
   * Consists of a `country` (ISO code or dialing code)
   * and the mobile `number`.
   *
   * @example
   * ```ts
   * { country: "IN", number: "9876543210" }
   * ```
   */
  value?: { country: string; number: string };

  /**
   * Callback fired when the user changes either the country code or the mobile number.
   *
   * Receives the updated `{ country, number }` object.
   *
   * @param val - Updated mobile number state.
   */
  onChange?: (val: { country: string; number: string }) => void;

  /**
   * Country codes to choose from. Fetched on the server by the page and passed down.
   *
   * @default []
   */
  countries?: Country[];

  /**
   * The maximum length allowed for the mobile number input.
   *
   * If the selected country provides its own `length`,
   * that will override this value.
   *
   * @default undefined
   */
  maxLength?: number;

  /**
   * Error message to display below the mobile number field.
   *
   * Useful for number-specific validation errors.
   *
   * @example "Invalid mobile number"
   */
  error?: string;

  /**
   * Error message to display below the country code selector.
   *
   * Useful when the user must select a valid country code but hasn’t done so.
   * @example "Please select a country"
   */
  countryError?: string;
}

export default function MobileNumberInput({
  maxLength,
  error,
  countryError,
  value,
  onChange,
  countries = EMPTY_COUNTRIES,
}: MobileNumberInputProps) {
  const [country, setCountry] = useState('');
  const [search, setSearch] = useState('');
  const [number, setNumber] = useState(value?.number ?? '');
  const [length, setLength] = useState(
    value?.country ? countries.find((c) => c.code === value.country)?.length : maxLength,
  );

  useEffect(() => {
    if (countries.length === 0) return;

    // Set initial country and number if value exists
    if (value) {
      setCountry(value.country);
      setNumber(value.number);
      setLength(
        value.country ? countries.find((c) => c.code === value.country)?.length : maxLength,
      );
    }
  }, [countries, value, maxLength]);

  const filteredCountries = useMemo(() => {
    if (!search) return countries;
    return countries.filter(
      (c) =>
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [countries, search]);

  const handleSelect = (
    selected: { name: string; code: string; length: number } | string | undefined,
  ) => {
    if (!selected || typeof selected === 'string') {
      // if undefined or a string, reset country
      setCountry('');
      setSearch('');
      setNumber('');
      setLength(maxLength);
      onChange?.({ country: '', number: '' });
      return;
    }

    // selected is the proper country object
    setCountry(selected.code);
    setSearch('');
    setNumber('');
    setLength(selected.length);
    onChange?.({ country: selected.code, number: '' });
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    if (!val) {
      setCountry('');
    }
  };

  return (
    <>
      <div data-testid="MobileNumberInputTest" className={styles.container}>
        <div className={styles.dropdownWrapper}>
          <Autocomplete
            options={filteredCountries?.map((c) => ({ value: c, label: c.code }))}
            placeholder={STRINGS.COUNTRY_CODE}
            value={country}
            searchValue={search}
            onSearchChange={(val) => handleSearch(val)}
            onChange={handleSelect}
            dropdownContainerClassName={clsx(styles.dropdown)}
            dropdownTextContainerClassName={styles.dropdownText}
          />
        </div>

        <TextField
          placeholder={STRINGS.ENTER_MOBILE_NUMBER}
          className={clsx(styles.inputContainer)}
          inputClassName={styles.inputField}
          value={number}
          maxLength={length || maxLength}
          onChange={(e) => {
            const newNumber = e.target.value;
            setNumber(newNumber);
            onChange?.({ country, number: newNumber });
          }}
        />
      </div>
      {error && <p className={styles.errorText}>{error}</p>}
      {countryError && <p className={styles.errorText}>{countryError}</p>}
    </>
  );
}
