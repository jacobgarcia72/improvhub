import styles from './loader.module.css';

export default function Loader() {
    return <div className='mt-4 mx-4 mb-6'><div className={styles.loader}></div></div>;
}