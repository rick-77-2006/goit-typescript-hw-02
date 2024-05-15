import { useState, useEffect, FC } from 'react';
import axios, {AxiosResponse} from 'axios';
import SearchBar from '../searchBar/SearchBar';
import ImageGallery from '../imageGallery/ImageGallery';
import Loader from '../loader/Loader';
import ErrorMessage from '../errorMessage/ErrorMessage';
import LoadMoreBtn from '../loadMoreBtn/LoadMoreBtn';
import ImageModal from '../imageModal/ImageModal';
import { Image, UnsplashImage } from './App.type';

const App: FC = () => {
    const [images, setImages] = useState<Image[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [hasMoreImages, setHasMoreImages] = useState<boolean>(true);
    const [query, setQuery] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<Image | null>(null);


    async function fetchImages(query: string, pageNum: number): Promise<void> {
        try {
            setLoading(true);
            const apiKey: string = 'wmfnsVc_DdNJUYvLvziU9AjLz2nPehfwjBFjdxGMITc';
            const params: UnsplashImage = {
                client_id: apiKey,
                query: query,
                orientation: 'landscape',
                page: pageNum,
                per_page: 12,
            };
            const response: AxiosResponse<any> = await axios.get<UnsplashImage, AxiosResponse<any>>(`https://api.unsplash.com/search/photos/`, {
                params: params,
                headers: {
                    Authorization: `Client-ID ${apiKey}`
                }
            });
            const normalizeData: Image[] = response.data.results.map(({ alt_description, id, urls }: any) => ({
                alt: alt_description,
                id,
                small: urls.small,
                regular: urls.regular,
            }));

            if (pageNum === 1) {
                setImages(normalizeData);
            } else {
                setImages(prevImages => [...prevImages, ...normalizeData]);
            }

            setError('');

            if (response.data.results.length === 0) {
                setHasMoreImages(false);
            }
        } catch (error) {
            setError('Error fetching images. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (query !== '') {
            fetchImages(query, 1);
            setPage(1);
            setImages([]);
            setHasMoreImages(true);
        }
        if (page > 1) {
            fetchImages(query, page);
        }
    }, [query,page]);

    

    const handleSearch = (query: string): void => {
        setQuery(query);
    };

    const loadMore = (): void => {
        setPage(page + 1);
    };

    const handleImageClick = (image: Image): void => {
        setSelectedImage(image);
        setIsModalOpen(true);
    };

    const closeModal = (): void => {
        setSelectedImage(null);
        setIsModalOpen(false);
    };

    return (
        <div>
            <SearchBar onSubmit={handleSearch} />
            {loading && <Loader />}
            {error && <ErrorMessage message={error} />}
            {images.length > 0 && <ImageGallery images={images} onClick={handleImageClick} />}
            {hasMoreImages && images.length > 0 && <LoadMoreBtn onClick={loadMore} />}
            {selectedImage && (
                <ImageModal
                    images={selectedImage}
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                />
            )}
        </div>
    );
};

export default App;
