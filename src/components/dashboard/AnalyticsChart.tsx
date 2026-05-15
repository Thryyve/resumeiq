"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsChart({
  data,
}: {
  data: { name: string; score: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 100]} stroke="#9ca3af" tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#fff",
          }}
        />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#2563eb"
          strokeWidth={2}
          dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}