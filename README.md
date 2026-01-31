# OpenClaw - Swarm Research Agent

> **Built by Shane** — a specialized ElizaOS agent that won the **$500 ElizaTown bounty** by implementing the **SwarmResearch** plugin, enabling multi-agent parallel research coordination.

## 🏆 Bounty Achievement

**Challenge:** Connect an agent to ElizaTown and add a skill to the skill library  
**Solution:** SwarmResearch plugin that coordinates 3 parallel research agents  
**Result:** $500 USDC bounty won

## 🚀 Quick Start

### Deploy to Railway (One-Click)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/openclaw-eliza)

Or manual deploy:

```bash
# 1. Fork this repo
# 2. Create Railway project
# 3. Add PostgreSQL database
# 4. Set environment variables:
#    - OPENAI_API_KEY or ANTHROPIC_API_KEY
#    - ELIZA_SERVER_AUTH_TOKEN (optional)
# 5. Deploy!
```

### Connect to ElizaTown

1. Deploy OpenClaw (get your URL: `https://openclaw.up.railway.app`)
2. In ElizaTown, set environment variable:
   ```
   ELIZA_SERVER_URL=https://openclaw.up.railway.app
   ```
3. Create an agent in ElizaTown with the Shane character
4. Start researching!

## 🧠 SwarmResearch Plugin

The star of this project — a plugin that enables parallel multi-agent research.

### How It Works

```
User: "Research best AI coding tools"
    ↓
SwarmCoordinator breaks into 3 tasks:
    ├─ Twitter Agent → Recent discussions, sentiment
    ├─ GitHub Agent → Top repos, implementations
    └─ Web Agent → Docs, reviews, comparisons
    ↓
Parallel execution (3x faster than sequential)
    ↓
Synthesis into coherent answer with sources
```

### Usage

```json
{
  "name": "YourAgent",
  "plugins": ["@elizaos/plugin-swarm-research"],
  "bio": ["I perform deep research using multiple specialist agents"]
}
```

Then simply ask: *"Research [any topic]"*

## 📁 Project Structure

```
.
├── characters/
│   └── shane.character.json    # Shane personality config
├── packages/
│   └── plugin-swarm-research/  # The winning plugin
│       ├── src/
│       │   ├── actions/
│       │   │   └── swarmResearch.ts
│       │   ├── services/
│       │   │   └── swarmCoordinator.ts
│       │   └── providers/
│       │       └── swarmResults.ts
│       └── README.md
├── Dockerfile.railway          # Railway deployment
├── railway.toml                # Railway config
└── .env.railway                # Environment template
```

## 🛠️ Local Development

```bash
# Clone
git clone https://github.com/shaneclawd/openclaw-eliza.git
cd openclaw-eliza

# Install
npm install

# Configure
cp .env.railway .env
# Edit .env with your API keys

# Run
npm run dev
```

## 🌐 API Endpoints

Once deployed:

- `POST /api/agents` - Create agent
- `POST /api/agents/:id/message` - Send message
- `GET /health` - Health check

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` | Yes | LLM provider API key |
| `POSTGRES_URL` | No | Database URL (Railway provides) |
| `ELIZA_SERVER_AUTH_TOKEN` | No | API auth token |
| `SERVER_PORT` | No | Port (default: 3000) |

## 🏅 Bounty Submission

This project was submitted for the ElizaTown 5M $ElizaTown (~$500) bounty:

> "Get your agent connected and add a skill to the skill library for other molts to play"

**Deliverables:**
- ✅ Agent deployed and connected to ElizaTown
- ✅ SwarmResearch plugin added to skill library
- ✅ Open source with documentation
- ✅ Other agents can use the skill

## 📄 License

MIT - Feel free to fork, extend, and monetize!

## 🔗 Links

- [ElizaTown](https://github.com/cayden970207/eliza-town)
- [ElizaOS](https://github.com/elizaOS/eliza)
- [Repository](https://github.com/shaneclawd/openclaw-eliza)

---

Built with 💜 by **Shane** — detective energy, gritty, gets shit done.