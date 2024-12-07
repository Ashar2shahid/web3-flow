import { Node, Edge } from "reactflow";
import { executeWorkflow, getWorkflowStatus } from "../utils/apiUtils";

interface WorkflowPayload {
  nodes: Node[];
  edges: Edge[];
}

interface WorkflowStore {
  setNodeProcessing: (nodeId: string, isProcessing: boolean) => void;
  setNodeCompleted: (nodeId: string, isCompleted: boolean) => void;
}

interface WorkflowExecutionCallbacks {
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export async function executeAndPollWorkflow(
  payload: WorkflowPayload,
  store: WorkflowStore,
  callbacks?: WorkflowExecutionCallbacks
): Promise<() => void> {
  let pollInterval: any;

  try {
    // Start workflow execution
    const workflowId = await executeWorkflow(payload);

    // Create polling function
    const pollWorkflowStatus = async () => {
      try {
        const status = await getWorkflowStatus(workflowId);

        // Update node statuses
        status.nodes.forEach((node) => {
          if (node.status === "running") {
            store.setNodeProcessing(node.id, true);
          } else if (node.status === "completed") {
            store.setNodeCompleted(node.id, true);
          }
        });

        // Stop polling if workflow is complete or failed
        if (status.status !== "running") {
          clearInterval(pollInterval);
          callbacks?.onComplete?.();
        }
      } catch (error) {
        clearInterval(pollInterval);
        callbacks?.onError?.(
          error instanceof Error
            ? error
            : new Error("Failed to fetch workflow status")
        );
      }
    };

    // Start polling
    pollInterval = setInterval(pollWorkflowStatus, 1000);

    // Return cleanup function
    return () => clearInterval(pollInterval);
  } catch (error) {
    callbacks?.onError?.(
      error instanceof Error ? error : new Error("Failed to execute workflow")
    );
    return () => {}; // Return empty cleanup function if execution fails
  }
}
