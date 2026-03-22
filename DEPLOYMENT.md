# Deployment Guide for Render

This guide will walk you through deploying your Node.js, Express, and MySQL portfolio application to **Render**.

## 1. Prepare Your Project
Before deploying, ensure your code is pushed to a Github repository.

1. Open your terminal in the project folder (`c:\Users\nayan\OneDrive\Desktop\my portfolio1`).
2. Run the following commands:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for portfolio"
   git branch -M main
   # Add your github remote repository URL here and push
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

## 2. Setting Up a Remote MySQL Database
Render does not offer free native MySQL hosting (they use PostgreSQL). You need a remote MySQL database. You can get a free one at [Aiven](https://aiven.io/mysql) or [Clever Cloud](https://www.clever-cloud.com/).

Once created, note down your credentials:
- **Host**
- **User**
- **Password**
- **Database Name**
- **Port** 

> Note: Before deploying the main app, run the `node setup-db.js` script with your remote database credentials set in a `.env` file to create the tables remotely.

## 3. Deploy to Render
1. Go to [Render](https://render.com/) and create a free account.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select the repository you just created.
4. Configure the Web Service:
   - **Name**: e.g., `my-student-portfolio`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free

## 4. Set Environment Variables
Scroll down to the **Environment Variables** section on the Render setup page and add the following:

- `DB_HOST`: Your remote MySQL Host
- `DB_USER`: Your remote MySQL User
- `DB_PASSWORD`: Your remote MySQL Password
- `DB_NAME`: Your remote MySQL Database Name
- `EMAIL_USER`: your-gmail@gmail.com
- `EMAIL_PASS`: your-gmail-app-password (generated below)

## 5. Gmail App Password (For Nodemailer)
To allow your web service to send emails from your Gmail:
1. Go to your Google Account > Security.
2. Ensure **2-Step Verification** is ON.
3. Search for **App Passwords** in the search bar.
4. Create a new app password and copy the 16-character code. Use this for `EMAIL_PASS`.

## 6. Finalize Deployment
Click **Create Web Service**. 
Render will clone your repository, run `npm install`, and then execute `node server.js`. Within a few minutes, your portfolio website will be live on a generated `something.onrender.com` URL!
