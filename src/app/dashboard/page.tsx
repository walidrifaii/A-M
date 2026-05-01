"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Filter, Search, Pencil, Trash2, Loader2 } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  size: string[];
  sex?: string;
  brand?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = Cookies.get('access_token');
      const response = await axios.get(
        'https://api-perfuim-production.up.railway.app/user/products',
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (response.status === 200) {
        setProducts(response.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to fetch products');
        toast.error(err.response?.data?.message || 'Failed to fetch products');
      } else {
        setError('Something went wrong. Please try again.');
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    {
      label: 'Total Products',
      value: products.length.toString(),
      color: 'text-gray-300'
    },
    {
      label: 'In Stock',
      value: products.filter(p => p.size && p.size.length > 0).length.toString(),
      color: 'text-green-600'
    },
    {
      label: 'Categories',
      value: new Set(products.map(p => p.sex).filter(Boolean)).size.toString(),
      color: 'text-orange-600'
    },
  ];

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // const handleDelete = (id: string) => {
  //   if (confirm('Are you sure you want to delete this product?')) {
  //     console.log('Delete product:', id);
  //   }
  // };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 
             tracking-tight">
              Products Inventory
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-2xl">
              Manage your product catalogue, track stock levels, and organize categories efficiently.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:min-w-[500px]">
            {stats.map((stat, index) => (
              <div
                key={index}
                className=" bg-gray-100 dark:bg-gray-800 backdrop-blur-xl p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-md hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">{stat.label}</span>
                  <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions Bar */}
        <div className="p-1">
          <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search products by name, brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-0 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-brand-500/20 focus:bg-white dark:focus:bg-gray-900 transition-all duration-300 sm:text-sm"
              />
            </div>

            <Link
              href="/dashboard/products/add"
              className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 active:scale-95 whitespace-nowrap"
            >
              <Plus className="h-5 w-5 stroke-[2.5]" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-700/50 overflow-hidden">
        {isLoading ? (
          <div className="p-32 text-center">
            <div className="relative inline-flex mb-6">
              <div className="w-16 h-16 border-4 border-brand-100 dark:border-brand-900/30 rounded-full animate-ping absolute"></div>
              <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin relative z-10"></div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Loading directory...</p>
          </div>
        ) : error ? (
          <div className="p-20 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 mb-6 ring-8 ring-red-50/50 dark:ring-red-900/10">
              <svg className="h-10 w-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Unavailable</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-8 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-xl transition-all active:scale-95"
            >
              Try Again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-24 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-brand-50 dark:bg-brand-900/20 mb-8 ring-8 ring-brand-50/50 dark:ring-brand-900/10">
              <Search className="h-12 w-12 text-brand-500/50" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">No products found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-md mx-auto leading-relaxed">
              We couldn't find any products matching your search criteria. Try adjusting your search terms or add a new product to your inventory.
            </p>
            <Link
              href="/dashboard/products/add"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="h-5 w-5 stroke-[2.5]" />
              Add First Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 backdrop-blur-sm">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden sm:table-cell">Brand</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden md:table-cell">Sizes</th>
                  <th className="px-8 py-5 text-right text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="group hover:bg-gray-50/80 dark:hover:bg-gray-700/20 transition-colors duration-200">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-5">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 border border-gray-100 dark:border-gray-700 shadow-sm">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                              sizes="56px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Search className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 py-1">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-500 transition-colors">
                            {product.name}
                          </p>
                          {product.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px] hidden sm:block mt-1">
                              {product.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 dark:text-gray-500 sm:hidden mt-0.5">
                            {product.brand || 'No brand'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 hidden sm:table-cell">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                        {product.brand || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {product.sex ? (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide capitalize
                          ${product.sex.toLowerCase() === 'female'
                            ? 'bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400 ring-1 ring-pink-500/20'
                            : product.sex.toLowerCase() === 'male'
                              ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 ring-1 ring-brand-500/20'
                              : 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 ring-1 ring-purple-500/20'
                          }
                        `}>
                          {product.sex}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">
                          ${product.price?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1.5">
                        {product.size && product.size.length > 0 ? (
                          product.size.slice(0, 3).map((s, i) => (
                            <span key={i} className="px-2 py-1 text-[10px] font-bold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400 dark:text-gray-500 italic">No sizes</span>
                        )}
                        {product.size && product.size.length > 3 && (
                          <span className="px-1.5 py-1 text-[10px] font-medium text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded">+{product.size.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opactity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/dashboard/products/edit/${product.id}`}
                          className="p-2.5 text-gray-400 hover:text-brand-600 dark:text-gray-500 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-xl transition-all hover:scale-105 active:scale-95"
                          title="Edit Product"
                        >
                          <Pencil className="h-4 w-4 stroke-[2.5]" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
