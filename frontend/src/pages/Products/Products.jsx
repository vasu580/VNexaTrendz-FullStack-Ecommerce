import { useState, useEffect, useCallback } from 'react'
import api from '../../api/axiosConfig'
import ProductCard from '../../components/ProductCard/ProductCard'
import Filters from '../../components/Filters/Filters'
import './Products.css'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    search: '', category: '', minRating: '', sortBy: '', page: 0
  })

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        page: filters.page,
        size: 12,
        ...(filters.search && { search: filters.search }),
        ...(filters.category && { category: filters.category }),
        ...(filters.minRating && { minRating: filters.minRating }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
      }
      const res = await api.get('/products', { params })
      setProducts(res.data.products)
      setTotalPages(res.data.totalPages)
      setTotalElements(res.data.totalElements)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    setFilters(f => ({ ...f, page: 0 }))
  }

  return (
    <div className="products-page">
      <div className="container">
        {/* Top bar */}
        <div className="products-topbar">
          <div className="topbar-left">
            <h2 className="products-title">
              All Products
              <span className="products-count">{totalElements} items</span>
            </h2>
          </div>

          <form className="search-bar" onSubmit={handleSearch}>
            <svg className="search-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search products, brands..."
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value, page: 0 }))}
            />
            {filters.search && (
              <button type="button" className="search-clear" onClick={() => setFilters(f => ({ ...f, search: '' }))}>×</button>
            )}
          </form>

          <button className="filter-toggle-btn btn btn-outline" onClick={() => setShowFilters(v => !v)}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
              <line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            Filters
          </button>
        </div>

        <div className="products-layout">
          {/* Filters */}
          <div className={`filters-wrapper ${showFilters ? 'show' : ''}`}>
            <Filters filters={filters} setFilters={setFilters} categories={categories} />
          </div>

          {/* Grid */}
          <div className="products-main">
            {loading ? (
              <div className="products-grid">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="product-skeleton">
                    <div className="skeleton" style={{ height: '200px' }} />
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div className="skeleton" style={{ height: '12px', width: '40%' }} />
                      <div className="skeleton" style={{ height: '16px' }} />
                      <div className="skeleton" style={{ height: '14px', width: '60%' }} />
                      <div className="skeleton" style={{ height: '20px', width: '50%' }} />
                      <div className="skeleton" style={{ height: '38px', marginTop: '8px' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🔍</span>
                <h3>No products found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map(p => <ProductCard key={p.id} product={p} />)}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="btn btn-outline page-btn"
                      disabled={filters.page === 0}
                      onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                    >← Prev</button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        className={`btn page-btn ${filters.page === i ? 'active-page' : 'btn-outline'}`}
                        onClick={() => setFilters(f => ({ ...f, page: i }))}
                      >{i + 1}</button>
                    ))}

                    <button
                      className="btn btn-outline page-btn"
                      disabled={filters.page === totalPages - 1}
                      onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                    >Next →</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
