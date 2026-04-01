# 🔐 Your SSLCommerz Sandbox Credentials

## ✅ Account Details (Sandbox)

```
Store ID: autos69cccc023b067
Store Password (API Key): autos69cccc023b067@ssl
Merchant ID: autos69cccbff392af
Store Name: testautosvs42
Registered URL: https://autosparkbd.com/
```

## 🔗 Important URLs

| Purpose | URL |
|---------|-----|
| **Merchant Panel** | https://sandbox.sslcommerz.com/manage/ |
| **Session API** | https://sandbox.sslcommerz.com/gwprocess/v4/api.php |
| **Validation API** | https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php |
| **Developer Docs** | https://merchant.sslcommerz.com/developer |

## 📝 Account Info

- **Account Owner**: Farhan Kabir
- **Email**: farhankabir133@gmail.com
- **Phone**: +8801783165726
- **Business**: Auto Spark

## 🎯 Next Step: Configure IPN Settings

Now you need to:

1. **Log in to**: https://sandbox.sslcommerz.com/manage/
2. **Go to**: Menu → My Store → IPN Settings
3. **Update these 3 URLs**:
   - Success URL: `https://autospark-one.vercel.app/api/payment/success`
   - Failed URL: `https://autospark-one.vercel.app/api/payment/fail`
   - Cancelled URL: `https://autospark-one.vercel.app/api/payment/cancel`
4. **Save** ✅

These are the IPN (Instant Payment Notification) callback URLs.

## ✨ What's Already Configured

Your code is already set up to use these credentials:
- ✅ Store ID and Password are in Vercel env vars
- ✅ Session API integration ready
- ✅ Validation API integration ready
- ✅ IPN listener ready to receive callbacks

**All you need to do is update the 3 callback URLs in the IPN Settings!**
