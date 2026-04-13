# 🔧 Fix Missing "district" Attribute

## The Error
```
Invalid document structure: Unknown attribute: "district"
```

## Why It Happened
The `district` column wasn't created in your Appwrite collection `payments`.

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
Attribute ID: district
Type: String
Size: 100
Required: ✓ (checked)
```

Click **[Create]**

---

## That's It!

Once the `district` column is created:

1. **Refresh browser** at http://localhost:5173
2. Try the payment form again
3. Should work now! ✓

---

## Complete Column List

You should have these 15 columns total:

```
✓ $id (auto)
✓ customer_name (String, 255) - Required
✓ mobile (String, 20) - Required
✓ email (String, 255) - Optional
✓ address (String, 500) - Required
✓ cart_items (String, 5000) - Required
✓ session_id (String, 255) - Required
✓ status (String, 50) - Required
✓ total_amount (double) - Required
✓ transaction_id (String, 255) - Optional
✓ gateway_status (String, 50) - Optional
✓ thana (String, 100) - Required
❌ district (String, 100) - Required - MISSING! Add this now
✓ $createdAt (auto)
✓ $updatedAt (auto)
```

---

## Quick Steps

1. Go to Appwrite Console
2. Open `autospark_db` → `payments` collection
3. Click **[Create Column]**
4. Enter:
   - Attribute ID: `district`
   - Type: `String`
   - Size: `100`
   - Required: `✓ Yes`
5. Click **[Create]**
6. Refresh browser at http://localhost:5173
7. Test payment form again

---

**Go add the `district` column now!** 👍
