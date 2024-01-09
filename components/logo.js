import Link from 'next/link';
import styles from '@/styles/logo.module.css';

export default function logo({ boxOn = false }) {
  return (
    <Link href="/" className={boxOn ? styles.box : styles.basic}>
      CUBE
    </Link>
  );
}
