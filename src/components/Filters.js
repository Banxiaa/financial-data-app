import React, { useState } from 'react';

const Filters = ({ onFilter }) => {
  const [dateRange, setDateRange] = useState([2020, 2024]);
  const [revenueRange, setRevenueRange] = useState([0, Infinity]);
  const [netIncomeRange, setNetIncomeRange] = useState([0, Infinity]);

  const handleFilter = () => {
    onFilter({ dateRange, revenueRange, netIncomeRange });
  };

  return (
    <div className="mb-4 p-4 bg-gray-100 rounded">
      <div className="flex gap-4">
        <div>
          <label>Date Range:</label>
          <input
            type="number"
            value={dateRange[0]}
            onChange={(e) => setDateRange([+e.target.value, dateRange[1]])}
            className="border p-2"
          />
          -
          <input
            type="number"
            value={dateRange[1]}
            onChange={(e) => setDateRange([dateRange[0], +e.target.value])}
            className="border p-2"
          />
        </div>
        <div>
          <label>Revenue Range:</label>
          <input
            type="number"
            value={revenueRange[0]}
            onChange={(e) => setRevenueRange([+e.target.value, revenueRange[1]])}
            className="border p-2"
          />
          -
          <input
            type="number"
            value={revenueRange[1]}
            onChange={(e) => setRevenueRange([revenueRange[0], +e.target.value])}
            className="border p-2"
          />
        </div>
        <div>
          <label>Net Income Range:</label>
          <input
            type="number"
            value={netIncomeRange[0]}
            onChange={(e) => setNetIncomeRange([+e.target.value, netIncomeRange[1]])}
            className="border p-2"
          />
          -
          <input
            type="number"
            value={netIncomeRange[1]}
            onChange={(e) => setNetIncomeRange([netIncomeRange[0], +e.target.value])}
            className="border p-2"
          />
        </div>
      </div>
      <button
        onClick={handleFilter}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default Filters;