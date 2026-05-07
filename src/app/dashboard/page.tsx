"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Pencil, Trash2, AlertTriangle, Package, Tag } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useGetProductsQuery, useDeleteProductMutation, Product } from '@/app/store/api/productsApi';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // RTK Query hooks
  const { data: products = [], isLoading, isError, refetch } = useGetProductsQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id || productToDelete._id!).unwrap();
      toast.success('Product deleted successfully');
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (err) {
      toast.error('Failed to delete product');
      console.log(err);
    }
  };

  const stats = [
    {
      label: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'text-[#485e38]',
    },
    {
      label: 'Total Stock',
      value: products.reduce((acc, p) => acc + (p.quantity || 0), 0),
      icon: Search,
      color: 'text-emerald-500',
    },
    {
      label: 'Categories',
      value: new Set(products.map(p => p.sex).filter(Boolean)).size,
      icon: Tag,
      color: 'text-amber-500',
    },
  ];

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="space-y-10 text-white">
      <Toaster position="top-right" />
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
            Inventory <span className="text-[#485e38]">Overview</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl">
            Manage your product catalog, track inventory levels, and organize categories with precision.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/5 dark:bg-black/20 backdrop-blur-sm p-6 rounded-[2.5rem] border border-white/10 hover:border-white/20 transition-all duration-300 min-w-[180px] group"
            >
              <div className="flex flex-col gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                  <p className="text-3xl font-black tracking-tight text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500 group-focus-within:text-white transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search products by name, brand, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-16 pr-6 py-4 bg-white/5 dark:bg-black/20 border border-white/10 rounded-[2rem] text-white placeholder:text-gray-500 focus:ring-0 transition-all duration-300 backdrop-blur-sm"
          />
        </div>

        <Link
          href="/dashboard/products/add"
          className="flex items-center justify-center gap-3 px-8 py-4 bg-[#485e38] hover:bg-[#5a7447] text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-[#485e38]/10 hover:shadow-[#485e38]/20 active:scale-95 whitespace-nowrap w-full sm:w-auto"
        >
          <Plus className="h-5 w-5 stroke-[3]" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Table Section */}
      <div className="bg-white/5 dark:bg-black/20 backdrop-blur-md rounded-[3rem] shadow-2xl border border-white/10 overflow-hidden">
        {isLoading ? (
          <div className="p-32 text-center">
            <div className="w-16 h-16 border-4 border-[#485e38] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-gray-400 font-medium animate-pulse">Syncing inventory...</p>
          </div>
        ) : isError ? (
          <div className="p-20 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-white mb-6 font-bold">Failed to connect to catalog.</p>
            <button
              onClick={() => refetch()}
              className="px-8 py-3 bg-[#485e38] text-white font-bold rounded-xl active:scale-95 transition-all"
            >
              Reconnect Now
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-24 text-center">
            <Package className="h-16 w-16 text-white/10 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">No products found</h3>
            <p className="text-gray-500 mb-10 max-w-md mx-auto">
              We couldn&apos;t find anything matching your search. Try broadening your criteria or add a new item.
            </p>
            <Link
              href="/dashboard/products/add"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#485e38] text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="h-5 w-5" />
              Add First Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#485e38]/80 text-white backdrop-blur-md">
                <tr>
                  <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em]">Product</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] hidden sm:table-cell">Brand</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em]">Category</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em]">Stock</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em]">Pricing</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedProducts.map((product) => (
                  <tr key={product.id || product._id} className="group hover:bg-white/5 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="relative w-16 h-16 rounded-[1.5rem] overflow-hidden bg-white/5 border border-white/10 shadow-lg">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-125"
                              sizes="64px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20">
                              <Package className="h-8 w-8" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-white group-hover:text-[#485e38] transition-colors truncate">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 truncate max-w-[200px]">
                            {product.brand || 'No Brand'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 hidden sm:table-cell">
                      <span className="text-xs font-bold text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                        {product.brand || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`inline-flex items-center px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ring-1 
                        ${product.sex?.toLowerCase() === 'female' ? 'bg-pink-500/10 text-pink-400 ring-pink-500/20' : 
                          product.sex?.toLowerCase() === 'male' ? 'bg-[#485e38]/20 text-[#485e38] ring-[#485e38]/30' : 
                          'bg-purple-500/10 text-purple-400 ring-purple-500/20'}`}>
                        {product.sex || 'Unisex'}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`text-sm font-black font-mono ${product.quantity > 0 ? 'text-white' : 'text-red-500'}`}>
                        {product.quantity || 0}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-wrap gap-1.5">
                        {product.sizePrices?.map((sp, i) => (
                          <span key={i} className="px-2.5 py-1 text-[10px] font-bold text-white/80 bg-white/5 rounded-lg border border-white/10">
                            {sp.price} $
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/products/edit/${product.id || product._id}`}
                          className="p-3 text-white/30 hover:text-white hover:bg-white/10 rounded-2xl transition-all active:scale-95"
                          title="Edit Product"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setProductToDelete(product);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-3 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all active:scale-95"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="px-8 py-8 bg-white/5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Page <span className="text-white">{currentPage}</span> of <span className="text-white">{totalPages}</span>
            </p>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-3 text-white/30 hover:text-white disabled:opacity-10 transition-all"
              >
                <Search className="h-5 w-5 rotate-90" /> {/* Placeholder for arrow */}
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-10 h-10 rounded-2xl text-xs font-black transition-all ${
                      currentPage === page
                        ? 'bg-[#485e38] text-white shadow-xl shadow-[#485e38]/20 scale-110'
                        : 'text-white/30 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-3 text-white/30 hover:text-white disabled:opacity-10 transition-all"
              >
                <Search className="h-5 w-5 -rotate-90" /> {/* Placeholder for arrow */}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity"
            onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
          />
          
          <div className="relative bg-[#0f172a] rounded-[3.5rem] shadow-2xl border border-white/10 w-full max-w-md overflow-hidden transform animate-in fade-in zoom-in duration-300">
            <div className="p-10 text-center">
              <div className="w-20 h-20 rounded-[2rem] bg-red-500/10 flex items-center justify-center mx-auto mb-8 border border-red-500/20">
                <AlertTriangle className="h-10 w-10 text-red-500" />
              </div>

              <h3 className="text-3xl font-black text-white mb-4">
                Delete Product?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-10">
                Are you sure you want to remove <span className="text-white font-bold italic">&quot;{productToDelete?.name}&quot;</span>? This action is irreversible.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-[1.5rem] transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white bg-red-600 hover:bg-red-700 rounded-[1.5rem] transition-all shadow-xl shadow-red-900/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isDeleting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
