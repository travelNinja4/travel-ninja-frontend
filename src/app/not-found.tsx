import React from 'react';
import styles from './not-found.module.scss';
import { Home, Users, CalendarCheck, User, Route, Mail, Search } from 'lucide-react';
import Link from 'next/link';

const floatingEmojis = [
  { emoji: '✈️', style: { top: '10%', left: '10%', fontSize: '3rem', animationDelay: '0s' } },
  { emoji: '🏔️', style: { top: '20%', right: '15%', fontSize: '2.5rem', animationDelay: '2s' } },
  { emoji: '🌊', style: { bottom: '20%', left: '15%', fontSize: '2rem', animationDelay: '4s' } },
  { emoji: '🗺️', style: { bottom: '30%', right: '10%', fontSize: '2.5rem', animationDelay: '6s' } },
  { emoji: '🏖️', style: { top: '50%', left: '5%', fontSize: '1.5rem', animationDelay: '1s' } },
  { emoji: '🎒', style: { top: '60%', right: '5%', fontSize: '1.8rem', animationDelay: '3s' } },
];

export default function NotFound() {
  return (
    <div className={styles.pageBg}>
      {/* Floating Background Elements */}
      <div className={styles.floatingElements}>
        {floatingEmojis.map((item, i) => (
          <div key={i} className={styles.floatingElement} style={item.style}>
            {item.emoji}
          </div>
        ))}
      </div>
      <div className={styles.errorContainer}>
        {/* Error Illustration */}
        <div className={styles.errorIllustration}>
          <Search size={64} />
        </div>
        {/* Error Number */}
        <div className={styles.errorNumber}>404</div>
        {/* Error Title */}
        <h1 className={styles.errorTitle}>Oops! Page Not Found</h1>
        {/* Error Message */}
        <p className={styles.errorMessage}>
          The page you&apos;re looking for seems to have wandered off on its own adventure.
        </p>
        {/* Error Description */}
        <p className={styles.errorDescription}>
          Don&apos;t worry! You can search for what you need, go back to the homepage, or explore
          our popular destinations.
        </p>
        {/* Search Box (commented out for now) */}
        {/*
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchBox}
            placeholder="Search for tours, destinations, or activities..."
            disabled
          />
        </div>
        */}
        {/* Action Links */}
        <div className={styles.actionButtons}>
          <Link href="/dashboard" className={styles.btnPrimary}>
            <Home size={20} style={{ marginRight: 8 }} />
            Go to Dashboard
          </Link>
        </div>
        {/* Quick Links */}
        <div className={styles.quickLinks}>
          <Link href="/my-tours" className={styles.quickLink}>
            <Route size={18} style={{ marginRight: 4 }} />
            My Tours
          </Link>
          <Link href="/bookings" className={styles.quickLink}>
            <CalendarCheck size={18} style={{ marginRight: 4 }} />
            Bookings
          </Link>
          <Link href="/customers" className={styles.quickLink}>
            <Users size={18} style={{ marginRight: 4 }} />
            Customers
          </Link>
          <Link href="/profile" className={styles.quickLink}>
            <User size={18} style={{ marginRight: 4 }} />
            Profile
          </Link>
        </div>
        {/* Contact Support */}
        <div className={styles.contactSupport}>
          <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            Still can&apos;t find what you&apos;re looking for?
          </p>
          <a href="mailto:support@travelninja.com" className={styles.contactLink}>
            <Mail size={16} style={{ marginRight: 4 }} />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
