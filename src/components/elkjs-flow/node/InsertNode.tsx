import { NodeData } from "@/types";
import React, { FC } from "react";
import { Handle, Node, NodeProps, Position } from "reactflow";


export const InsertNode: FC<Node<NodeData>> = ({
  id,
  data: { disabled },
}) => {
  return (
    <div
      className={`relative w-[260px] h-[80px] rounded-lg border-2 border-dashed flex justify-center items-center !border-[#6366F1] !bg-[#E0E7FF] ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onDragOver={(e) => {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }}
    >
      <Handle
        position={Position.Top}
        type="target"
     
        className="!min-h-[1px] !h-[1px] !top-[1px] !opacity-0 !border-0 pointer-events-none cursor-default"
      />

      <Handle
        position={Position.Bottom}
        type="source"
 
        className="!min-h-[1px] !h-[1px] !bottom-[1px] !opacity-0 !border-0 !pointer-events-none !cursor-default"
      />
  
    </div>
  );
};
