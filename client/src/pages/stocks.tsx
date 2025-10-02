import { Link } from "wouter";
import StockDashboard from "@/components/StockDashboard";
import { ArrowLeft, TrendingUp, Activity, BarChart3 } from "lucide-react";
import { useEffect } from "react";

export default function StocksPage() {
  useEffect(() => {
    document.title = "Real-Time Stock Analytics | Lakshmi Sravya";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <a className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors" data-testid="link-home">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Portfolio</span>
              </a>
            </Link>
            <div className="flex items-center gap-2 text-emerald-400">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live Data</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg backdrop-blur-sm">
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Real-Time Stock Analytics
            </h1>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Powered by Elasticsearch • Interactive visualizations with live market data
          </p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-gray-200">OHLC Charts</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-200">Volume Analysis</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-200">Price Trends</span>
            </div>
          </div>
        </div>

        {/* Dashboard Container */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
          <StockDashboard />
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            Data refreshes every 30 seconds • Showing real-time market analytics from Elasticsearch
          </p>
        </div>
      </div>
    </div>
  );
}
