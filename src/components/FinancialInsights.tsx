import React from 'react';
import { Sparkles, TrendingUp, AlertCircle, Info, Lightbulb } from 'lucide-react';
import { FinancialInsight } from '../utils/insights';

interface FinancialInsightsProps {
  insights: FinancialInsight[];
}

export const FinancialInsights: React.FC<FinancialInsightsProps> = ({ insights }) => {
  if (insights.length === 0) {
    return null;
  }

  const getIcon = (type: FinancialInsight['type']) => {
    switch (type) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'tip':
        return <Lightbulb className="w-4 h-4 text-indigo-600" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getBadgeStyle = (type: FinancialInsight['type']) => {
    switch (type) {
      case 'positive':
        return 'bg-emerald-50/80 border-emerald-200 text-emerald-950';
      case 'warning':
        return 'bg-amber-50/80 border-amber-200 text-amber-950';
      case 'tip':
        return 'bg-indigo-50/80 border-indigo-200 text-indigo-950';
      case 'info':
      default:
        return 'bg-blue-50/80 border-blue-200 text-blue-950';
    }
  };

  return (
    <div className="mb-10">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-200">
        <div className="w-6 h-6 rounded-md bg-brand-500/10 text-brand-600 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Financial Insights</h2>
          <p className="text-xs text-gray-500">Automated spending intelligence from your recorded activity</p>
        </div>
      </div>

      {/* Grid of Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`p-4 rounded-xl border flex items-start gap-3 transition-all hover:shadow-xs ${getBadgeStyle(
              insight.type
            )}`}
          >
            <div className="mt-0.5 p-1 rounded-md bg-white shadow-2xs">
              {getIcon(insight.type)}
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold uppercase tracking-wider opacity-90">
                {insight.title}
              </h4>
              <p className="text-xs sm:text-sm mt-0.5 leading-relaxed opacity-85">
                {insight.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
