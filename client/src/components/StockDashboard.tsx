import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

interface StockData {
  symbol: string;
  "@timestamp": string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export default function StockDashboard() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");
  const [timeRange, setTimeRange] = useState<number>(1);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Fetch available symbols
  const { data: symbols = [], isLoading: symbolsLoading, error: symbolsError } = useQuery<string[]>({
    queryKey: ["/api/stocks/symbols"],
  });

  // Fetch latest stock data
  const { data: latestData = [], isLoading: latestLoading, error: latestError } = useQuery<StockData[]>({
    queryKey: ["/api/stocks/latest?size=50"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch time series data for selected symbol
  const { data: timeSeriesData = [], isLoading: timeSeriesLoading } = useQuery<StockData[]>({
    queryKey: [`/api/stocks/timeseries?symbols=${selectedSymbol}&hours=${timeRange}`],
    enabled: !!selectedSymbol,
    refetchInterval: 30000,
  });

  // Update last refresh time when data changes
  useEffect(() => {
    if (latestData.length > 0) {
      setLastRefresh(new Date());
    }
  }, [latestData]);

  // Set default symbol when data loads
  useEffect(() => {
    if (symbols.length > 0 && !selectedSymbol) {
      setSelectedSymbol(symbols[0]);
    }
  }, [symbols, selectedSymbol]);

  // Show loading state
  if (symbolsLoading || latestLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading stock data from Elasticsearch...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (symbolsError || latestError) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 text-center">
        <p className="text-red-400 text-lg font-semibold mb-2">Unable to connect to Elasticsearch</p>
        <p className="text-red-300 text-sm">
          {symbolsError?.message || latestError?.message || "Please check your Elasticsearch configuration and credentials."}
        </p>
      </div>
    );
  }

  // Show empty state
  if (symbols.length === 0 || latestData.length === 0) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-8 text-center">
        <p className="text-yellow-400 text-lg font-semibold mb-2">No stock data available</p>
        <p className="text-yellow-300 text-sm">
          The Elasticsearch index appears to be empty. Please ensure your data ingestion pipeline is running.
        </p>
      </div>
    );
  }

  // Calculate stats
  const stats = latestData.slice(0, 4).map((stock) => ({
    symbol: stock.symbol,
    price: stock.close,
    change: stock.close - stock.open,
    changePercent: ((stock.close - stock.open) / stock.open) * 100,
  }));

  // Prepare chart data
  const lineChartData = timeSeriesData.map((d) => ({
    time: new Date(d["@timestamp"]).getTime(),
    timestamp: new Date(d["@timestamp"]).toLocaleTimeString(),
    [d.symbol]: d.close,
  }));

  const volumeChartData = latestData.slice(0, 10).map((d) => ({
    symbol: d.symbol,
    volume: d.volume,
  }));

  const scatterData = latestData.map((d) => ({
    symbol: d.symbol,
    close: d.close,
    volume: d.volume,
  }));

  // Get market close time from latest data
  const marketCloseTime = latestData[0]?.["@timestamp"] 
    ? new Date(latestData[0]["@timestamp"]).toLocaleString()
    : null;

  return (
    <div className="space-y-6">
      {/* Data Refresh Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-blue-200">
              Data last refreshed: <strong className="text-blue-100">{lastRefresh.toLocaleTimeString()}</strong>
            </span>
          </div>
          {marketCloseTime && (
            <div className="text-blue-200">
              Market close time: <strong className="text-blue-100">{marketCloseTime}</strong>
              <span className="ml-2 text-blue-300 text-xs">(timestamps show last trade)</span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Select Stocks</label>
          <Select
            value={selectedSymbol}
            onValueChange={setSelectedSymbol}
          >
            <SelectTrigger data-testid="select-stock-symbol">
              <SelectValue placeholder="Select a stock" />
            </SelectTrigger>
            <SelectContent>
              {symbols.map((symbol) => (
                <SelectItem key={symbol} value={symbol}>
                  {symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Time Range</label>
          <Select value={timeRange.toString()} onValueChange={(value) => setTimeRange(parseInt(value))}>
            <SelectTrigger data-testid="select-time-range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Hour</SelectItem>
              <SelectItem value="6">6 Hours</SelectItem>
              <SelectItem value="24">24 Hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.symbol}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.symbol}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">${stat.price.toFixed(2)}</p>
                  <p className={`text-sm flex items-center gap-1 ${stat.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {stat.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {stat.changePercent.toFixed(2)}%
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Volume Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Trading Volume (Top 10)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={volumeChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="symbol" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="volume" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Scatter Plot - Price vs Volume */}
      <Card>
        <CardHeader>
          <CardTitle>Price vs Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="close" name="Price" />
              <YAxis dataKey="volume" name="Volume" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={scatterData} fill="#8b5cf6" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Raw Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Latest Stock Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Symbol</th>
                  <th className="text-left py-2">Time</th>
                  <th className="text-right py-2">Open</th>
                  <th className="text-right py-2">High</th>
                  <th className="text-right py-2">Low</th>
                  <th className="text-right py-2">Close</th>
                  <th className="text-right py-2">Volume</th>
                </tr>
              </thead>
              <tbody>
                {latestData.slice(0, 20).map((stock, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-2 font-medium">{stock.symbol}</td>
                    <td className="py-2 text-gray-600">
                      {new Date(stock["@timestamp"]).toLocaleTimeString()}
                    </td>
                    <td className="py-2 text-right">${stock.open.toFixed(2)}</td>
                    <td className="py-2 text-right">${stock.high.toFixed(2)}</td>
                    <td className="py-2 text-right">${stock.low.toFixed(2)}</td>
                    <td className="py-2 text-right">${stock.close.toFixed(2)}</td>
                    <td className="py-2 text-right">{stock.volume.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Historical Charts Section - Moved to bottom */}
      {timeSeriesData.length > 0 && (
        <>
          {/* Candlestick Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                {selectedSymbol || "Select a symbol"} - OHLC Chart
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={timeSeriesData.filter(d => d.symbol === selectedSymbol).sort((a, b) => new Date(a["@timestamp"]).getTime() - new Date(b["@timestamp"]).getTime())}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="@timestamp" tickFormatter={(value) => new Date(value).toLocaleTimeString()} />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip labelFormatter={(value) => new Date(value).toLocaleString()} />
                  <Legend />
                  <Line type="monotone" dataKey="high" stroke="#10b981" strokeWidth={2} dot={false} name="High" />
                  <Line type="monotone" dataKey="low" stroke="#ef4444" strokeWidth={2} dot={false} name="Low" />
                  <Line type="monotone" dataKey="close" stroke="#3b82f6" strokeWidth={2} dot={false} name="Close" />
                  <Area type="monotone" dataKey="volume" fill="#8b5cf6" fillOpacity={0.1} stroke="#8b5cf6" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Line Chart - Price Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Price Trends - {selectedSymbol}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeSeriesData.map(d => ({ 
                  timestamp: new Date(d["@timestamp"]).toLocaleTimeString(),
                  close: d.close,
                  open: d.open
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="close" stroke="#3b82f6" strokeWidth={2} dot={false} name="Close" />
                  <Line type="monotone" dataKey="open" stroke="#10b981" strokeWidth={2} dot={false} name="Open" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
