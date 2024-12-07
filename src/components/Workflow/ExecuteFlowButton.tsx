import React from "react";
import { Play, TestTube } from "lucide-react";
import { Panel } from "reactflow";
import { useWorkflowStore } from "../../stores/workflowStore";
import { executeWorkflow } from "../../utils/apiUtils";
import { simulateWorkflowExecution } from "../../utils/testUtils";

// WebSocket Integration Guide:
// 1. Connect to WebSocket when workflow execution starts
// 2. Listen for events from the server:
//
// Event format examples:
// {
//   type: "NODE_PROCESSING",
//   nodeId: "node-123",
//   status: true | false
// }
// {
//   type: "NODE_COMPLETED",
//   nodeId: "node-123",
//   status: true | false
// }
//
// Usage with workflowStore:
// socket.on("message", (event) => {
//   const data = JSON.parse(event.data);
//   if (data.type === "NODE_PROCESSING") {
//     workflowStore.setNodeProcessing(data.nodeId, data.status);
//   }
//   if (data.type === "NODE_COMPLETED") {
//     workflowStore.setNodeCompleted(data.nodeId, data.status);
//   }
// });

export default function ExecuteFlowButton() {
  const { nodes, edges } = useWorkflowStore();
  const [isExecuting, setIsExecuting] = React.useState(false);

  const handleExecute = async (
    e: React.MouseEvent,
    isTest: boolean = false
  ) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsExecuting(true);

      if (isTest) {
        await simulateWorkflowExecution(nodes);
      } else {
        // When implementing real execution:
        // 1. Connect to WebSocket
        // 2. Send workflow data to backend
        // 3. Listen for node status updates
        // 4. Clean up WebSocket on completion
        await executeWorkflow({ nodes, edges });
      }
    } catch (error) {
      console.error("Failed to execute workflow:", error);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Panel position="bottom-center">
      <div className="flex gap-2">
        <button
          onClick={(e) => handleExecute(e, false)}
          disabled={isExecuting}
          className="px-6 py-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-5 h-5" />
          {isExecuting ? "Executing..." : "Execute Flow"}
        </button>

        <button
          onClick={(e) => handleExecute(e, true)}
          disabled={isExecuting}
          className="px-6 py-3 bg-secondary-600 text-white rounded-full shadow-lg hover:bg-secondary-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <TestTube className="w-5 h-5" />
          Test Flow
        </button>
      </div>
    </Panel>
  );
}
