import { NodeLayout } from "@/components/layouts";
import React from "react";

import { Node } from "reactflow";


export const Notification = (props: Node) => {
  return (
    <NodeLayout
    type="action"
     icon="bell"
      title="Notification"
      nodeProps={props}
 
    />
  );
};
