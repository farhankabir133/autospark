#!/bin/bash

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        PAYMENT GATEWAY TESTING - CUSTOM DOMAIN                 ║${NC}"
echo -e "${BLUE}║        Domain: https://autosparkbd.com/                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Test variables
CUSTOM_DOMAIN="https://autosparkbd.com"
LOCALHOST="http://localhost:5174"
APPWRITE_ENDPOINT="https://sgp.cloud.appwrite.io/v1"
PROJECT_ID="69d09ead0018cd1663a7"
FUNCTION_ID="sslcommerz-api"
STORE_ID="autosparkbd0live"

echo -e "${YELLOW}1️⃣  CHECKING CUSTOM DOMAIN ACCESSIBILITY${NC}"
echo "─────────────────────────────────────────────────────────────────"

if timeout 5 curl -I -s "$CUSTOM_DOMAIN" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Custom domain is ACCESSIBLE${NC}"
    echo "   URL: $CUSTOM_DOMAIN"
else
    echo -e "${YELLOW}⚠️  Custom domain may not be deployed yet${NC}"
    echo "   Trying to reach: $CUSTOM_DOMAIN"
    echo "   If this fails, you may need to deploy to your custom domain"
fi
echo ""

echo -e "${YELLOW}2️⃣  CHECKING LOCALHOST DEVELOPMENT SERVER${NC}"
echo "─────────────────────────────────────────────────────────────────"

if timeout 5 curl -I -s "$LOCALHOST" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Local dev server is RUNNING${NC}"
    echo "   URL: $LOCALHOST"
else
    echo -e "${RED}❌ Local dev server is NOT running${NC}"
    echo "   Start it with: npm run dev"
fi
echo ""

echo -e "${YELLOW}3️⃣  CHECKING APPWRITE PROJECT STATUS${NC}"
echo "─────────────────────────────────────────────────────────────────"

if timeout 5 curl -I -s "$APPWRITE_ENDPOINT" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Appwrite endpoint is ACCESSIBLE${NC}"
    echo "   Endpoint: $APPWRITE_ENDPOINT"
    echo "   Project ID: $PROJECT_ID"
    echo "   Function ID: $FUNCTION_ID"
else
    echo -e "${RED}❌ Appwrite endpoint is NOT accessible${NC}"
fi
echo ""

echo -e "${YELLOW}4️⃣  CHECKING ENVIRONMENT VARIABLES${NC}"
echo "─────────────────────────────────────────────────────────────────"

# Source .env.local if it exists
if [ -f ".env.local" ]; then
    source .env.local
    echo -e "${GREEN}✅ .env.local file found${NC}"
    echo "   VITE_PAYMENT_API_URL: ${VITE_PAYMENT_API_URL:-NOT SET}"
    echo "   VITE_APPWRITE_FUNCTION_ID: ${VITE_APPWRITE_FUNCTION_ID:-NOT SET}"
    echo "   VITE_SSLCOMMERZ_STORE_ID: ${VITE_SSLCOMMERZ_STORE_ID:-NOT SET}"
    echo "   VITE_SSLCOMMERZ_LIVE_MODE: ${VITE_SSLCOMMERZ_LIVE_MODE:-NOT SET}"
else
    echo -e "${RED}❌ .env.local file NOT found${NC}"
fi
echo ""

echo -e "${YELLOW}5️⃣  CHECKING BUILD STATUS${NC}"
echo "─────────────────────────────────────────────────────────────────"

if [ -d "dist" ]; then
    FILE_COUNT=$(find dist -type f | wc -l)
    echo -e "${GREEN}✅ Build directory exists${NC}"
    echo "   Files in dist/: $FILE_COUNT"
    
    if [ -f "dist/index.html" ]; then
        echo -e "${GREEN}✅ index.html found in dist/${NC}"
    else
        echo -e "${RED}❌ index.html NOT found in dist/${NC}"
    fi
else
    echo -e "${RED}❌ dist directory does NOT exist${NC}"
    echo "   Run: npm run build"
fi
echo ""

echo -e "${YELLOW}6️⃣  CHECKING APPWRITE FUNCTION${NC}"
echo "─────────────────────────────────────────────────────────────────"

if [ -f "functions/sslcommerz-api/src/main.ts" ]; then
    echo -e "${GREEN}✅ Appwrite function source found${NC}"
    echo "   File: functions/sslcommerz-api/src/main.ts"
    
    # Check if function mentions custom domain
    if grep -q "autosparkbd.com" functions/sslcommerz-api/src/*.ts; then
        echo -e "${GREEN}✅ Custom domain references found in function${NC}"
    else
        echo -e "${YELLOW}⚠️  Custom domain not found in function code${NC}"
    fi
else
    echo -e "${RED}❌ Appwrite function source NOT found${NC}"
fi
echo ""

echo -e "${YELLOW}7️⃣  CHECKING PAYMENT CONFIGURATION${NC}"
echo "─────────────────────────────────────────────────────────────────"

if [ -f "src/config/payment.ts" ]; then
    echo -e "${GREEN}✅ Payment config file found${NC}"
    
    if grep -q "autosparkbd.com" src/config/payment.ts; then
        echo -e "${GREEN}✅ Custom domain URL configured${NC}"
    else
        echo -e "${YELLOW}⚠️  Custom domain URL not found in payment config${NC}"
    fi
else
    echo -e "${RED}❌ Payment config file NOT found${NC}"
fi
echo ""

echo -e "${YELLOW}8️⃣  CHECKING ACCESSORIES PAGE${NC}"
echo "─────────────────────────────────────────────────────────────────"

if [ -f "src/pages/AccessoriesPage.tsx" ]; then
    echo -e "${GREEN}✅ AccessoriesPage found${NC}"
    
    if grep -q "useCart" src/pages/AccessoriesPage.tsx; then
        echo -e "${GREEN}✅ Cart integration confirmed${NC}"
    else
        echo -e "${RED}❌ Cart integration NOT found${NC}"
    fi
else
    echo -e "${RED}❌ AccessoriesPage NOT found${NC}"
fi
echo ""

echo -e "${YELLOW}9️⃣  CHECKING PAYMENT PAGE${NC}"
echo "─────────────────────────────────────────────────────────────────"

if [ -f "src/pages/PaymentPage.tsx" ]; then
    echo -e "${GREEN}✅ PaymentPage found${NC}"
    
    if grep -q "createExecution" src/pages/PaymentPage.tsx; then
        echo -e "${GREEN}✅ Appwrite function integration confirmed${NC}"
    else
        echo -e "${RED}❌ Appwrite function integration NOT found${NC}"
    fi
else
    echo -e "${RED}❌ PaymentPage NOT found${NC}"
fi
echo ""

echo -e "${YELLOW}🔟 CHECKING GIT STATUS${NC}"
echo "─────────────────────────────────────────────────────────────────"

if git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Git repository found${NC}"
    
    LATEST_COMMIT=$(git log -1 --oneline 2>/dev/null)
    echo "   Latest commit: $LATEST_COMMIT"
    
    if [ -z "$(git status --porcelain)" ]; then
        echo -e "${GREEN}✅ Working tree is clean${NC}"
    else
        echo -e "${YELLOW}⚠️  Uncommitted changes detected${NC}"
    fi
else
    echo -e "${RED}❌ Not a git repository${NC}"
fi
echo ""

echo "─────────────────────────────────────────────────────────────────"
echo -e "${BLUE}TESTING SUMMARY${NC}"
echo "─────────────────────────────────────────────────────────────────"
echo ""

echo -e "${BLUE}📋 DEPLOYMENT OPTIONS:${NC}"
echo ""
echo "Option 1: Test on LOCALHOST (Development)"
echo "  ├─ Command: npm run dev"
echo "  ├─ URL: http://localhost:5174/accessories"
echo "  └─ Good for: Quick testing, debugging"
echo ""
echo "Option 2: Deploy to CUSTOM DOMAIN (Production)"
echo "  ├─ Prerequisites:"
echo "  │  ├─ Domain: https://autosparkbd.com/"
echo "  │  ├─ DNS configured"
echo "  │  ├─ SSL certificate"
echo "  │  └─ Web hosting/server setup"
echo "  ├─ Steps:"
echo "  │  ├─ npm run build"
echo "  │  ├─ Upload dist/ to hosting"
echo "  │  └─ Configure web server"
echo "  └─ Good for: Production testing with real domain"
echo ""

echo -e "${BLUE}🧪 PAYMENT TESTING FLOW:${NC}"
echo ""
echo "1. Choose either localhost OR custom domain (see above)"
echo "2. Navigate to: [YOUR_URL]/accessories"
echo "3. Add product to cart"
echo "4. Click 'Proceed to Checkout'"
echo "5. Fill billing information"
echo "6. Click 'Place Order'"
echo "7. Verify redirect to SSLCommerz payment gateway"
echo ""

echo -e "${BLUE}⚠️  IMPORTANT NOTES:${NC}"
echo ""
echo "• Appwrite Project Status:"
if [ -n "$VITE_APPWRITE_PROJECT_ID" ]; then
    echo "  ├─ Project ID: $VITE_APPWRITE_PROJECT_ID"
    echo "  └─ Must be RESTORED (not paused) for payment to work"
else
    echo "  └─ Appwrite configuration not loaded"
fi
echo ""
echo "• SSLCommerz Gateway:"
echo "  ├─ Store ID: $STORE_ID"
echo "  ├─ Mode: LIVE (Production)"
echo "  └─ Status: Ready for testing"
echo ""

echo -e "${BLUE}📞 QUICK REFERENCE:${NC}"
echo ""
echo "Custom Domain: $CUSTOM_DOMAIN"
echo "Localhost: $LOCALHOST"
echo "Appwrite Endpoint: $APPWRITE_ENDPOINT"
echo "Function ID: $FUNCTION_ID"
echo ""

echo "═════════════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ Test script completed!${NC}"
echo "═════════════════════════════════════════════════════════════════"
