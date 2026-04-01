import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Package,
  Search,
  Filter,
  Edit2,
  TrendingUp,
  AlertTriangle,
  Eye,
  Save,
  X,
} from 'lucide-react';
import { getStockStatus, formatStockMessage } from '../lib/inventoryUtils';

interface Product {
  id: string;
  name_en: string;
  name_bn: string;
  price: number;
  stock_quantity: number;
  category: string;
  is_available: boolean;
  sku?: string;
}

interface EditingProduct extends Product {
  isEditing?: boolean;
}

const InventoryManagementPage: React.FC = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isDark = theme === 'dark';

  const [products, setProducts] = useState<EditingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, number>>({});

  const translations = {
    en: {
      inventory: 'Inventory Management',
      totalProducts: 'Total Products',
      inStock: 'In Stock',
      lowStock: 'Low Stock',
      outOfStock: 'Out of Stock',
      totalValue: 'Total Inventory Value',
      productName: 'Product Name',
      category: 'Category',
      stock: 'Stock',
      status: 'Status',
      price: 'Price',
      actions: 'Actions',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      search: 'Search products...',
      noResults: 'No products found',
      lowStockAlert: 'Low stock alert',
      outOfStockAlert: 'Out of stock',
    },
    bn: {
      inventory: 'ইনভেন্টরি ব্যবস্থাপনা',
      totalProducts: 'মোট পণ্য',
      inStock: 'স্টকে আছে',
      lowStock: 'কম স্টক',
      outOfStock: 'স্টক শেষ',
      totalValue: 'মোট ইনভেন্টরি মূল্য',
      productName: 'পণ্যের নাম',
      category: 'বিভাগ',
      stock: 'স্টক',
      status: 'অবস্থা',
      price: 'মূল্য',
      actions: 'পদক্ষেপ',
      edit: 'সম্পাদনা',
      save: 'সংরক্ষণ করুন',
      cancel: 'বাতিল করুন',
      delete: 'মুছে ফেলুন',
      search: 'পণ্য খুঁজুন...',
      noResults: 'কোন পণ্য পাওয়া যায়নি',
      lowStockAlert: 'কম স্টক সতর্কতা',
      outOfStockAlert: 'স্টক শেষ',
    },
  };

  const t = (key: keyof typeof translations.en) => {
    return language === 'en' ? translations.en[key] : translations.bn[key];
  };

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // TODO: Replace with actual Supabase query
        // For demo, using mock data
        const mockProducts: Product[] = [
          { id: '1', name_en: 'Brake Pad Set', name_bn: 'ব্রেক প্যাড সেট', price: 4500, stock_quantity: 25, category: 'Accessories', is_available: true, sku: 'BP-001' },
          { id: '2', name_en: 'Air Filter', name_bn: 'এয়ার ফিল্টার', price: 2500, stock_quantity: 8, category: 'Filters', is_available: true, sku: 'AF-001' },
          { id: '3', name_en: 'Oil Filter', name_bn: 'অয়েল ফিল্টার', price: 1200, stock_quantity: 0, category: 'Filters', is_available: false, sku: 'OF-001' },
          { id: '4', name_en: 'Spark Plugs', name_bn: 'স্পার্ক প্লাগ', price: 3200, stock_quantity: 45, category: 'Engine', is_available: true, sku: 'SP-001' },
          { id: '5', name_en: 'Battery', name_bn: 'ব্যাটারি', price: 8500, stock_quantity: 3, category: 'Electrical', is_available: true, sku: 'BAT-001' },
        ];
        setProducts(mockProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name_bn.includes(searchTerm) ||
      product.sku?.includes(searchTerm.toUpperCase());

    const stockInfo = getStockStatus(product.stock_quantity);
    const matchesFilter = filterStatus === 'all' || stockInfo.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // Calculate stats
  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.stock_quantity > 10).length,
    lowStock: products.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= 10).length,
    outOfStock: products.filter((p) => p.stock_quantity === 0).length,
    totalValue: products.reduce((sum, p) => sum + p.price * p.stock_quantity, 0),
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditValues({ [product.id]: product.stock_quantity });
  };

  const handleSave = (product: Product) => {
    const newStock = editValues[product.id];
    setProducts(
      products.map((p) =>
        p.id === product.id
          ? { ...p, stock_quantity: newStock, is_available: newStock > 0 }
          : p
      )
    );
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin">
          <Package size={48} className="text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      {/* Header */}
      <div className={`sticky top-0 z-40 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('inventory')}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: t('totalProducts'), value: stats.total, icon: Package, color: 'blue' },
            { label: t('inStock'), value: stats.inStock, icon: TrendingUp, color: 'green' },
            { label: t('lowStock'), value: stats.lowStock, icon: AlertTriangle, color: 'yellow' },
            { label: t('outOfStock'), value: stats.outOfStock, icon: Eye, color: 'red' },
            { label: t('totalValue'), value: `৳${(stats.totalValue / 1000).toFixed(0)}K`, icon: Package, color: 'purple' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-lg p-4 ${isDark ? 'bg-gray-800' : 'bg-white shadow-md'}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {stat.value}
                  </p>
                </div>
                <stat.icon size={32} className={`text-${stat.color}-500`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Controls */}
        <div className={`rounded-lg p-6 mb-8 ${isDark ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>
            </div>
            <div className="flex gap-2">
              {['all', 'in-stock', 'low-stock', 'out-of-stock'].map((status) => (
                <motion.button
                  key={status}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilterStatus(status as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterStatus === status
                      ? 'bg-blue-500 text-white shadow-lg'
                      : isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Filter size={16} className="inline mr-2" />
                  {status === 'all' ? t('inventory') : status.replace('-', ' ')}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`rounded-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white shadow-md'}`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={isDark ? 'bg-gray-700' : 'bg-gray-100'}>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('productName')}
                  </th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('category')}
                  </th>
                  <th className={`px-6 py-3 text-center text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('stock')}
                  </th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('status')}
                  </th>
                  <th className={`px-6 py-3 text-right text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('price')}
                  </th>
                  <th className={`px-6 py-3 text-center text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => {
                      const stockInfo = getStockStatus(product.stock_quantity);
                      const isEditing = editingId === product.id;

                      return (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`border-t ${isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}
                        >
                          <td className={`px-6 py-4 font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {product.name_en}
                          </td>
                          <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {product.category}
                          </td>
                          <td className={`px-6 py-4 text-center font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {isEditing ? (
                              <input
                                type="number"
                                value={editValues[product.id] || product.stock_quantity}
                                onChange={(e) =>
                                  setEditValues({
                                    ...editValues,
                                    [product.id]: Math.max(0, parseInt(e.target.value)),
                                  })
                                }
                                className={`w-20 px-2 py-1 rounded text-center border ${
                                  isDark
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                }`}
                              />
                            ) : (
                              product.stock_quantity
                            )}
                          </td>
                          <td className={`px-6 py-4 text-sm font-medium`}>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                stockInfo.status === 'in-stock'
                                  ? isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700'
                                  : stockInfo.status === 'low-stock'
                                  ? isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-50 text-yellow-700'
                                  : isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-700'
                              }`}
                            >
                              {formatStockMessage(stockInfo)}
                            </span>
                          </td>
                          <td className={`px-6 py-4 text-right font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            ৳{product.price.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {isEditing ? (
                              <div className="flex items-center justify-center gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleSave(product)}
                                  className="p-2 rounded bg-green-500 text-white hover:bg-green-600"
                                >
                                  <Save size={16} />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setEditingId(null)}
                                  className={`p-2 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
                                >
                                  <X size={16} />
                                </motion.button>
                              </div>
                            ) : (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEdit(product)}
                                className={`p-2 rounded transition-colors ${
                                  isDark
                                    ? 'hover:bg-gray-700 text-gray-400 hover:text-blue-400'
                                    : 'hover:bg-gray-100 text-gray-600 hover:text-blue-600'
                                }`}
                              >
                                <Edit2 size={16} />
                              </motion.button>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{t('noResults')}</p>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InventoryManagementPage;
