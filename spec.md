# AI Resume Scanner MVP

## Overview
An AI-powered resume analysis application that evaluates resumes using Google's Gemini AI model. The application provides general resume feedback and job-specific matching analysis with proper form submission, error handling, and loading states.

## Core Features

### Resume Analysis
- **General Analysis**: Upload a PDF resume to receive comprehensive feedback including strengths, weaknesses, and an overall score
- **Job Matching**: Compare a resume against a specific job description to get match scoring, missing keywords identification, and improvement advice

### PDF Processing
- Extract text content from uploaded PDF resumes using pypdf library
- Handle corrupted or invalid PDF files with appropriate error responses

### User Interface
- **Form Submission**: Analyze buttons in GeneralAnalysis and JobMatching components properly trigger React Query mutations
- **Loading States**: Analyze buttons show progress indicators and disable during processing
- **Dynamic Updates**: Visual components update immediately upon receiving backend responses
- **Error Handling**: Display appropriate error messages for failed requests or invalid files

## Backend Functionality

### Data Processing
- PDF text extraction using `pypdf.PdfReader` via helper function `extract_text_from_pdf(file)`
- Integration with Google Gemini 1.5 Flash model for AI analysis
- Structured JSON response generation with strict JSON-only output enforcement
- Error handling for non-JSON responses to prevent frontend parsing failures

### API Endpoints
- `POST /analyze/general`: Accepts PDF file via multipart/form-data, analyzes resume and returns strengths, weaknesses, and numerical score
- `POST /analyze/match`: Accepts PDF file and job_description field via multipart/form-data, compares resume against job description and returns match score, missing keywords, and advice

### AI Integration
- Uses Google Generative AI library (`google-generativeai`) with Gemini 1.5 Flash model
- Implements "Resume Critic" prompt for general analysis
- Implements "Hiring Manager" prompt for job matching analysis
- API key management via `GEMINI_API_KEY` environment variable
- Ensures pure JSON responses from AI model with error handling

### Configuration
- FastAPI framework implementation with proper multipart form handling
- Environment-based API key management for Google services
- CORS middleware configuration for frontend integration
- Development server configuration with `uvicorn main:app --reload`
- Application content language: English

## Frontend Functionality

### React Query Integration
- `analyzeGeneral` mutation for general resume analysis
- `analyzeMatch` mutation for job matching analysis
- Proper file upload handling with multipart/form-data
- Loading state management during API calls

### Component Behavior
- **GeneralAnalysis Component**: File upload, analyze button with loading state, dynamic result display
- **JobMatching Component**: File upload, job description input, analyze button with loading state, dynamic result display
- **Progress Indicators**: Visual feedback during analysis processing
- **Error Display**: User-friendly error messages for failed operations

## Response Formats

### General Analysis Response
- `strengths`: Array of identified resume strengths
- `weaknesses`: Array of areas for improvement
- `score`: Numerical rating of the resume (integer)

### Job Match Response
- `match_score`: Numerical compatibility rating (integer)
- `missing_keywords`: Array of important keywords not found in resume
- `advice`: Specific recommendations for improvement (string)

## Technical Requirements
- FastAPI framework for backend API with multipart form support
- Google Generative AI integration with Gemini 1.5 Flash
- pypdf library for PDF text extraction
- React Query for frontend state management and API calls
- Environment variable configuration
- Multipart/form-data file upload support
- Cross-origin request support
- End-to-end connectivity testing for PDF analysis and Gemini feedback
