import os
from elasticsearch import Elasticsearch
import yfinance as yf
import pandas as pd
from datetime import datetime, timezone
import time
import schedule
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load credentials from environment

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

# Verify connection
try:
    if not es.ping():
        raise ValueError("Elasticsearch connection failed")
    logger.info("Connected to Elasticsearch: %s", es.info())
except Exception as e:
    logger.error("Connection error: %s", e)
    exit(1)

# Load symbols
try:
    symbols = pd.read_csv('all_stock_symbols.csv')['Symbol'].tolist()
    logger.info("Loaded %d symbols", len(symbols))
except FileNotFoundError:
    logger.error("all_stock_symbols.csv not found")
    exit(1)

def fetch_and_ingest_batch(symbol_batch):
    success_count = 0
    for symbol in symbol_batch:
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.history(period="1d", interval="1m")
            if not info.empty:
                latest = info.iloc[-1]
                record = {
                    "symbol": str(symbol),
                    "@timestamp": datetime.now(timezone.utc).isoformat(),
                    "open": float(latest["Open"]),
                    "high": float(latest["High"]),
                    "low": float(latest["Low"]),
                    "close": float(latest["Close"]),
                    "volume": int(latest["Volume"])
                }
                es.index(index=ES_INDEX, body=record)
                success_count += 1
                logger.info("Indexed %s", symbol)
            else:
                logger.warning("No data for %s", symbol)
        except Exception as e:
            logger.error("Error fetching %s: %s", symbol, e)
        time.sleep(0.1)  # Rate limit
    return success_count

def ingest_all_symbols():
    batch_size = 100
    total_success = 0
    for i in range(0, len(symbols), batch_size):
        batch = symbols[i:i+batch_size]
        total_success += fetch_and_ingest_batch(batch)
    logger.info("Ingestion cycle complete: %d/%d symbols indexed", total_success, len(symbols))

# Run every 5 minutes
schedule.every(5).minutes.do(ingest_all_symbols)

if __name__ == "__main__":
    ingest_all_symbols()  # Initial run
    while True:
        schedule.run_pending()
        time.sleep(1)