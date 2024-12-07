import React from "react";
import { EdgeProps, getSmoothStepPath } from "reactflow";

export default function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        strokeWidth={4}
        stroke="#60a5fa"
        strokeOpacity={0.2}
      />
      <path
        className="react-flow__edge-path animate-flow"
        d={edgePath}
        strokeWidth={2}
        stroke="#2563eb"
        fill="red"
        strokeDasharray="12"
        strokeDashoffset="0"
        style={{
          filter: "drop-shadow(0 0 1px hsla(225, 83%, 58%, 0.750))",
        }}
      />
    </>
  );
}
