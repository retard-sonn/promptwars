"use client";

import { scaleLinear } from "d3";
import { tacticEdges, tacticNodes } from "./cooccurrence";

const positions = tacticNodes.map((node, index) => {
  const angle = (index / tacticNodes.length) * Math.PI * 2 - Math.PI / 2;
  return { ...node, x: 320 + Math.cos(angle) * 210, y: 280 + Math.sin(angle) * 210 };
});
export function TacticChart() {
  const width = scaleLinear()
    .domain([1, Math.max(1, ...tacticEdges.map((edge) => edge.count))])
    .range([1, 9]);
  const radius = scaleLinear()
    .domain([1, Math.max(1, ...tacticNodes.map((node) => node.count))])
    .range([22, 42]);
  return (
    <div className="tactic-chart-wrap">
      <svg
        className="tactic-chart"
        viewBox="0 0 640 560"
        role="img"
        aria-label="Tactic co-occurrence network from the pattern library"
      >
        {tacticEdges.map((edge) => {
          const source = positions.find((node) => node.name === edge.source);
          const target = positions.find((node) => node.name === edge.target);
          return source && target ? (
            <line
              key={`${edge.source}-${edge.target}`}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke="var(--persimmon-300)"
              strokeWidth={width(edge.count)}
              strokeOpacity={0.42}
            />
          ) : null;
        })}
        {positions.map((node) => (
          <g key={node.name}>
            <circle
              cx={node.x}
              cy={node.y}
              r={radius(node.count)}
              fill="var(--persimmon-100)"
              stroke="var(--persimmon-600)"
              strokeWidth={2}
            />
            <text x={node.x} y={node.y} textAnchor="middle" className="chart-count">
              {node.count}
            </text>
            <text
              x={node.x}
              y={node.y + radius(node.count) + 22}
              textAnchor="middle"
              className="chart-label"
            >
              {node.name}
            </text>
          </g>
        ))}
      </svg>
      <details>
        <summary>View the source counts</summary>
        <table>
          <caption>Pattern count per tactic</caption>
          <tbody>
            {tacticNodes.map((node) => (
              <tr key={node.name}>
                <th>{node.name}</th>
                <td>{node.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
