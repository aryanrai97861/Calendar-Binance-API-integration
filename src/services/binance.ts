import axios from 'axios';

// Binance intervals: 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M
export type BinanceInterval = '1m' | '3m' | '5m' | '15m' | '30m' | '1h' | '2h' | '4h' | '6h' | '8h' | '12h' | '1d' | '3d' | '1w' | '1M';

export interface Kline {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteAssetVolume: string;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
}

export async function fetchKlines(
  symbol: string,
  interval: BinanceInterval,
  startTime?: number,
  endTime?: number,
  limit: number = 500
): Promise<Kline[]> {
  const params: any = {
    symbol,
    interval,
    limit,
  };
  if (startTime) params.startTime = startTime;
  if (endTime) params.endTime = endTime;

  const url = 'https://api.binance.com/api/v3/klines';
  const response = await axios.get(url, { params });
  // Binance returns an array of arrays; map to Kline objects
  return response.data.map((item: any[]) => ({
    openTime: item[0],
    open: item[1],
    high: item[2],
    low: item[3],
    close: item[4],
    volume: item[5],
    closeTime: item[6],
    quoteAssetVolume: item[7],
    numberOfTrades: item[8],
    takerBuyBaseAssetVolume: item[9],
    takerBuyQuoteAssetVolume: item[10],
  }));
} 