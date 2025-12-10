Quick instructions for creating survey links and viewing the dashboard

1) Open the app (developer environment)
   - Frontend: http://localhost:3000
   - Backend: http://localhost:4000

2) Create a survey (Survey Management)
   - Go to "Survey Management" → "Create New".
   - Enter the company name, choose survey type (managers/employees/mixed), and select the primary module.
   - Click "Create Survey". This saves the survey and generates two links: a Survey Link (send to participants) and a Dashboard Link (view results).
   - Use the copy button next to each link to copy to clipboard.

3) Send the Survey Link to participants
   - Participants open the survey link in their browser and complete the questions.
   - Responses are stored and aggregated automatically.

4) View results
   - Open the Dashboard Link. The top banner shows the company name and survey id.
   - The dashboard displays module analytics (AI Readiness, Leadership, Employee Experience) derived from responses.

Notes and troubleshooting
- For local demos we use a development helper token (dev-token). If you see an authorization error when submitting responses, ensure the backend is running locally and the dev-token endpoint is enabled (development only).
- To reset sample data, create a new survey; each survey has its own id and link.
- Do NOT expose the dev environment publicly; we will harden auth and remove the dev-token before sharing externally.

If you'd like, I can make the Survey Management flow even more boss-friendly:
- Add an explicit "Create and Open Survey" button that opens the survey in a new tab immediately after creation.
- Add a "Preview" button to see the survey flow before sending.

Tell me which of the two (Create+Open or Preview) you prefer and I'll add it next.