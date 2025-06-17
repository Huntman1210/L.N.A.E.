#!/bin/bash

echo "🧪 Running AI Character Creator SaaS Integration Tests"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to run tests
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -e "${YELLOW}Testing: $test_name${NC}"
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS: $test_name${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAIL: $test_name${NC}"
        ((TESTS_FAILED++))
    fi
}

echo "🔍 Checking Prerequisites..."

# Check Node.js
run_test "Node.js installation" "node --version"

# Check npm
run_test "npm installation" "npm --version"

# Check MongoDB
run_test "MongoDB connection" "mongo --eval 'db.runCommand({connectionStatus: 1})'"

echo ""
echo "📦 Checking Dependencies..."

# Check if node_modules exists
run_test "Dependencies installed" "test -d node_modules"

# Check for required packages
run_test "Express installed" "npm list express --depth=0"
run_test "React installed" "npm list react --depth=0"
run_test "Mongoose installed" "npm list mongoose --depth=0"
run_test "Stripe installed" "npm list stripe --depth=0"

echo ""
echo "🔧 Checking Configuration..."

# Check if .env file exists
run_test ".env file exists" "test -f .env"

# Check critical environment variables
if [ -f .env ]; then
    run_test "JWT_SECRET configured" "grep -q 'JWT_SECRET=' .env"
    run_test "MONGODB_URI configured" "grep -q 'MONGODB_URI=' .env"
    run_test "STRIPE_SECRET_KEY configured" "grep -q 'STRIPE_SECRET_KEY=' .env"
fi

echo ""
echo "📁 Checking File Structure..."

# Check server files
run_test "Server entry point exists" "test -f server/server.js"
run_test "Auth routes exist" "test -f server/routes/auth.js"
run_test "Character routes exist" "test -f server/routes/characters.js"
run_test "Subscription routes exist" "test -f server/routes/subscriptions.js"

# Check models
run_test "User model exists" "test -f server/models/User.js"
run_test "Character model exists" "test -f server/models/Character.js"
run_test "SubscriptionPlan model exists" "test -f server/models/SubscriptionPlan.js"

# Check middleware
run_test "Auth middleware exists" "test -f server/middleware/auth.js"
run_test "Usage middleware exists" "test -f server/middleware/usage.js"

# Check services
run_test "Email service exists" "test -f server/services/emailService.js"
run_test "Usage service exists" "test -f server/services/usageService.js"

echo ""
echo "🎨 Checking Frontend Components..."

# Check React components
run_test "App component exists" "test -f src/App.js"
run_test "Auth component exists" "test -f src/components/Auth.js"
run_test "Dashboard component exists" "test -f src/components/Dashboard.js"
run_test "UserProfile component exists" "test -f src/components/UserProfile.js"
run_test "SubscriptionPlans component exists" "test -f src/components/SubscriptionPlans.js"
run_test "UsageAnalytics component exists" "test -f src/components/UsageAnalytics.js"
run_test "Sidebar component exists" "test -f src/components/Sidebar.js"

echo ""
echo "🔨 Testing Build Process..."

# Test if the app can build
echo "Building frontend..."
if npm run build > build.log 2>&1; then
    echo -e "${GREEN}✅ PASS: Frontend build${NC}"
    ((TESTS_PASSED++))
    rm -f build.log
else
    echo -e "${RED}❌ FAIL: Frontend build${NC}"
    echo "Build errors:"
    cat build.log
    ((TESTS_FAILED++))
    rm -f build.log
fi

echo ""
echo "📚 Checking Documentation..."

# Check documentation files
run_test "README exists" "test -f README.md"
run_test "API documentation exists" "test -f docs/API.md"
run_test "Deployment guide exists" "test -f docs/DEPLOYMENT.md"

echo ""
echo "🚀 Testing Server Startup..."

# Test if server can start (timeout after 10 seconds)
echo "Testing server startup..."
timeout 10s npm run server > server.log 2>&1 &
SERVER_PID=$!
sleep 5

if kill -0 $SERVER_PID 2>/dev/null; then
    echo -e "${GREEN}✅ PASS: Server startup${NC}"
    ((TESTS_PASSED++))
    kill $SERVER_PID 2>/dev/null
else
    echo -e "${RED}❌ FAIL: Server startup${NC}"
    echo "Server errors:"
    cat server.log
    ((TESTS_FAILED++))
fi

rm -f server.log

echo ""
echo "📊 Test Results Summary"
echo "======================"
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! Your SaaS application is ready.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Configure your .env file with production values"
    echo "2. Set up your Stripe webhook endpoints"
    echo "3. Deploy to your preferred hosting platform"
    echo "4. Run 'npm run setup-stripe' to create subscription plans"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed. Please fix the issues before deploying.${NC}"
    exit 1
fi
