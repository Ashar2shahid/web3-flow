import React from "react";
import { Play, TestTube } from "lucide-react";
import { Panel } from "reactflow";
import { useWorkflowStore } from "../../stores/workflowStore";
import { executeWorkflow } from "../../utils/apiUtils";
import { simulateWorkflowExecution } from "../../utils/testUtils";
import { executeAndPollWorkflow } from "../../services/workflowExecutionService";

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
  const { nodes, edges, setNodeProcessing, setNodeCompleted } =
    useWorkflowStore();
  const [isExecuting, setIsExecuting] = React.useState(false);
  const cleanupRef = React.useRef<(() => void) | null>(null);

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
        setIsExecuting(false);
      } else {
        // Cleanup previous execution if exists
        if (cleanupRef.current) {
          cleanupRef.current();
        }

        // Start new execution
        cleanupRef.current = await executeAndPollWorkflow(
          { nodes, edges },
          { setNodeProcessing, setNodeCompleted },
          {
            onComplete: () => {
              setIsExecuting(false);
              cleanupRef.current = null;
            },
            onError: (error) => {
              console.error("Failed to execute workflow:", error);
              setIsExecuting(false);
              cleanupRef.current = null;
            },
          }
        );
      }
    } catch (error) {
      console.error("Failed to execute workflow:", error);
      setIsExecuting(false);
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

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
