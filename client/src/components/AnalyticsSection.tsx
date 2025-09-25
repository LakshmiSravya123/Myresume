import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Activity } from "lucide-react";
import { useState, useEffect } from "react";

export default function AnalyticsSection() {
  const [showFallback, setShowFallback] = useState(false);

  // For Grafana Cloud, embedding is typically blocked by X-Frame-Options
  // Show the fallback UI after a short delay since iframe events are unreliable
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Analytics: Showing fallback UI for Grafana Cloud');
      setShowFallback(true);
    }, 2000); // Show fallback after 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="analytics" className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
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
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <Activity className="w-6 h-6 text-indigo-600" />
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Analytics Dashboard
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Real-time data visualization and insights powered by Grafana
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
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <div className="w-3 h-3 bg-white/70 rounded-full"></div>
                <div className="w-3 h-3 bg-white/70 rounded-full"></div>
                <span className="ml-4 text-white font-medium">Grafana Dashboard</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white text-sm">Live</span>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="relative">
            {/* Loading State - Show initially */}
            {!showFallback && (
              <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 mb-4">
                    <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-4 h-4 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <p className="text-gray-600">Loading dashboard...</p>
                </div>
              </div>
            )}

            {/* Fallback State - Show after timeout */}
            {showFallback && (
              <div className="h-96 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center p-8 max-w-lg">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Dashboard Available in New Tab</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    Due to Grafana Cloud security policies, the dashboard cannot be embedded directly. 
                    Click below to view the full interactive dashboard in a new tab.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <button
                      onClick={() => window.open('https://lakshmisravyavedantham.grafana.net/dashboard/snapshot/GZkCR08gQEFF4J06CaeBQkfhvWYNTT46', '_blank')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      data-testid="analytics-open-dashboard"
                    >
                      <BarChart3 className="w-5 h-5" />
                      <span>Open Full Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowFallback(false);
                        // Force reload the iframe
                        const iframe = document.getElementById('grafana-iframe') as HTMLIFrameElement;
                        if (iframe) {
                          iframe.src = iframe.src;
                        }
                        // Reset the timeout
                        setTimeout(() => setShowFallback(true), 2000);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                      data-testid="analytics-retry-button"
                    >
                      Try Embedding Again
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-4 bg-gray-100 p-3 rounded-lg">
                    <strong>Note:</strong> Grafana Cloud blocks iframe embedding by default for security. 
                    This is normal behavior for cloud-hosted dashboards.
                  </div>
                </div>
              </div>
            )}

            {/* Grafana Dashboard Iframe */}
            <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
              <iframe
                id="grafana-iframe"
                src="https://lakshmisravyavedantham.grafana.net/dashboard/snapshot/GZkCR08gQEFF4J06CaeBQkfhvWYNTT46?kiosk=true&theme=light"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  minHeight: '600px'
                }}
                title="Grafana Analytics Dashboard"
                data-testid="analytics-dashboard-iframe"
              />
            </div>
          </div>

          {/* Dashboard Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Real-time monitoring</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Live metrics</span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Powered by Grafana
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Data Visualization</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Interactive charts and graphs displaying key metrics and performance indicators
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Real-time Monitoring</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Live system monitoring with alerts and automated data collection
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Trend Analysis</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Historical data analysis and predictive insights for data-driven decisions
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}