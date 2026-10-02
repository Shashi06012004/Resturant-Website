import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const { showToast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      if (res.data.success) {
        showToast(`Order status updated to '${newStatus}'`, 'success');
        fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
        }
      }
    } catch (error) {
      showToast('Failed to update order status', 'error');
    }
  };

  const statusOptions = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== 'all' && o.orderStatus !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-ivory">Order Management</h1>
          <p className="text-xs text-brand-muted mt-1">Monitor live incoming customer orders and update status</p>
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center space-x-1.5 text-xs text-brand-gold bg-brand-gold/10 border border-brand-gold/30 px-3.5 py-2 rounded-xl hover:bg-brand-gold/20 transition self-start sm:self-auto font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Live Orders</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            filterStatus === 'all' ? 'bg-brand-gold text-brand-dark font-bold' : 'bg-brand-card text-brand-muted border border-brand-border'
          }`}
        >
          All Orders ({orders.length})
        </button>
        {statusOptions.map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              filterStatus === st ? 'bg-brand-gold text-brand-dark font-bold' : 'bg-brand-card text-brand-muted border border-brand-border'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-brand-card border border-brand-border/80 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-brand-muted text-xs">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-brand-muted text-xs">No orders found for this status filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-brand-border/60 text-brand-muted uppercase text-[10px] bg-brand-dark/40">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Order Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40 text-brand-ivory">
                {filteredOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-brand-dark/50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-brand-gold">
                      #{ord._id.substring(ord._id.length - 8)}
                    </td>
                    <td className="py-3 px-4">
                      <strong className="block text-brand-ivory">{ord.customerName}</strong>
                      <span className="text-brand-muted text-[10px] block">{ord.customerPhone}</span>
                    </td>
                    <td className="py-3 px-4">{ord.items.length} item(s)</td>
                    <td className="py-3 px-4 font-bold text-brand-ivory">₹{ord.totalAmount}</td>
                    <td className="py-3 px-4 uppercase text-[10px] font-semibold text-brand-goldLight">
                      {ord.paymentMethod} ({ord.paymentStatus})
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                        className="bg-brand-dark border border-brand-border text-brand-gold font-bold text-xs rounded-xl px-3 py-1.5 outline-none cursor-pointer"
                      >
                        {statusOptions.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 rounded-lg bg-brand-dark border border-brand-border hover:border-brand-gold text-brand-ivory"
                        title="View Full Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-brand-card border border-brand-border rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
              <div>
                <h2 className="font-serif text-xl font-bold text-brand-ivory">
                  Order #{selectedOrder._id.substring(selectedOrder._id.length - 8)}
                </h2>
                <span className="text-[10px] text-brand-muted">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-brand-muted hover:text-brand-ivory">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-brand-dark p-3 rounded-xl space-y-1">
                <p className="font-bold text-brand-gold">Customer Information</p>
                <p>Name: {selectedOrder.customerName}</p>
                <p>Phone: {selectedOrder.customerPhone}</p>
                <p>Email: {selectedOrder.customerEmail}</p>
                <p className="mt-1 text-brand-muted">Address: {selectedOrder.deliveryAddress}</p>
                {selectedOrder.customerNotes && (
                  <p className="text-brand-goldLight mt-1">Notes: {selectedOrder.customerNotes}</p>
                )}
              </div>

              <div className="space-y-1">
                <p className="font-bold text-brand-ivory">Ordered Items:</p>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between border-b border-brand-border/40 py-1">
                    <span>
                      {item.productName} ({item.variantName}) x {item.quantity}
                    </span>
                    <span className="font-bold text-brand-ivory">₹{item.totalPrice}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-brand-border/60 flex justify-between font-bold text-sm">
                <span>Grand Total Amount</span>
                <span className="text-brand-gold">₹{selectedOrder.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
