import { Service, IAgentRuntime, ServiceType } from "@elizaos/core";

interface SwarmTask {
  id: string;
  query: string;
  source: string;
  status: string;
  result?: string;
  timestamp: number;
}

export class SwarmCoordinatorService extends Service {
  static serviceType: ServiceType = "swarm-coordinator" as ServiceType;
  private activeResearches: Map<string, SwarmTask[]> = new Map();

  async initialize(runtime: IAgentRuntime): Promise<void> {
    this.runtime = runtime;
  }

  async startResearch(queryId: string, tasks: SwarmTask[]): Promise<void> {
    this.activeResearches.set(queryId, tasks);
  }

  async updateTask(queryId: string, taskId: string, result: string): Promise<void> {
    const tasks = this.activeResearches.get(queryId);
    if (tasks) {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        task.result = result;
        task.status = "completed";
      }
    }
  }

  async getResults(queryId: string): Promise<SwarmTask[]> {
    return this.activeResearches.get(queryId) || [];
  }

  getState(): any {
    return {
      activeResearches: Array.from(this.activeResearches.entries()),
    };
  }
}