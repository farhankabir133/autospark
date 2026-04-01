# 📧 EMAIL NOTIFICATIONS SETUP GUIDE

**Goal**: Send automatic email notifications when customers place orders and after payment completion.

**Services Used**:
- **SendGrid** (FREE tier - 100 emails/day)
- **Resend** (FREE tier - 100 emails/day, simpler to use)
- **Node Mailer** (FREE if using Gmail, more complex)

**Recommendation**: Use **Resend** (easiest, most modern)

---

## 🚀 Option 1: Setup Resend (Recommended - Easiest)

### Step 1: Create Resend Account

1. Go to: https://resend.com
2. Click "Sign Up"
3. Create account with your email
4. Verify email
5. You get FREE 100 emails/day

### Step 2: Get API Key

1. Go to: https://resend.com/api-keys
2. Click "Create API Key"
3. Name it: `autospark-payments`
4. Copy the API key (starts with `re_...`)

### Step 3: Add to Vercel Environment Variables

1. Go to: https://vercel.com/dashboard
2. Select project: `autospark-one`
3. Settings → Environment Variables
4. Add new variable:
   ```
   RESEND_API_KEY = re_xxxxxxxxxxxx
   ```
5. Redeploy the project

### Step 4: Install Resend SDK

In your `next-sslcommerz` folder:

```bash
npm install resend
```

Commit and push:
```bash
git add package.json package-lock.json
git commit -m "feat: add resend email notifications"
git push origin main
```

### Step 5: Create Email Service

Create new file: `next-sslcommerz/lib/email.ts`

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail(
  customerEmail: string,
  customerName: string,
  orderId: string,
  amount: number,
  productName: string
) {
  try {
    const result = await resend.emails.send({
      from: 'orders@autospark.com',
      to: customerEmail,
      subject: `Order Confirmation - ${orderId}`,
      html: `
        <h2>Thank you for your order, ${customerName}!</h2>
        <p>Your order has been created successfully.</p>
        
        <h3>Order Details:</h3>
        <ul>
          <li><strong>Order ID:</strong> ${orderId}</li>
          <li><strong>Product:</strong> ${productName}</li>
          <li><strong>Amount:</strong> ${amount} BDT</li>
          <li><strong>Status:</strong> Processing Payment</li>
        </ul>
        
        <p>You will receive another email once your payment is confirmed.</p>
        
        <p>Thank you for choosing AutoSpark!</p>
      `,
    });

    console.log('[Email] Order confirmation sent:', result);
    return result;
  } catch (error) {
    console.error('[Email] Failed to send order confirmation:', error);
    throw error;
  }
}

export async function sendPaymentSuccessEmail(
  customerEmail: string,
  customerName: string,
  orderId: string,
  transactionId: string,
  amount: number
) {
  try {
    const result = await resend.emails.send({
      from: 'orders@autospark.com',
      to: customerEmail,
      subject: `Payment Confirmed - ${orderId}`,
      html: `
        <h2>Payment Confirmed!</h2>
        <p>Dear ${customerName},</p>
        
        <p>Your payment has been successfully processed.</p>
        
        <h3>Payment Details:</h3>
        <ul>
          <li><strong>Order ID:</strong> ${orderId}</li>
          <li><strong>Transaction ID:</strong> ${transactionId}</li>
          <li><strong>Amount Paid:</strong> ${amount} BDT</li>
          <li><strong>Status:</strong> ✅ Paid</li>
        </ul>
        
        <p>Our team will contact you shortly with further details.</p>
        
        <p>Thank you for your business!</p>
        
        <hr>
        <p><small>AutoSpark - Vehicle Sales & Services</small></p>
      `,
    });

    console.log('[Email] Payment success email sent:', result);
    return result;
  } catch (error) {
    console.error('[Email] Failed to send payment success email:', error);
    throw error;
  }
}

export async function sendPaymentFailureEmail(
  customerEmail: string,
  customerName: string,
  orderId: string,
  amount: number
) {
  try {
    const result = await resend.emails.send({
      from: 'orders@autospark.com',
      to: customerEmail,
      subject: `Payment Failed - ${orderId}`,
      html: `
        <h2>Payment Could Not Be Processed</h2>
        <p>Dear ${customerName},</p>
        
        <p>Unfortunately, your payment could not be processed.</p>
        
        <h3>Order Details:</h3>
        <ul>
          <li><strong>Order ID:</strong> ${orderId}</li>
          <li><strong>Amount:</strong> ${amount} BDT</li>
          <li><strong>Status:</strong> ❌ Payment Failed</li>
        </ul>
        
        <p><strong>Please try again:</strong> <a href="https://autosparkbd.com/#/payment">Retry Payment</a></p>
        
        <p>If you continue to experience issues, please contact us at support@autospark.com</p>
        
        <p>Thank you,<br>AutoSpark Team</p>
      `,
    });

    console.log('[Email] Payment failure email sent:', result);
    return result;
  } catch (error) {
    console.error('[Email] Failed to send payment failure email:', error);
    throw error;
  }
}
```

### Step 6: Update Payment Routes to Send Emails

**Update**: `next-sslcommerz/pages/api/payment/initiate.ts`

Add this import at the top:
```typescript
import { sendOrderConfirmationEmail } from '../../../lib/email';
```

Find the section where the order is created in Supabase, and add after it:

```typescript
// Send confirmation email to customer
try {
  await sendOrderConfirmationEmail(
    cus_email,
    cus_name,
    tran_id,
    amount,
    product_name
  );
} catch (emailError) {
  console.error('Failed to send order confirmation email:', emailError);
  // Don't fail the payment if email fails
}
```

**Update**: `next-sslcommerz/pages/api/payment/success.ts`

Add this import at the top:
```typescript
import { sendPaymentSuccessEmail } from '../../../lib/email';
```

After the order status is updated to "paid", add:

```typescript
// Send success email to customer
try {
  const order = ...// Get the order data
  await sendPaymentSuccessEmail(
    order.cus_email,
    order.cus_name,
    order.tran_id,
    transaction.val_id,
    order.total_amount
  );
} catch (emailError) {
  console.error('Failed to send payment success email:', emailError);
  // Don't fail if email fails
}
```

**Update**: `next-sslcommerz/pages/api/payment/fail.ts`

Add this import at the top:
```typescript
import { sendPaymentFailureEmail } from '../../../lib/email';
```

After updating status to "failed", add:

```typescript
// Send failure email
try {
  const order = ...// Get the order data
  await sendPaymentFailureEmail(
    order.cus_email,
    order.cus_name,
    order.tran_id,
    order.total_amount
  );
} catch (emailError) {
  console.error('Failed to send payment failure email:', emailError);
}
```

### Step 7: Verify Email Setup

1. Commit changes:
```bash
git add -A
git commit -m "feat: add email notifications with Resend"
git push origin main
```

2. Redeploy on Vercel (automatic)

3. Test by submitting a payment - check your email inbox!

---

## 📧 Alternative Option 2: SendGrid

If you prefer SendGrid instead:

### Setup Steps

1. Go to: https://sendgrid.com
2. Sign up (FREE tier - 100 emails/day)
3. Create API key
4. Add to Vercel: `SENDGRID_API_KEY`
5. Install: `npm install @sendgrid/mail`
6. Use similar code pattern as above

### SendGrid Code Example

```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: customerEmail,
  from: 'orders@autospark.com',
  subject: 'Order Confirmation',
  html: '<strong>Thank you for your order!</strong>',
};

await sgMail.send(msg);
```

---

## 🎯 Email Templates Ready to Use

### Template 1: Order Confirmation
Sent immediately when customer submits payment form
- Confirms order received
- Shows order details
- Next steps

### Template 2: Payment Success
Sent after successful payment
- Confirms payment received
- Shows transaction details
- Next action

### Template 3: Payment Failure
Sent if payment fails
- Explains failure
- Retry link
- Support contact

### Template 4: Admin Notification (Optional)
You can also notify yourself:

```typescript
export async function sendAdminNotification(
  orderId: string,
  customerEmail: string,
  amount: number,
  status: string
) {
  await resend.emails.send({
    from: 'orders@autospark.com',
    to: 'farhankabir133@gmail.com', // Your email
    subject: `New Order: ${orderId} - ${status}`,
    html: `
      <h3>New Order Received</h3>
      <p>Order ID: ${orderId}</p>
      <p>Customer Email: ${customerEmail}</p>
      <p>Amount: ${amount} BDT</p>
      <p>Status: ${status}</p>
    `,
  });
}
```

---

## ✅ Testing Email Setup

1. **Local Testing**:
   - Use fake RESEND_API_KEY to test without sending
   - Or use Mailtrap.io for free email testing

2. **Production Testing**:
   - Submit a real test payment
   - Check your inbox for confirmation email
   - Verify all details are correct

3. **Check Email Delivery**:
   - Resend Dashboard: https://resend.com/emails
   - Check delivery status
   - View open rates, clicks, etc.

---

## 💡 Email Best Practices

✅ **DO**:
- Send confirmation immediately on order creation
- Send success email after payment validated
- Include order ID in all emails
- Use professional branding
- Include support contact
- Add unsubscribe link (if needed)

❌ **DON'T**:
- Send too many emails (max 3 per order)
- Include sensitive data in subject line
- Use HTML only (always have plain text alternative)
- Send immediately without confirmation

---

## 🔒 Email Security

- API keys stored in Vercel (not in code)
- Never log API keys
- Use "from" email that's verified
- Validate email addresses before sending
- Handle errors gracefully (don't block payment)

---

## 📊 Email Metrics (Optional)

Once emails are sending, monitor:
- Delivery rate (should be >95%)
- Open rate
- Click rate
- Bounce rate

Resend and SendGrid both provide dashboards for this.

---

## 🎉 You'll Have

After setting up emails:
- ✅ Customer gets immediate order confirmation
- ✅ Customer gets payment success notification
- ✅ Customer gets payment failure alert
- ✅ You get admin notifications
- ✅ Professional communication
- ✅ Better customer experience

---

**Which email service would you prefer?**
1. **Resend** (Recommended - easiest, most modern) 
2. **SendGrid** (Mature, more features)
3. **Node Mailer** (Free but needs Gmail config)

Let me know and I'll help implement it! 📧
