import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import {
  ShoppingCart,
  Heart,
  Share2,
  ChevronLeft,
  Star,
  Truck,
  Shield,
  Package,
  Plus,
  Minus,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getProductById } from '../data/demoProducts';

interface Product {
  id: string;
  name_en: string;
  name_bn: string;
  description_en?: string;
  description_bn?: string;
  category: string;
  price: number;
  stock_quantity: number;
  sku?: string;
  is_available: boolean;
  images?: { image_url: string }[];
  brand?: string;
  rating?: number;
  reviews?: number;
  discount?: number;
  compatibility?: string[];
  specifications?: Record<string, string>;
}

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { addToCart } = useCart();

  const isDark = theme === 'dark';

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Fetch product details from Supabase or fallback to demo data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('accessories')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        // Parse images if stored as JSON
        let processedProduct = { ...data };
        if (typeof data.images === 'string') {
          try {
            processedProduct.images = JSON.parse(data.images);
          } catch {
            processedProduct.images = [];
          }
        }

        setProduct(processedProduct);
      } catch (error) {
        console.error('Error fetching product from Supabase:', error);
        // Fallback: try to find in shared demo data
        const demoProduct = getProductById(id || '');
        if (demoProduct) {
          setProduct(demoProduct);
        }
        // If still not found, product will remain null and show "Product not found"
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      addToCart({
        id: product.id,
        name: language === 'bn' ? product.name_bn : product.name_en,
        price: product.discount
          ? product.price * (1 - product.discount / 100)
          : product.price,
        quantity,
        image: product.images?.[0]?.image_url,
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const getStockStatus = () => {
    if (product?.stock_quantity === 0) return { label: 'Out of Stock', color: 'red', icon: '❌' };
    if (product?.stock_quantity && product.stock_quantity <= 5)
      return { label: `Low Stock (${product.stock_quantity})`, color: 'orange', icon: '⚠️' };
    return { label: 'In Stock', color: 'green', icon: '✅' };
  };

  const stockStatus = getStockStatus();
  const discountedPrice = product
    ? product.discount
      ? product.price * (1 - product.discount / 100)
      : product.price
    : 0;

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#050505]' : 'bg-gray-50'}`}>
        <div className="w-8 h-8 border-2 border-[#C00000] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#050505]' : 'bg-gray-50'}`}>
        <div className="text-center">
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Product not found</p>
          <button
            onClick={() => navigate('/accessories')}
            className="mt-4 px-4 py-2 bg-[#C00000] text-white rounded hover:bg-red-700"
          >
            Back to Accessories
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen ${isDark ? 'bg-[#050505]' : 'bg-gray-50'}`}
    >
      {/* Breadcrumb & Back Button */}
      <div className={`${isDark ? 'bg-[#0a0a0a]' : 'bg-white'} border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-2">
          <button
            onClick={() => navigate('/accessories')}
            className={`flex items-center gap-2 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}
          >
            <ChevronLeft size={20} />
            Back to Accessories
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Image Gallery */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            {/* Main Image */}
            <div
              className={`mb-4 rounded-lg overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-gray-200'} aspect-square flex items-center justify-center`}
            >
              {product.images && product.images[selectedImage] ? (
                <img
                  src={product.images[selectedImage].image_url}
                  alt={language === 'bn' ? product.name_bn : product.name_en}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`text-center ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                  <Package size={60} className="mx-auto mb-2 opacity-50" />
                  <p>No image available</p>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 rounded overflow-hidden border-2 transition ${
                      selectedImage === idx
                        ? 'border-[#C00000]'
                        : isDark
                          ? 'border-gray-700 hover:border-gray-600'
                          : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <img src={img.image_url} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right: Product Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {/* Product Name */}
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
              {language === 'bn' ? product.name_bn : product.name_en}
            </h1>

            {/* SKU & Brand */}
            {(product.sku || product.brand) && (
              <div className={`flex gap-4 mb-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {product.brand && <span>Brand: {product.brand}</span>}
                {product.sku && <span>SKU: {product.sku}</span>}
              </div>
            )}

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}
                    />
                  ))}
                </div>
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {product.rating.toFixed(1)} ({product.reviews || 0} reviews)
                </span>
              </div>
            )}

            {/* Price Section */}
            <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-[#C00000]">৳{discountedPrice.toFixed(0)}</span>
                {product.discount ? (
                  <>
                    <span className="text-lg line-through text-gray-500">৳{product.price}</span>
                    <span className="ml-2 px-2 py-1 bg-[#C00000] text-white text-xs rounded font-bold">
                      -{product.discount}%
                    </span>
                  </>
                ) : null}
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Price includes all taxes</p>
            </div>

            {/* Stock Status */}
            <div className={`mb-6 p-3 rounded-lg flex items-center gap-2 ${
              stockStatus.color === 'green'
                ? isDark
                  ? 'bg-green-900/20'
                  : 'bg-green-50'
                : stockStatus.color === 'orange'
                  ? isDark
                    ? 'bg-orange-900/20'
                    : 'bg-orange-50'
                  : isDark
                    ? 'bg-red-900/20'
                    : 'bg-red-50'
            }`}>
              <span className="text-xl">{stockStatus.icon}</span>
              <span
                className={`font-semibold ${
                  stockStatus.color === 'green'
                    ? 'text-green-700 dark:text-green-400'
                    : stockStatus.color === 'orange'
                      ? 'text-orange-700 dark:text-orange-400'
                      : 'text-red-700 dark:text-red-400'
                }`}
              >
                {stockStatus.label}
              </span>
            </div>

            {/* Description */}
            {product.description_en && (
              <div className="mb-6">
                <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>Description</h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {language === 'bn' ? product.description_bn : product.description_en}
                </p>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mb-6">
                <h3 className={`font-bold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>Specifications</h3>
                <div className={`space-y-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Cart */}
            <div className="mb-6 space-y-3">
              <div className="flex items-center gap-4">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Quantity:</span>
                <div className={`flex items-center border rounded ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className={`p-2 ${quantity <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                  >
                    <Minus size={16} />
                  </button>
                  <span className={`px-4 py-2 font-bold ${isDark ? 'text-white' : 'text-black'}`}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity || 10, quantity + 1))}
                    disabled={(product.stock_quantity || 10) <= quantity}
                    className={`p-2 ${
                      (product.stock_quantity || 10) <= quantity
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition ${
                  product.stock_quantity === 0
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-[#C00000] text-white hover:bg-red-700'
                }`}
              >
                <ShoppingCart size={20} />
                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </button>
            </div>

            {/* Wishlist & Share */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`flex-1 py-2 rounded-lg border transition flex items-center justify-center gap-2 ${
                  isWishlisted
                    ? 'bg-red-50 dark:bg-red-900/20 border-[#C00000] text-[#C00000]'
                    : isDark
                      ? 'border-gray-700 text-gray-400 hover:text-white'
                      : 'border-gray-300 text-gray-600 hover:text-black'
                }`}
              >
                <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                Wishlist
              </button>
              <button
                className={`flex-1 py-2 rounded-lg border transition flex items-center justify-center gap-2 ${
                  isDark ? 'border-gray-700 text-gray-400 hover:text-white' : 'border-gray-300 text-gray-600 hover:text-black'
                }`}
              >
                <Share2 size={18} />
                Share
              </button>
            </div>

            {/* Info Cards */}
            <div className="space-y-3">
              <div className={`p-3 rounded-lg flex items-center gap-3 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
                <Truck className="text-[#C00000]" size={20} />
                <div className="text-sm">
                  <p className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>Free Shipping</p>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>On orders over ৳2,000</p>
                </div>
              </div>
              <div className={`p-3 rounded-lg flex items-center gap-3 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
                <Shield className="text-[#C00000]" size={20} />
                <div className="text-sm">
                  <p className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>Secure Payment</p>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>100% secure checkout</p>
                </div>
              </div>
              <div className={`p-3 rounded-lg flex items-center gap-3 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
                <Package className="text-[#C00000]" size={20} />
                <div className="text-sm">
                  <p className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>30-Day Returns</p>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Easy returns & refunds</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;
