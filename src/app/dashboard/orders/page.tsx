"use client";

import { useState } from 'react';
import { Search, Eye, ShoppingBag, XCircle, User, Phone, MapPin } from 'lucide-react';
import { useGetOrdersQuery, CheckoutResponse } from '@/app/store/api/checkoutApi';

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<CheckoutResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch orders using RTK Query
  const { data: orders = [], isLoading, isError, refetch } = useGetOrdersQuery();

  const filteredOrders = orders.filter(order =>
    order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerPhone?.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-amber-500/10 text-amber-400 ring-amber-500/20';
      case 'completed': return 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-400 ring-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 ring-gray-500/20';
    }
  };

  const stats = [
    { label: 'Total Orders', value: orders.length.toString(), color: 'text-[#485e38]' },
    { label: 'Pending', value: orders.filter(o => o.status === 'pending').length.toString(), color: 'text-amber-500' },
    { label: 'Revenue', value: `$${orders.reduce((acc, o) => acc + (o.total || 0), 0).toFixed(2)}`, color: 'text-emerald-500' },
  ];

  return (
    <div className="space-y-10 text-white">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
            Orders <span className="text-[#485e38]">Management</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl">
            Monitor and process customer orders, track fulfillment status, and manage business revenue.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white/5 dark:bg-black/20 backdrop-blur-sm p-6 rounded-[2rem] border border-white/10 min-w-[160px] hover:border-white/20 transition-all group">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 group-hover:text-gray-400 transition-colors">{stat.label}</p>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions Bar */}
      <div className="p-1">
        <div className="flex flex-col sm:flex-row gap-4 bg-white/5 dark:bg-black/20 p-2 rounded-[2rem] shadow-sm border border-white/10 backdrop-blur-sm">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500 group-focus-within:text-white transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search by ID, name, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-14 pr-6 py-4 bg-transparent border-0 rounded-2xl text-white placeholder:text-gray-500 focus:ring-0 transition-all duration-300 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white/5 dark:bg-black/20 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden">
        {isLoading ? (
          <div className="p-32 text-center">
            <div className="w-16 h-16 border-4 border-[#485e38] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-gray-400 font-medium animate-pulse">Fetching latest orders...</p>
          </div>
        ) : isError ? (
            <div className="p-20 text-center">
                <p className="text-red-400 mb-4">Failed to load orders.</p>
                <button onClick={() => refetch()} className="px-6 py-2 bg-[#485e38] text-white rounded-xl">Try Again</button>
            </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-24 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/5 mb-8">
              <ShoppingBag className="h-12 w-12 text-white/20" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No orders found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              {searchTerm ? "No orders match your search criteria." : "You don't have any customer orders yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#485e38]/80 backdrop-blur-md text-white border-b border-white/10">
                <tr>
                  <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em]">Order</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em]">Customer</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em]">Date</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em]">Items</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em]">Total</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="group hover:bg-white/5 transition-all duration-300">
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold font-mono bg-white/5 text-[#485e38] px-3 py-1.5 rounded-lg border border-white/10">
                        #{order._id?.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover:text-[#485e38] transition-colors">{order.customerName}</span>
                        <span className="text-xs text-gray-500">{order.customerPhone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-sm text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-sm font-bold text-white/80 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                        {order.items?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-sm font-black text-white font-mono">
                        ${order.total?.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ${getStatusColor(order.status || 'pending')}`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsModalOpen(true);
                        }}
                        className="p-3 text-white/30 hover:text-white hover:bg-white/10 rounded-2xl transition-all active:scale-95 group/btn"
                      >
                        <Eye className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#0f172a] rounded-[3.5rem] shadow-2xl border border-white/10 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-10">
              <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-white">Order Details</h3>
                  <p className="text-[#485e38] font-mono text-sm font-bold tracking-widest">ORDER ID: {selectedOrder._id}</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all hover:rotate-90">
                  <XCircle className="h-7 w-7" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                <div className="space-y-5">
                  <h4 className="text-[10px] font-bold text-[#485e38] uppercase tracking-[0.3em] flex items-center gap-3">
                    <div className="w-6 h-px bg-[#485e38]/50"></div>
                    <User className="h-4 w-4" /> Customer Info
                  </h4>
                  <div className="space-y-2">
                    <p className="text-2xl font-black text-white">{selectedOrder.customerName}</p>
                    <p className="text-sm text-gray-400 flex items-center gap-2"><Phone className="h-4 w-4 text-[#485e38]" /> {selectedOrder.customerPhone}</p>
                    <p className="text-sm text-gray-400 flex items-center gap-2">{selectedOrder.customerEmail}</p>
                  </div>
                </div>
                <div className="space-y-5">
                  <h4 className="text-[10px] font-bold text-[#485e38] uppercase tracking-[0.3em] flex items-center gap-3">
                    <div className="w-6 h-px bg-[#485e38]/50"></div>
                    <MapPin className="h-4 w-4" /> Delivery
                  </h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-300 leading-relaxed font-medium">{selectedOrder.addressLine1}</p>
                    <p className="text-sm text-white font-black">{selectedOrder.city}</p>
                    {selectedOrder.notes && (
                      <div className="bg-amber-500/10 p-4 rounded-2xl mt-4 border border-amber-500/20">
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Customer Note</p>
                        <p className="text-xs text-amber-200/80 italic leading-relaxed">{selectedOrder.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-bold text-[#485e38] uppercase tracking-[0.3em] flex items-center gap-3">
                  <div className="w-6 h-px bg-[#485e38]/50"></div>
                  Items Ordered
                </h4>
                <div className="max-h-56 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors group">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover:text-[#485e38] transition-colors">{item.name}</span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{item.brand} • {item.size} • QTY: {item.quantity}</span>
                      </div>
                      <span className="text-sm font-black text-white font-mono">${item.lineTotal?.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-white/10 flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Status</p>
                  <span className={`inline-flex items-center px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status || 'Pending'}
                  </span>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Total Revenue</p>
                  <p className="text-4xl font-black text-[#485e38] tracking-tighter">${selectedOrder.total?.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
