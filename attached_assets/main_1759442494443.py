
import os
import streamlit as st
from elasticsearch import Elasticsearch
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta

# Streamlit page config
st.set_page_config(page_title="Interactive Real-Time Stock Dashboard", layout="wide")

# Elasticsearch connection

ES_CLOUD_ID = os.getenv('ES_CLOUD_ID')
ES_INDEX = os.getenv('ELASTIC_INDEX', 'stocks_real_time')
ES_USERNAME = os.getenv('ESUSERNAME')
ES_PASSWORD = os.getenv('ESPASSWORD')

# Build Elasticsearch client using only cloud_id and basic_auth
if not ES_CLOUD_ID:
    raise RuntimeError('ES_CLOUD_ID must be set in .env')
if not ES_USERNAME or not ES_PASSWORD:
    raise RuntimeError('ES_USERNAME and ES_PASSWORD must be set in .env for basic_auth')
es = Elasticsearch(cloud_id=ES_CLOUD_ID, basic_auth=(ES_USERNAME, ES_PASSWORD))

# Check connection
if not es.ping():
    st.error("Failed to connect to Elasticsearch. Check credentials.")
    st.stop()

# Cache queries to improve performance
@st.cache_data(ttl=30)
def get_latest_data(size=10000):
    query = {
        "query": {"match_all": {}},
        "aggs": {
            "by_symbol": {
                "terms": {"field": "symbol.keyword", "size": size},
                "aggs": {
                    "latest_doc": {
                        "top_hits": {
                            "sort": [{"@timestamp": {"order": "desc"}}],
                            "size": 1
                        }
                    }
                }
            }
        },
        "size": 0
    }
    response = es.search(index="stocks_real_time", body=query)
    buckets = response["aggregations"]["by_symbol"]["buckets"]
    data = [bucket["latest_doc"]["hits"]["hits"][0]["_source"] for bucket in buckets]
    return pd.DataFrame(data)

@st.cache_data(ttl=30)
def get_timeseries_data(symbols, hours=1):
    query = {
        "query": {
            "bool": {
                "filter": [
                    {"terms": {"symbol.keyword": symbols}},
                    {"range": {"@timestamp": {"gte": f"now-{hours}h"}}}
                ]
            }
        },
        "sort": [{"@timestamp": {"order": "asc"}}],
        "size": 1000
    }
    response = es.search(index="stocks_real_time", body=query)
    hits = response["hits"]["hits"]
    data = [hit["_source"] for hit in hits]
    return pd.DataFrame(data)

@st.cache_data(ttl=30)
def get_volume_heatmap(hours=1):
    query = {
        "query": {"match_all": {}},
        "aggs": {
            "by_symbol": {
                "terms": {"field": "symbol.keyword", "size": 50},
                "aggs": {
                    "by_time": {
                        "date_histogram": {"field": "@timestamp", "fixed_interval": "5m"},
                        "aggs": {"total_volume": {"sum": {"field": "volume"}}}
                    }
                }
            }
        },
        "size": 0
    }
    response = es.search(index="stocks_real_time", body=query)
    buckets = response["aggregations"]["by_symbol"]["buckets"]
    data = []
    for bucket in buckets:
        symbol = bucket["key"]
        for time_bucket in bucket["by_time"]["buckets"]:
            data.append({
                "symbol": symbol,
                "@timestamp": time_bucket["key_as_string"],
                "volume": time_bucket["total_volume"]["value"]
            })
    return pd.DataFrame(data)

@st.cache_data(ttl=30)
def get_price_volatility(hours=1):
    query = {
        "query": {"match_all": {}},
        "aggs": {
            "by_symbol": {
                "terms": {"field": "symbol.keyword", "size": 50},
                "aggs": {
                    "price_stats": {"stats": {"field": "close"}}
                }
            }
        },
        "size": 0
    }
    response = es.search(index="stocks_real_time", body=query)
    buckets = response["aggregations"]["by_symbol"]["buckets"]
    data = [{"symbol": b["key"], "volatility": b["price_stats"]["max"] - b["price_stats"]["min"]} for b in buckets]
    return pd.DataFrame(data)

@st.cache_data(ttl=30)
def get_volume_histogram(hours=1):
    query = {
        "query": {"match_all": {}},
        "aggs": {
            "by_volume": {
                "histogram": {"field": "volume", "interval": 100000},
                "aggs": {"by_symbol": {"terms": {"field": "symbol.keyword", "size": 10}}}
            }
        },
        "size": 0
    }
    response = es.search(index="stocks_real_time", body=query)
    buckets = response["aggregations"]["by_volume"]["buckets"]
    data = [{"volume_bin": b["key"], "doc_count": b["doc_count"]} for b in buckets]
    return pd.DataFrame(data)

# Streamlit app
st.title("Interactive Real-Time Stock Dashboard")



# Sidebar for interactive filters
st.sidebar.header("Filter Options")
try:
    # Use raw ingested data for symbol list
    query = {
        "query": {"match_all": {}},
        "sort": [{"@timestamp": {"order": "desc"}}],
        "size": 1000
    }
    response = es.search(index=ES_INDEX, body=query)
    hits = response["hits"]["hits"]
    raw_data = [h["_source"] for h in hits]
    raw_df = pd.DataFrame(raw_data)
    all_symbols = raw_df["symbol"].dropna().unique().tolist() if not raw_df.empty else []
except Exception as e:
    all_symbols = []

# Use top 3 symbols for defaults if available
default_symbols = all_symbols[:3] if len(all_symbols) >= 3 else all_symbols

# Dropdown for symbol selection (dynamic, top 3 default)
selected_symbols = st.sidebar.multiselect("Select Symbols", all_symbols, default=default_symbols)
search_symbol = st.sidebar.selectbox("Search Symbol (Dropdown)", all_symbols, index=0) if all_symbols else None
time_range = st.sidebar.slider("Time Range (hours)", 1, 24, 1)
metric = st.sidebar.selectbox("Metric for Line/Area Charts", ["close", "open", "high", "low", "volume"])
refresh = st.sidebar.checkbox("Auto-Refresh (every 30s)", value=True)

if refresh:
    st.markdown('<meta http-equiv="refresh" content="60">', unsafe_allow_html=True)

# Layout with columns
col1, col2 = st.columns(2)

# 1. Line Chart: Selected Metric
with col1:
    st.subheader(f"{metric.capitalize()} Trends (Line Chart)")
    # Use only symbols present in raw_df for charts
    chart_symbols = [s for s in selected_symbols if s in all_symbols]
    line_df = get_timeseries_data(chart_symbols, time_range)
    if not line_df.empty:
        line_df["@timestamp"] = pd.to_datetime(line_df["@timestamp"])
        fig = px.line(line_df, x="@timestamp", y=metric, color="symbol", title=f"{metric.capitalize()} Over Time",
                      hover_data=["symbol", "open", "close", "volume"])
        fig.update_layout(showlegend=True, xaxis_rangeslider_visible=True)
        st.plotly_chart(fig, width='stretch')
    else:
        st.warning("No data for selected symbols.")

# 2. Candlestick Chart
with col2:
    st.subheader("Candlestick Chart")
    # Use only symbols present in raw_df for dropdown
    candle_symbol = st.sidebar.selectbox("Select Symbol for Candlestick", all_symbols, index=0) if all_symbols else None
    if candle_symbol:
        candle_df = get_timeseries_data([candle_symbol], time_range)
        if not candle_df.empty:
            candle_df["@timestamp"] = pd.to_datetime(candle_df["@timestamp"])
            fig = go.Figure(data=[
                go.Candlestick(
                    x=candle_df["@timestamp"],
                    open=candle_df["open"],
                    high=candle_df["high"],
                    low=candle_df["low"],
                    close=candle_df["close"],
                    name=candle_symbol
                )
            ])
            fig.update_layout(title=f"{candle_symbol} Candlestick", xaxis_title="Time", yaxis_title="Price",
                              xaxis_rangeslider_visible=True)
            st.plotly_chart(fig, width='stretch')
        else:
            st.warning(f"No data for {candle_symbol}.")
    else:
        st.warning("No symbol available for candlestick chart.")

# 3. Heatmap: Volume
st.subheader("Volume Heatmap")
heatmap_df = get_volume_heatmap(time_range)
if not heatmap_df.empty:
    heatmap_df["@timestamp"] = pd.to_datetime(heatmap_df["@timestamp"])
    pivot = heatmap_df.pivot(index="@timestamp", columns="symbol", values="volume")
    fig = px.imshow(pivot, title="Volume Heatmap", aspect="auto", color_continuous_scale="Viridis")
    fig.update_layout(hovermode="x unified")
    st.plotly_chart(fig, width='stretch')
else:
    st.warning("No volume data available.")


# Show raw ingested data (like app.py)
st.subheader("Raw Ingested Stock Data")
try:
    # Query latest 1000 docs from ES_INDEX
    query = {
        "query": {"match_all": {}},
        "sort": [{"@timestamp": {"order": "desc"}}],
        "size": 1000
    }
    response = es.search(index=ES_INDEX, body=query)
    hits = response["hits"]["hits"]
    raw_data = [h["_source"] for h in hits]
    raw_df = pd.DataFrame(raw_data)
    if not raw_df.empty:
        raw_df["@timestamp"] = pd.to_datetime(raw_df["@timestamp"])
        st.dataframe(raw_df[["symbol", "@timestamp", "open", "high", "low", "close", "volume"]], width='stretch')
    else:
        st.warning("No ingested stock data found.")
except Exception as e:
    st.error(f"Error fetching raw ingested data: {e}")

# 5. Area Chart: Stacked Metric
with col1:
    st.subheader(f"Stacked {metric.capitalize()} (Area Chart)")
    area_df = get_timeseries_data(chart_symbols, time_range)
    if not area_df.empty:
        area_df["@timestamp"] = pd.to_datetime(area_df["@timestamp"])
        fig = px.area(area_df, x="@timestamp", y=metric, color="symbol", title=f"Stacked {metric.capitalize()} Over Time")
        fig.update_layout(showlegend=True, xaxis_rangeslider_visible=True)
        st.plotly_chart(fig, width='stretch')
    else:
        st.warning(f"No {metric} data for selected symbols.")

# 6. Bar Chart: Average Volume
with col2:
    st.subheader("Average Volume (Bar Chart)")
    bar_query = {
        "query": {"match_all": {}},
        "aggs": {
            "by_symbol": {
                "terms": {"field": "symbol.keyword", "size": 20},
                "aggs": {"avg_volume": {"avg": {"field": "volume"}}}
            }
        },
        "size": 0
    }
    response = es.search(index="stocks_real_time", body=bar_query)
    bar_data = [{"symbol": b["key"], "avg_volume": b["avg_volume"]["value"]} for b in response["aggregations"]["by_symbol"]["buckets"]]
    bar_df = pd.DataFrame(bar_data)
    if not bar_df.empty:
        fig = px.bar(bar_df, x="symbol", y="avg_volume", title="Average Volume by Symbol", color="symbol")
        fig.update_layout(showlegend=False)
        st.plotly_chart(fig, width='stretch')
    else:
        st.warning("No volume data for bar chart.")

# 7. Scatter Plot: Close Price vs Volume
st.subheader("Close Price vs Volume (Scatter Plot)")
scatter_df = get_latest_data()
if not scatter_df.empty:
    fig = px.scatter(scatter_df, x="close", y="volume", color="symbol", title="Close Price vs Volume",
                     hover_data=["symbol", "@timestamp"], size="volume")
    st.plotly_chart(fig, width='stretch')
else:
    st.warning("No data for scatter plot.")

# 8. Box Plot: Price Distribution
with col1:
    st.subheader("Price Distribution (Box Plot)")
    box_df = get_timeseries_data(chart_symbols, time_range)
    if not box_df.empty:
        fig = px.box(box_df, x="symbol", y="close", title="Close Price Distribution", color="symbol")
        fig.update_layout(showlegend=False)
        st.plotly_chart(fig, width='stretch')
    else:
        st.warning("No data for box plot.")

# 9. Range Area Chart: High-Low Range
with col2:
    st.subheader("High-Low Range (Range Area Chart)")
    range_df = get_timeseries_data([candle_symbol], time_range)
    if not range_df.empty:
        range_df["@timestamp"] = pd.to_datetime(range_df["@timestamp"])
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=range_df["@timestamp"], y=range_df["high"], mode="lines", name="High", fill=None))
        fig.add_trace(go.Scatter(x=range_df["@timestamp"], y=range_df["low"], mode="lines", name="Low", fill="tonexty"))
        fig.update_layout(title=f"{candle_symbol} High-Low Range", xaxis_title="Time", yaxis_title="Price",
                          xaxis_rangeslider_visible=True)
        st.plotly_chart(fig, width='stretch')
    else:
        st.warning(f"No data for {candle_symbol} range chart.")

# 10. Bubble Chart: Volume-Weighted Price Changes
st.subheader("Price Change vs Volume (Bubble Chart)")
bubble_query = {
    "query": {"match_all": {}},
    "aggs": {
        "by_symbol": {
            "terms": {"field": "symbol.keyword", "size": 50},
            "aggs": {
                "price_stats": {"stats": {"field": "close"}},
                "total_volume": {"sum": {"field": "volume"}}
            }
        }
    },
    "size": 0
}
response = es.search(index="stocks_real_time", body=bubble_query)
bubble_data = [
    {
        "symbol": b["key"],
        "price_change": b["price_stats"]["max"] - b["price_stats"]["min"],
        "volume": b["total_volume"]["value"]
    } for b in response["aggregations"]["by_symbol"]["buckets"]
]
bubble_df = pd.DataFrame(bubble_data)
if not bubble_df.empty:
    fig = px.scatter(bubble_df, x="price_change", y="volume", size="volume", color="symbol",
                     title="Price Change vs Volume", hover_data=["symbol"])
    st.plotly_chart(fig, width='stretch')
else:
    st.warning("No data for bubble chart.")

# 11. Violin Plot: Price Distribution Density
with col1:
    st.subheader("Price Distribution (Violin Plot)")
    violin_df = get_timeseries_data(chart_symbols, time_range)
    if not violin_df.empty:
        fig = px.violin(violin_df, x="symbol", y="close", title="Close Price Distribution (Violin)", box=True, points="all")
        st.plotly_chart(fig, width='stretch')
    else:
        st.warning("No data for violin plot.")

# 12. Histogram: Volume Distribution
with col2:
    st.subheader("Volume Distribution (Histogram)")
    hist_df = get_volume_histogram(time_range)
    if not hist_df.empty:
        fig = px.histogram(hist_df, x="volume_bin", y="doc_count", title="Volume Distribution")
        fig.update_layout(xaxis_title="Volume Bin", yaxis_title="Count")
        st.plotly_chart(fig, width='stretch')
    else:
        st.warning("No data for histogram.")

# Auto-refresh note
st.markdown("**Note**: Auto-refresh enabled (every 1 minute). Data updates every 5 minutes.")