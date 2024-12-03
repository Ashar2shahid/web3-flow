import { NodeData } from "@/types";
import React, { FC } from "react";
import { Handle, Node, NodeProps, Position } from "reactflow";

export const StartNode: FC<Node<NodeData>> = ({
  id,
  selected,
  data: { disabled },
}) => {
  return (

    <div className=" w-[400px] h-[100px]  bg-transparent">
    
    <div
      className={`w-full relative py-8 h-full bg-white rounded-md flex justify-center items-center ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${selected ? "border-2 border-[#6366F1]" : "border border-[#E5E7EB]"}`}
    >
      
      <div className="font-medium font-inter text-[16px] leading-[22px]">
        Start
      </div>
      <Handle
        position={Position.Bottom}
        type="source"
        className="!min-h-[1px] !z-[999] !h-[1px] !bottom-[1px] !opacity-0 !border-0 pointer-events-none cursor-default"
      />
    </div>
    </div>
  );
};
