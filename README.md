# Vector Prime | Intelligent RFP Agent 🚀
### EY Techathon 6.0 Submission - Team Vector Prime

**Autonomous B2B Proposal Response System for Asian Paints**

![Status](https://img.shields.io/badge/Status-Prototype%20Ready-success)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20FastAPI%20%7C%20AI-blue)

## 📖 Executive Summary
The industrial manufacturing sector faces a critical bottleneck: manual RFP qualification and technical matching. This process typically takes **2-3 weeks**, leading to missed deadlines and lost revenue.

**Vector Prime** is an Agentic AI solution that automates this workflow. It reduces response time to **18 hours** and improves technical matching accuracy to **90%+**, transforming the bidding process from a bottleneck into a competitive advantage.

## ✨ Key Features (Prototype)
* **🕵️ Automated Discovery (Inbox):** Simulates a web scraper monitoring 50+ tender portals to qualify leads automatically.
* **🧠 AI Spec Extraction:** Uses LLMs to read unstructured PDF documents and extract critical technical requirements (e.g., "Waterproofing", "10-Year Warranty").
* **🎯 Intelligent SKU Matching:** Maps requirements to the Asian Paints product catalog using vector logic to find the perfect product match.
* **💰 Dynamic Pricing:** Automatically calculates the Bill of Materials (BOM) and estimated project value.
* **📊 Business Analytics:** Visualizes the impact on Win Rate and Processing Time.

## 🛠️ Technology Stack
* **Frontend:** React.js, Tailwind CSS, Framer Motion, Recharts.
* **Backend:** Python FastAPI.
* **AI/LLM:** OpenAI GPT-4 / Gemini (Simulation Mode enabled for demo stability).
* **Data:** JSON Mock Database (Simulating MongoDB/PostgreSQL architecture).

## 💻 Installation & Setup
Follow these steps to run the prototype locally.

### Prerequisites
* Node.js & npm
* Python 3.8+

---

### 1. Backend Setup (The Brain)
**Open a terminal** in the root directory:

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run Server
python main.py
```

2. Frontend Setup: 
Open a NEW terminal (keep the backend terminal running):
```bash
cd frontend

# Install libraries
npm install

# Run App
npm run dev

