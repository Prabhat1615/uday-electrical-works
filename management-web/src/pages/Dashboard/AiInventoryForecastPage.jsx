import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';
import { useInventoryForecast } from '../../hooks/useErpQueries';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const AiInventoryForecastPage = () => {
  const { data: res, isLoading } = useInventoryForecast();
  const forecastData = res?.data || {};

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-orange-400" />
          <span>AI Inventory Demand & Stock Risk Forecasting</span>
        </h1>
        <p className="text-xs text-slate-400">Machine learning demand prediction, seasonal raw material velocity & automated purchase suggestions</p>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Generating AI predictive inventory forecast..." />
      ) : (
        <div className="space-y-6 text-xs">
          
          {/* Seasonal Forecast Insight Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-500/20 via-blue-500/10 to-transparent border border-slate-800 shadow-xl space-y-2">
            <span className="text-[10px] uppercase font-bold text-orange-400 tracking-widest flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>AI Seasonal Insight</span>
            </span>
            <h3 className="text-lg font-bold text-white">Demand Surge Prediction</h3>
            <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
              {forecastData.forecastInsight || 'Transformer Copper Wire & Stator Varnish demand predicted to rise 25% due to seasonal monsoon power surges.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Stock Out Risk Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-extrabold text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>Predicted Stock-Out Risk</span>
              </h3>

              <div className="space-y-3">
                {(forecastData.lowStockRisk || []).map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white text-sm">{item.name}</span>
                      <span className="text-rose-400 font-extrabold font-mono text-xs">{item.stock} Units Left</span>
                    </div>
                    <p className="text-slate-400">Stock depletion estimated in: <strong className="text-white">{item.predictedDaysLeft} Days</strong></p>
                    <p className="text-[11px] text-orange-400 font-semibold mt-1">AI Action: {item.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Fast Moving Velocity */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-extrabold text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>High Velocity Materials</span>
              </h3>

              <div className="space-y-3">
                {(forecastData.fastMoving || []).map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white text-sm">{item.name}</span>
                      <span className="text-emerald-400 font-extrabold text-xs">{item.velocity}</span>
                    </div>
                    <p className="text-slate-400">Category: {item.category}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
