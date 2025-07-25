import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Database, Brain, Zap } from 'lucide-react';

interface ModelStats {
  samplesProcessed: number;
  lastTrainingTime: string;
  modelVersion: number;
  accuracyHistory: number[];
  errorHistory: number[];
  bufferSize: number;
  isTraining: boolean;
}

interface CollectionStats {
  totalSamples: number;
  successfulPredictions: number;
  failedPredictions: number;
  bufferSize: number;
  symbolsCount: number;
  isRunning: boolean;
}

const MLDashboard: React.FC = () => {
  const [modelStats, setModelStats] = useState<ModelStats>({
    samplesProcessed: 1250,
    lastTrainingTime: new Date().toISOString(),
    modelVersion: 3,
    accuracyHistory: [0.65, 0.68, 0.72, 0.75, 0.78, 0.76, 0.82, 0.85, 0.83, 0.87],
    errorHistory: [0.15, 0.12, 0.10, 0.08, 0.07, 0.09, 0.06, 0.05, 0.07, 0.04],
    bufferSize: 150,
    isTraining: true
  });

  const [collectionStats, setCollectionStats] = useState<CollectionStats>({
    totalSamples: 5420,
    successfulPredictions: 4895,
    failedPredictions: 525,
    bufferSize: 150,
    symbolsCount: 5,
    isRunning: true
  });

  const [recentPredictions] = useState([
    { symbol: 'BTCUSDT', prediction: 'UP', confidence: 0.85, timestamp: '2025-01-25 14:30:15', actual: 'UP' },
    { symbol: 'ETHUSDT', prediction: 'DOWN', confidence: 0.72, timestamp: '2025-01-25 14:29:45', actual: 'DOWN' },
    { symbol: 'SOLUSDT', prediction: 'NEUTRAL', confidence: 0.68, timestamp: '2025-01-25 14:29:20', actual: 'NEUTRAL' },
    { symbol: 'ADAUSDT', prediction: 'UP', confidence: 0.91, timestamp: '2025-01-25 14:28:55', actual: 'UP' },
    { symbol: 'XRPUSDT', prediction: 'DOWN', confidence: 0.79, timestamp: '2025-01-25 14:28:30', actual: 'UP' }
  ]);

  const accuracyData = modelStats.accuracyHistory.map((acc, index) => ({
    iteration: index + 1,
    accuracy: acc * 100,
    error: modelStats.errorHistory[index] * 100
  }));

  const symbolPerformance = [
    { symbol: 'BTCUSDT', accuracy: 87, predictions: 890, color: 'hsl(var(--primary))' },
    { symbol: 'ETHUSDT', accuracy: 82, predictions: 765, color: 'hsl(var(--secondary))' },
    { symbol: 'SOLUSDT', accuracy: 79, predictions: 654, color: 'hsl(var(--accent))' },
    { symbol: 'ADAUSDT', accuracy: 85, predictions: 543, color: 'hsl(var(--muted))' },
    { symbol: 'XRPUSDT', accuracy: 81, predictions: 432, color: 'hsl(var(--destructive))' }
  ];

  const getPredictionIcon = (prediction: string) => {
    switch (prediction) {
      case 'UP':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'DOWN':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (prediction: string, actual: string) => {
    const isCorrect = prediction === actual;
    return (
      <Badge variant={isCorrect ? "default" : "destructive"}>
        {isCorrect ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
        {isCorrect ? 'Верно' : 'Ошибка'}
      </Badge>
    );
  };

  // Симуляция обновления данных
  useEffect(() => {
    const interval = setInterval(() => {
      setModelStats(prev => ({
        ...prev,
        samplesProcessed: prev.samplesProcessed + Math.floor(Math.random() * 5),
        bufferSize: Math.max(0, prev.bufferSize + Math.floor(Math.random() * 10) - 5)
      }));

      setCollectionStats(prev => ({
        ...prev,
        totalSamples: prev.totalSamples + Math.floor(Math.random() * 3),
        successfulPredictions: prev.successfulPredictions + Math.floor(Math.random() * 2)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              ML Trading System Dashboard
            </h1>
            <p className="text-muted-foreground">
              Мониторинг и анализ системы машинного обучения для торговли криптовалютами
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant={modelStats.isTraining ? "default" : "secondary"} className="px-3 py-1">
              <Brain className="h-4 w-4 mr-1" />
              {modelStats.isTraining ? 'Обучение активно' : 'Обучение остановлено'}
            </Badge>
            <Badge variant={collectionStats.isRunning ? "default" : "secondary"} className="px-3 py-1">
              <Database className="h-4 w-4 mr-1" />
              {collectionStats.isRunning ? 'Сбор данных активен' : 'Сбор данных остановлен'}
            </Badge>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Обработано образцов</CardTitle>
              <div className="text-2xl font-bold">{modelStats.samplesProcessed.toLocaleString()}</div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-muted-foreground">
                <Zap className="h-3 w-3 mr-1" />
                Версия модели: {modelStats.modelVersion}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Точность модели</CardTitle>
              <div className="text-2xl font-bold text-green-600">
                {((collectionStats.successfulPredictions / collectionStats.totalSamples) * 100).toFixed(1)}%
              </div>
            </CardHeader>
            <CardContent>
              <Progress 
                value={(collectionStats.successfulPredictions / collectionStats.totalSamples) * 100} 
                className="h-2"
              />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Буфер данных</CardTitle>
              <div className="text-2xl font-bold">{modelStats.bufferSize}</div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-muted-foreground">
                <Database className="h-3 w-3 mr-1" />
                Отслеживается символов: {collectionStats.symbolsCount}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Всего предсказаний</CardTitle>
              <div className="text-2xl font-bold">{collectionStats.totalSamples.toLocaleString()}</div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-green-600">
                +{collectionStats.successfulPredictions} успешных
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Производительность</TabsTrigger>
            <TabsTrigger value="predictions">Предсказания</TabsTrigger>
            <TabsTrigger value="symbols">По символам</TabsTrigger>
            <TabsTrigger value="analysis">Анализ</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>История точности модели</CardTitle>
                  <CardDescription>Динамика точности предсказаний по итерациям обучения</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={accuracyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="iteration" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="accuracy" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        name="Точность (%)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="error" 
                        stroke="hsl(var(--destructive))" 
                        strokeWidth={2}
                        name="Ошибка (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Статистика обучения</CardTitle>
                  <CardDescription>Ключевые метрики системы машинного обучения</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Последнее обучение</span>
                    <span className="text-sm font-medium">
                      {new Date(modelStats.lastTrainingTime).toLocaleString('ru-RU')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Успешность предсказаний</span>
                    <span className="text-sm font-medium">
                      {collectionStats.successfulPredictions} / {collectionStats.totalSamples}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Средняя точность</span>
                    <span className="text-sm font-medium text-green-600">
                      {(modelStats.accuracyHistory.slice(-5).reduce((a, b) => a + b, 0) / 5 * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Текущая ошибка</span>
                    <span className="text-sm font-medium text-red-600">
                      {(modelStats.errorHistory[modelStats.errorHistory.length - 1] * 100).toFixed(2)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Последние предсказания</CardTitle>
                <CardDescription>История недавних предсказаний модели с фактическими результатами</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentPredictions.map((pred, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        {getPredictionIcon(pred.prediction)}
                        <div>
                          <div className="font-medium">{pred.symbol}</div>
                          <div className="text-xs text-muted-foreground">{pred.timestamp}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="text-sm font-medium">{pred.prediction}</div>
                          <div className="text-xs text-muted-foreground">
                            {(pred.confidence * 100).toFixed(0)}% уверенности
                          </div>
                        </div>
                        {getStatusBadge(pred.prediction, pred.actual)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="symbols" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Производительность по символам</CardTitle>
                <CardDescription>Точность предсказаний для каждой торговой пары</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={symbolPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="symbol" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="accuracy" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ключевые улучшения</CardTitle>
                  <CardDescription>Реализованные исправления критических ошибок</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Нормализация данных разного масштаба</div>
                      <div className="text-sm text-muted-foreground">
                        Логарифмическое масштабирование для цен от 0.00001 до 100K
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Инкрементальное обучение</div>
                      <div className="text-sm text-muted-foreground">
                        SGD модели для обучения на потоковых данных
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Персистентное хранение</div>
                      <div className="text-sm text-muted-foreground">
                        Автоматическое сохранение и восстановление после перезапуска
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Улучшенная feature engineering</div>
                      <div className="text-sm text-muted-foreground">
                        Технические индикаторы, volatility, временные признаки
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Рекомендации</CardTitle>
                  <CardDescription>Следующие шаги для оптимизации системы</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Увеличить частоту сбора данных</div>
                      <div className="text-sm text-muted-foreground">
                        Уменьшить интервал до 15 секунд для криптовалют
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Добавить cross-validation</div>
                      <div className="text-sm text-muted-foreground">
                        Временная валидация для более точной оценки
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Мониторинг drift'а модели</div>
                      <div className="text-sm text-muted-foreground">
                        Отслеживание деградации производительности
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MLDashboard;