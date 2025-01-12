import React, { useState, useEffect } from 'react';
import Filters from './components/Filters';
import Table from './components/Table';

const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortOrder, setSortOrder] = useState({ column: '', order: '' });

  const fetchData = async () => {
    try {
      const response = await fetch(
        'https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey=Dl9QItybedcwXsHa0HgcTyczhTZ680bM'
      );
      const result = await response.json();
      setData(result);
      setFilteredData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilter = (filters) => {
    const { dateRange, revenueRange, netIncomeRange } = filters;
    const filtered = data.filter((item) => {
      const date = new Date(item.date).getFullYear();
      const revenue = parseFloat(item.revenue || 0);
      const netIncome = parseFloat(item.netIncome || 0);
      return (
        date >= dateRange[0] &&
        date <= dateRange[1] &&
        revenue >= revenueRange[0] &&
        revenue <= revenueRange[1] &&
        netIncome >= netIncomeRange[0] &&
        netIncome <= netIncomeRange[1]
      );
    });
    setFilteredData(filtered);
  };

  const handleSort = (column, order) => {
    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      if (order === 'asc') return aValue > bValue ? 1 : -1;
      if (order === 'desc') return aValue < bValue ? 1 : -1;
      return 0;
    });
    setSortOrder({ column, order });
    setFilteredData(sorted);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Financial Data Filtering App</h1>
      <Filters onFilter={handleFilter} />
      <Table data={filteredData} onSort={handleSort} sortOrder={sortOrder} />
    </div>
  );
};

export default App;