/**
 * A reusable input component for entering mobile numbers with a selectable country code and dynamic validation.
 *
 * @example
 * ```tsx
 * import MobileNumberInput from '@src/components/MobileNumberInput'
 *
 * export default function MobileNumberInput() {
 *   return <MobileNumberInput label="Hello" />;
 * }
 * ```
 */
'use client';

import { useEffect, useMemo, useState } from 'react';
import TextField from '../TextField';
import Autocomplete from '../Autocomplete';
import { useNotification } from '@/providers/NotificationProvider';
import { errorHandler } from '@/utils/errorHandler';
import clsx from 'clsx';
import styles from './MobileNumberInput.module.scss';
import { authService } from '@/services/authService';
import { useCommonStore } from '@/store/common';

/**
 * Define the props available for the MobileNumberInput component.
 */
interface MobileNumberInputProps {
  value?: { country: string; number: string };
  onChange?: (val: { country: string; number: string }) => void;
  maxLength?: number;
  error?: string;
  countryError?: string;
}

export default function MobileNumberInput({
  maxLength,
  error,
  countryError,
  value,
  onChange,
}: MobileNumberInputProps) {
  const { showNotification } = useNotification();
  const { countries, setCountries } = useCommonStore();
  const [country, setCountry] = useState('');
  const [search, setSearch] = useState('');
  const [number, setNumber] = useState(value?.number ?? '');
  const [length, setLength] = useState(
    value?.country ? countries.find((c) => c.code === value.country)?.length : maxLength,
  );

  useEffect(() => {
    (async () => {
      try {
        const response = await authService.getCountryCode();
        setCountries(response);
      } catch (err) {
        const messages = errorHandler(err);
        messages.forEach((msg) => showNotification('Error!', msg, 'error'));
      }
    })();
  }, []);

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
            value={country}
            searchValue={search}
            onSearchChange={(val) => handleSearch(val)}
            onChange={handleSelect}
            dropdownContainerClassName={clsx(styles.dropdown)}
            dropdownTextContainerClassName={styles.dropdownText}
          />
        </div>

        <TextField
          placeholder="Enter mobile number"
          className={clsx(styles.input)}
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
