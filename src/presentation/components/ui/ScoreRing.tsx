import type { CSSProperties, ReactNode } from "react";

type ScoreRingProps = {
  score: number;
  label: string;
  children?: ReactNode;
};

export function ScoreRing({ score, label, children }: ScoreRingProps) {
  const style = { "--score": score } as CSSProperties;

  return (
    <div className="dr-score-ring" style={style}>
      <span>{score}%</span>
      <small>{label}</small>
      {children}
    </div>
  );
}
