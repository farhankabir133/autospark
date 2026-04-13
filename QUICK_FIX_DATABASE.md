# ⚡ Quick Fix: Create Database NOW

## The Problem
```
"Database with the requested ID 'autospark_db' could not be found."
```

## The Solution
You need to create the database in Appwrite Cloud (takes 10 minutes)

---

## DO THIS RIGHT NOW (In Order)

### 1. Open Appwrite Console
Go to: https://cloud.appwrite.io

### 2. Open Your Project
- Click on project: **"Auto Spark"**

### 3. Create Database
- Left sidebar → **Databases**
- Click **[Create Database]**
- Name: `autospark_db`
- Click **[Create]**

### 4. Create Collection
- Click **[Create Collection]**
- Name: `payments`
- Click **[Create]**

### 5. Add Attributes (14 total)

Quick Copy-Paste Guide:

```
1. customer_name  → String (size 255) → Required ✓
2. mobile         → String (size 20)  → Required ✓
3. email          → String (size 255) → Optional
4. address        → String (size 500) → Required ✓
5. thana          → String (size 100) → Required ✓
6. district       → String (size 100) → Required ✓
7. total_amount   → Float             → Required ✓
8. cart_items     → String (size 5000) → Required ✓
9. session_id     → String (size 255) → Required ✓
10. transaction_id → String (size 255) → Optional
11. status        → String (size 50)  → Required ✓
12. gateway_status → String (size 50)  → Optional
13. created_at    → DateTime          → Required ✓
14. updated_at    → DateTime          → Optional
```

For each attribute:
1. Click **[Create Attribute]**
2. Fill Attribute ID (e.g., "customer_name")
3. Select Type (String, Float, DateTime)
4. Enter Size (for String only)
5. Toggle Required if needed
6. Click **[Create Attribute]**
7. Repeat

---

## Then Come Back Here

Once database is created:

1. **Refresh your browser** at http://localhost:5173
2. Go to Accessories page
3. Add items to cart
4. Click "Proceed to Checkout"
5. Fill payment form
6. Click "Submit Payment"

✅ **Should work now!**

---

## Visual Steps

```
Appwrite Cloud
    ↓
Databases (left sidebar)
    ↓
[Create Database]
    ↓
Name: autospark_db
    ↓
[Create]
    ↓
[Create Collection]
    ↓
Name: payments
    ↓
[Create]
    ↓
[Create Attribute] × 14 times
    ↓
DONE! ✓
```

---

## Time to Complete
⏱️ **10-15 minutes**

## Difficulty
🟢 **Easy** - Just filling forms

---

## Full Instructions
See: **CREATE_APPWRITE_DATABASE.md**

---

## Are You Stuck?

**Most Common Issues:**

1. ❌ "Can't find Databases menu"
   - Make sure you're in "Auto Spark" project
   - Look at left sidebar

2. ❌ "Database already exists"
   - You created it ✓
   - Just create the collection instead

3. ❌ "Wrong attribute ID format"
   - IDs are case-sensitive
   - Use exact names from list above

4. ❌ "Still getting same error"
   - Refresh your browser (Ctrl+R)
   - Clear cache if needed

---

**Go do it now!** Let me know when database is created. 🚀
