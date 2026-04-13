# 🔧 Create Appwrite Database - Step by Step

## Error You're Getting
```
Database with the requested ID 'autospark_db' could not be found.
```

**Why:** You need to create the database in Appwrite Cloud first.

---

## Create Database in Appwrite Cloud

### Step 1: Go to Appwrite Console
1. Open https://cloud.appwrite.io
2. Log in with your account
3. Open project: "Auto Spark"

### Step 2: Create Database
1. **Left sidebar** → Click "Databases"
2. Click **"Create Database"** button (top right)
3. Fill in:
   - **Name:** `autospark_db`
   - Click **"Create"**

### Step 3: Create Collection
1. Inside database, click **"Create Collection"**
2. Fill in:
   - **Name:** `payments`
   - Click **"Create"**

### Step 4: Add Attributes (Fields)

Now add these fields to the `payments` collection. For each one:
1. Click **"Create Attribute"**
2. Fill in the details
3. Click **"Create"**

**Add these 13 attributes:**

#### 1. customer_name
- Attribute ID: `customer_name`
- Type: String
- Size: 255
- Required: ✓
- Default: (empty)

#### 2. mobile
- Attribute ID: `mobile`
- Type: String
- Size: 20
- Required: ✓

#### 3. email
- Attribute ID: `email`
- Type: String
- Size: 255
- Required: ✗ (optional)

#### 4. address
- Attribute ID: `address`
- Type: String
- Size: 500
- Required: ✓

#### 5. thana
- Attribute ID: `thana`
- Type: String
- Size: 100
- Required: ✓

#### 6. district
- Attribute ID: `district`
- Type: String
- Size: 100
- Required: ✓

#### 7. total_amount
- Attribute ID: `total_amount`
- Type: Float
- Required: ✓

#### 8. cart_items
- Attribute ID: `cart_items`
- Type: String
- Size: 5000
- Required: ✓

#### 9. session_id
- Attribute ID: `session_id`
- Type: String
- Size: 255
- Required: ✓

#### 10. transaction_id
- Attribute ID: `transaction_id`
- Type: String
- Size: 255
- Required: ✗ (optional)

#### 11. status
- Attribute ID: `status`
- Type: String
- Size: 50
- Required: ✓
- Default: "pending"

#### 12. gateway_status
- Attribute ID: `gateway_status`
- Type: String
- Size: 50
- Required: ✗ (optional)

#### 13. created_at
- Attribute ID: `created_at`
- Type: DateTime
- Required: ✓

#### 14. updated_at
- Attribute ID: `updated_at`
- Type: DateTime
- Required: ✗ (optional)

---

## Quick Checklist

- [ ] Logged in to Appwrite Cloud
- [ ] Opened "Auto Spark" project
- [ ] Clicked "Databases" in left sidebar
- [ ] Created database: `autospark_db`
- [ ] Created collection: `payments`
- [ ] Added all 14 attributes
- [ ] All required fields marked as Required
- [ ] Went back to app and refreshed

---

## After Creating Database

Once database is created:

1. **Refresh your browser** at http://localhost:5173
2. Try the payment form again
3. You should now see the form working!
4. When you submit, check:
   - Console for success messages
   - Appwrite database for new records

---

## Screenshot Guide

### Step 1: Databases Menu
```
Left Sidebar
├─ Overview
├─ Databases ← CLICK HERE
├─ Files
├─ Users
└─ ...
```

### Step 2: Create Database Button
```
Top Right Corner
┌─────────────────────┐
│ [Create Database]   │
└─────────────────────┘
```

### Step 3: Database Form
```
┌─────────────────────────────┐
│ Database Name               │
│ ┌─────────────────────────┐ │
│ │ autospark_db            │ │
│ └─────────────────────────┘ │
│                             │
│        [Cancel] [Create]    │
└─────────────────────────────┘
```

### Step 4: Collection
```
Once database opens:

┌─────────────────────────┐
│ [Create Collection]     │
└─────────────────────────┘

Enter: payments
```

### Step 5: Attributes
```
Inside Collection

[Create Attribute] button

For each field, fill:
- Attribute ID: customer_name
- Type: String
- Size: 255
- Required: Yes/No
```

---

## Detailed Walkthrough

### Creating First Attribute (customer_name)

1. Click **[Create Attribute]**
2. Fill form:
   ```
   Attribute ID: customer_name
   Type: String (dropdown)
   Size: 255 (for string)
   Required: Toggle ON ✓
   Default Value: (leave empty)
   ```
3. Click **[Create Attribute]**
4. Repeat for next attribute

### For Float Type (total_amount)
```
Attribute ID: total_amount
Type: Float (dropdown)
Required: Toggle ON ✓
No Size needed for Float
Default Value: (leave empty)
```

### For DateTime Type (created_at)
```
Attribute ID: created_at
Type: DateTime (dropdown)
Required: Toggle ON ✓
No Size needed for DateTime
Default Value: (leave empty)
```

---

## Verify Setup

After creating all attributes, you should see:

```
Collection: payments

Attributes:
✓ customer_name (String)
✓ mobile (String)
✓ email (String)
✓ address (String)
✓ thana (String)
✓ district (String)
✓ total_amount (Float)
✓ cart_items (String)
✓ session_id (String)
✓ transaction_id (String)
✓ status (String)
✓ gateway_status (String)
✓ created_at (DateTime)
✓ updated_at (DateTime)
```

---

## Time Estimate

- Creating database: **1 minute**
- Creating collection: **1 minute**
- Adding 14 attributes: **5-10 minutes**
- **Total: ~10 minutes**

---

## Common Issues

### "Database already exists"
- You already created it ✓
- Just add the collection

### "Can't find Databases menu"
- Make sure you're in the correct project "Auto Spark"
- Left sidebar should show "Databases"

### "Attribute ID already exists"
- You're trying to add the same attribute twice
- Skip it or use different ID

### "Size field not appearing"
- Only String types have Size field
- Float and DateTime don't need it

---

## After Database Setup

Go back to your app:
1. Refresh browser: http://localhost:5173
2. Go to Accessories page
3. Add items to cart
4. Click "Proceed to Checkout"
5. Fill payment form
6. Click "Submit"

**It should work now!** ✓

---

## Need Help?

If you're stuck:
1. Check you're logged into Appwrite Cloud
2. Verify you're in the "Auto Spark" project
3. Verify database is named exactly `autospark_db`
4. Verify collection is named exactly `payments`
5. Verify all attribute IDs match exactly (case-sensitive)

**Then refresh your browser and try again!**
