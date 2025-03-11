import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PlusCircle, Trash2, ArrowRight } from 'lucide-react';

const PERatioVisualizer = () => {
  const [stocks, setStocks] = useState([
    { id: 1, ticker: 'AAPL', name: 'Apple Inc.', currentPrice: 175.50, eps: 6.14, currentPE: 28.58, targetPE: 25 },
    { id: 2, ticker: 'MSFT', name: 'Microsoft Corp.', currentPrice: 390.27, eps: 11.02, currentPE: 35.42, targetPE: 30 },
    { id: 3, ticker: 'GOOGL', name: 'Alphabet Inc.', currentPrice: 145.40, eps: 5.80, currentPE: 25.07, targetPE: 25 },
  ]);
  
  const [newStock, setNewStock] = useState({
    ticker: '',
    targetPE: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStockData = async (ticker: string) => {
    try {
      setLoading(true);
      setError('');
      
      const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
      
      if (!API_KEY) {
        throw new Error('API key not found. Please add VITE_ALPHA_VANTAGE_API_KEY to your .env file');
      }
      
      // Fetch overview data (includes EPS and company name)
      const overviewResponse = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${API_KEY}`
      );
      const overviewData = await overviewResponse.json();

      // Fetch current price
      const quoteResponse = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${API_KEY}`
      );
      const quoteData = await quoteResponse.json();

      if (!overviewData || !quoteData['Global Quote']) {
        throw new Error('Stock not found');
      }

      const price = parseFloat(quoteData['Global Quote']['05. price']);
      const eps = parseFloat(overviewData.EPS);
      const name = overviewData.Name;

      if (!price || !eps || isNaN(price) || isNaN(eps)) {
        throw new Error('Unable to fetch required stock data');
      }

      return {
        currentPrice: price,
        eps: eps,
        name: name || ticker,
        currentPE: parseFloat((price / eps).toFixed(2))
      };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to fetch stock data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStock({
      ...newStock,
      [name]: name === 'ticker' ? value.toUpperCase() : value
    });
  };

  const addStock = async () => {
    // Validate inputs
    if (!newStock.ticker || !newStock.targetPE) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const stockData = await fetchStockData(newStock.ticker);
      
      const stockToAdd = {
        id: stocks.length + 1,
        ticker: newStock.ticker,
        targetPE: parseFloat(newStock.targetPE),
        ...stockData
      };

      setStocks([...stocks, stockToAdd]);
      setNewStock({
        ticker: '',
        targetPE: ''
      });
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add stock');
    }
  };

  const updateTargetPE = (id, newTargetPE) => {
    setStocks(stocks.map(stock => 
      stock.id === id ? { ...stock, targetPE: parseFloat(newTargetPE) } : stock
    ));
  };

  const removeStock = (id) => {
    setStocks(stocks.filter(stock => stock.id !== id));
  };

  const chartData = stocks.map(stock => ({
    name: stock.ticker,
    currentPE: stock.currentPE,
    targetPE: stock.targetPE
  }));

  console.log('Chart Data:', chartData);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-gray-50 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">P/E Ratio Stock Visualizer</h1>
      
      {/* Chart Section */}
      <div className="mb-8 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">P/E Ratio Comparison</h2>
        <div className="w-full" style={{ position: 'relative', minHeight: '400px' }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
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
          ) : (
            <p className="text-center text-gray-500">No data to display</p>
          )}
        </div>
      </div>

      {/* Add Stock Form */}
      <div className="mb-8 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Add New Stock</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                disabled={loading}
                className={`ml-2 p-2 ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded flex items-center`}
              >
                <PlusCircle size={20} />
              </button>
            </div>
          </div>
        </div>
        {error && (
          <div className="mt-2 text-red-600 text-sm">
            {error}
          </div>
        )}
        {loading && (
          <div className="mt-2 text-blue-600 text-sm">
            Loading stock data...
          </div>
        )}
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
              {stocks.map((stock) => (
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
                  <td className="py-2 px-4 text-right">
                    ${(stock.eps * stock.targetPE).toFixed(2)}
                  </td>
                  <td className={`py-2 px-4 text-right ${((stock.eps * stock.targetPE - stock.currentPrice) / stock.currentPrice * 100) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {((stock.eps * stock.targetPE - stock.currentPrice) / stock.currentPrice * 100).toFixed(2)}%
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
};

export default PERatioVisualizer;
