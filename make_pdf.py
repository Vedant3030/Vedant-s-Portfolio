import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

pdf_path = r"c:\Users\Vedant\Desktop\my portfolio site\resume.pdf"

doc = SimpleDocTemplate(
    pdf_path,
    pagesize=letter,
    leftMargin=32,
    rightMargin=32,
    topMargin=24,
    bottomMargin=24
)

styles = getSampleStyleSheet()

primary_color = colors.HexColor("#1e293b")
accent_color = colors.HexColor("#4f46e5")
muted_color = colors.HexColor("#475569")

name_style = ParagraphStyle(
    'NameStyle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=18,
    leading=20,
    textColor=primary_color,
    alignment=TA_LEFT
)

contact_style = ParagraphStyle(
    'ContactStyle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8,
    leading=10,
    textColor=muted_color,
    alignment=TA_LEFT
)

summary_style = ParagraphStyle(
    'SummaryStyle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8,
    leading=10.8,
    textColor=colors.HexColor("#334155")
)

sec_title_style = ParagraphStyle(
    'SecTitleStyle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=9.5,
    leading=11,
    textColor=primary_color
)

item_title_style = ParagraphStyle(
    'ItemTitleStyle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=8.5,
    leading=10.5,
    textColor=primary_color
)

right_date_style = ParagraphStyle(
    'RightDateStyle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8,
    leading=10,
    textColor=muted_color,
    alignment=TA_RIGHT
)

bullet_style = ParagraphStyle(
    'BulletStyle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=7.8,
    leading=10.2,
    textColor=colors.HexColor("#334155"),
    leftIndent=10,
    firstLineIndent=-6
)

tech_style = ParagraphStyle(
    'TechStyle',
    parent=styles['Normal'],
    fontName='Helvetica-Oblique',
    fontSize=7.5,
    leading=9.5,
    textColor=accent_color,
    leftIndent=10
)

skill_cat_style = ParagraphStyle(
    'SkillCatStyle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8,
    leading=10.5,
    textColor=colors.HexColor("#1e293b")
)

story = []

# Header
story.append(Paragraph("VEDANT BHOSALE", name_style))
story.append(Spacer(1, 2))

contact_text = "bhosalevedant2004@gmail.com  |  +91 8080953096  |  linkedin.com/in/vedant-bhosale-0a483b2a9  |  github.com/Vedant3030  |  vedant-bhosale.resumex.dev"
story.append(Paragraph(contact_text, contact_style))
story.append(Spacer(1, 4))

summary_text = "Computer Engineering graduate focused on backend engineering, AI/computer vision, and full-stack product development. Experience shipping a production-style SaaS (PulseCheck), building applied computer-vision systems, and prototyping RAG/agentic pipelines. Comfortable across the stack from infra (Docker, Redis, background workers) to model integration."
story.append(Paragraph(summary_text, summary_style))
story.append(Spacer(1, 4))

def add_section_header(title):
    story.append(Paragraph(title, sec_title_style))
    story.append(Spacer(1, 1))
    story.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor("#cbd5e1"), spaceBefore=1, spaceAfter=4))

# EXPERIENCE
add_section_header("EXPERIENCE")

# Exp 1
t1 = Paragraph("<b>VR Development Intern</b> — Firebird VR", item_title_style)
d1 = Paragraph("Jun 2025 – Aug 2025", right_date_style)
tbl1 = Table([[t1, d1]], colWidths=[400, 148])
tbl1.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0), ('BOTTOMPADDING', (0,0), (-1,-1), 0), ('TOPPADDING', (0,0), (-1,-1), 0)]))
story.append(tbl1)
story.append(Paragraph("• Contributed to VR application development as part of a college-placement internship cohort — worked on scene design, VR interaction logic, and Unity build/testing workflows.", bullet_style))
story.append(Spacer(1, 3))

# Exp 2
t2 = Paragraph("<b>Research Assistant</b> — College Faculty Project", item_title_style)
d2 = Paragraph("01/2025 – 05/2025", right_date_style)
tbl2 = Table([[t2, d2]], colWidths=[400, 148])
tbl2.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0), ('BOTTOMPADDING', (0,0), (-1,-1), 0), ('TOPPADDING', (0,0), (-1,-1), 0)]))
story.append(tbl2)
story.append(Paragraph("• Applied statistical methods to identify anomalies and outliers across datasets of 5 lakh+ entries using Python.", bullet_style))
story.append(Spacer(1, 5))

# PROJECTS
add_section_header("PROJECTS")

# PulseCheck
story.append(Paragraph("<b>PulseCheck — Full-Stack Uptime Monitoring SaaS</b>", item_title_style))
story.append(Paragraph("• Built and deployed a full-stack SaaS that monitors website uptime in real time, sends email alerts on downtime, and publishes public status pages.", bullet_style))
story.append(Paragraph("• Built a Node.js/Express + PostgreSQL (Prisma) API with JWT auth and ownership-scoped CRUD for monitors.", bullet_style))
story.append(Paragraph("• Architected a BullMQ/Redis background worker for scheduled per-monitor health checks with automatic email alerts via Resend on status change.", bullet_style))
story.append(Paragraph("• Developed a Next.js + Tailwind frontend with a custom real-time ICU/heartbeat visual theme.", bullet_style))
story.append(Paragraph("• Containerized all services with Docker and deployed to Render (API, worker, frontend as independent services).", bullet_style))
story.append(Paragraph("<i>Node.js · Express · PostgreSQL · Prisma · Redis · BullMQ · Next.js · Docker</i>", tech_style))
story.append(Spacer(1, 4))

# Veridex
t_v = Paragraph("<b>Veridex — Digital Identity & Document Verification Platform</b>", item_title_style)
d_v = Paragraph("<i>In Progress</i>", right_date_style)
tbl_v = Table([[t_v, d_v]], colWidths=[430, 118])
tbl_v.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0), ('BOTTOMPADDING', (0,0), (-1,-1), 0), ('TOPPADDING', (0,0), (-1,-1), 0)]))
story.append(tbl_v)
story.append(Paragraph("• Building a general-purpose identity/document verification pipeline: document classification → OCR field extraction → face match → confidence scoring → audit trail.", bullet_style))
story.append(Paragraph("• Currently at v1 prototype stage (single document type, core OCR fields, functional face-match) with API-only output.", bullet_style))
story.append(Paragraph("<i>InsightFace · YOLOv8 · FastAPI · PostgreSQL · OpenCV</i>", tech_style))
story.append(Spacer(1, 4))

# EDU-VISION
story.append(Paragraph("<b>EDU-VISION: AI-Powered Attendance System — Final Year Project</b>", item_title_style))
story.append(Paragraph("• Developed an AI-based smart classroom management system using facial recognition to automate attendance, reduce proxy entries, and provide attendance analytics through a secure web application.", bullet_style))
story.append(Paragraph("<i>Python · OpenCV · FastAPI · PostgreSQL · React.js · Git · Computer Vision</i>", tech_style))
story.append(Spacer(1, 4))

# Docs Q&A Agent
story.append(Paragraph("<b>Internal Docs Q&A Agent — AI Agent Hackathon (2025)</b>", item_title_style))
story.append(Paragraph("• Prototyped an AI-powered assistant to answer queries from internal documents during a 48-hour hackathon; built a working Q&A pipeline with semantic search and live demo deployment.", bullet_style))
story.append(Paragraph("• Learned fundamentals of RAG workflows, vector search, and AI-powered document retrieval.", bullet_style))
story.append(Paragraph("<i>LangChain · FAISS · Hugging Face · Gemini API · Streamlit</i>", tech_style))
story.append(Spacer(1, 4))

# VR Experience
story.append(Paragraph("<b>VR Experience — Qubits & Schrödinger's Cat (6th Semester Project)</b>", item_title_style))
story.append(Paragraph("• Built an educational VR project in Unity to simplify quantum computing concepts for learners; designed an interactive 3-scene experience (classroom intro, superposition demo, entanglement demo) with Meta XR SDK for UI, audio, and VR controls.", bullet_style))
story.append(Paragraph("<i>Unity · Meta XR SDK</i>", tech_style))
story.append(Spacer(1, 5))

# EDUCATION
add_section_header("EDUCATION")

# Edu 1
e1_t = Paragraph("<b>Wadia College of Engineering (MESWCOE), Pune</b> — Savitribai Phule Pune University", item_title_style)
e1_d = Paragraph("2022 – 2026", right_date_style)
tbl_e1 = Table([[e1_t, e1_d]], colWidths=[430, 118])
tbl_e1.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0), ('BOTTOMPADDING', (0,0), (-1,-1), 0), ('TOPPADDING', (0,0), (-1,-1), 0)]))
story.append(tbl_e1)
story.append(Paragraph("Bachelor of Engineering in Computer Engineering | <b>CGPA: 8.10</b>", ParagraphStyle('SubEdu', parent=styles['Normal'], fontSize=7.8, leading=9.5, textColor=muted_color)))
story.append(Spacer(1, 2))

# Edu 2
e2_t = Paragraph("<b>Sou Vimalabai Garware Jr. College, Pune</b>", item_title_style)
e2_d = Paragraph("2022", right_date_style)
tbl_e2 = Table([[e2_t, e2_d]], colWidths=[430, 118])
tbl_e2.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0), ('BOTTOMPADDING', (0,0), (-1,-1), 0), ('TOPPADDING', (0,0), (-1,-1), 0)]))
story.append(tbl_e2)
story.append(Paragraph("Higher Secondary Education (HSC) | <b>71.82%</b>", ParagraphStyle('SubEdu2', parent=styles['Normal'], fontSize=7.8, leading=9.5, textColor=muted_color)))
story.append(Spacer(1, 2))

# Edu 3
e3_t = Paragraph("<b>Genba Sopanrao Moze School, Pune</b>", item_title_style)
e3_d = Paragraph("2020", right_date_style)
tbl_e3 = Table([[e3_t, e3_d]], colWidths=[430, 118])
tbl_e3.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0), ('BOTTOMPADDING', (0,0), (-1,-1), 0), ('TOPPADDING', (0,0), (-1,-1), 0)]))
story.append(tbl_e3)
story.append(Paragraph("Secondary Education (SSC) | <b>92.60%</b>", ParagraphStyle('SubEdu3', parent=styles['Normal'], fontSize=7.8, leading=9.5, textColor=muted_color)))
story.append(Spacer(1, 5))

# SKILLS
add_section_header("SKILLS")
skills_p = """
<b>Languages:</b> Python, Java, JavaScript (Node, Express, React), SQL &nbsp;|&nbsp; <b>Backend:</b> FastAPI, REST APIs<br/>
<b>Databases:</b> MySQL, PostgreSQL &nbsp;|&nbsp; <b>AI/ML:</b> NumPy, Pandas, OpenCV, Scikit-learn, LangChain, Hugging Face, RAG, CV<br/>
<b>Developer Tools:</b> Git, GitHub, Linux (Ubuntu), VS Code, Docker &nbsp;|&nbsp; <b>Other:</b> Unity, Meta XR SDK
"""
story.append(Paragraph(skills_p, skill_cat_style))
story.append(Spacer(1, 5))

# ACHIEVEMENTS
add_section_header("ACHIEVEMENTS")
story.append(Paragraph("• <b>Anthropic Certifications:</b> Claude Code 101, Claude Code in Action", bullet_style))
story.append(Paragraph("• <b>Unity Junior Programmer Certification:</b> Professional certification in Unity development", bullet_style))

doc.build(story)
print("Single-page PDF successfully generated at:", pdf_path)
