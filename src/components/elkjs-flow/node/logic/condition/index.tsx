import { NodeLayout } from "@/components/elkjs-flow";
import React from "react";

import { Node } from "reactflow";


export const Condition = (props: Node) => {
  return (
    <NodeLayout
      title="Conditional Split"
      type="condition"
      icon="condition"
      nodeProps={props}
 
    />
  );
};
