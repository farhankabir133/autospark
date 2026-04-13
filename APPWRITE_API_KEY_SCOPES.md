# Appwrite API Key Scopes - What to Select

## For Payment Gateway, You Need These Scopes:

### ✅ **Database Scopes** (MOST IMPORTANT)

Select these under **Database** section:

```
☑ databases.read          (Read database)
☑ databases.write         (Write/Create documents)
☑ databases.update        (Update documents)
☑ collections.read        (Read collections)
```

### ⚠️ **Why These Scopes?**

| Scope | What It Does | Why You Need It |
|-------|-------------|-----------------|
| `databases.read` | View database and collections | See payment records |
| `databases.write` | Create new documents/records | Save payment requests |
| `databases.update` | Modify existing documents | Update payment status after SSLCommerz callback |
| `collections.read` | Read collection structure | Access payments collection |

---

## Step-by-Step (In Appwrite Console):

1. **Go to:** Settings → API Keys
2. **Click:** Create API Key
3. **Enter Name:** `payment_key`
4. **Set Expiration:** None (or 90 days)

5. **Scroll down to Scopes section**

6. **Under Database - Check these 4 boxes:**
   - ☑ databases.read
   - ☑ databases.write
   - ☑ databases.update
   - ☑ collections.read

7. **Leave everything else unchecked:**
   - ❌ Auth (0 scopes) - Don't need
   - ❌ Functions (0 scopes) - Don't need
   - ❌ Storage (0 scopes) - Don't need
   - ❌ Messaging (0 scopes) - Don't need
   - ❌ Sites (0 scopes) - Don't need
   - ❌ Other (0 scopes) - Don't need

8. **Click:** Create

---

## Visual Example

```
Database
☑ databases.read
☑ databases.write
☑ databases.update
☑ collections.read
```

All others should be empty (0 Scopes selected)

---

## After Creating the Key

You'll get:
- **API Key** (looks like: `projectid_longrandomstring`)
- Copy this to your `.env` file as:
  ```
  VITE_APPWRITE_API_KEY=projectid_longrandomstring
  ```

---

## Security Note

✅ **You're following best practice** by:
- Selecting only the minimum permissions needed (databases only)
- NOT selecting Auth, Functions, Storage, etc.
- This limits damage if the key is exposed

---

## Summary

**For Payment Gateway, select ONLY:**
- ✅ databases.read
- ✅ databases.write
- ✅ databases.update
- ✅ collections.read

**Everything else:** Leave unchecked (0 scopes)

That's it! Click Create and you're done. 🎉
