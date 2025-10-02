import { motion } from "framer-motion";
import { TrendingUp, Database, Activity } from "lucide-react";
import StockDashboard from "./StockDashboard";

export default function ElasticsearchSection() {
  
  return (
    <section id="elasticsearch" className="py-20 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-32 h-32 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2">
              <Database className="w-8 h-8 text-slate-600" />
              <Activity className="w-6 h-6 text-gray-600" />
              <TrendingUp className="w-8 h-8 text-zinc-600" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Elasticsearch Stock Dashboard
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-slate-600 to-zinc-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Real-time stock market analytics powered by Elasticsearch and Streamlit
          </p>
        </motion.div>

        {/* Dashboard Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
        >
          {/* Dashboard Header */}
          <div className="bg-gradient-to-r from-slate-600 to-zinc-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <div className="w-3 h-3 bg-white/70 rounded-full"></div>
                <div className="w-3 h-3 bg-white/70 rounded-full"></div>
                <span className="ml-4 text-white font-medium">Stock Market Analytics</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white text-sm">Live</span>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="relative bg-white p-6">
            <StockDashboard />
          </div>

          {/* Dashboard Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4" />
                  <span>Elasticsearch</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>Real-time data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Stock analytics</span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Powered by Streamlit & Elasticsearch
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Elasticsearch Integration</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Advanced search and analytics on real-time stock market data
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Live Market Data</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Real-time stock prices, volume, and market trends from multiple exchanges
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Interactive Visualizations</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Candlestick charts, heatmaps, and advanced analytics for data-driven decisions
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
