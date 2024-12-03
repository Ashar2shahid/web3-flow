import { useFlow } from "@/hooks/useFlow";
import { useNodeDataChange } from "@/hooks/useUpdateNode";
import { useGlobalStore } from "@/store/use-global-store";
import { NodeData, NodeType } from "@/types";
import { camelCase } from "lodash";
import React, { DragEvent, FC, useState } from "react";
import { Handle, Node, NodeProps, Position, getOutgoers } from "reactflow";

export const EmptyNode: FC<Node<NodeData>> = ({
  // isConnectable,
  id,
  data: { disabled },
}) => {
  const [isDropzoneActive, setDropzoneActive] = useState<boolean>(false);
 const {setDragOn}=useGlobalStore()
  const onDrop = () => {
    setDropzoneActive(false);
    setDragOn(false)
  };



  const onDragOver = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
 
  };

  const onDragEnter = () => {
    setDropzoneActive(true);

  };

  const onDragLeave = () => {
    setDropzoneActive(false);

  };

  return (
    <div className=" w-[400px]  bg-transparent">
    <div
      className={`  border-2 border-dashed border-[#9CA3AF] w-full relative  py-8 bg-white rounded-md flex justify-center items-center ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } `}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
    >
      <Handle
        position={Position.Top}
        type="target"
        isConnectable={true}
        className="!min-h-[1px] !h-[1px] !top-[1px] !opacity-0 !border-0 pointer-events-none cursor-default"
      />

      <h4>End Node</h4>

      <Handle
        position={Position.Bottom}
        type="source"
        isConnectable={true}
        className="!min-h-[1px] !h-[1px] !bottom-[1px] !opacity-0 !border-0 !pointer-events-none !cursor-default"
      />
    </div>
    </div>
  );
};
