import pandas as pd

# Fetch NASDAQ listed symbols
nasdaq_url = 'https://www.nasdaqtrader.com/dynamic/SymDir/nasdaqlisted.txt'
nasdaq_df = pd.read_csv(nasdaq_url, sep='|', header=0)  # Pipe-delimited with header
nasdaq_symbols = nasdaq_df['Symbol'].dropna().str.strip().unique()

# Fetch Other (NYSE, AMEX, etc.) symbols
other_url = 'https://www.nasdaqtrader.com/dynamic/SymDir/otherlisted.txt'
other_df = pd.read_csv(other_url, sep='|', header=0)
other_symbols = other_df['ACT Symbol'].dropna().str.strip().unique()  # 'ACT Symbol' for NYSE

# Concatenate and remove duplicates
all_symbols = pd.concat([pd.Series(nasdaq_symbols), pd.Series(other_symbols)]).dropna().str.strip().unique()

# Save to CSV
df = pd.DataFrame(all_symbols, columns=['Symbol'])
df.to_csv('all_stock_symbols.csv', index=False)

# Output summary
print(f"Total unique symbols: {len(df)}")
print("First 10 symbols:")
print(df.head(10))