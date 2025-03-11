import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PlusCircle, Trash2, ArrowRight } from 'lucide-react';


import './App.css'

function App() {
  const [stocks, setStocks] = useState([
    { id: 1, ticker: 'AAPL', name: 'Apple Inc.', currentPrice: 175.50, eps: 6.14, currentPE: 28.58, targetPE: 25 },
    { id: 2, ticker: 'MSFT', name: 'Microsoft Corp.', currentPrice: 390.27, eps: 11.02, currentPE: 35.42, targetPE: 30 },
    { id: 3, ticker: 'GOOGL', name: 'Alphabet Inc.', currentPrice: 145.40, eps: 5.80, currentPE: 25.07, targetPE: 25 },
  ]);
  
  const [newStock, setNewStock] = useState({
    ticker: '',
    name: '',
    currentPrice: '',
    eps: '',
    targetPE: ''
  });

  // Calculate current P/E and target price for each stock
  const stocksWithCalculations = stocks.map(stock => {
    // Calculate current P/E if not provided
    const currentPE = stock.currentPE || (stock.currentPrice / stock.eps);
    
    // Calculate target price based on target P/E
    const targetPrice = stock.eps * stock.targetPE;
    
    // Calculate price change percentage
    const priceChange = ((targetPrice - stock.currentPrice) / stock.currentPrice) * 100;
    
    return {
      ...stock,
      currentPE: parseFloat(currentPE.toFixed(2)),
      targetPrice: parseFloat(targetPrice.toFixed(2)),
      priceChange: parseFloat(priceChange.toFixed(2))
    };
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStock({
      ...newStock,
      [name]: name === 'ticker' ? value.toUpperCase() : value
    });
  };

  const addStock = () => {
    // Validate inputs
    if (!newStock.ticker || !newStock.name || !newStock.currentPrice || !newStock.eps || !newStock.targetPE) {
      alert('Please fill in all fields');
      return;
    }

    // Convert numeric strings to numbers
    const stockToAdd = {
      id: stocks.length + 1,
      ticker: newStock.ticker,
      name: newStock.name,
      currentPrice: parseFloat(newStock.currentPrice),
      eps: parseFloat(newStock.eps),
      targetPE: parseFloat(newStock.targetPE),
      currentPE: parseFloat((newStock.currentPrice / newStock.eps).toFixed(2))
    };

    setStocks([...stocks, stockToAdd]);
    setNewStock({
      ticker: '',
      name: '',
      currentPrice: '',
      eps: '',
      targetPE: ''
    });
  };

  const updateTargetPE = (id, newTargetPE) => {
    setStocks(stocks.map(stock => 
      stock.id === id ? { ...stock, targetPE: parseFloat(newTargetPE) } : stock
    ));
  };

  const removeStock = (id) => {
    setStocks(stocks.filter(stock => stock.id !== id));
  };

  const chartData = stocksWithCalculations.map(stock => ({
    name: stock.ticker,
    currentPE: stock.currentPE,
    targetPE: stock.targetPE
  }));

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-gray-50 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">P/E Ratio Stock Visualizer</h1>
      
      {/* Chart Section */}
      <div className="mb-8 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">P/E Ratio Comparison</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="currentPE" name="Current P/E" fill="#4f46e5" />
              <Bar dataKey="targetPE" name="Target P/E" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Add Stock Form */}
      <div className="mb-8 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Add New Stock</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ticker</label>
            <input
              type="text"
              name="ticker"
              value={newStock.ticker}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="AAPL"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              name="name"
              value={newStock.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Apple Inc."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Price ($)</label>
            <input
              type="number"
              name="currentPrice"
              value={newStock.currentPrice}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="175.50"
              step="0.01"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">EPS ($)</label>
            <input
              type="number"
              name="eps"
              value={newStock.eps}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="6.14"
              step="0.01"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target P/E</label>
            <div className="flex items-center">
              <input
                type="number"
                name="targetPE"
                value={newStock.targetPE}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="25"
                step="0.1"
                min="0"
              />
              <button
                onClick={addStock}
                className="ml-2 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
              >
                <PlusCircle size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stocks Table */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Stock Analysis</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Ticker</th>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-right">Current Price ($)</th>
                <th className="py-2 px-4 text-right">EPS ($)</th>
                <th className="py-2 px-4 text-right">Current P/E</th>
                <th className="py-2 px-4 text-right">Target P/E</th>
                <th className="py-2 px-4 text-right">Target Price ($)</th>
                <th className="py-2 px-4 text-right">Price Change (%)</th>
                <th className="py-2 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stocksWithCalculations.map((stock) => (
                <tr key={stock.id} className="border-t">
                  <td className="py-2 px-4 font-medium">{stock.ticker}</td>
                  <td className="py-2 px-4">{stock.name}</td>
                  <td className="py-2 px-4 text-right">${stock.currentPrice.toFixed(2)}</td>
                  <td className="py-2 px-4 text-right">${stock.eps.toFixed(2)}</td>
                  <td className="py-2 px-4 text-right">{stock.currentPE}</td>
                  <td className="py-2 px-4 text-right">
                    <input
                      type="number"
                      value={stock.targetPE}
                      onChange={(e) => updateTargetPE(stock.id, e.target.value)}
                      className="w-16 p-1 border border-gray-300 rounded text-right"
                      step="0.1"
                      min="0"
                    />
                  </td>
                  <td className="py-2 px-4 text-right">${stock.targetPrice}</td>
                  <td className={`py-2 px-4 text-right ${stock.priceChange > 0 ? 'text-green-600' : stock.priceChange < 0 ? 'text-red-600' : ''}`}>
                    {stock.priceChange > 0 ? '+' : ''}{stock.priceChange}%
                  </td>
                  <td className="py-2 px-4 text-center">
                    <button
                      onClick={() => removeStock(stock.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App
