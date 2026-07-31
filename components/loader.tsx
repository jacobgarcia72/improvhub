import styles from './loader.module.css';

export default function Loader({ caption }: { caption?: string }) {
    return <div className='flex flex-col items-center justify-center'>
        <div className='mt-4 mx-4 mb-6'><div className={styles.loader}></div></div>
        {caption ? <div className='opacity-70 -mt-3 text-sm'>{`Loading ${caption}...`}</div> : null}
    </div>
}