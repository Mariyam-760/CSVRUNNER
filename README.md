CSV Runner Dashboard
A Next.js application for analyzing and visualizing running data from CSV files. Track individual and team running metrics with interactive charts and comprehensive statistics.
📋 Project Overview
CSV Runner Dashboard is a web-based analytics tool that allows users to upload CSV files containing running data and instantly view comprehensive statistics and visualizations. The application provides both global team metrics and per-person breakdowns with interactive charts powered by Recharts.
🎯 Key Features

CSV Upload & Validation: Robust parsing with detailed error messages
Global Dashboard: Team-wide running statistics and trends
Per-Person Analytics: Individual runner performance metrics
Interactive Visualizations: Dynamic charts showing miles over time and distribution
Responsive Design: Works seamlessly on desktop, tablet, and mobile devices
Error Handling: Comprehensive validation with user-friendly error messages
Empty States: Clear guidance when no data is loaded

🔧 Assumptions

Date Format: Dates in CSV should be in YYYY-MM-DD format (e.g., 2024-01-15)
Required Headers: CSV must contain exactly three columns: date, person, miles run
Data Types:

date: Valid date string
person: Any string (case-sensitive)
miles run: Positive number (decimals allowed)


No Empty Rows: All rows must contain valid data (empty rows will trigger validation errors)
File Size: Designed for typical running logs (up to several thousand entries)
Browser Support: Modern browsers with ES6+ support

📦 Prerequisites
Before you begin, ensure you have the following installed:

Node.js: Version 18.17 or higher
npm: Version 9.0 or higher (comes with Node.js)
Git: For cloning the repository (optional)

To verify your installations:
bashnode --version  # Should output v18.17.0 or higher
npm --version   # Should output 9.0.0 or higher
🚀 Setup Instructions
1. Clone or Download the Repository
bashgit clone <repository-url>
cd csv-runner-dashboard
Or download and extract the ZIP file.
2. Install Dependencies
bashnpm install
This will install all required packages including:

Next.js 14+ (App Router)
React 18+
TypeScript
shadcn/ui components
Recharts
PapaParse
Tailwind CSS
Lucide React (icons)

3. Environment Configuration
Create a .env.local file in the root directory:
bashcp .env.example .env.local
Note: This project doesn't require environment variables for basic functionality. The .env.example file is provided for future extensibility (e.g., API endpoints, analytics keys).
4. Development Server
Start the development server:
bashnpm run dev
The application will be available at: http://localhost:3000
5. Build for Production (Optional)
To create an optimized production build:
bashnpm run build
npm start

✅ Verification & Testing
Acceptance Criteria Checklist
1. CSV Upload & Parsing
 Navigate to http://localhost:3000
 Click "Upload CSV" button or drag-and-drop a file
 Upload the sample file from /public/sample.csv
 Verify data loads without errors

2. Header Validation
 Create a CSV with wrong headers (e.g., date,name,distance)
 Upload the file
 Verify error message: "Invalid CSV headers"

3. Date Format Validation
 Create a CSV with invalid date (e.g., 32/13/2024)
 Upload the file
 Verify error message specifying the row with invalid date

4. Numeric Validation
 Create a CSV with non-numeric miles (e.g., "five")
 Upload the file
 Verify error message specifying the row with invalid number

5. Empty Row Validation
 Create a CSV with empty rows
 Upload the file
 Verify error message about empty rows

6. Overall Summary Metrics
 Upload valid CSV
 Verify "Overall Dashboard" shows:
Total Miles
Average Miles
Minimum Miles
Maximum Miles

7. Per-Person Metrics
 Select a person from the dropdown
 Verify dashboard shows person-specific:
Total Miles
Average Miles
Minimum Miles
Maximum Miles

8. Global Visualization
 On "Overall Dashboard" tab
 Verify line chart showing miles over time (all runners)
 Verify bar chart showing total miles by person

9. Per-Person Visualization
 Select a person from dropdown
 Verify line chart showing that person's miles over time
 Verify distribution chart (bar chart) of their runs

10. Responsive Design
 Resize browser window to mobile size (375px)
 Verify layout adapts gracefully
 Test on tablet size (768px)
 Verify charts remain readable

11. State Management
 Upload a CSV
 Switch between "Overall" and person views
 Verify data persists across view changes
 Upload a new CSV
 Verify old data is replaced

🎨 Sample Data
A sample CSV file is provided at /public/sample.csv. Download it directly from the app or use this format:
csvdate,person,miles run
2024-01-01,Alice,3.5
2024-01-01,Bob,5.2
2024-01-02,Alice,4.1
2024-01-02,Bob,3.8
2024-01-03,Alice,5.0
2024-01-03,Bob,6.1
2024-01-04,Charlie,4.5
2024-01-05,Alice,3.2
2024-01-05,Bob,7.0
2024-01-05,Charlie,5.5
Creating Test Files:
Valid CSV:
csvdate,person,miles run
2024-01-15,John,5.5
2024-01-16,Jane,6.2
Invalid Headers:
csvdate,name,distance
2024-01-15,John,5.5
Invalid Date:
csvdate,person,miles run
2024-13-45,John,5.5
Invalid Miles:
csvdate,person,miles run
2024-01-15,John,five miles
```

## 📁 Architecture & Project Structure
```
csv-runner-dashboard/
├── .env.example
├── .gitignore
├── README.md
├── next.config.js
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── public/
│   └── sample.csv
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── dashboard/
│   │       └── page.tsx          # Dashboard UI page
│   ├── components/
│   │   ├── ui/                   # All shadcn components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── alert.tsx
│   │   │   └── ...others
│   │   ├── csv-upload.tsx        # Handles CSV upload
│   │   ├── summary-cards.tsx     # Cards showing metrics
│   │   ├── overall-chart.tsx     # Global chart
│   │   ├── person-chart.tsx      # Per-person chart
│   │   ├── error-alert.tsx       # Error messages
│   │   └── navbar.tsx            # Optional top navigation
│   ├── lib/
│   │   ├── parseCsv.ts           # CSV parsing logic
│   │   ├── validateCsv.ts        # CSV validation logic
│   │   └── computeMetrics.ts     # Metrics calculation
│   └── types/
│       └── index.ts              # TypeScript types for CSV rows



🎯 Features & Capabilities
✅ Implemented
✅ CSV upload via file picker or drag-and-drop
✅ Comprehensive validation (headers, dates, numbers, empty rows)
✅ Global statistics (total, average, min, max miles)
✅ Per-person statistics with dropdown selection
✅ Time series line chart (miles over time)
✅ Bar charts (total by person, distribution)
✅ Responsive design (mobile, tablet, desktop)
✅ Error handling with detailed messages
✅ Empty states with helpful guidance
✅ Loading states during parsing
✅ Sample CSV download
✅ Data persistence across view switches

🔮 Limitations & Future Enhancements
Current Limitations:
Data stored in memory (resets on page refresh)
No export functionality (CSV/PDF)
Limited to single CSV at a time
No date range filtering
Basic chart customization

Potential Enhancements:
 LocalStorage persistence
 Multiple CSV comparison
 Date range picker
 Goal tracking & milestones
 Export reports (PDF, Excel)
 Weekly/Monthly aggregations
 Pace calculations (min/mile)
 Leaderboards
 Dark mode support
 Advanced filtering & sorting
 User authentication
 Cloud storage integration

♿ Accessibility
This application follows WCAG 2.1 Level AA guidelines:
Implemented Features

Keyboard Navigation
All interactive elements accessible via keyboard
Tab order follows logical flow
File upload accessible via Enter/Space


Screen Reader Support
Semantic HTML elements
ARIA labels on interactive components
Alt text for icons (via Lucide React)
Descriptive button labels


Visual Accessibility
Sufficient color contrast ratios (4.5:1 minimum)
Focus indicators on all interactive elements
Error messages with icons and text
Responsive text sizing


Forms & Input
Clear labels for all inputs
Error messages associated with inputs
File upload feedback


Charts
Recharts provides basic keyboard navigation
Tooltip data accessible on hover/focus
Color schemes designed for color blindness

Testing Recommendations
Test with screen readers (NVDA, JAWS, VoiceOver)
Verify keyboard-only navigation
Check color contrast with tools like WebAIM
Test with browser zoom (200%+)

🐛 Troubleshooting
Common Issues
Issue: npm install fails

Solution: Delete node_modules and package-lock.json, then run npm install again
Ensure Node.js version is 18.17+

Issue: Port 3000 already in use

Solution: Use a different port: npm run dev -- -p 3001
Or kill the process using port 3000

Issue: CSV not parsing correctly

Solution: Verify CSV format matches exactly: date,person,miles run
Check for hidden characters or wrong line endings
Ensure dates are in YYYY-MM-DD format

Issue: Charts not displaying

Solution: Check browser console for errors
Verify data has been loaded successfully
Try refreshing the page

Issue: Styles not loading

Solution: Clear browser cache
Restart development server
Verify Tailwind CSS is configured correctly

📚 Additional Resources

Next.js Documentation
shadcn/ui Components
Recharts Documentation
PapaParse Documentation
TypeScript Handbook

📄 License
MIT License - feel free to use this project for personal or commercial purposes.

Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request

