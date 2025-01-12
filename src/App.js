import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [filters, setFilters] = useState({ dateFrom: '', dateTo: '', revenueMin: '', revenueMax: '', netIncomeMin: '', netIncomeMax: '' });
  const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get('https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey=Dl9QItybedcwXsHa0HgcTyczhTZ680bM')
      .then((response) => {
        setData(response.data);
        setFilteredData(response.data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const applyFilters = () => {
    let filtered = [...data];

    if (filters.dateFrom || filters.dateTo) {
      filtered = filtered.filter((item) => {
        const year = new Date(item.date).getFullYear();
        return (
          (!filters.dateFrom || year >= parseInt(filters.dateFrom)) &&
          (!filters.dateTo || year <= parseInt(filters.dateTo))
        );
      });
    }

    if (filters.revenueMin || filters.revenueMax) {
      filtered = filtered.filter((item) => {
        return (
          (!filters.revenueMin || item.revenue >= parseFloat(filters.revenueMin)) &&
          (!filters.revenueMax || item.revenue <= parseFloat(filters.revenueMax))
        );
      });
    }

    if (filters.netIncomeMin || filters.netIncomeMax) {
      filtered = filtered.filter((item) => {
        return (
          (!filters.netIncomeMin || item.netIncome >= parseFloat(filters.netIncomeMin)) &&
          (!filters.netIncomeMax || item.netIncome <= parseFloat(filters.netIncomeMax))
        );
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const applySort = () => {
    let sorted = [...filteredData];

    if (sortOption === 'dateAsc') {
      sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortOption === 'dateDesc') {
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOption === 'revenueAsc') {
      sorted.sort((a, b) => a.revenue - b.revenue);
    } else if (sortOption === 'revenueDesc') {
      sorted.sort((a, b) => b.revenue - a.revenue);
    }

    setFilteredData(sorted);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Financial Data</h1>

      {/* Filter Button */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        Filter
      </button>

      {isFilterOpen && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <h2 className="font-bold mb-2">Filters</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="From Year"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="To Year"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Min Revenue"
              value={filters.revenueMin}
              onChange={(e) => setFilters({ ...filters, revenueMin: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Max Revenue"
              value={filters.revenueMax}
              onChange={(e) => setFilters({ ...filters, revenueMax: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Min Net Income"
              value={filters.netIncomeMin}
              onChange={(e) => setFilters({ ...filters, netIncomeMin: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Max Net Income"
              value={filters.netIncomeMax}
              onChange={(e) => setFilters({ ...filters, netIncomeMax: e.target.value })}
              className="border p-2 rounded"
            />
          </div>
          <button
            className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
            onClick={applyFilters}
          >
            Apply Filters
          </button>
        </div>
      )}

      {/* Sort Button */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => setIsSortOpen(!isSortOpen)}
      >
        Sort
      </button>

      {isSortOpen && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <h2 className="font-bold mb-2">Sort Options</h2>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Select...</option>
            <option value="dateAsc">Date (Ascending)</option>
            <option value="dateDesc">Date (Descending)</option>
            <option value="revenueAsc">Revenue (Ascending)</option>
            <option value="revenueDesc">Revenue (Descending)</option>
          </select>
          <button
            className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
            onClick={applySort}
          >
            Apply Sort
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Revenue</th>
              <th className="border px-4 py-2">Net Income</th>
              <th className="border px-4 py-2">Gross Profit</th>
              <th className="border px-4 py-2">EPS</th>
              <th className="border px-4 py-2">Operating Income</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border px-4 py-2">{item.date}</td>
                <td className="border px-4 py-2">${item.revenue.toLocaleString()}</td>
                <td className="border px-4 py-2">${item.netIncome.toLocaleString()}</td>
                <td className="border px-4 py-2">${item.grossProfit.toLocaleString()}</td>
                <td className="border px-4 py-2">${item.eps}</td>
                <td className="border px-4 py-2">${item.operatingIncome.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {[...Array(Math.ceil(filteredData.length / itemsPerPage)).keys()].map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page + 1)}
            className={`px-4 py-2 mx-1 border rounded ${
              currentPage === page + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {page + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
