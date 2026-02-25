import { useState, useEffect } from 'react';
import { ShoppingCart, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import { formatPrice } from '../utils/format';

export const AccessoriesPage = () => {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedCategory, searchTerm, products]);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select(`
        *,
        images:product_images(*)
      `)
      .eq('is_available', true);

    if (data) {
      setProducts(data);
      setFilteredProducts(data);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name_en.toLowerCase().includes(term) ||
          p.name_bn.toLowerCase().includes(term)
      );
    }

    setFilteredProducts(filtered);
  };

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="bg-gradient-to-r from-gray-900 to-black text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">{t('nav.accessories')}</h1>
          <p className="text-xl text-gray-300">
            {language === 'en' ? 'Premium car accessories and parts' : 'প্রিমিয়াম গাড়ির এক্সেসরিজ এবং যন্ত্রাংশ'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('filter.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          >
            <option value="">{language === 'en' ? 'All Categories' : 'সব ক্যাটাগরি'}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">
              {language === 'en' ? 'No products found' : 'কোনো পণ্য পাওয়া যায়নি'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} hover>
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={product.images?.[0]?.image_url || 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={language === 'en' ? product.name_en : product.name_bn}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  {product.stock_quantity > 0 ? (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                      {t('shop.in_stock')}
                    </div>
                  ) : (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      {t('shop.out_of_stock')}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {language === 'en' ? product.name_en : product.name_bn}
                  </h3>
                  <div className="text-xl font-bold text-blue-600 mb-3">
                    {formatPrice(product.price, language)}
                  </div>
                  <Button className="w-full" disabled={product.stock_quantity === 0}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {t('shop.add_to_cart')}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
