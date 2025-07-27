import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { TrendingUp, PieChart as PieChartIcon, BarChart3, Calendar } from 'lucide-react';
import { format, isWithinInterval, subDays, subWeeks, subMonths } from 'date-fns';

interface Transaction {
  id: string;
  date: Date;
  amount: number;
  category: string;
}

interface DailySpending {
  date: string;
  amount: number;
}

interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
}

type TimePeriod = 'day' | 'week' | 'month' | '3months' | '6months' | 'year';

const SpendingInsightCard: React.FC = () => {
  const [isPieView, setIsPieView] = useState(false);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');

  // Time period options
  const timePeriodOptions = [
    { value: 'day', label: 'Last Day' },
    { value: 'week', label: 'Last Week' },
    { value: 'month', label: 'Last Month' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: 'year', label: 'Last Year' },
  ];

  // Calculate date range based on time period
  const dateRange = useMemo(() => {
    const now = new Date();
    switch (timePeriod) {
      case 'day':
        return { from: subDays(now, 1), to: now };
      case 'week':
        return { from: subWeeks(now, 1), to: now };
      case 'month':
        return { from: subMonths(now, 1), to: now };
      case '3months':
        return { from: subMonths(now, 3), to: now };
      case '6months':
        return { from: subMonths(now, 6), to: now };
      case 'year':
        return { from: subMonths(now, 12), to: now };
      default:
        return { from: subMonths(now, 1), to: now };
    }
  }, [timePeriod]);

  // Extended mock data for transactions
  const mockTransactions: Transaction[] = [
    { id: '1', date: subDays(new Date(), 1), amount: 45.50, category: 'Groceries' },
    { id: '2', date: subDays(new Date(), 2), amount: 12.99, category: 'Entertainment' },
    { id: '3', date: subDays(new Date(), 3), amount: 89.00, category: 'Bills' },
    { id: '4', date: subDays(new Date(), 4), amount: 25.75, category: 'Groceries' },
    { id: '5', date: subDays(new Date(), 5), amount: 150.00, category: 'Bills' },
    { id: '6', date: subDays(new Date(), 6), amount: 32.40, category: 'Entertainment' },
    { id: '7', date: subDays(new Date(), 7), amount: 67.80, category: 'Groceries' },
    { id: '8', date: subDays(new Date(), 8), amount: 19.99, category: 'Shopping' },
    { id: '9', date: subDays(new Date(), 9), amount: 78.50, category: 'Dining' },
    { id: '10', date: subDays(new Date(), 10), amount: 23.45, category: 'Entertainment' },
    { id: '11', date: subDays(new Date(), 15), amount: 156.78, category: 'Bills' },
    { id: '12', date: subDays(new Date(), 20), amount: 43.20, category: 'Groceries' },
    { id: '13', date: subDays(new Date(), 25), amount: 87.99, category: 'Shopping' },
    { id: '14', date: subDays(new Date(), 30), amount: 29.50, category: 'Dining' },
    { id: '15', date: subDays(new Date(), 35), amount: 65.30, category: 'Entertainment' },
    { id: '16', date: subDays(new Date(), 45), amount: 110.00, category: 'Bills' },
    { id: '17', date: subDays(new Date(), 60), amount: 35.60, category: 'Groceries' },
    { id: '18', date: subDays(new Date(), 90), amount: 42.80, category: 'Dining' },
    { id: '19', date: subDays(new Date(), 120), amount: 95.20, category: 'Shopping' },
    { id: '20', date: subDays(new Date(), 180), amount: 125.40, category: 'Bills' },
    { id: '21', date: subDays(new Date(), 200), amount: 78.90, category: 'Entertainment' },
    { id: '22', date: subDays(new Date(), 250), amount: 55.30, category: 'Groceries' },
    { id: '23', date: subDays(new Date(), 300), amount: 89.70, category: 'Dining' },
    { id: '24', date: subDays(new Date(), 350), amount: 134.50, category: 'Shopping' },
  ];

  // Filter transactions based on date range
  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter(transaction =>
      isWithinInterval(transaction.date, { start: dateRange.from, end: dateRange.to })
    );
  }, [dateRange]);

  // Prepare data for line chart (daily spending)
  const lineChartData: DailySpending[] = useMemo(() => {
    const dailyTotals = new Map<string, number>();
    
    filteredTransactions.forEach(transaction => {
      const dateKey = format(transaction.date, timePeriod === 'day' ? 'HH:mm' : 'MMM dd');
      const currentTotal = dailyTotals.get(dateKey) || 0;
      dailyTotals.set(dateKey, currentTotal + transaction.amount);
    });

    return Array.from(dailyTotals.entries())
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => {
        if (timePeriod === 'day') {
          return a.date.localeCompare(b.date);
        }
        return new Date(a.date + ', 2023').getTime() - new Date(b.date + ', 2023').getTime();
      });
  }, [filteredTransactions, timePeriod]);

  // Prepare data for pie chart (category spending)
  const pieChartData: CategorySpending[] = useMemo(() => {
    const categoryTotals = new Map<string, number>();
    let totalSpending = 0;
    
    filteredTransactions.forEach(transaction => {
      const currentTotal = categoryTotals.get(transaction.category) || 0;
      categoryTotals.set(transaction.category, currentTotal + transaction.amount);
      totalSpending += transaction.amount;
    });

    return Array.from(categoryTotals.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: Math.round((amount / totalSpending) * 100)
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredTransactions]);

  // Enhanced chart colors with gradients
  const chartColors = [
    'hsl(var(--chart-primary))',
    'hsl(var(--chart-secondary))',
    'hsl(var(--chart-accent))',
    'hsl(var(--chart-warning))',
    'hsl(var(--chart-info))',
    'hsl(var(--chart-success))',
  ];

  const totalSpent = filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  // Custom tooltip for enhanced styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">
            {isPieView ? `Category: ${label}` : `Date: ${label}`}
          </p>
          <p className="text-sm text-primary font-semibold">
            Amount: ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-gradient-to-br from-card/80 via-card to-background/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            <TrendingUp className="h-5 w-5 text-primary" />
            Spending Insights
          </CardTitle>
          <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-lg">
            <BarChart3 className={`h-4 w-4 transition-all duration-300 ${!isPieView ? 'text-primary scale-110' : 'text-muted-foreground'}`} />
            <Switch
              checked={isPieView}
              onCheckedChange={setIsPieView}
              aria-label="Toggle chart view"
              className="data-[state=checked]:bg-primary"
            />
            <PieChartIcon className={`h-4 w-4 transition-all duration-300 ${isPieView ? 'text-primary scale-110' : 'text-muted-foreground'}`} />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2 z-10" />
            <Select value={timePeriod} onValueChange={(value: TimePeriod) => setTimePeriod(value)}>
              <SelectTrigger className="w-full pl-10 bg-muted/30 border-border/50 hover:bg-muted/50 transition-colors">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-sm border-border/50">
                {timePeriodOptions.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className="hover:bg-muted/50 focus:bg-muted/50"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-lg border border-primary/20">
            <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              ${totalSpent.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Total spent in {timePeriodOptions.find(opt => opt.value === timePeriod)?.label.toLowerCase()}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {isPieView ? (
              <PieChart>
                <defs>
                  {chartColors.map((color, index) => (
                    <linearGradient key={index} id={`pieGradient${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={color} stopOpacity={1} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="amount"
                  className="drop-shadow-sm"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#pieGradient${index % chartColors.length})`}
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={40}
                  iconType="circle"
                  formatter={(value, entry: any) => {
                    const percentage = pieChartData.find(item => item.category === value)?.percentage || 0;
                    return (
                      <span className="text-xs font-medium text-foreground">
                        {value} ({percentage}%)
                      </span>
                    );
                  }}
                />
              </PieChart>
            ) : (
              <AreaChart data={lineChartData}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-primary))" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  stroke="hsl(var(--muted-foreground))"
                  strokeOpacity={0.5}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  stroke="hsl(var(--muted-foreground))"
                  strokeOpacity={0.5}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(var(--chart-primary))"
                  strokeWidth={3}
                  fill="url(#areaGradient)"
                  dot={{ 
                    fill: 'hsl(var(--chart-primary))', 
                    stroke: 'hsl(var(--background))',
                    strokeWidth: 2, 
                    r: 4,
                    className: "drop-shadow-sm"
                  }}
                  activeDot={{ 
                    r: 6, 
                    stroke: 'hsl(var(--chart-primary))', 
                    strokeWidth: 3,
                    fill: 'hsl(var(--background))',
                    className: "drop-shadow-md"
                  }}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpendingInsightCard;