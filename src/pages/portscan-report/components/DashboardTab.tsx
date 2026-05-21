import {
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  AreaChart,
  Area,
  ReferenceLine,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import type { PortScanData } from "../portScanData";
import { useTheme } from "../../../components/util/theme";

const THEME_COLORS = {
  dark: {
    primary: "#60a5fa",
    secondary: "#a78bfa",
    accent: "#a78bfa",
    danger: "#fb7185",
    success: "#a78bfa",
    warning: "#fbbf24",
    info: "#a78bfa",
    background: "#080b0f",
    surface: "#10151c",
    raised: "#151b24",
  },
  light: {
    primary: "#1d4ed8",
    secondary: "#7c3aed",
    accent: "#6d28d9",
    danger: "#b91c1c",
    success: "#6d28d9",
    warning: "#b45309",
    info: "#6d28d9",
    background: "#f4f5f7",
    surface: "#ffffff",
    raised: "#f8fafc",
  },
};

function ServiceRiskChart({ data }: { data: PortScanData }) {
  const { actualTheme } = useTheme();
  const colors = THEME_COLORS[actualTheme];

  const chartData = [...(data.graph_data.service_risk_chart || [])]
    .sort((a, b) => b.risk_score - a.risk_score)
    .slice(0, 6)
    .map((item) => ({
      ...item,
      serviceLabel: item.count
        ? `${item.service} (${item.count})`
        : item.service,
    }));

  const getRiskColor = (score: number) => {
    if (score >= 80) return colors.danger;
    if (score >= 60) return colors.warning;
    return colors.info;
  };

  const renderPoint = ({ cx, cy, payload }: any) => {
    const size = Math.max(12, Math.min(32, 8 + (payload.count || 1) * 6));
    return (
      <circle
        cx={cx}
        cy={cy}
        r={size / 2}
        fill={getRiskColor(payload.risk_score)}
        fillOpacity={0.88}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={1.5}
      />
    );
  };

  return (
    <div className="dr-chart-card dr-chart-card--clean">
      <div className="dr-chart-header">
        <div>
          <h3 className="dr-chart-title">Service Exposure Scatter</h3>
          <p className="dr-chart-meta">
            Open port count versus risk score for the top exposed services.
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={360}>
        <ScatterChart margin={{ top: 24, right: 24, bottom: 28, left: 24 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.08)"
          />
          <XAxis
            type="number"
            dataKey="count"
            name="Open ports"
            stroke="var(--muted)"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "var(--muted)" }}
            domain={[0, "dataMax + 1"]}
            label={{
              value: "Open ports",
              position: "insideBottom",
              offset: -10,
              fill: "var(--muted)",
            }}
          />
          <YAxis
            type="number"
            dataKey="risk_score"
            name="Risk score"
            stroke="var(--muted)"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "var(--muted)" }}
            domain={[0, 100]}
            label={{
              value: "Risk score (%)",
              angle: -90,
              position: "insideLeft",
              fill: "var(--muted)",
            }}
          />
          <ZAxis dataKey="count" range={[100, 260]} />
          <ReferenceLine
            y={75}
            stroke={colors.warning}
            strokeDasharray="4 4"
            label={{
              value: "High risk",
              position: "insideTopLeft",
              fill: "var(--muted)",
              fontSize: 12,
            }}
          />
          <Tooltip
            cursor={{ stroke: "rgba(255,255,255,0.2)", strokeWidth: 2 }}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(15,23,42,0.95)",
              fontSize: "14px",
              fontWeight: "500",
            }}
            formatter={(value, name) => {
              if (name === "risk_score") return [`${value}%`, "Risk"];
              if (name === "count") return [value, "Open ports"];
              return [value, name];
            }}
            labelFormatter={(label) => `Service: ${String(label ?? "")}`}
          />
          <Scatter data={chartData} shape={renderPoint} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

function RiskTrendChart({ data }: { data: PortScanData }) {
  const { actualTheme } = useTheme();
  const colors = THEME_COLORS[actualTheme];

  const chartData = data.graph_data?.risk_trend || [];

  if (chartData.length === 0) {
    return (
      <div className="dr-chart-card dr-chart-card--clean">
        <div className="dr-chart-header">
          <h3 className="dr-chart-title">Risk Trend Analysis</h3>
        </div>
        <div className="dr-chart-placeholder">
          <p>No risk trend data available</p>
        </div>
      </div>
    );
  }

  const latestRisk = chartData[chartData.length - 1].risk_level;
  const previousRisk =
    chartData[chartData.length - 2]?.risk_level ?? latestRisk;
  const delta = latestRisk - previousRisk;
  const trendLabel =
    delta > 0 ? "Rising risk" : delta < 0 ? "Improving" : "Stable";
  const trendSymbol = delta > 0 ? "▲" : delta < 0 ? "▼" : "▶";
  const riskColor =
    latestRisk >= 75
      ? colors.danger
      : latestRisk >= 50
        ? colors.warning
        : colors.success;

  return (
    <div className="dr-chart-card dr-chart-card--clean">
      <div className="dr-chart-header">
        <div>
          <h3 className="dr-chart-title">Risk Trend Analysis</h3>
          <p className="dr-chart-meta">
            Directional risk movement for exposed services over time.
          </p>
        </div>
        <div className="dr-chart-summary">
          <div className="dr-chart-summary-item">
            <span className="dr-chart-summary-value">{latestRisk}%</span>
            <span className="dr-chart-summary-label">Current risk</span>
          </div>
          <div className="dr-chart-summary-item">
            <span
              className="dr-chart-summary-value"
              style={{ color: riskColor }}
            >
              {trendSymbol} {Math.abs(delta)}%
            </span>
            <span className="dr-chart-summary-label">{trendLabel}</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={360}>
        <AreaChart
          data={chartData}
          margin={{ top: 18, right: 18, left: -10, bottom: 8 }}
        >
          <defs>
            <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={colors.danger}
                stopOpacity={0.35}
              />
              <stop
                offset="95%"
                stopColor={colors.danger}
                stopOpacity={0.08}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.08)"
          />
          <XAxis
            dataKey="time"
            stroke="var(--muted)"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "var(--muted)" }}
            minTickGap={16}
          />
          <YAxis
            stroke="var(--muted)"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "var(--muted)" }}
            domain={[
              0,
              Math.max(...chartData.map((item) => item.risk_level)) + 10,
            ]}
          />
          <ReferenceLine
            y={75}
            stroke={colors.warning}
            strokeDasharray="4 4"
            label={{
              value: "High risk",
              position: "insideTopLeft",
              fill: "var(--muted)",
              fontSize: 12,
            }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(15,23,42,0.95)",
              fontSize: "14px",
              fontWeight: "500",
            }}
            formatter={(value: any) => `${value}%`}
          />
          <Area
            type="monotone"
            dataKey="risk_level"
            stroke={riskColor}
            fill="url(#riskGradient)"
            strokeWidth={3}
            dot={{ fill: riskColor, strokeWidth: 0, r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function DashboardTab({ data }: { data: PortScanData }) {
  return (
    <div className="dr-content">
      <section className="dr-panel dr-panel-wide dr-panel--clean">
        <div className="dr-section-header">
          <p className="dr-section-comment">Advanced Risk Dashboard</p>
          <div className="dr-section-stats">
            <div className="dr-section-stat">
              <span className="dr-section-stat-value">
                {data.graph_data.attack_surface.total_ports}
              </span>
              <span className="dr-section-stat-label">Total Ports</span>
            </div>
            <div className="dr-section-stat">
              <span className="dr-section-stat-value">
                {data.graph_data.attack_surface.open_ports}
              </span>
              <span className="dr-section-stat-label">Open Ports</span>
            </div>
            <div className="dr-section-stat">
              <span className="dr-section-stat-value">
                {data.ai_summary.risk_score}%
              </span>
              <span className="dr-section-stat-label">Risk Score</span>
            </div>
          </div>
        </div>
        <div className="dr-graph-grid-clean">
          <ServiceRiskChart data={data} />
          <RiskTrendChart data={data} />
        </div>
      </section>
    </div>
  );
}
