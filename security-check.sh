#!/bin/bash

# 🔒 Security Pre-Push Verification Script
# Run this before pushing to GitHub to ensure no secrets are committed

echo "🔒 Running Security Checks..."
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Check 1: .env file should not exist in repo
echo "📋 Check 1: Verifying .env files are not tracked..."
if [ -f .env ]; then
    if git ls-files --error-unmatch .env > /dev/null 2>&1; then
        echo -e "${RED}❌ FAIL: .env file is being tracked by git!${NC}"
        echo "   Run: git rm --cached .env"
        FAILED=$((FAILED+1))
    else
        echo -e "${GREEN}✅ PASS: .env file exists but is ignored by git${NC}"
        PASSED=$((PASSED+1))
    fi
else
    echo -e "${GREEN}✅ PASS: No .env file in repository${NC}"
    PASSED=$((PASSED+1))
fi

# Check 2: Search for potential API keys in code
echo ""
echo "📋 Check 2: Scanning for hardcoded API keys..."
SUSPICIOUS=$(grep -r "api[_-]key.*=.*['\"].*[a-zA-Z0-9]" src/ 2>/dev/null | grep -v "YOUR_" | grep -v "import.meta.env" | grep -v "console.log" || true)
if [ -z "$SUSPICIOUS" ]; then
    echo -e "${GREEN}✅ PASS: No hardcoded API keys found${NC}"
    PASSED=$((PASSED+1))
else
    echo -e "${RED}❌ FAIL: Potential API keys found:${NC}"
    echo "$SUSPICIOUS"
    FAILED=$((FAILED+1))
fi

# Check 3: Check for placeholder values still in code
echo ""
echo "📋 Check 3: Verifying placeholder values..."
if grep -q "import.meta.env.VITE_" src/api/jobsApi.js; then
    echo -e "${GREEN}✅ PASS: Using environment variables for API keys${NC}"
    PASSED=$((PASSED+1))
else
    echo -e "${YELLOW}⚠️  WARNING: Not using environment variables${NC}"
fi

# Check 4: Verify .gitignore contains .env
echo ""
echo "📋 Check 4: Checking .gitignore..."
if grep -q "^\.env$" .gitignore || grep -q "^.env$" .gitignore; then
    echo -e "${GREEN}✅ PASS: .env is in .gitignore${NC}"
    PASSED=$((PASSED+1))
else
    echo -e "${RED}❌ FAIL: .env is NOT in .gitignore!${NC}"
    FAILED=$((FAILED+1))
fi

# Check 5: Verify node_modules is ignored
echo ""
echo "📋 Check 5: Checking node_modules..."
if grep -q "node_modules" .gitignore; then
    echo -e "${GREEN}✅ PASS: node_modules is in .gitignore${NC}"
    PASSED=$((PASSED+1))
else
    echo -e "${RED}❌ FAIL: node_modules is NOT in .gitignore!${NC}"
    FAILED=$((FAILED+1))
fi

# Check 6: Look for TODO or FIXME with security implications
echo ""
echo "📋 Check 6: Checking for security TODOs..."
SECURITY_TODOS=$(grep -ri "TODO.*\(password\|api.*key\|secret\)" src/ 2>/dev/null || true)
if [ -z "$SECURITY_TODOS" ]; then
    echo -e "${GREEN}✅ PASS: No security-related TODOs found${NC}"
    PASSED=$((PASSED+1))
else
    echo -e "${YELLOW}⚠️  WARNING: Security TODOs found:${NC}"
    echo "$SECURITY_TODOS"
fi

# Summary
echo ""
echo "================================================"
echo "           🔒 SECURITY AUDIT SUMMARY"
echo "================================================"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED!${NC}"
    echo ""
    echo "🚀 Your repository is SECURE and ready to push!"
    echo ""
    echo "Next steps:"
    echo "1. git add ."
    echo "2. git commit -m \"Initial commit: Real job listings app\""
    echo "3. git remote add origin <your-repo-url>"
    echo "4. git push -u origin main"
    echo ""
    exit 0
else
    echo -e "${RED}❌ SECURITY ISSUES FOUND!${NC}"
    echo ""
    echo "Please fix the issues above before pushing."
    echo "Review SECURITY.md for more information."
    echo ""
    exit 1
fi
