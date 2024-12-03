import { NodeLayout } from "@/components/layouts";
import React from "react";

import { Node } from "reactflow";


export const SMS = (props: Node) => {
  return (
    <NodeLayout
      type="action"
      icon="message"
      title="SMS"
      nodeProps={props}
 
    />
  );
};
