import { useState, useEffect } from 'react';
import { Mail, Trash2, Download, RefreshCw, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Subscriber {
  id: string;
  email: string;
  is_active: boolean;
  subscribed_at: string;
  unsubscribed_at: string | null;
  created_at: string;
}

export default function SubscriberManagement() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterActive, setFilterActive] = useState<boolean | null>(true);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

  useEffect(() => {
    loadSubscribers();
  }, [filterActive]);

  const loadSubscribers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterActive !== null) {
        query = query.eq('is_active', filterActive);
      }

      const { data, error } = await query;

      if (error) throw error;

      setSubscribers(data || []);

      // Calculate stats
      const { data: allData } = await supabase
        .from('subscribers')
        .select('is_active');

      if (allData) {
        const active = allData.filter(s => s.is_active).length;
        setStats({
          total: allData.length,
          active: active,
          inactive: allData.length - active
        });
      }
    } catch (error) {
      console.error('Error loading subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubscriber = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to permanently delete ${email}?`)) return;

    try {
      const { error } = await supabase
        .from('subscribers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSubscribers(subscribers.filter(s => s.id !== id));
      loadSubscribers(); // Reload to update stats
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      alert('Failed to delete subscriber');
    }
  };

  const exportSubscribers = () => {
    const csvContent = [
      ['Email', 'Status', 'Subscribed At', 'Unsubscribed At'].join(','),
      ...subscribers.map(s => [
        s.email,
        s.is_active ? 'Active' : 'Inactive',
        new Date(s.subscribed_at).toLocaleString(),
        s.unsubscribed_at ? new Date(s.unsubscribed_at).toLocaleString() : 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold" style={{
            fontFamily: 'Cinzel, serif',
            color: '#d4af37'
          }}>
            Subscriber Management
          </h2>
          <p className="text-sm" style={{ color: '#a8a29e' }}>
            Manage your personal reading subscribers
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadSubscribers}
            disabled={loading}
            className="px-4 py-2 bg-amber-600/20 border border-amber-600/40 hover:bg-amber-600/30 transition-colors flex items-center gap-2 disabled:opacity-50"
            style={{ color: '#d4af37' }}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={exportSubscribers}
            disabled={subscribers.length === 0}
            className="px-4 py-2 bg-green-600/20 border border-green-600/40 hover:bg-green-600/30 transition-colors flex items-center gap-2 disabled:opacity-50"
            style={{ color: '#10b981' }}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-amber-600/10 border-2 border-amber-600/40 rounded">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8" style={{ color: '#d4af37' }} />
            <div>
              <p className="text-sm" style={{ color: '#a8a29e' }}>Total Subscribers</p>
              <p className="text-3xl font-bold" style={{ color: '#d4af37' }}>{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-green-600/10 border-2 border-green-600/40 rounded">
          <div className="flex items-center gap-3">
            <Mail className="w-8 h-8" style={{ color: '#10b981' }} />
            <div>
              <p className="text-sm" style={{ color: '#a8a29e' }}>Active</p>
              <p className="text-3xl font-bold" style={{ color: '#10b981' }}>{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-red-600/10 border-2 border-red-600/40 rounded">
          <div className="flex items-center gap-3">
            <Mail className="w-8 h-8" style={{ color: '#ef4444' }} />
            <div>
              <p className="text-sm" style={{ color: '#a8a29e' }}>Unsubscribed</p>
              <p className="text-3xl font-bold" style={{ color: '#ef4444' }}>{stats.inactive}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-amber-600/20">
        <button
          onClick={() => setFilterActive(null)}
          className={`px-4 py-2 font-medium transition-colors ${
            filterActive === null
              ? 'border-b-2 border-amber-600 text-amber-400'
              : 'text-stone-400 hover:text-amber-300'
          }`}
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setFilterActive(true)}
          className={`px-4 py-2 font-medium transition-colors ${
            filterActive === true
              ? 'border-b-2 border-amber-600 text-amber-400'
              : 'text-stone-400 hover:text-amber-300'
          }`}
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          Active ({stats.active})
        </button>
        <button
          onClick={() => setFilterActive(false)}
          className={`px-4 py-2 font-medium transition-colors ${
            filterActive === false
              ? 'border-b-2 border-amber-600 text-amber-400'
              : 'text-stone-400 hover:text-amber-300'
          }`}
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          Unsubscribed ({stats.inactive})
        </button>
      </div>

      {/* Subscribers List */}
      <div className="border-2 border-amber-600/40 rounded overflow-hidden">
        {loading ? (
          <div className="p-8 text-center" style={{ color: '#a8a29e' }}>
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
            Loading subscribers...
          </div>
        ) : subscribers.length === 0 ? (
          <div className="p-8 text-center" style={{ color: '#a8a29e' }}>
            <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No subscribers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-amber-600/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#d4af37' }}>
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#d4af37' }}>
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#d4af37' }}>
                    Subscribed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#d4af37' }}>
                    Unsubscribed
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: '#d4af37' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-600/20">
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-amber-600/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" style={{ color: '#d4af37' }} />
                        <span style={{ color: '#f5e6d3' }}>{subscriber.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        subscriber.is_active
                          ? 'bg-green-600/20 text-green-400 border border-green-600/40'
                          : 'bg-red-600/20 text-red-400 border border-red-600/40'
                      }`}>
                        {subscriber.is_active ? 'Active' : 'Unsubscribed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#a8a29e' }}>
                      {formatDate(subscriber.subscribed_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#a8a29e' }}>
                      {subscriber.unsubscribed_at ? formatDate(subscriber.unsubscribed_at) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => deleteSubscriber(subscriber.id, subscriber.email)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Delete subscriber"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
