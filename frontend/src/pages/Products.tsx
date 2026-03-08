import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import { mockProducts, availableFilters } from '../data/mockData';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [gridCols, setGridCols] = useState(4);
  const [showFilters, setShowFilters] = useState(false);

  // Get filter values from URL
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const gender = searchParams.get('gender') || '';
  const sort = searchParams.get('sort') || 'relevance';
  const minPrice = Number(searchParams.get('minPrice') || 0);
  const maxPrice = Number(searchParams.get('maxPrice') || 10000);
  const sizes = searchParams.get('sizes')?.split(',').filter(Boolean) || [];
  const colors = searchParams.get('colors')?.split(',').filter(Boolean) || [];
  const discount = Number(searchParams.get('discount') || 0);
  const rating = Number(searchParams.get('rating') || 0);
  const fabric = searchParams.get('fabric') || '';
  const page = Number(searchParams.get('page') || 1);
  const perPage = 20;

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    let result = [...mockProducts];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.tags?.some(t => t.includes(q)));
    }
    if (category) result = result.filter(p => category.split(',').includes(p.category));
    if (brand) result = result.filter(p => brand.split(',').includes(p.brand));
    if (gender) result = result.filter(p => p.gender === gender || p.gender === 'unisex');
    if (minPrice > 0) result = result.filter(p => p.price >= minPrice);
    if (maxPrice < 10000) result = result.filter(p => p.price <= maxPrice);
    if (sizes.length) result = result.filter(p => p.sizes.some(s => sizes.includes(s.size) && s.stock > 0));
    if (colors.length) result = result.filter(p => p.colors.some(c => colors.includes(c.name)));
    if (discount > 0) result = result.filter(p => p.discount >= discount);
    if (rating > 0) result = result.filter(p => p.avgRating >= rating);
    if (fabric) result = result.filter(p => fabric.split(',').includes(p.fabric || ''));

    switch (sort) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'newest': result.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')); break;
      case 'popular': result.sort((a, b) => b.numReviews - a.numReviews); break;
      case 'rating': result.sort((a, b) => b.avgRating - a.avgRating); break;
    }
    return result;
  }, [search, category, brand, gender, sort, minPrice, maxPrice, sizes, colors, discount, rating, fabric]);

  const paginatedProducts = filteredProducts.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filteredProducts.length / perPage);

  const updateFilter = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.set('page', '1');
    setSearchParams(p);
  };

  const toggleArrayFilter = (key: string, value: string) => {
    const current = searchParams.get(key)?.split(',').filter(Boolean) || [];
    const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
    updateFilter(key, updated.join(','));
  };

  // Active filter chips
  const activeFilters: { label: string; clear: () => void }[] = [];
  if (search) activeFilters.push({ label: `Search: "${search}"`, clear: () => updateFilter('search', '') });
  if (category) category.split(',').forEach(c => activeFilters.push({ label: c, clear: () => toggleArrayFilter('category', c) }));
  if (brand) brand.split(',').forEach(b => activeFilters.push({ label: b, clear: () => toggleArrayFilter('brand', b) }));
  if (gender) activeFilters.push({ label: gender.charAt(0).toUpperCase() + gender.slice(1), clear: () => updateFilter('gender', '') });
  if (discount) activeFilters.push({ label: `${discount}%+ off`, clear: () => updateFilter('discount', '') });
  if (fabric) activeFilters.push({ label: fabric, clear: () => updateFilter('fabric', '') });

  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);

  // Brand checkboxes state
  const selectedBrands = brand ? brand.split(',') : [];
  const selectedCategories = category ? category.split(',') : [];

  return (
    <div className="page-enter max-w-[1440px] mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <Link to="/" className="hover:text-primary-500">Home</Link>
        <span>/</span>
        <span className="text-dark-700 font-medium">{gender ? `${gender.charAt(0).toUpperCase() + gender.slice(1)}'s Fashion` : 'All Products'}</span>
        {category && <><span>/</span><span className="text-dark-700 font-medium">{category}</span></>}
      </div>

      <div className="flex gap-6">
        {/* Filter Sidebar */}
        <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-black/50 lg:relative lg:bg-transparent' : 'hidden lg:block'} lg:w-64 flex-shrink-0`}>
          <div className={`${showFilters ? 'absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto animate-slide-in lg:relative lg:w-auto' : ''}`}>
            {showFilters && (
              <div className="flex items-center justify-between p-4 border-b lg:hidden">
                <h3 className="font-bold">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="text-2xl">×</button>
              </div>
            )}
            <div className="space-y-6 p-4 lg:p-0">
              {/* Categories */}
              <div>
                <h4 className="text-sm font-bold text-dark-700 mb-3 uppercase tracking-wide">Category</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableFilters.categories.map(c => (
                    <label key={c} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" checked={selectedCategories.includes(c)} onChange={() => toggleArrayFilter('category', c)}
                        className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-400" />
                      <span className="text-sm text-gray-600 group-hover:text-dark-700">{c}</span>
                      <span className="text-xs text-gray-300 ml-auto">({mockProducts.filter(p => p.category === c).length})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h4 className="text-sm font-bold text-dark-700 mb-3 uppercase tracking-wide">Brand</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableFilters.brands.slice(0, 10).map(b => (
                    <label key={b} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" checked={selectedBrands.includes(b)} onChange={() => toggleArrayFilter('brand', b)}
                        className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-400" />
                      <span className="text-sm text-gray-600 group-hover:text-dark-700">{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-sm font-bold text-dark-700 mb-3 uppercase tracking-wide">Price Range</h4>
                <div className="px-1">
                  <input type="range" min={0} max={10000} step={100} value={priceRange[1]}
                    onChange={e => { setPriceRange([priceRange[0], Number(e.target.value)]); }}
                    onMouseUp={() => { updateFilter('maxPrice', priceRange[1] < 10000 ? String(priceRange[1]) : ''); }}
                    className="w-full" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>₹0</span>
                    <span className="font-semibold text-dark-700">₹{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h4 className="text-sm font-bold text-dark-700 mb-3 uppercase tracking-wide">Size</h4>
                <div className="flex flex-wrap gap-2">
                  {availableFilters.sizes.map(s => (
                    <button key={s} onClick={() => toggleArrayFilter('sizes', s)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${sizes.includes(s) ? 'bg-primary-500 text-white border-primary-500' : 'border-gray-300 text-gray-600 hover:border-primary-400'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <h4 className="text-sm font-bold text-dark-700 mb-3 uppercase tracking-wide">Color</h4>
                <div className="flex flex-wrap gap-2">
                  {availableFilters.colors.map(c => (
                    <button key={c.name} onClick={() => toggleArrayFilter('colors', c.name)} title={c.name}
                      className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${colors.includes(c.name) ? 'border-primary-500 ring-2 ring-primary-300 ring-offset-1' : 'border-gray-200'}`}
                      style={{ backgroundColor: c.hex }} />
                  ))}
                </div>
              </div>

              {/* Discount */}
              <div>
                <h4 className="text-sm font-bold text-dark-700 mb-3 uppercase tracking-wide">Discount</h4>
                <div className="space-y-2">
                  {availableFilters.discounts.map(d => (
                    <label key={d} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="discount" checked={discount === d} onChange={() => updateFilter('discount', String(d))}
                        className="w-4 h-4 text-primary-500 focus:ring-primary-400" />
                      <span className="text-sm text-gray-600">{d}% and above</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="text-sm font-bold text-dark-700 mb-3 uppercase tracking-wide">Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2].map(r => (
                    <label key={r} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="rating" checked={rating === r} onChange={() => updateFilter('rating', String(r))}
                        className="w-4 h-4 text-primary-500 focus:ring-primary-400" />
                      <span className="text-sm text-gray-600">{r}★ & above</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fabric */}
              <div>
                <h4 className="text-sm font-bold text-dark-700 mb-3 uppercase tracking-wide">Fabric</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {availableFilters.fabrics.map(f => (
                    <label key={f} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={fabric.split(',').includes(f)} onChange={() => toggleArrayFilter('fabric', f)}
                        className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-400" />
                      <span className="text-sm text-gray-600">{f}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear All */}
              {activeFilters.length > 0 && (
                <button onClick={() => setSearchParams(new URLSearchParams())}
                  className="w-full py-2.5 border border-primary-500 text-primary-500 rounded-lg text-sm font-semibold hover:bg-primary-50 transition-colors">
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setShowFilters(true)} className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium hover:border-primary-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
                Filters
              </button>
              <span className="text-sm text-gray-500">
                Showing <strong className="text-dark-700">{(page - 1) * perPage + 1}-{Math.min(page * perPage, filteredProducts.length)}</strong> of <strong className="text-dark-700">{filteredProducts.length}</strong> products
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <select value={sort} onChange={e => updateFilter('sort', e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-300">
                <option value="relevance">Sort by: Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="popular">Popularity</option>
                <option value="rating">Customer Rating</option>
              </select>

              {/* Grid Toggle */}
              <div className="hidden md:flex items-center border rounded-lg overflow-hidden">
                {[2, 3, 4].map(cols => (
                  <button key={cols} onClick={() => setGridCols(cols)}
                    className={`px-3 py-2 text-xs font-semibold transition-colors ${gridCols === cols ? 'bg-primary-500 text-white' : 'text-gray-400 hover:bg-gray-50'}`}>
                    {cols}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeFilters.map((f, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-600 rounded-full text-xs font-medium">
                  {f.label}
                  <button onClick={f.clear} className="hover:text-primary-800 font-bold">×</button>
                </span>
              ))}
              <button onClick={() => setSearchParams(new URLSearchParams())} className="text-xs text-primary-500 font-semibold hover:underline ml-1">Clear all</button>
            </div>
          )}

          {/* Product Grid */}
          {paginatedProducts.length > 0 ? (
            <div className={`grid gap-4 grid-cols-2 ${gridCols === 3 ? 'md:grid-cols-3' : gridCols === 4 ? 'md:grid-cols-3 lg:grid-cols-4' : 'md:grid-cols-2'}`}>
              {paginatedProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <span className="text-6xl mb-4 block">🔍</span>
              <h3 className="text-xl font-bold text-dark-700 mb-2">No products found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your filters or search terms</p>
              <button onClick={() => setSearchParams(new URLSearchParams())} className="btn-primary">Clear All Filters</button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button onClick={() => updateFilter('page', String(Math.max(1, page - 1)))} disabled={page === 1}
                className="px-4 py-2 border rounded-lg text-sm font-medium hover:border-primary-400 disabled:opacity-40 disabled:cursor-not-allowed">← Previous</button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button key={pageNum} onClick={() => updateFilter('page', String(pageNum))}
                    className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors ${page === pageNum ? 'bg-primary-500 text-white' : 'border hover:border-primary-400'}`}>
                    {pageNum}
                  </button>
                );
              })}
              <button onClick={() => updateFilter('page', String(Math.min(totalPages, page + 1)))} disabled={page === totalPages}
                className="px-4 py-2 border rounded-lg text-sm font-medium hover:border-primary-400 disabled:opacity-40 disabled:cursor-not-allowed">Next →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
