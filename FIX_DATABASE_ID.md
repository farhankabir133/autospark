# 🔧 Fix Appwrite Database ID Error

## The Problem

```
Database with the requested ID 'autospark_db' could not be found.
```

**Reason:** Your `.env` file has the database **name** (`autospark_db`) but Appwrite needs the database **ID** (a unique internal identifier).

---

## The Solution (5 minutes)

### Step 1: Go to Appwrite Console
Open: https://cloud.appwrite.io

### Step 2: Find Your Database ID
1. Open project: **"Auto Spark"**
2. Left sidebar → **Databases**
3. Click on database: **autospark_db**
4. Look at the top or settings - you'll see **Database ID**
   - It looks like: `69dd576a00019558df4d`
   - NOT the name `autospark_db`

### Step 3: Copy the Database ID
Example: `69dd576a00019558df4d`

### Step 4: Update .env File
Replace:
```
VITE_APPWRITE_DATABASE_ID="autospark_db"
```

With:
```
VITE_APPWRITE_DATABASE_ID="69dd576a00019558df4d"
```

(Use YOUR actual database ID, not this example!)

### Step 5: Refresh Browser
1. Refresh http://localhost:5173
2. Try payment form again

---

## How to Find Database ID in Appwrite

### Method 1: In Console UI
```
Appwrite Console
  ↓
"Auto Spark" project
  ↓
Databases (left sidebar)
  ↓
Click "autospark_db"
  ↓
Look for "Database ID" or "$id"
  ↓
Copy the ID (looks like: 69dd576a00019558df4d)
```

### Method 2: Looking at Collection
```
Appwrite Console
  ↓
Databases
  ↓
autospark_db (your database)
  ↓
payments (collection)
  ↓
Look at URL: .../databases/69dd576a00019558df4d/collections/...
  ↓
That's your database ID!
```

---

## What It Looks Like

### WRONG (Name):
```
VITE_APPWRITE_DATABASE_ID="autospark_db"
```

### CORRECT (ID):
```
VITE_APPWRITE_DATABASE_ID="69dd576a00019558df4d"
```

The ID is usually:
- 20+ characters long
- Mix of letters and numbers
- Lowercase
- Starts with a number or letter

---

## Quick Example

If your database looks like this in Appwrite:
```
Database Name: autospark_db
Database ID:   69dd576a00019558df4d
```

Your .env should have:
```
VITE_APPWRITE_DATABASE_ID="69dd576a00019558df4d"
```

---

## After Updating .env

1. **Refresh browser** at http://localhost:5173
2. **Try payment form again**
3. Should work now! ✓

---

## If Still Getting Error

**Double-check:**
1. Database ID is correct (not the name)
2. API Key has database permissions
3. Project ID is correct
4. Endpoint is correct
5. Database actually exists in Appwrite

---

## Need Help Finding It?

The database ID is shown:
- At top of database page
- In collection settings
- In URL when viewing collection
- In API documentation

It's a unique identifier that looks like: `69dd576a00019558df4d`

---

**Do this now and let me know what ID you find!** 👍
