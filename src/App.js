import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  // State variables to hold data, filters, and pagination state
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    revenueMin: '',
    revenueMax: '',
    netIncomeMin: '',
    netIncomeMax: '',
  });
  const [sortOption, setSortOption] = useState('dateAsc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // Local API : http://127.0.0.1:8000/data
  const API = 'http://3.147.85.86:8000/data';

  // Fetch data from the API on component mount
  useEffect(() => {
    axios
      .get(API) 
      .then((response) => {
        console.log("Fetched Data:", response.data.data
        );  
        setData(response.data);
        setFilteredData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Apply filters and sorting when sortOption changes
  useEffect(() => {
    applyFilters();
  }, [sortOption]);

  // Function to apply filters based on the filter state
  const applyFilters = () => {
    axios
      .get(API, {
        params: {
          date_from: filters.dateFrom,
          date_to: filters.dateTo,
          revenue_min: filters.revenueMin,
          revenue_max: filters.revenueMax,
          net_income_min: filters.netIncomeMin,
          net_income_max: filters.netIncomeMax,
          sort: sortOption
        },
      })
      .then((response) => {
        setFilteredData(response.data);
        setCurrentPage(1);
      })
      .catch((error) => console.error('Error applying filters:', error));
  };

  // Function to handle pagination by setting the current page (for bigger dataset)
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Function to toggle between the filter and sort windows
  const handleWindowToggle = (windowType) => {
    if (windowType === 'sort') {
      if (isSortOpen) {
        setIsSortOpen(false);
      } else {
        if (isFilterOpen) {
          setIsFilterOpen(false);
        }
        setIsSortOpen(true);
      }
    } else if (windowType === 'filter') {
      if (isFilterOpen) {
        setIsFilterOpen(false);
      } else {
        if (isSortOpen) {
          setIsSortOpen(false);
        }
        setIsFilterOpen(true);
      }
    }
  };

  // Get the data for current page
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
        onClick={() => handleWindowToggle('filter')}
      >
        Filter
      </button>

      {/* Sort Button */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => handleWindowToggle('sort')}
      >
        Sort
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

      {isSortOpen && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <h2 className="font-bold mb-2">Sort Options</h2>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border p-2 rounded w-full"
          >

            <option value="dateAsc">Date (Ascending)</option>
            <option value="dateDesc">Date (Descending)</option>
            <option value="revenueAsc">Revenue (Ascending)</option>
            <option value="revenueDesc">Revenue (Descending)</option>
            <option value="netIncomeAsc">Net Income (Ascending)</option>
            <option value="netIncomeDesc">Net Income (Descending)</option>
          </select>
        </div>
      )}

      {/* Table */}
      <div className="overflow-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2" style={{ whiteSpace: 'nowrap' }}>Date</th>
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
                <td className="border px-4 py-2" style={{ whiteSpace: 'nowrap' }}>{item.date}</td>
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
