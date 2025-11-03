"use client";

import Link from 'next/link';
import { Package, Tag, ShoppingCart, TrendingUp, ArrowRight, Plus } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    {
      label: 'Total Products',
      value: '24',
      change: '+12%',
      icon: Package,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
    },
    {
      label: 'Categories',
      value: '8',
      change: '+5%',
      icon: Tag,
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
    },
    {
      label: 'Total Orders',
      value: '142',
      change: '+23%',
      icon: ShoppingCart,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
    },
    {
      label: 'Revenue',
      value: '$12,450',
      change: '+18%',
      icon: TrendingUp,
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-2xl p-6 lg:p-8 shadow-xl">
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Welcome back! 👋</h1>
        <p className="text-yellow-50">Here&apos;s what&apos;s happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/50`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-md`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <Link
              href="/dashboard/products"
              className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white font-medium text-center hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
            >
              View Products
            </Link>
            <Link
              href="/dashboard/products/add"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-4 text-white font-medium text-center hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
            >
              Add Product
            </Link>
            <Link
              href="/dashboard/categories"
              className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white font-medium text-center hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
            >
              Categories
            </Link>
            <button className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl p-4 text-white font-medium text-center hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105">
              Settings
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Plus className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">New product added</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Order completed</p>
                  <p className="text-sm text-gray-500">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Tag className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Category updated</p>
                  <p className="text-sm text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
            <Link
              href="/dashboard/products"
              className="mt-4 flex items-center justify-center gap-2 text-yellow-600 hover:text-yellow-700 font-medium text-sm transition-colors"
            >
              View all activities
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
