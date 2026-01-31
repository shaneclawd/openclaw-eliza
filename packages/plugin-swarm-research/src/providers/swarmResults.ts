import { Provider, IAgentRuntime, Memory, State } from "@elizaos/core";

export const swarmResultsProvider: Provider = {
  name: "swarm-results",
  description: "Provides access to recent swarm research results",

  get: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
    const coordinator = await runtime.getService("swarm-coordinator");
    if (!coordinator) {
      return null;
    }

    // Return recent research context if available
    const serviceState = coordinator.getState();
    if (serviceState?.activeResearches?.length > 0) {
      const [latestQueryId, latestTasks] = serviceState.activeResearches[serviceState.activeResearches.length - 1];
      const completedTasks = latestTasks.filter((t: any) => t.status === "completed");
      
      if (completedTasks.length > 0) {
        return {
          recentResearch: {
            queryId: latestQueryId,
            completedTasks: completedTasks.length,
            totalTasks: latestTasks.length,
            summary: completedTasks.map((t: any) => `[${t.source}]: ${t.result?.substring(0, 100)}...`).join("\n"),
          },
        };
      }
    }

    return null;
  },
};