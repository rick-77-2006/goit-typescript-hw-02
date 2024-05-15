import { FC } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import styles from './Loader.module.css'; 

const Loader: FC = () => {
    return (
        <div className={styles.loaderStyle}>
           <ClipLoader
        color='SlateBlue'
        loading={true}
        size={100}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
        </div>
    );
};

export default Loader;



