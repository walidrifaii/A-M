"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useGetProductsQuery } from '../../store/api/productsApi';
import { useStore } from '../../store/StoreContext';
import {
    Heart,
    ShoppingCart,
    ArrowLeft,
    Star,
    ChevronRight,
    Minus,
    Plus,
    CreditCard
} from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../../ui/NavBar';
import Footer from '../../ui/Footer';

export default function SingleProductPage() {
    const params = useParams();
    const router = useRouter();
    const { slug } = params;
    const { data: products, isLoading } = useGetProductsQuery();
    const { addToCart, addFavorite, favorites, setBuyNowItem } = useStore();

    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState<string>('');

    // Find product by slug
    const product = products?.find(
        (p) => p.name.toLowerCase().replace(/\s+/g, "-") === slug
    );

    const isFavorite = product ? favorites.some((f) => f.id === product._id) : false;

    useEffect(() => {
        if (product) {
            setActiveImage(product.image);
            if (product.size && product.size.length > 0) {
                setSelectedSize(product.size[0]);
            }
        }
    }, [product]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center ">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative h-16 w-16">
                        <div className="absolute inset-0 rounded-full border-4 border-yellow-200  animate-ping"></div>
                        <div className="relative h-16 w-16 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-gray-500 font-medium animate-pulse">Loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center  px-4">
                <div className="max-w-md text-center">
                    <h1 className="text-4xl font-bold   mb-4">Product Not Found</h1>
                    <p className="text-gray-600 mb-8">
                        We couldn't find the product you're looking for. It may have been removed or the link might be broken.
                    </p>
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white font-semibold rounded-xl hover:bg-yellow-600 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const handleAddToCart = () => {
        if (!selectedSize) {
            toast.error('Please select a size');
            return;
        }

        addToCart({
            id: product._id,
            slug: product.name.toLowerCase().replace(/\s+/g, "-"),
            name: product.name,
            price: product.price.toString(),
            image: product.image,
            sizes: product.size,
            selectedSize: selectedSize,
            qty: quantity,
        });

        toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full  shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                            <div className="h-10 w-10 relative rounded-lg overflow-hidden">
                                <Image src={product.image} alt="" fill className="object-cover" />
                            </div>
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium ">Added to cart!</p>
                            <p className="mt-1 text-sm  ">
                                {product.name} ({selectedSize})
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        ));
    };

    const handleBuyNow = () => {
        if (!selectedSize) {
            toast.error('Please select a size');
            return;
        }

        // Use setBuyNowItem to store temporary checkout item
        setBuyNowItem({
            id: product._id,
            slug: product.name.toLowerCase().replace(/\s+/g, "-"),
            name: product.name,
            price: product.price.toString(),
            image: product.image,
            sizes: product.size,
            selectedSize: selectedSize,
            qty: quantity,
        });

        router.push('/checkout?source=buy_now');
    };

    const handleToggleFavorite = () => {
        if (isFavorite) {
            addFavorite({ id: product._id } as any, "remove");
        } else {
            addFavorite({
                id: product._id,
                slug: product.name.toLowerCase().replace(/\s+/g, "-"),
                name: product.name,
                price: product.price.toString(),
                image: product.image,
                sizes: product.size,
            });
        }
    };

    return (
        <div className="min-h-screen ">
            {/* Add padding-top to account for fixed/sticky navbar if necessary, or let Navbar handle it */}
            <Navbar />

            <main className="flex-grow mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 
            py-12 lg:py-16 w-full ">

                {/* Navigation & Breadcrumb */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-sm font-medium te transition-colors group"
                    >
                        <div className="p-2 rounded-full  ">
                            <ArrowLeft className="h-4 w-4" />
                        </div>
                        <span>Back</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Left Column: Images */}
                    <div className="space-y-6">
                        <div className=" aspect-square mx-auto  relative rounded-[2rem] overflow-hidden ">
                            {product.image ? (
                                <Image
                                    src={activeImage || product.image}
                                    alt={product.name}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <span className="text-6xl font-bold opacity-20">NO IMAGE</span>
                                </div>
                            )}

                            <button
                                onClick={handleToggleFavorite}
                                className={`absolute top-6 right-6 p-4 rounded-full backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-110 hover:-rotate-12
                ${isFavorite ? 'bg-rose-500 text-white' : 'bg-white/90 dark:bg-black/40 text-gray-600 dark:text-white hover:bg-white dark:hover:bg-black/60'}`}
                            >
                                <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Right Column: details */}
                    <div className="flex flex-col justify-center">
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="inline-flex px-4 py-1.5 text-xs font-bold tracking-widest text-yellow-700 dark:text-yellow-300 uppercase bg-yellow-100 dark:bg-yellow-900/40 rounded-full">
                                    {product.brand || 'Luxury'}
                                </span>
                                {product.sex && (
                                    <span className="inline-flex px-4 py-1.5 text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase bg-gray-100 dark:bg-gray-800 rounded-full">
                                        {product.sex}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black  tracking-tighter mb-4 leading-tight">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 fill-current" />
                                    ))}
                                </div>
                                <span className="text-sm font-medium border-l border-gray-300 dark:border-gray-700 pl-4">
                                    4.9 (128 reviews)
                                </span>
                            </div>

                            <div className="text-5xl font-bold  mb-8 tracking-tight">
                                ${product.price.toFixed(2)}
                            </div>

                            <p className="text-lg  leading-relaxed max-w-lg">
                                {product.description}
                            </p>
                        </div>

                        {/* Size Selector */}
                        <div className="mb-10">
                            <div className="flex justify-between items-end mb-4">
                                <span className="text-sm font-bold  uppercase tracking-wider">Select Size</span>
                                <button className="text-xs font-medium  transition-colors underline decoration-gray-300 underline-offset-4">
                                    Size Guide
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {product.size && product.size.length > 0 ? (
                                    product.size.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`min-w-[4.5rem] px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 border-2
                        ${selectedSize === size
                                                    ? 'border-yellow-500 bg-yellow-500 text-white shadow-lg shadow-yellow-500/30 transform scale-105'
                                                    : 'border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:border-yellow-400 dark:hover:border-yellow-600'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))
                                ) : (
                                    <span className=" italic">No sizes available</span>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100 dark:border-neutral-800">
                            <div className="flex items-center justify-between rounded-2xl border-2 border-gray-200 dark:border-neutral-700">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-3.5  rounded-xl "
                                >
                                    <Minus className="h-5 w-5" />
                                </button>
                                <span className="w-12 text-center font-bold text-lg ">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-3.5 rounded-xl transition-colors"
                                >
                                    <Plus className="h-5 w-5" />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="flex-1 flex items-center justify-center gap-3
                                   font-bold py-2 px-8 rounded-2xl shadow-xl bg-yellow-500 text-white
                                    shadow-yellow-500/20 transition-all hover:-translate-y-1 active:scale-95 text-[16px]"
                            >
                                <ShoppingCart className="h-5 w-5 stroke-[2.5]" />
                                Add to Cart
                            </button>

                            <button
                                onClick={handleBuyNow}
                                className="flex-1 flex items-center justify-center gap-3 text-[16px]
                                   font-bold py-2 px-8 rounded-2xl border-2 border-yellow-500
                                     transition-all hover:-translate-y-1 active:scale-95 "
                            >
                                <CreditCard className="h-5 w-5 stroke-[2.5]" />
                                Buy Now
                            </button>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
