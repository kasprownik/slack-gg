import styles from './Ad.module.css';
import xteam from './xteam.png';

export function Ad() {
  return <img src={xteam} className={styles.ad} alt="Advertisement" />;
}
