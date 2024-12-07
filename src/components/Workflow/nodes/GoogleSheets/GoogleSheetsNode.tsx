import React, { memo } from "react";
import { NodeProps } from "reactflow";
import { File } from "lucide-react";
import BaseNode, { Port } from "../Base/BaseNode";

const inputs: Port[] = [{ id: "input", label: "Input", type: "input" }];

const outputs: Port[] = [
  {
    id: "done",
    label: "Done",
    type: "output",
    style: { backgroundColor: "#22c55e" },
  },
  {
    id: "loop",
    label: "Loop",
    type: "output",
    style: { backgroundColor: "#6366f1" },
  },
];

function GoogleSheetsNode({ data, ...props }: NodeProps) {
  return <BaseNode data={data} icon={File} {...props} />;
}

export default memo(GoogleSheetsNode);
