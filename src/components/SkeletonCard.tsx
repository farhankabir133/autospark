import React from 'react';
import styles from './SkeletonCard.module.css';

interface SkeletonCardProps {
  width?: string | number;
  height?: string | number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ width = '100%', height = 240 }) => {
  return (
    <div className={styles.card} style={{ width, height }} aria-hidden>
      <div className={styles.image} />
      <div className={styles.body}>
        <div className={styles.line} style={{ width: '60%' }} />
        <div className={styles.line} style={{ width: '40%' }} />
        <div className={styles.row}>
          <div className={styles.smallLine} />
          <div className={styles.smallLine} style={{ width: '30%' }} />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
