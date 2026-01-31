import { Plugin } from "@elizaos/core";
import swarmResearchAction from "./actions/swarmResearch";
import { swarmResultsProvider } from "./providers/swarmResults";
import { SwarmCoordinatorService } from "./services/swarmCoordinator";

export const swarmResearchPlugin: Plugin = {
  name: "swarm-research",
  description: "Multi-agent swarm research coordination",
  actions: [swarmResearchAction],
  providers: [swarmResultsProvider],
  services: [SwarmCoordinatorService],
};

export default swarmResearchPlugin;