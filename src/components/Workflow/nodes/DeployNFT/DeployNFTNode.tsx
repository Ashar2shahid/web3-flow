import React, { memo } from "react";
import { NodeProps } from "reactflow";
import { Image } from "lucide-react";
import BaseNode, { Port } from "../Base/BaseNode";

function DeployNFTNode({ data, ...props }: NodeProps) {
  return <BaseNode data={data} icon={Image} {...props} />;
}

export default memo(DeployNFTNode);
