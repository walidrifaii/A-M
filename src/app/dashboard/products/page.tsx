"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Filter, Search, Pencil, Trash2 } from 'lucide-react';

interface Product {
  id: string;
  destination: string;
  plan: string;
  purchasedTime: string;
  total: number;
  available: number;
}

export default function ProductsPage() {
  const [products] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    { label: 'Total Products', value: '10', color: 'text-gray-900' },
    { label: 'In Stock', value: '8', color: 'text-green-600' },
    { label: 'Low Stock', value: '2', color: 'text-orange-600' },
  ];

  const filteredProducts = products.filter(product =>
    product.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      console.log('Delete product:', id);
    }
  };

  return (
    <div className=" rounded-2xl  overflow-hidden backdrop-blur-sm">
      {/* Header Section */}
      <div className="p-6 lg:p-8 ">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
              Products Inventory
            </h1>
            <p className="text-gray-500 text-sm">Manage your product inventory</p>
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-right">
                <p className={`text-2xl lg:text-3xl font-bold ${stat.color} transition-all duration-300`}>
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/dashboard/products/add"
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Link>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 hover:border-yellow-400 text-gray-700 rounded-xl font-medium hover:bg-yellow-50 transition-all duration-200 shadow-sm hover:shadow-md">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
          
          <div className="relative flex-1 lg:max-w-md lg:ml-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        {filteredProducts.length === 0 ? (
          <div className="p-12 lg:p-16 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-100 to-amber-50 mb-4">
                <svg className="h-10 w-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-2">No products found</p>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">Start by adding your first product to manage your inventory</p>
            <Link
              href="/dashboard/products/add"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-white font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Add New Product
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Destination
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Product Plan
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Available
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50 bg-white">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gradient-to-r hover:from-yellow-50/50 hover:to-transparent transition-all duration-200">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.destination}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.plan}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.purchasedTime}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{product.total}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold text-green-700 bg-green-100">
                      {product.available}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/products/edit/${product.id}`}
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
