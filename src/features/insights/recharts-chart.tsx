"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { CheckPoint } from "./user-checks-chart";

export default function RechartsChart({ points }: { points: CheckPoint[] }) {
  return (
    <div className="user-chart" aria-label="Your saved report scores">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={points}>
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#ec5800"
            strokeWidth={3}
            dot={{ fill: "#ff6a1f" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
