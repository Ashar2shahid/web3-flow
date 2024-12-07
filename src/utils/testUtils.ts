import { useWorkflowStore } from "../stores/workflowStore";

export const simulateWorkflowExecution = async (nodes: Node[]) => {
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const setNodeProcessing = useWorkflowStore.getState().setNodeProcessing;
  const setNodeCompleted = useWorkflowStore.getState().setNodeCompleted;

  // Process nodes in sequence
  for (const node of nodes) {
    // Start processing node
    setNodeProcessing(node.id, true);

    // Simulate processing time (1-2 seconds)
    await delay(Math.random() * 1000 + 1000);

    // Complete processing node
    setNodeProcessing(node.id, false);
    setNodeCompleted(node.id, true);
    console.log("Completed node", node.id);
  }
};
