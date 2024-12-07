import React, { memo } from "react";
import { NodeProps } from "reactflow";
import { Clock, Webhook, Blocks } from "lucide-react";
import { TriggerType } from "../../../../types/workflow";
import BaseNode from "../Base/BaseNode";

const iconMap: Record<TriggerType, React.ElementType> = {
  cronjob: Clock,
  webhook: Webhook,
  onchain: Blocks,
};

function StartNode({ data, ...props }: NodeProps) {
  const trigger = data.trigger;
  const Icon = trigger ? iconMap[trigger.type] : Clock;

  return (
    <BaseNode
      data={data}
      icon={Icon}
      outputs={[{ id: "default", label: "", type: "output" }]}
      inputs={[]}
      {...props}
    />
  );
}

export default memo(StartNode);
