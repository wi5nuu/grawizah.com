'use client';

import React, { useMemo } from 'react';

interface Node {
  id: string;
  label: string;
  type: 'supplier' | 'buyer' | 'logistics';
  x: number;
  y: number;
  score: number;
}

interface Link {
  source: string;
  target: string;
  value: number;
}

export default function TradeNetworkMap() {
  const nodes: Node[] = useMemo(() => [
    { id: 'me', label: 'My Company', type: 'supplier', x: 250, y: 200, score: 98 },
    { id: 'b1', label: 'Acme Corp (USA)', type: 'buyer', x: 450, y: 100, score: 85 },
    { id: 'b2', label: 'EuroTrade (GER)', type: 'buyer', x: 450, y: 300, score: 92 },
    { id: 'l1', label: 'GlobalPort Log.', type: 'logistics', x: 100, y: 150, score: 88 },
    { id: 'l2', label: 'Oceanic Freight', type: 'logistics', x: 100, y: 250, score: 95 },
  ], []);

  const links: Link[] = [
    { source: 'me', target: 'b1', value: 2 },
    { source: 'me', target: 'b2', value: 3 },
    { source: 'l1', target: 'me', value: 1 },
    { source: 'l2', target: 'me', value: 2 },
  ];

  return (
    <div className="w-full h-[400px] bg-surface-container-lowest rounded-xl border border-surface-variant/30 relative overflow-hidden group">
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-sm font-bold text-on-surface">Global Supply Chain Visualization</h3>
        <p className="text-[11px] text-on-surface-variant">Real-time node-based mapping of your trade partners</p>
      </div>

      <svg width="100%" height="100%" viewBox="0 0 550 400" className="animate-fade-in">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="15" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#9ca3af" />
          </marker>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Links */}
        {links.map((link, i) => {
          const source = nodes.find(n => n.id === link.source)!;
          const target = nodes.find(n => n.id === link.target)!;
          return (
            <line
              key={i}
              x1={source.x} y1={source.y}
              x2={target.x} y2={target.y}
              stroke="#e5e7eb"
              strokeWidth={link.value + 1}
              markerEnd="url(#arrowhead)"
              className="transition-all duration-500 opacity-60 group-hover:opacity-100"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => (
          <g key={node.id} transform={`translate(${node.x},${node.y})`} className="cursor-pointer group/node">
            <circle
              r={node.id === 'me' ? 24 : 18}
              fill={node.type === 'supplier' ? '#5300b7' : node.type === 'buyer' ? '#2563eb' : '#047857'}
              className="transition-all duration-300 hover:scale-110 shadow-lg"
              filter={node.id === 'me' ? "url(#glow)" : ""}
            />
            <text
              y={node.id === 'me' ? 40 : 34}
              textAnchor="middle"
              className="text-[10px] font-bold fill-on-surface dark:fill-dark-on-surface"
            >
              {node.label}
            </text>
            <text
              y={node.id === 'me' ? 52 : 44}
              textAnchor="middle"
              className="text-[8px] fill-on-surface-variant dark:fill-dark-on-surface-variant font-medium"
            >
              Score: {node.score}
            </text>
          </g>
        ))}
      </svg>

      <div className="absolute bottom-4 right-4 flex gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#5300b7]" />
          <span className="text-[10px] font-bold text-on-surface-variant uppercase">You</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#2563eb]" />
          <span className="text-[10px] font-bold text-on-surface-variant uppercase">Buyers</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#047857]" />
          <span className="text-[10px] font-bold text-on-surface-variant uppercase">Logistics</span>
        </div>
      </div>
    </div>
  );
}
