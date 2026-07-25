# CivicBridge
## Participatory Governance & Public Accountability

---

# Project Overview

**Project Name:** CivicBridge

**Platform**
- Progressive Web App (PWA)
- Responsive Website

**Hackathon Duration**
- 4 Hours

**Goal**

Build a lightweight digital governance platform that improves transparency and communication between citizens and public institutions by allowing citizens to report civic issues and track their resolution in real time.

---

# Problem Statement

Citizens often struggle to:

- Report civic issues easily
- Track complaint progress
- Receive updates from authorities
- Participate in governance

Government agencies struggle with:

- Complaint management
- Transparency
- Duplicate reports
- Citizen engagement

---

# Solution

Develop a web-based PWA where citizens can:

- Report issues
- Upload photos
- Share GPS location
- Track complaint status
- View all public complaints

Government officers can:

- View complaints
- Update status
- Mark complaints as resolved

Everything updates in real time using Supabase Realtime.

---

# Target Users

## Citizen

- Login
- Report issue
- View public complaints
- Track complaint status

## Officer

- Login
- Manage complaints
- Update status

---

# MVP Features

## Citizen

- Authentication
- Report Issue
- Upload Image
- Auto GPS Location
- Complaint Feed
- Complaint Details

## Officer

- Officer Dashboard
- View Complaints
- Change Complaint Status
- Resolution Notes

---

# Complaint Lifecycle

Submitted

↓

Under Review

↓

In Progress

↓

Resolved

---

# Functional Requirements

## Authentication

- Email Login
- Google Login (Optional)

---

## Complaint Reporting

User can submit:

- Title
- Description
- Category
- Photo
- GPS Coordinates

---

## Complaint Feed

Display

- Image
- Title
- Status
- Location
- Timestamp

---

## Complaint Details

Show

- Description
- Uploaded Photo
- Status History
- Location

---

## Officer Dashboard

Officer can

- View all complaints
- Filter by status
- Update status
- Add notes

---

# Non Functional Requirements

- Mobile Responsive
- Installable PWA
- Fast Loading
- Secure Authentication
- Offline UI Cache
- Real-time Updates

---

# Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

## Backend

Supabase

- Authentication
- PostgreSQL
- Storage
- Realtime
- Row Level Security (RLS)

## Maps

- Leaflet
- OpenStreetMap

## Deployment

- Vercel
- Supabase Cloud

---

# Folder Structure

src/

components/

pages/

hooks/

services/

supabase/

types/

utils/

assets/

App.tsx

main.tsx

---

# Routing

/

login

dashboard

report

complaints

complaints/:id

admin

---

# Database Schema

## profiles

```
id UUID

name

email

role

created_at
```

---

## complaints

```
id UUID

title

description

category

image_url

latitude

longitude

status

user_id

created_at

updated_at
```

---

## comments (Optional)

```
id

complaint_id

user_id

message

created_at
```

---

# Storage

Bucket

complaint-images

Store

- Images
- Attachments

---

# Authentication

Supabase Auth

Supported

- Email
- Google OAuth (Optional)

---

# Row Level Security

Citizen

- Create complaint
- View all complaints
- Edit only own complaint

Officer

- View all complaints
- Update complaint status

Admin

- Full Access

---

# Application Flow

Citizen

↓

Login

↓

Report Issue

↓

Upload Image

↓

Save to Supabase

↓

Realtime Update

↓

Officer Dashboard

↓

Update Status

↓

Citizen Receives Update

---

# UI Pages

Landing Page

Login

Dashboard

Report Complaint

Complaint Feed

Complaint Details

Officer Dashboard

404 Page

---

# Components

Navbar

Footer

Sidebar

Complaint Card

Complaint Form

Status Badge

Image Upload

Map Picker

Loading Spinner

Toast Notifications

---

# PWA Features

- Installable
- Offline Cache
- Responsive
- Home Screen Shortcut

---

# Nice to Have

If time permits

- AI Complaint Categorization
- Duplicate Detection
- Search
- Filters
- Dark Mode
- Charts
- Ward-wise Dashboard

---

# Development Timeline

Hour 1

- React Setup
- Tailwind
- Supabase
- Authentication

Hour 2

- Complaint Form
- Image Upload
- Database

Hour 3

- Complaint Feed
- Officer Dashboard
- Status Update

Hour 4

- PWA
- Testing
- Deployment
- Final Polish

---

# Future Scope

- AI Assistant
- Predictive Analytics
- WhatsApp Integration
- Public Polls
- Community Voting
- Government Analytics Dashboard
- Multi-language Support

---

# Deliverables

✅ Responsive Website

✅ Installable PWA

✅ Supabase Backend

✅ Real-time Complaint Tracking

✅ Officer Dashboard

✅ Public Complaint Feed

---

# Elevator Pitch

CivicBridge is a lightweight digital governance platform that enables transparent communication between citizens and government. Citizens can report civic issues, upload evidence, and track resolution progress in real time. Government officers manage complaints through a dedicated dashboard while the public gains visibility into issue resolution, fostering accountability, transparency, and community participation.

---

# Suggested Repository Structure

```
civicbridge/

├── public/

├── src/

│ ├── assets/

│ ├── components/

│ ├── hooks/

│ ├── layouts/

│ ├── pages/

│ ├── services/

│ ├── lib/

│ │ └── supabase.ts

│ ├── types/

│ ├── utils/

│ ├── App.tsx

│ └── main.tsx

├── .env

├── package.json

├── vite.config.ts

└── README.md
```

---

# Success Criteria

- User can authenticate.
- User can report an issue.
- Image uploads successfully.
- Complaint is stored in Supabase.
- Complaint appears instantly in the feed.
- Officer updates status.
- Status updates are reflected in real time.
- PWA is installable and responsive.
