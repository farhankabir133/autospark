# 🔧 Fix Missing "thana" Attribute

## The Error
```
Invalid document structure: Unknown attribute: "thana"
```

## Why It Happened
The `thana` column wasn't created in your Appwrite collection `payments`.

---

## Fix: Add Missing Column

### Step 1: Go to Appwrite Console
Open: https://cloud.appwrite.io

### Step 2: Navigate to Collection
1. Project: "Auto Spark"
2. Databases → autospark_db
3. Collections → payments

### Step 3: Add Missing Attribute
Click **[Create Column]** or **[Create Attribute]**

Fill in:
```
Attribute ID: thana
Type: String
Size: 100
Required: ✓ (checked)
```

Click **[Create]**

---

## That's It!

Once the `thana` column is created:

1. **Refresh browser** at http://localhost:5173
2. Try the payment form again
3. Should work now! ✓

---

## What's Missing?

Based on the error, you're missing:
- ❌ `thana` 

Make sure ALL these are created:

```
✓ customer_name (String, 255)
✓ mobile (String, 20)
  email (String, 255) - optional
✓ address (String, 500)
  cart_items (String, 5000)
✓ session_id (String, 255)
✓ status (String, 50)
✓ total_amount (Float)
  transaction_id (String, 255) - optional
  gateway_status (String, 50) - optional
❌ thana (String, 100) - MISSING! Add this now
✓ district (String, 100)
```

---

## Quick Visual

In Appwrite Console:
```
Databases
  ↓
autospark_db
  ↓
payments (collection)
  ↓
Columns/Attributes section
  ↓
[Create Column] button
  ↓
Enter: thana
  ↓
Type: String, Size: 100
  ↓
Required: YES
  ↓
[Create]
```

---

## Then Test Again

1. Refresh browser
2. Fill payment form
3. Submit
4. Should work! ✓

---

**Go add the `thana` column now!** 👍
