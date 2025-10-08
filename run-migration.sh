#!/bin/bash

echo "============================================"
echo "Running Prisma Migration for Consultation Requests"
echo "============================================"
echo ""

cd "$(dirname "$0")"

echo "Checking database connection..."
npx prisma db pull --force 2>/dev/null
if [ $? -ne 0 ]; then
    echo "ERROR: Cannot connect to database. Please ensure MySQL is running."
    exit 1
fi

echo ""
echo "Creating migration..."
npx prisma migrate dev --name add_consultation_requests

echo ""
echo "Generating Prisma Client..."
npx prisma generate

echo ""
echo "============================================"
echo "Migration Complete!"
echo "============================================"
echo ""
echo "You can now start the backend server with: npm run start:dev"
echo ""

