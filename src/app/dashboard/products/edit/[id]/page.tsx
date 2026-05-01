"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeft, Loader2, X } from 'lucide-react';
import Image from 'next/image';

interface ProductFormValues {
  name: string;
  brand: string;
  price: number;
  description: string;
  size: string[];
  sex: string;
  isActive: boolean;
  image?: File | string;
}

const schema = yup.object({
  name: yup.string().required('Product name is required'),
  brand: yup.string().required('Brand is required'),
  price: yup.number().required('Price is required').positive('Price must be positive'),
  description: yup.string().required('Description is required'),
  size: yup.array().of(yup.string()).min(1, 'At least one size is required'),
  sex: yup.string().required('Category is required'),
  isActive: yup.boolean(),
}) as yup.ObjectSchema<ProductFormValues>;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sizes, setSizes] = useState<string[]>(['']);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      brand: '',
      price: 0,
      description: '',
      size: [],
      sex: '',
      isActive: true,
    },
  });

  const fetchProduct = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = Cookies.get('access_token');
      
      const response = await axios.get(
        `https://api-perfuim-production.up.railway.app/user/products/${productId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (response.status === 200) {
        const product = response.data;
        
        // Set form values
        setValue('name', product.name || '');
        setValue('brand', product.brand || '');
        setValue('price', product.price || 0);
        setValue('description', product.description || '');
        setValue('sex', product.sex || '');
        setValue('isActive', product.isActive !== undefined ? product.isActive : true);
        
        // Set sizes
        if (product.size && product.size.length > 0) {
          setSizes(product.size);
          setValue('size', product.size);
        }
        
        // Set image preview
        if (product.image) {
          setImagePreview(product.image);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to fetch product');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [productId, setValue, router]);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId, fetchProduct]);

  const handleSizeChange = (index: number, value: string) => {
    const newSizes = [...sizes];
    newSizes[index] = value;
    setSizes(newSizes);
    setValue('size', newSizes.filter(s => s.trim() !== ''));
  };

  const addSizeField = () => {
    setSizes([...sizes, '']);
  };

  const removeSizeField = (index: number) => {
    if (sizes.length > 1) {
      const newSizes = sizes.filter((_, i) => i !== index);
      setSizes(newSizes);
      setValue('size', newSizes.filter(s => s.trim() !== ''));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsSubmitting(true);
      const token = Cookies.get('access_token');

      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('brand', data.brand);
      formData.append('price', data.price.toString());
      formData.append('description', data.description);
      formData.append('sex', data.sex);
      formData.append('isActive', data.isActive.toString());
      
      // Append sizes array
      const validSizes = sizes.filter(s => s.trim() !== '');
      validSizes.forEach(size => {
        formData.append('size', size);
      });

      // Append image if it's a new file
      if (data.image && data.image instanceof File) {
        formData.append('image', data.image);
      }

      const response = await axios.put(
        `https://api-perfuim-production.up.railway.app/products/${productId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (response.status === 200) {
        toast.success('Product updated successfully!');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to update product');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="">
      <Toaster position="top-right" />
      
      {/* Back Button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm  hover:text-brand-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      {/* Form */}
      <div className="rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold ">Edit Product</h1>
          <p className="text-sm sm:text-base  mt-2">Update product information</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium duration-300 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              {...register('name')}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400 transition ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Brand and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="brand" className="block text-sm font-medium duration-300 mb-2">
                Brand *
              </label>
              <input
                type="text"
                id="brand"
                {...register('brand')}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400 transition ${
                  errors.brand ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter brand name"
              />
              {errors.brand && (
                <p className="text-xs text-red-500 mt-1">{errors.brand.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="sex" className="block text-sm font-medium duration-300 mb-2">
                Category *
              </label>
              <select
                id="sex"
                {...register('sex')}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400 transition ${
                  errors.sex ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select category</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
              </select>
              {errors.sex && (
                <p className="text-xs text-red-500 mt-1">{errors.sex.message}</p>
              )}
            </div>
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium duration-300 mb-2">
              Price ($) *
            </label>
            <input
              type="number"
              id="price"
              {...register('price', { valueAsNumber: true })}
              min="0"
              step="0.01"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400 transition ${
                errors.price ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>
            )}
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium duration-300 mb-2">
              Sizes * (e.g., 50ml, 100ml)
            </label>
            <div className="space-y-2">
              {sizes.map((size, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => handleSizeChange(index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400 transition"
                    placeholder={`Size ${index + 1} (e.g., 50ml)`}
                  />
                  {sizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSizeField(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addSizeField}
                className="text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                + Add Size
              </button>
            </div>
            {errors.size && (
              <p className="text-xs text-red-500 mt-1">{errors.size.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium duration-300 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={4}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400 transition ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter product description"
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium duration-300 mb-2">
              Product Image
            </label>
            <div className="space-y-4">
              {imagePreview && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-300">
                  <Image
                    src={imagePreview}
                    alt="Product preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400 transition"
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3">
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="w-5 h-5 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                  />
                  <span className="text-sm font-medium duration-300">Product is active</span>
                </label>
              )}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#6f6862] from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-sm sm:text-base font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Product'
              )}
            </button>
            <Link
              href="/dashboard"
              className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 duration-300 text-sm sm:text-base font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
