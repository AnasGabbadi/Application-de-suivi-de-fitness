import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { formatShortDate } from '../../utils/formatters';
import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';
import { cn } from '../../utils/cn';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WeightChart = ({ progressData }) => {
  const [period, setPeriod] = useState('30'); // 7, 30, 90, all
  const [filteredData, setFilteredData] = useState([]);
  const [stats, setStats] = useState({
    current: 0,
    change: 0,
    trend: 'stable',
  });

  useEffect(() => {
    filterData();
  }, [progressData, period]);

  const filterData = () => {
    if (!progressData || progressData.length === 0) {
      setFilteredData([]);
      return;
    }

    let filtered = [...progressData].sort((a, b) => new Date(a.date) - new Date(b.date));

    if (period !== 'all') {
      const days = parseInt(period);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      filtered = filtered.filter((item) => new Date(item.date) >= cutoffDate);
    }

    setFilteredData(filtered);

    // Calculer les stats
    if (filtered.length > 0) {
      const current = filtered[filtered.length - 1].poids;
      const first = filtered[0].poids;
      const change = ((current - first) / first) * 100;
      
      let trend = 'stable';
      if (Math.abs(change) < 1) trend = 'stable';
      else if (change > 0) trend = 'up';
      else trend = 'down';

      setStats({
        current: current.toFixed(1),
        change: change.toFixed(1),
        trend,
      });
    }
  };

  const chartData = {
    labels: filteredData.map((item) => formatShortDate(item.date)),
    datasets: [
      {
        label: 'Poids (kg)',
        data: filteredData.map((item) => item.poids),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#fff',
        pointBorderWidth: 2,
        pointHoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
        displayColors: false,
        callbacks: {
          label: (context) => {
            return `Poids: ${context.parsed.y} kg`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 11,
          },
          callback: (value) => `${value} kg`,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  const periods = [
    { value: '7', label: '7 jours' },
    { value: '30', label: '30 jours' },
    { value: '90', label: '90 jours' },
    { value: 'all', label: 'Tout' },
  ];

  const getTrendIcon = () => {
    if (stats.trend === 'up') return <TrendingUp className="h-5 w-5" />;
    if (stats.trend === 'down') return <TrendingDown className="h-5 w-5" />;
    return <Minus className="h-5 w-5" />;
  };

  const getTrendColor = () => {
    if (stats.trend === 'up') return 'text-red-600 dark:text-red-400';
    if (stats.trend === 'down') return 'text-green-600 dark:text-green-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getTrendLabel = () => {
    if (stats.trend === 'up') return 'en hausse';
    if (stats.trend === 'down') return 'en baisse';
    return 'stable';
  };

  if (!progressData || progressData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Aucune donnée de poids
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Ajoutez vos mesures pour suivre votre évolution
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Évolution du poids
          </h3>
          <div className="flex items-center space-x-3">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.current} kg
            </p>
            <div className={cn('flex items-center space-x-1', getTrendColor())}>
              {getTrendIcon()}
              <span className="text-sm font-medium">
                {stats.change}% {getTrendLabel()}
              </span>
            </div>
          </div>
        </div>

        {/* Period selector */}
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                period === p.value
                  ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <Line data={chartData} options={options} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Poids initial
          </p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {filteredData[0]?.poids.toFixed(1)} kg
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Poids actuel
          </p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {stats.current} kg
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Évolution
          </p>
          <p className={cn('text-xl font-bold', getTrendColor())}>
            {stats.change > 0 ? '+' : ''}{stats.change}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeightChart;