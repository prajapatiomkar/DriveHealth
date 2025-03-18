# Google Cloud Console Setup for OAuth Authentication

Follow these steps to enable Google OAuth authentication and integrate Google Drive API with your application.

---

## **1️⃣ Create a Google Cloud Project**

1. Go to **[Google Cloud Console](https://console.cloud.google.com/)**.
2. Click on **Select a Project** → **New Project**.
3. Enter a **Project Name** and click **Create**.

---

## **2️⃣ Enable Google Drive API**

1. In the Google Cloud Console, go to **APIs & Services** → **Library**.
2. Search for **Google Drive API**.
3. Click **Enable**.

---

## **3️⃣ Set Up OAuth Consent Screen**

1. Navigate to **APIs & Services** → **OAuth Consent Screen**.
2. Choose **"External"** and click **Create**.
3. Fill in the required details:
   - **App Name**: Any name (e.g., `DriveHealth`).
   - **User Support Email**: Your email.
   - **Developer Contact Information**: Your email.
4. Click **Save and Continue**.
5. Under **Scopes**, click **Add or Remove Scopes** and select:
   - `https://www.googleapis.com/auth/drive.file` (Full access)
   - `https://www.googleapis.com/auth/drive.metadata.readonly` (Read-only access)
6. Click **Save and Continue**.
7. Under **Test Users**, add your email (`youremail@gmail.com`).
8. Click **Save and Continue** → **Back to Dashboard**.

---

## **4️⃣ Create OAuth Credentials**

1. Navigate to **APIs & Services** → **Credentials**.
2. Click **Create Credentials** → **OAuth Client ID**.
3. Select **Application Type** → **Web Application**.
4. Set up:
   - **Name**: `DriveHealth OAuth`
   - **Authorized JavaScript Origins**:
     ```
     http://localhost:3000
     ```
   - **Authorized Redirect URIs**:
     ```
     http://localhost:5000/auth/google/callback
     ```
5. Click **Create**.
6. Copy **Client ID** and **Client Secret**.

---

## **5️⃣ Add Your Email as a Test User**

1. Go to **APIs & Services** → **OAuth Consent Screen**.
2. Under **Test Users**, click **Add Users**.
3. Enter your email and **Save**.

---

## **6️⃣ Use Client ID and Secret in Your `.env` File**

```env
PORT=5000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
FRONTEND_URL=http://localhost:3000
```
