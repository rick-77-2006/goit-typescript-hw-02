import { FC } from 'react';
import ImageCard from '../imageCard/ImageCard';
import css from "./ImageGallery.module.css";
import { Image } from '../app/App.type';


interface ImageGalleryProps {
    images: Image[];
    onClick: (image: Image) => void;
}

const ImageGallery: FC<ImageGalleryProps> = ({ images, onClick }) => {
    return (
        <ul className={css.imageGallery}>
            {images.map((image) => (
                <ImageCard
                    key={image.id}
                    imageUrl={image.small}
                    alt={image.alt}
                    onClick={() => onClick(image)} />
            ))}
        </ul>
    );
};

export default ImageGallery;
