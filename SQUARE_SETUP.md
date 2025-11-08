# Square Payment Integration Setup

This application integrates Square's Web Payments SDK for secure payment processing.

## Getting Your Square Credentials

### 1. Create a Square Developer Account

1. Go to [Square Developer Portal](https://developer.squareup.com/)
2. Sign up for a free developer account (or log in if you have one)
3. You'll automatically get access to Sandbox mode for testing

### 2. Get Your Application ID and Location ID

1. Go to the [Square Developer Dashboard](https://developer.squareup.com/apps)
2. Create a new application or select an existing one
3. In the left sidebar, click **"Credentials"**
4. You'll see:
   - **Sandbox Application ID** - for testing
   - **Production Application ID** - for live payments
   - **Sandbox Access Token**
   - **Production Access Token**

5. Scroll down to find your **Location ID**
   - Click on **"Locations"** in the sidebar
   - Copy the Location ID for your business location

### 3. Update Your Application

Open `src/App.tsx` and replace the placeholder credentials on lines 10-11:

```typescript
// Replace these with your actual Square credentials
const SQUARE_APPLICATION_ID = 'sandbox-sq0idb-YOUR_APP_ID_HERE';
const SQUARE_LOCATION_ID = 'YOUR_LOCATION_ID_HERE';
```

**For Testing (Sandbox Mode):**
```typescript
const SQUARE_APPLICATION_ID = 'sandbox-sq0idb-XXXXXXXXXXXXX'; // Your Sandbox App ID
const SQUARE_LOCATION_ID = 'LXXXXXXXXXXXXXX'; // Your Sandbox Location ID
```

**For Production (Live Payments):**
1. Update `index.html` line 9 to use the production URL:
   ```html
   <script type="text/javascript" src="https://web.squarecdn.com/v1/square.js"></script>
   ```
2. Use your Production Application ID and Location ID

### 4. Test Card Numbers (Sandbox Mode Only)

Use these test cards in Sandbox mode:

| Card Number         | Result                |
|--------------------|-----------------------|
| 4111 1111 1111 1111 | Success              |
| 4000 0000 0000 0002 | Card Declined        |
| 4000 0000 0000 0069 | Expired Card         |
| 4000 0000 0000 0119 | CVV Failure          |

- Use any future expiration date
- Use any 3-digit CVV
- Use any ZIP code

### 5. Processing Real Payments

**Important:** This current implementation only tokenizes cards. To process actual payments, you need:

1. **A Backend Server** - Square requires server-side payment processing
2. **Square Payments API** - Call from your backend
3. **Webhook Handlers** - For payment status updates

#### Quick Backend Setup Options:

**Option A: Vercel Serverless Function**
```javascript
// api/create-payment.js
const { Client, Environment } = require('square');

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox
});

module.exports = async (req, res) => {
  const { sourceId, amountMoney } = req.body;

  try {
    const response = await client.paymentsApi.createPayment({
      sourceId,
      amountMoney,
      locationId: process.env.SQUARE_LOCATION_ID,
      idempotencyKey: crypto.randomUUID()
    });

    res.json({ success: true, payment: response.result.payment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

**Option B: Firebase Functions**
**Option C: AWS Lambda**
**Option D: Express.js Backend**

### 6. Security Checklist

- ✅ Never expose your Access Token in frontend code
- ✅ Use HTTPS for production
- ✅ Validate amounts server-side
- ✅ Implement idempotency keys
- ✅ Set up webhook notifications
- ✅ Log all transactions
- ✅ Handle 3D Secure authentication

## Resources

- [Square Web Payments SDK Guide](https://developer.squareup.com/docs/web-payments/overview)
- [Square API Reference](https://developer.squareup.com/reference/square)
- [Testing in Sandbox](https://developer.squareup.com/docs/devtools/sandbox/payments)
- [Payment API Best Practices](https://developer.squareup.com/docs/payments-api/overview)

## Support

For Square-specific issues, contact [Square Developer Support](https://squareup.com/help/contact).
