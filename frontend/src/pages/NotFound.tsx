import { Link } from 'react-router-dom';
import { mockProducts } from '../data/mockData';
import ProductCard from '../components/common/ProductCard';

export default function NotFound() {
  const suggestions = mockProducts.sort(() => Math.random() - 0.5).slice(0, 4);

  return (
    <div className="page-enter max-w-4xl mx-auto px-4 py-20 text-center">
      <div className="mb-8">
        <span className="text-8xl block mb-4">🔍</span>
        <h1 className="text-5xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-bold text-dark-700 mb-2">Page Not Found</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          Oops! The page you're looking for seems to have taken a fashion break. Let's get you back on track.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/" className="btn-primary">Go Home</Link>
          <Link to="/products" className="btn-secondary">Browse Products</Link>
        </div>
      </div>

      <div className="mt-16">
        <h3 className="text-xl font-display font-bold text-dark-700 mb-6">Meanwhile, check these out!</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {suggestions.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
