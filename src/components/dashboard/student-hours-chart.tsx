"use client";

import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  CartesianGrid,
} from "recharts";
import { BarChart3 } from "lucide-react";

interface StudentHoursChartProps {
  data: { name: string; hours: number }[];
}

export function StudentHoursChart({ data }: StudentHoursChartProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-lg">
          <BarChart3 className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Weekly Logged Hours
          </h3>
          <p className="text-[10px] text-slate-400 font-medium">
            Visual progression of logged industrial workload metrics.
          </p>
        </div>
      </div>

      <div className="h-48 w-full text-[10px] font-mono font-bold pt-2">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 italic border border-dashed border-slate-100 rounded-xl">
            No logged hours data points available. Complete daily entries to
            draw progress trends.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                tickLine={false}
                axisLine={false}
              />
              <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  borderRadius: "12px",
                  border: "none",
                  color: "#fff",
                  fontSize: "11px",
                }}
                itemStyle={{ color: "#a5b4fc" }}
              />
              <Area
                type="monotone"
                dataKey="hours"
                name="Hours Logged"
                stroke="#4f46e5"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#hoursGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
