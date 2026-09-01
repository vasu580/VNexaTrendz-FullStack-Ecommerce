import './Filters.css'

const RATINGS = [
  { label: '4★ & above', value: 4 },
  { label: '3★ & above', value: 3 },
  { label: '2★ & above', value: 2 },
]

const SORT_OPTIONS = [
  { label: 'Relevance', value: '' },
  { label: 'Price: Low to High', value: 'price_low' },
  { label: 'Price: High to Low', value: 'price_high' },
  { label: 'Top Rated', value: 'rating' },
]

export default function Filters({ filters, setFilters, categories }) {
  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 0 }))
  }

  const clearAll = () => {
    setFilters({
      search: '',
      category: '',
      minRating: '',
      sortBy: '',
      page: 0,
    })
  }

  return (
    <aside className="filters-panel">
      <div className="filters-header">
        <h3>VNexa Filters</h3>
        <button className="clear-btn" onClick={clearAll}>
          Clear All
        </button>
      </div>

      {/* Sort By */}
      <div className="filter-section">
        <h4 className="filter-label">Sort By</h4>
        {SORT_OPTIONS.map(opt => (
          <label key={opt.value} className="filter-option">
            <input
              type="radio"
              name="sort"
              value={opt.value}
              checked={filters.sortBy === opt.value}
              onChange={() => handleChange('sortBy', opt.value)}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>

      {/* Category */}
      <div className="filter-section">
        <h4 className="filter-label">Category</h4>
        <label className="filter-option">
          <input
            type="radio"
            name="category"
            value=""
            checked={!filters.category}
            onChange={() => handleChange('category', '')}
          />
          <span>All Categories</span>
        </label>

        {categories.map(cat => (
          <label key={cat.id} className="filter-option">
            <input
              type="radio"
              name="category"
              value={cat.name}
              checked={filters.category === cat.name}
              onChange={() => handleChange('category', cat.name)}
            />
            <span>{cat.name}</span>
          </label>
        ))}
      </div>

      {/* Rating */}
      <div className="filter-section">
        <h4 className="filter-label">Min Rating</h4>
        <label className="filter-option">
          <input
            type="radio"
            name="rating"
            value=""
            checked={!filters.minRating}
            onChange={() => handleChange('minRating', '')}
          />
          <span>All Ratings</span>
        </label>

        {RATINGS.map(r => (
          <label key={r.value} className="filter-option">
            <input
              type="radio"
              name="rating"
              value={r.value}
              checked={Number(filters.minRating) === r.value}
              onChange={() => handleChange('minRating', r.value)}
            />
            <span>{r.label}</span>
          </label>
        ))}
      </div>
    </aside>
  )
}