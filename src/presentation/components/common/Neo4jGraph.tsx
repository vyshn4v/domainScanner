import type { Dispatch, SetStateAction } from "react";

type DashboardResult = {
  id: string;
  title: string;
  summary: string;
  type: string;
  severity: string;
  status: string;
};

type DashboardScan = {
  id: string;
  title: string;
  target: string;
  status: string;
  severity: string;
  results: DashboardResult[];
};

type DashboardUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  team: string;
};

type DashboardData = {
  user: DashboardUser;
  scans: DashboardScan[];
};

type SelectedNode =
  | { type: "user"; item: DashboardUser }
  | { type: "scan"; item: DashboardScan }
  | { type: "result"; item: DashboardResult; scan: DashboardScan };

type GraphNode = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: "user" | "scan" | "result";
  label: string;
  subtitle: string;
  data: DashboardUser | DashboardScan | DashboardResult;
  parentId?: string;
};

type GraphLink = {
  source: string;
  target: string;
};

type Props = {
  dashboardData: DashboardData;
  selectedNode: SelectedNode | null;
  setSelectedNode: Dispatch<SetStateAction<SelectedNode | null>>;
};

export function Neo4jGraph({
  dashboardData,
  selectedNode,
  setSelectedNode,
}: Props) {
  const graphWidth = 940;
  const graphHeight = 520;

  const scanCount = dashboardData.scans.length;
  const scanSpacing = graphWidth / (scanCount + 1);

  const nodes: GraphNode[] = [
    {
      id: dashboardData.user.id,
      type: "user",
      x: graphWidth / 2,
      y: 90,
      width: 180,
      height: 180,
      label: dashboardData.user.name,
      subtitle: dashboardData.user.role,
      data: dashboardData.user,
    },
    ...dashboardData.scans.flatMap((scan, scanIndex) => {
      const scanX = scanSpacing * (scanIndex + 1);
      const scanNode: GraphNode = {
        id: scan.id,
        type: "scan",
        x: scanX,
        y: 230,
        width: 150,
        height: 150,
        label: scan.title,
        subtitle: scan.target,
        data: scan,
        parentId: dashboardData.user.id,
      };

      const resultNodes: GraphNode[] = scan.results.map((result, resultIndex) => {
        const offset = (resultIndex - (scan.results.length - 1) / 2) * 180;
        return {
          id: result.id,
          type: "result",
          x: scanX + offset,
          y: 420,
          width: 120,
          height: 120,
          label: result.title,
          subtitle: `${result.severity} · ${result.type}`,
          data: result,
          parentId: scan.id,
        };
      });

      return [scanNode, ...resultNodes];
    }),
  ];

  const links: GraphLink[] = [
    ...dashboardData.scans.map((scan) => ({
      source: dashboardData.user.id,
      target: scan.id,
    })),
    ...dashboardData.scans.flatMap((scan) =>
      scan.results.map((result) => ({ source: scan.id, target: result.id })),
    ),
  ];

  const radiusFor = (node: GraphNode) => {
    if (node.type === "user") return 72;
    if (node.type === "scan") return 60;
    return 48;
  };

  const nodeFill = (type: GraphNode["type"]) => {
    if (type === "user") return "#0f766e";
    if (type === "scan") return "#1d4ed8";
    return "#be123c";
  };

  const nodeStroke = (type: GraphNode["type"]) => {
    if (type === "user") return "#2dd4bf";
    if (type === "scan") return "#93c5fd";
    return "#fca5a5";
  };

  const getPath = (source: GraphNode, target: GraphNode) => {
    const x1 = source.x;
    const y1 = source.y + radiusFor(source) + 4;
    const x2 = target.x;
    const y2 = target.y - radiusFor(target) - 4;
    const curve = Math.max(80, Math.abs(y2 - y1) / 2);
    return `M ${x1} ${y1} C ${x1} ${y1 + curve}, ${x2} ${y2 - curve}, ${x2} ${y2}`;
  };

  return (
    <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} className="graph-svg">
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#7b92a9" />
        </marker>
        <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="6"
            floodColor="var(--green)"
            floodOpacity="0.3"
          />
        </filter>
      </defs>

      {links.map((link) => {
        const source = nodes.find((node) => node.id === link.source);
        const target = nodes.find((node) => node.id === link.target);
        if (!source || !target) return null;

        return (
          <path
            key={`${link.source}-${link.target}`}
            d={getPath(source, target)}
            fill="none"
            stroke="#7b92a9"
            strokeWidth="2"
            strokeLinecap="round"
            markerEnd="url(#arrow)"
            opacity="0.85"
          />
        );
      })}

      {nodes.map((node) => {
        const radius = radiusFor(node);
        const active =
          selectedNode?.type === node.type && selectedNode.item.id === node.id;
        return (
          <g
            key={node.id}
            className="graph-node-group"
            onClick={() => {
              if (node.type === "user") {
                setSelectedNode({
                  type: "user",
                  item: node.data as DashboardUser,
                });
              } else if (node.type === "scan") {
                setSelectedNode({
                  type: "scan",
                  item: node.data as DashboardScan,
                });
              } else {
                const scan = dashboardData.scans.find(
                  (scan) => scan.id === node.parentId,
                );
                setSelectedNode({
                  type: "result",
                  item: node.data as DashboardResult,
                  scan: scan!,
                });
              }
            }}
            style={{ cursor: "pointer" }}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={radius}
              fill={nodeFill(node.type)}
              stroke={active ? "var(--green)" : nodeStroke(node.type)}
              strokeWidth={active ? 4 : 3}
              filter={active ? "url(#node-glow)" : undefined}
            />
            <text
              x={node.x}
              y={node.y - (node.type === "result" ? 10 : 14)}
              textAnchor="middle"
              fontSize={node.type === "user" ? 14 : 13}
              fontWeight="700"
              fill="#f8fafc"
            >
              {node.type === "scan" ? node.label : node.label}
            </text>
            <text
              x={node.x}
              y={node.y + (node.type === "result" ? 22 : 24)}
              textAnchor="middle"
              fontSize="11"
              fill="#cbd5e1"
            >
              {node.type === "user" ? node.subtitle : node.subtitle}
            </text>
            <text
              x={node.x}
              y={node.y + (node.type === "result" ? 36 : 40)}
              textAnchor="middle"
              fontSize="10"
              fill="#94a3b8"
            >
              {node.type === "user"
                ? "User"
                : node.type === "scan"
                  ? "Scan"
                  : "Result"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
