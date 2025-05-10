# SecondMemory.ai

Build a smart, enduring knowledge base for your workstream with deeply integrated, context‑aware AI assistance.

Imagine having a second brain – a tireless, context‑aware assistant that can effortlessly tap into your knowledge, generate code, and even debug your projects. SecondMemory.ai isn't just another AI tool; it's your personalized cognitive companion, designed to augment your abilities and streamline your workflow.

* **Intelligent Knowledge Retrieval**:
  A production-ready Multi‑Agent Retrieval‑Augmented Generation (RAG) solution built with LangChain and a highly efficient FAISS DB. Experience a 30% improvement in query efficiency as SecondMemory.ai swiftly surfaces the information you need.
  Upload and build your custom knowledge base using PDF files, websites, and also leverage our in‑built intelligent memory drawn from a pool of research papers from arXiv and Wikipedia.
  SecondMemory.ai also searches YouTube and brings you the best videos on your subject.

* **Autonomous Agent Collaboration**:
  SecondMemory.ai harnesses the collaborative power of AI agents and RAG to model intelligent agents that can autonomously tackle complex tasks. Imagine agents that can:

  * **Code‑Generation Alchemist**: Automatically generate code snippets based on your specifications. Just upload your code to our in‑built code‑editor space to start debugging, generating code, or talking to your own codebase.
  * **Web Researcher**: Seamlessly integrate web‑search capabilities (powered by Serper) to gather real‑time information and enrich responses.

* **Deeply Integrated, Context‑Aware Assistance**:
  SecondMemory.ai isn’t just retrieving information; it understands the context of your requests. It can even:

  * **Automated Code Cloning & Response**: Triggered within a Lambda instance, it can clone relevant code and generate insightful responses within your cloud environment.
  * **Optimized Vector Embeddings**: We’ve fine‑tuned vector‑embedding creation, achieving a 40% optimization through:

    * **Cosine Similarity Search**: Ensuring highly relevant information retrieval.
    * **Content‑Based Segmentation**: Breaking down your knowledge into meaningful chunks for more precise analysis.

---

## Backend, RAG, and AI Agent Repositories

| Feature                   | GitHub Repo                                                                                                                                 | Description                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Multisource RAG**       | [https://github.com/pratyushdev-codes/Secondmemory.ai\_MultisourceRAG](https://github.com/pratyushdev-codes/Secondmemory.ai_MultisourceRAG) | Multi‑source Retrieval‑Augmented Generation Python backend for querying user documents. |
| **Code Database QA**      | [https://github.com/pratyushdev-codes/SecondMemory.ai\_CodeQA](https://github.com/pratyushdev-codes/SecondMemory.ai_CodeQA)                 | Backend for Code‑Querying Agent                                                         |
| **Code Generation Agent** | [https://github.com/pratyushdev-codes/Secondmemory.ai\_CodeGenAgent](https://github.com/pratyushdev-codes/Secondmemory.ai_CodeGenAgent)     | Deeply integrated code‑generation agent using Crew AI and Serper API                    |
| **Browser Extension**     | [https://github.com/pratyushdev-codes/SecondMemory.ai\_Extension](https://github.com/pratyushdev-codes/SecondMemory.ai_Extension)           | Browser extension for saving or bookmarking websites directly into your knowledge base  |

---

### Tech Stack

Python, LangChain, Crew AI, ChromaDB, FAISS DB, React.js, Firebase, CRON, Onrender
