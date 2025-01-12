import React from 'react';

const Table = ({ data, onSort, sortOrder }) => {
  const handleSort = (column) => {
    const order = sortOrder.column === column && sortOrder.order === 'asc' ? 'desc' : 'asc';
    onSort(column, order);
  };

  return (
    <table className="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          {['date', 'revenue', 'netIncome', 'grossProfit', 'eps', 'operatingIncome'].map((col) => (
            <th
              key={col}
              className="border p-2 cursor-pointer"
              onClick={() => handleSort(col)}
            >
              {col.toUpperCase()}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td className="border p-2">{item.date}</td>
            <td className="border p-2">{item.revenue}</td>
            <td className="border p-2">{item.netIncome}</td>
            <td className="border p-2">{item.grossProfit}</td>
            <td className="border p-2">{item.eps}</td>
            <td className="border p-2">{item.operatingIncome}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
