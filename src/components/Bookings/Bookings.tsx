/**
 * The Bookings component displays a list of bookings for a specific tour agency. It supports searching, filtering, and exporting booking data, allowing uagency to quickly find and manage bookings efficiently.
 *
 * @example
 * ```tsx
 * import Bookings from '@src/components/Bookings'
 *
 * export default function Bookings() {
 *   return <Bookings label="Hello" />;
 * }
 * ```
 */

import BookingTable from '../BookingTable';
import Dropdown from '../Dropdown';
import TextField from '../TextField';
import styles from './Bookings.module.scss';

/**
 * Define the props available for the Bookings component.
 */
interface BookingsProps {
  label?: string;
}

export default function Bookings({ label = 'label' }: BookingsProps) {
  const status = [
    { value: 'All Status', label: 'All Status' },
    { value: 'Confirmed', label: 'Confirmed' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' },
  ];

  const tour = [
    { value: 'All Tours', label: 'All Tours' },
    { value: 'Mountain Adventure', label: 'Mountain Adventure' },
    { value: 'Beach Paradise', label: 'Beach Paradise' },
    { value: 'City Explorer', label: 'City Explorer' },
    { value: 'Cultural Heritage', label: 'Cultural Heritage' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Dropdown
          label="Status"
          options={status}
          dropdownContainerClassName={styles.statusDropdown}
        />
        <Dropdown label="Tour" options={tour} dropdownContainerClassName={styles.statusDropdown} />
        <TextField label="Search" placeholder="Search bookings..." />
      </div>
      <BookingTable header="All Bookings (24)" />
    </div>
  );
}
