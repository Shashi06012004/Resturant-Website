import React, { useState, useEffect } from 'react';
import api from '../services/api';

export const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const ordersRes = await api.get('/orders');
        if (ordersRes.data.success) {
          const uniqueCustomers = [];
          const seen = new Set();
          ordersRes.data.data.forEach((o) => {
            if (!seen.has(o.customerEmail)) {
              seen.add(o.customerEmail);
              uniqueCustomers.push({
                _id: o._id,
                name: o.customerName,
                email: o.customerEmail,
                phone: o.customerPhone,
                role: 'customer',
              });
            }
          });
          setCustomers(uniqueCustomers);
        }
      } catch (error) {
        console.error('Failed to fetch customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-brand-ivory">Registered Customers</h1>
        <p className="text-xs text-brand-muted mt-1">Directory of customers who placed orders at Draksha</p>
      </div>

      <div className="bg-brand-card border border-brand-border/80 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-brand-muted text-xs">Loading customer directory...</div>
        ) : customers.length === 0 ? (
          <div className="p-8 text-center text-brand-muted text-xs">No registered customer orders found yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-brand-border/60 text-brand-muted uppercase text-[10px] bg-brand-dark/40">
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Account Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40 text-brand-ivory">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-brand-dark/50 transition">
                    <td className="py-3 px-4 font-bold text-sm text-brand-gold">{c.name}</td>
                    <td className="py-3 px-4 text-brand-ivory">{c.email}</td>
                    <td className="py-3 px-4 text-brand-muted">{c.phone || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-500/40 uppercase">
                        Customer
                      </span>
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
};
