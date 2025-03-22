#### Tasks

X Add authentication middleware - https://www.youtube.com/watch?v=Y3o4or23V-0
X Style Auth pages
X Style verify email
X nextjs_template branch - https://github.com/Siumauricio/nextui-dashboard-template?tab=readme-ov-file
X Add unprotected landing page without navbar/sidebar
X Build out landing page
X Clean out route names (make components/home components/dashboard so app/home can be there)
X Add update password
X Add reset password - https://github.com/alexrusin/nextjs-cognito-auth/tree/5-reset-password-end
X Add resend verification email
X Clean up dashboard template
X Call AppSync APIs
X Fix github actions
X Update packages
X Deploy to AWS Amplify
X Update to codegen 5
X Build accounts page
X Add environment variables to AppSync JS Resolvers/DynamoDB table - https://docs.aws.amazon.com/appsync/latest/devguide/environment-variables.html
X Fix DynamoDB seeding
X Fix add/edit acocunt validation bugs
X Add loading screens
X Migrate rest of backend functions over
X Sort and categorize Accounts in UI
X Switch to shadcn dashboard
X Fix conditional zod validations for Account schema
X Add Toast for Account actions
X Add ability to delete multiple Accounts - data-table.tsx
X Add progress/loading transitions
X Build mobile sidebar
X Combine backend and infrastructure folders
X Clean up data-table, actions, columns
X Add sorting to table
X Create payee/category on add
X Create symbol on add
X Add pages to manage payees, categories, symbols using Dialog instead of Sheet
X Switch to use ComboBox from budget-tracker tutorial
X Switch to sonner
X Add tests to validate APIs and workflows
X Switch frontend to use NextJS 14 with turbo
X Switch transactionsResolver to use AppSync JS pipeline resolvers
X Rearchitect updatePositions/updateBalances to use AppSync JS Resolvers
X UI: (Tanstack) Refresh balance and book/marketValue on Account page when a transaction is added/updated/deleted
X UI: Close dropdown after creating a new symbol, payee, category, etc

##### Current Task

X TD: Remove OTel
X TD: Add Powertools Logger

- TD: Switch logs to powertools Logger

##### Future Tasks

- UI: Use AI coding tool to revamp UI to be more like Quicken input - bolt.new, tempolabs.ai
  https://nsui.irung.me/
  - UI: Style currency input field and remove double tab
  - UI: Style creatable select to match shadcn
  - UI: Improve landing page with Bolt
  - UI: Switch to use shadcn sidebar - https://ui.shadcn.com/docs/components/sidebar
- Arch: Add manual refresh for account balance and bookValue/marketValue, including positions and networth
- UI: Build dashboard to display account summaries
- BE: Add more seed data tied to user
- BE: Build script to generate transaction data from Quicken export
  - Export Quicken
  - Put into CSV (manually)
  - Write script to parse CSV
  - Maintain CSV
- TD: Add additional tests to updateBankAccount and updateInvestmentAccount Lambdas
- Arch: All account types (banking/investment) requires balance, bookValue, and marketValue to be defined
- UI: Improve error message when creating/updating items fails

##### References

- Budget Tracker
  - https://github.com/monirhabderabby/budget-tracker
  - https://github.com/AyushGlitch/budget-tracker
- Finance Dashboard
  - https://appfinance.vercel.app/
  - https://github.com/sanidhyy/finance-dashboard
- Shadcn UI examples
  - https://github.com/shadcn-ui/ui
- Auth
  - AmplifyUI Authenticator - https://github.com/focusOtter/fullstack-nextjs-cdk-starter/tree/main
  - Next-Auth - https://github.com/alexrusin/nextjs-cognito-auth/tree/5-reset-password-end
- Dashboard Template
  - Shadcn
    - https://github.com/bradtraversy/traversypress-ui
    - https://github.com/Kiranism/next-shadcn-dashboard-starter?tab=readme-ov-file
    - https://github.com/sachidumaleesha/shadcn-dashboard
    - https://github.com/horizon-ui/horizon-tailwind-react-nextjs
  - NextUI
    - https://github.com/Siumauricio/nextui-dashboard-template?tab=readme-ov-file
