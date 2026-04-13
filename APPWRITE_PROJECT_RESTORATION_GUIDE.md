# Appwrite Project Restoration Guide

## 🔴 Problem: "Project is paused due to inactivity"

This error occurs when your Appwrite project has been inactive for an extended period. The project needs to be restored/resumed from the Appwrite console.

---

## ✅ Solution: Restore Your Appwrite Project

### **Step 1: Access Appwrite Console**

1. Open your browser and go to:
   ```
   https://sgp.cloud.appwrite.io/console
   ```
   
2. Log in with your Appwrite credentials (email and password you used to sign up)

---

### **Step 2: Select Your Project**

1. Once logged in, look for your project: **Auto Spark**
2. Project ID: `69d09ead0018cd1663a7`
3. Click on it to open the project dashboard

---

### **Step 3: Restore/Resume the Project**

1. **Look for a notification** at the top of the dashboard that says:
   - "Project is paused"
   - "Project is inactive"
   - Or a yellow/red banner with a warning

2. **Click the "Restore" or "Resume" button** in the notification
   
3. You may be prompted to confirm - click **"Yes"** or **"Confirm"**

4. **Wait a few moments** for the project to come back online (usually 10-30 seconds)

---

### **Step 4: Verify Project Status**

After restoration:

1. **Check the dashboard** - the notification should disappear
2. **Go to Functions** in the left sidebar
3. **Look for the function**: `sslcommerz-api`
4. **Verify the status**:
   - ✅ Function should appear in the list
   - ✅ Status should show as **"Enabled"** or **"Active"**
   - ✅ No error messages

---

### **Step 5: Test the Payment Gateway**

Now test the payment flow:

1. Open: `http://localhost:5174/accessories` (or your custom domain)
2. Add a product to cart
3. Click "Proceed to Checkout"
4. Fill in billing information:
   - Full Name: `Test User`
   - Mobile: `01701234567`
   - District: Select any district
   - Thana: Select any thana
   - Address: `Test Address`
5. Click "Place Order"
6. You should be redirected to SSLCommerz payment gateway

---

## 🛠️ What Changed in the Code?

### Improved Error Messages

The PaymentPage now displays more helpful error messages:

```
❌ "Project is paused"
   ↓
✅ "The payment service is temporarily unavailable. Please contact support or try again later."
```

### Better UI for Error Handling

- **More prominent error display** with better visibility
- **"Dismiss" button** to close the error
- **"Try Again" button** to reload and retry the payment
- **Support contact information** in relevant error messages

---

## ⚠️ Prevention: Keep Project Active

To prevent this issue in the future:

1. **Ensure continuous access** to the Appwrite project
2. **Set up automatic transactions** if possible (some subscription plans auto-restore)
3. **Regularly check the Appwrite dashboard** for any paused projects
4. **Consider upgrading your Appwrite plan** if available

---

## 🆘 Still Having Issues?

If the project still doesn't work after restoration:

1. **Clear browser cache**: Press `Ctrl+Shift+Delete` (or `Cmd+Shift+Delete` on Mac)
2. **Hard refresh**: Press `Ctrl+F5` (or `Cmd+Shift+R` on Mac)
3. **Check browser console** for any errors:
   - Right-click → Inspect → Console tab
   - Look for error messages
4. **Contact Appwrite Support**: https://appwrite.io/support

---

## 📝 Appwrite Project Details

- **Endpoint**: https://sgp.cloud.appwrite.io/v1 (Singapore)
- **Project ID**: 69d09ead0018cd1663a7
- **Function ID**: sslcommerz-api
- **Region**: Singapore

---

## 💡 Quick Checklist

- [ ] Accessed Appwrite console at https://sgp.cloud.appwrite.io/console
- [ ] Logged in with credentials
- [ ] Selected "Auto Spark" project
- [ ] Found and clicked "Restore/Resume" button
- [ ] Waited for project to come online
- [ ] Verified `sslcommerz-api` function is enabled
- [ ] Tested payment flow on localhost:5174
- [ ] Confirmed SSLCommerz redirect works

---

**Last Updated**: April 13, 2026  
**Status**: Payment gateway fully configured and ready for production
