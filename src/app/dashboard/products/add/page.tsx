"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    destination: '',
    plan: '',
    price: '',
    total: '',
    available: '',
    description: '',
    status: 'active',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('Product added successfully!');
      router.push('/dashboard/products');
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="">
      {/* Back Button */}
      <Link
        href="/dashboard/products"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-yellow-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8">
        <div className="mb-8">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-400 flex items-center justify-center mb-4 shadow-lg">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-2">Create a new product in your inventory</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
        

          {/* Plan */}
          <div>
            <label htmlFor="plan" className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              id="plan"
              name="plan"
              value={formData.plan}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition"
              placeholder="Enter product plan name"
            />
          </div>

          {/* Price and Total */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition"
                placeholder="0.00"
              />
            </div>
            <div>
              <label htmlFor="total" className="block text-sm font-medium text-gray-700 mb-2">
                Total Quantity *
              </label>
              <input
                type="number"
                id="total"
                name="total"
                value={formData.total}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition"
                placeholder="0"
              />
            </div>
          </div>

         
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition"
              placeholder="Enter product description (optional)"
            />
          </div>

       
          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl"
            >
              {isLoading ? 'Adding...' : 'Add Product'}
            </button>
            <Link
              href="/dashboard/products"
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

