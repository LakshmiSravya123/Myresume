import { Client } from '@elastic/elasticsearch';

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

async function fixIndex() {
  try {
    console.log(`Attempting to fix index: ${INDEX_NAME}`);
    
    // First, try to delete any existing index or data stream
    try {
      await esClient.indices.delete({ index: INDEX_NAME, ignore_unavailable: true });
      console.log(`Deleted existing index/data stream: ${INDEX_NAME}`);
    } catch (deleteError: any) {
      console.log(`No existing index to delete or deletion failed: ${deleteError.message}`);
    }
    
    // Create a fresh index
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
    
    console.log(`Successfully created index: ${INDEX_NAME}`);
    
    // Verify the index
    const exists = await esClient.indices.exists({ index: INDEX_NAME });
    console.log(`Index exists verification: ${exists}`);
    
  } catch (error: any) {
    console.error('Error fixing index:', error.message || error);
  }
}

fixIndex().then(() => {
  console.log('Index fix complete');
  process.exit(0);
}).catch((err) => {
  console.error('Failed to fix index:', err);
  process.exit(1);
});
