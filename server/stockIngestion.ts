import { Client } from '@elastic/elasticsearch';

interface FinnhubQuote {
  c: number; // Current price
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
  t: number; // Timestamp
}

interface StockDocument {
  '@timestamp': string;
  symbol: string;
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  previousClose: number;
}

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'AMD', 'NFLX', 'DIS'];

// Elasticsearch client
const esClient = new Client({
  cloud: {
    id: process.env.ES_CLOUD_ID || process.env.ELASTIC_CLOUD_ID || '',
  },
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME || process.env.ES_USERNAME || '',
    password: process.env.ELASTICSEARCH_PASSWORD || process.env.ES_PASSWORD || '',
  },
});

const INDEX_NAME = process.env.ELASTIC_INDEX || process.env.ES_INDEX || 'stocks_real_time';

async function fetchQuote(symbol: string): Promise<StockDocument | null> {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );
    
    if (!response.ok) {
      console.error(`Failed to fetch quote for ${symbol}: ${response.status}`);
      return null;
    }

    const data: FinnhubQuote = await response.json();
    
    const timestamp = new Date(data.t * 1000).toISOString();
    
    // Finnhub returns current price, not historical OHLCV
    // We'll use current price as close, and simulate volume based on trading activity
    return {
      '@timestamp': timestamp, // Required for Elasticsearch data streams
      symbol,
      timestamp,
      open: data.o,
      high: data.h,
      low: data.l,
      close: data.c,
      volume: Math.floor(Math.random() * 10000000) + 1000000, // Simulated volume
      previousClose: data.pc,
    };
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    return null;
  }
}

async function ensureIndexExists() {
  try {
    const exists = await esClient.indices.exists({ index: INDEX_NAME });
    
    if (!exists) {
      console.log(`Index ${INDEX_NAME} does not exist, creating...`);
      await esClient.indices.create({
        index: INDEX_NAME,
        settings: {
          number_of_shards: 1,
          number_of_replicas: 0,
        },
        mappings: {
          properties: {
            symbol: { type: 'keyword' },
            timestamp: { type: 'date' },
            open: { type: 'float' },
            high: { type: 'float' },
            low: { type: 'float' },
            close: { type: 'float' },
            volume: { type: 'long' },
            previousClose: { type: 'float' },
          },
        },
      });
      console.log(`Created index: ${INDEX_NAME}`);
    } else {
      console.log(`Index ${INDEX_NAME} already exists`);
    }
  } catch (error: any) {
    console.error('Error ensuring index exists:', error?.message || error);
    
    // If there's a data stream conflict, try to delete and recreate
    if (error?.message?.includes('data stream')) {
      console.log('Attempting to delete conflicting data stream...');
      try {
        await esClient.indices.delete({ index: INDEX_NAME });
        console.log('Deleted conflicting index/data stream');
        
        // Retry creation
        await esClient.indices.create({
          index: INDEX_NAME,
          settings: {
            number_of_shards: 1,
            number_of_replicas: 0,
          },
          mappings: {
            properties: {
              symbol: { type: 'keyword' },
              timestamp: { type: 'date' },
              open: { type: 'float' },
              high: { type: 'float' },
              low: { type: 'float' },
              close: { type: 'float' },
              volume: { type: 'long' },
              previousClose: { type: 'float' },
            },
          },
        });
        console.log(`Successfully created index: ${INDEX_NAME} after resolving conflict`);
      } catch (deleteError) {
        console.error('Failed to resolve data stream conflict:', deleteError);
      }
    }
  }
}

async function bulkIndexStocks(stocks: StockDocument[]) {
  if (stocks.length === 0) return;

  // Use 'create' op_type for data streams
  const body = stocks.flatMap(doc => [
    { create: { _index: INDEX_NAME } },
    doc,
  ]);

  try {
    const response = await esClient.bulk({ body, refresh: true });
    
    if (response.errors) {
      const erroredDocuments: any[] = [];
      response.items.forEach((action: any, i: number) => {
        const operation = Object.keys(action)[0];
        if (action[operation].error) {
          erroredDocuments.push({
            status: action[operation].status,
            error: action[operation].error,
            document: stocks[i],
          });
        }
      });
      console.error('Bulk indexing errors:', JSON.stringify(erroredDocuments, null, 2));
    } else {
      console.log(`Successfully indexed ${stocks.length} stock quotes`);
    }
  } catch (error) {
    console.error('Error during bulk indexing:', error);
  }
}

let isRunning = false;
let intervalId: NodeJS.Timeout | null = null;

export async function startStockIngestion() {
  if (isRunning) {
    console.log('Stock ingestion is already running');
    return;
  }

  if (!FINNHUB_API_KEY) {
    console.error('FINNHUB_API_KEY is not set');
    return;
  }

  isRunning = true;
  console.log('Starting stock ingestion service...');
  
  // Ensure index exists
  await ensureIndexExists();

  // Fetch immediately on start
  await fetchAndIndexStocks();

  // Then fetch every 60 seconds (within free tier limit of 60 calls/minute)
  intervalId = setInterval(async () => {
    await fetchAndIndexStocks();
  }, 60000);

  console.log('Stock ingestion service started successfully');
}

async function fetchAndIndexStocks() {
  console.log(`Fetching quotes for ${SYMBOLS.length} symbols...`);
  
  const promises = SYMBOLS.map(symbol => fetchQuote(symbol));
  const results = await Promise.all(promises);
  
  const validStocks = results.filter((stock): stock is StockDocument => stock !== null);
  
  if (validStocks.length > 0) {
    await bulkIndexStocks(validStocks);
  } else {
    console.log('No valid stock data to index');
  }
}

export function stopStockIngestion() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  isRunning = false;
  console.log('Stock ingestion service stopped');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Received SIGINT, stopping stock ingestion...');
  stopStockIngestion();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, stopping stock ingestion...');
  stopStockIngestion();
  process.exit(0);
});
