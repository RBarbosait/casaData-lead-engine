"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts"

export default function ChartClient({ data }: { data: any[] }) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={3} />
          <Line type="monotone" dataKey="users" stroke="#eab308" strokeWidth={3} />
          <Line type="monotone" dataKey="leads" stroke="#22c55e" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
