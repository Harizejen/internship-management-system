"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface SupervisorChartsProps {
  data: { name: string; verified: number; pending: number }[];
}

export function SupervisorCharts({ data }: SupervisorChartsProps) {
  return (
    <div className="w-full space-y-2">
      <div>
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">
          Logbook Submission Workload Volume
        </h3>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Comparative visual matrix of verified logs against outstanding
          actions.
        </p>
      </div>

      {/* 💡 FIXED SCREEN COMPACTNESS: Scaled container frame height box down to h-56 */}
      <div className="h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
            barSize={28}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
            />
            <Tooltip
              contentStyle={{
                background: "#fff",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                fontSize: "11px",
              }}
            />
            <Legend
              wrapperStyle={{
                fontSize: "10px",
                fontWeight: 600,
                paddingTop: "5px",
              }}
            />
            <Bar
              dataKey="verified"
              name="Verified Logs"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="pending"
              name="Pending Review"
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
