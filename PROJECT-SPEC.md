Problem Statement

Cloud environments are becoming increasingly complex, making it difficult for engineers to understand infrastructure designs, identify inefficient resource usage, and detect potential cost leaks from architecture diagrams and monitoring dashboards.

Current approaches require manual analysis by cloud architects and DevOps engineers, which is time-consuming and error-prone.

There is a need for an intelligent system that can automatically interpret cloud infrastructure visuals and provide actionable recommendations.

Proposed Solution

GreenOps AI allows users to upload:

Azure architecture diagrams
AWS architecture diagrams
GCP architecture diagrams
Monitoring dashboard screenshots
Infrastructure screenshots

The platform automatically:

Infrastructure Detection

Identifies:

Virtual Machines
Load Balancers
Databases
Storage Accounts
Kubernetes Clusters
VNets
API Gateways
Architecture Understanding

Generates:

Architecture summary
Resource dependency mapping
Data flow explanation
Cost Optimization

Detects:

Overprovisioned VMs
Idle resources
Redundant services
Expensive architecture patterns

Generates:

Estimated savings
Optimization recommendations
Security Analysis

Flags:

Publicly exposed resources
Missing network segmentation
Potential architecture weaknesses
Why Recruiters Will Like It

This project combines:

Computer Vision
OCR
Cloud Computing
DevOps
AI
Full Stack Development
System Design

Most student projects stop at object detection.

This project demonstrates engineering thinking.

System Architecture
User Upload
      │
      ▼
Image Processing
(OpenCV)
      │
      ▼
OCR Extraction
(EasyOCR)
      │
      ▼
Diagram Element Detection
(YOLO)
      │
      ▼
Infrastructure Parser
      │
      ▼
LLM Analysis Engine
(GPT/Gemini)
      │
      ▼
Cost + Security Recommendations
      │
      ▼
React Dashboard


Tech Stack
Frontend
React
Tailwind CSS
Recharts
Backend
FastAPI
Computer Vision
OpenCV
YOLOv8
OCR
EasyOCR
AI
Gemini API
Database
PostgreSQL


Deployment
Frontend

Use:
Vercel

Backend

Use:
Render

Database

Use:
Neon Postgres

# day1
Problem

Cloud engineers struggle to understand architecture diagrams and identify cost/security issues manually.

Input
PNG
JPG
JPEG

Examples:

Azure Architecture Diagram
AWS Architecture Diagram
Monitoring Dashboard Screenshot
Output

For MVP:

Uploaded Successfully

Image Name:
architecture.png

Image Size:
1.2 MB

Later:

Detected Resources
Cost Suggestions
Security Insights