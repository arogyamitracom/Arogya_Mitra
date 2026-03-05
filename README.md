# 🏥 Arogya Mitra  
## AI-Based Personal Health Tracking and Risk Monitoring Web Application  
### BCA Final Year Project

---

## 📌 Project Overview

Arogya Mitra is a full-stack web application developed as a BCA Final Year Project.  
The system allows users to track daily health parameters, analyze trends, and predict potential health risks using machine learning.

The main goal of this project is to promote **preventive healthcare** through intelligent monitoring, health scoring, and early disease risk detection.

---

## 🎯 Project Objectives

- Enable users to log and monitor daily health data
- Automatically calculate BMI and generate health score
- Visualize weekly and monthly health trends
- Predict diabetes and heart disease risks using ML models
- Generate alerts for abnormal health conditions
- Provide downloadable monthly health reports

---

## 🛠 Tech Stack

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript
- Chart.js (for visualization)

### Backend
- Python
- Django
- Django REST Framework (API development)

### Database
- MySQL

### Machine Learning
- Scikit-learn
- Pandas
- NumPy

---

## 🏗 System Architecture

The project follows a **Client-Server Architecture**:

Frontend (React)
    ↓
Django REST API
    ↓
MySQL Database
    ↓
Machine Learning Model (Scikit-learn)

- React handles UI and user interaction.
- Django handles authentication, business logic, and API endpoints.
- MySQL stores user and health records.
- ML model processes health data for risk prediction.

---

## 🔐 Authentication Module

- User Registration
- Login / Logout
- Secure password hashing
- Token-based authentication
- Profile management

---

## 📊 Health Data Logging

Users can log the following daily parameters:

- Weight
- Height
- Blood Pressure
- Blood Sugar
- Heart Rate
- Sleep Hours
- Water Intake
- Step Count

All data is stored date-wise for trend analysis.

---

## 🧮 BMI & Health Score System

- Automatic BMI calculation
- BMI Classification:
  - Underweight
  - Normal
  - Overweight
  - Obese
- Overall Health Score (0–100)
- Dynamic health score updates based on latest data

---

## 📈 Trend Analysis & Dashboard

- Weekly health graphs
- Monthly health graphs
- Weight trend visualization
- Blood pressure trend tracking
- Blood sugar analysis
- Interactive dashboard

---

## 🤖 Machine Learning Risk Prediction

The system integrates ML models to predict:

- Diabetes Risk
- Heart Disease Risk

### ML Workflow:

1. Dataset Collection
2. Data Preprocessing
3. Feature Selection
4. Model Training (Random Forest / Logistic Regression)
5. Model Evaluation
6. Model Saving (.pkl file)
7. Backend Integration for real-time predictions

### Output:
- Risk Probability
- Risk Classification:
  - Low
  - Medium
  - High

---

## ⚠ Smart Alert System

- Abnormal value detection alerts
- High-risk ML prediction warnings
- Trend-based health warnings
- Goal achievement notifications
- Preventive suggestions

---

## 🎯 Goal Tracking

Users can set:

- Target weight
- Daily water intake goal
- Daily step goal

System tracks:
- Progress percentage
- Goal completion status

---

## 📄 Health Report Generation

- Monthly PDF health report
- Health score summary
- Risk analysis summary
- Graphical health overview

---

## 📂 Project Folder Structure

### Frontend (React)
src/
├── components/
├── pages/
├── services/
├── utils/
└── App.js


### Backend (Django)


backend/
├── manage.py
├── models.py
├── serializers.py
├── views.py
├── urls.py
├── ml_model.pkl
└── settings.py


---

## ⚙ Installation Guide

### Backend Setup

1. Clone the repository
2. Create virtual environment
3. Install dependencies

```bash
pip install -r requirements.txt

Run migrations

python manage.py migrate

Start server

python manage.py runserver
Frontend Setup
npm install
npm start

```
🚀 Future Enhancements

Mobile application version

Wearable device integration

Cloud deployment

Multi-user family health monitoring

Advanced AI health recommendations

Role-based access control

⚠ Disclaimer

This application provides predictive health insights based on user-entered data and machine learning models.
It is not a substitute for professional medical advice, diagnosis, or treatment.

👨‍🎓 Academic Information

Project Title: Arogya Mitra – AI-Based Personal Health Tracking and Risk Monitoring Web Application
Course: Bachelor of Computer Applications (BCA)
Project Type: Final Year Major Project

📜 License

This project is developed for academic purposes.
