import { NodeLayout } from "@/components/elkjs-flow";
import React from "react";

import { Node } from "reactflow";


export const Delay = (props: Node) => {
  return (
    <NodeLayout
    icon="clock"
     type="logic"
      title="Time Delay"
      nodeProps={props}
 
    />
  );
};
