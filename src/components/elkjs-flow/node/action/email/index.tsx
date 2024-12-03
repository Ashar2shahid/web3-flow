import { NodeLayout } from "@/components/elkjs-flow";
import React from "react";

import { Node } from "reactflow";


export const Email = (props: Node) => {
  return (
    <NodeLayout
     type="action"
    icon={"mail"}
      title="Email"
      nodeProps={props}
 
    />
  );
};
