import { Node } from "reactflow";
import { useWorkflowStore } from "../stores/workflowStore";

interface MockWorkflowStatus {
  id: string;
  nodes: {
    id: string;
    status: "completed" | "running" | null;
  }[];
  status: "running" | "completed" | "failed";
}

export const simulateWorkflowExecution = async (nodes: Node[]) => {
  const mockWorkflowId = crypto.randomUUID();
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Create mock workflow status
  const createMockStatus = (currentNodeIndex: number): MockWorkflowStatus => ({
    id: mockWorkflowId,
    nodes: nodes.map((node, index) => ({
      id: node.id,
      status:
        index < currentNodeIndex
          ? "completed"
          : index === currentNodeIndex
          ? "running"
          : null,
    })),
    status: currentNodeIndex >= nodes.length ? "completed" : "running",
  });

  const setNodeProcessing = useWorkflowStore.getState().setNodeProcessing;
  const setNodeCompleted = useWorkflowStore.getState().setNodeCompleted;

  // Process nodes in sequence
  for (let i = 0; i < nodes.length; i++) {
    const status = createMockStatus(i);

    // Update node statuses based on mock status
    status.nodes.forEach((node) => {
      if (node.status === "running") {
        setNodeProcessing(node.id, true);
      } else if (node.status === "completed") {
        setNodeProcessing(node.id, false);
        setNodeCompleted(node.id, true);
      }
    });

    // Simulate processing time (1-2 seconds)
    await delay(Math.random() * 1000 + 1000);
  }

  // Final status update
  const finalStatus = createMockStatus(nodes.length);
  finalStatus.nodes.forEach((node) => {
    setNodeProcessing(node.id, false);
    setNodeCompleted(node.id, true);
  });
};
