import React from 'react';
import { Briefcase, TrendingUp, Video, Trophy } from 'lucide-react';

export default function StatsBar({ stats }) {
  const {
    total = 0,
    responseRate = 0,
    interviewRate = 0,
    offerRate = 0
  } = stats || {};

  const cards = [
    {
      id: 'total',
      label: 'Total Applications',
      value: total,
      unit: '',
      icon: Briefcase,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      id: 'response',
      label: 'Response Rate',
      value: responseRate,
      unit: '%',
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      id: 'interview',
      label: 'Interview Rate',
      value: interviewRate,
      unit: '%',
      icon: Video,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20'
    },
    {
      id: 'offer',
      label: 'Offer Rate',
      value: offerRate,
      unit: '%',
      icon: Trophy,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`bg-[#111118]/80 backdrop-blur-md border ${card.borderColor} rounded-xl p-4 flex items-center justify-between shadow-lg hover:border-opacity-50 transition-all`}
          >
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                {card.label}
              </p>
              <h3 className="text-2xl font-bold text-white tracking-tight font-mono">
                {card.value}{card.unit}
              </h3>
            </div>
            <div className={`p-3 rounded-lg ${card.bgColor} ${card.color} shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
