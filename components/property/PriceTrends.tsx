import { Card, CardContent } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface PriceTrendsProps {
  priceHistoryData: any[];
  formatPrice: (price: number) => string;
}

export const PriceTrends = ({ priceHistoryData, formatPrice }: PriceTrendsProps) => {
  // Calculate statistics
  const currentPrice = priceHistoryData[priceHistoryData.length - 1].price;
  const initialPrice = priceHistoryData[0].price;
  const priceChange = currentPrice - initialPrice;
  const percentageChange = (priceChange / initialPrice) * 100;
  
  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardContent className="p-5">
        <div className="flex items-center mb-4">
          <TrendingUp className="w-5 h-5 mr-2 text-primary" />
          <h3 className="text-base font-semibold">Price Trends</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Current Price</div>
            <div className="font-semibold">{formatPrice(currentPrice)}</div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Price Change</div>
            <div className={`font-semibold ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {priceChange >= 0 ? '+' : ''}{formatPrice(priceChange)}
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">% Change</div>
            <div className={`font-semibold ${percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(2)}%
            </div>
          </div>
        </div>
        
        <div className="h-[200px] mb-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceHistoryData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis 
                tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value) => [formatPrice(value as number), 'Price']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#6366f1" 
                fillOpacity={1} 
                fill="url(#colorPrice)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="text-xs text-gray-500 text-center">
          Price trends over the last {priceHistoryData.length} quarters
        </div>
      </CardContent>
    </Card>
  );
};