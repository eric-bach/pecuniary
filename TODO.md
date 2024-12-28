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

- Backend
  X update to use pk/sk
  X Add tests for queries
- Add tests for lambdas

* Frontend - remove "Loading..." on screens, remove landing page for login page, improvements to FE

* Events
  `- Create/Update Position on InvestmentTransactionCreated
      - Update createBankTransaction to publish BankTransactionCreated
      - Update createInvestmentTransaction to publish InvestmentTransactionCreated
      - Update api-stack eventbridge rules to listen to these events
      - Add updateAccount to update Account balances when BankTransactionCreated
      - Update updatePositions to upsert Positions when InvestmentTransactionCreated
`- Create TimeSeries data when SymbolCreated
  `- Update Account on BankTransactionCreated and InvestmentTransactionCreated
* Build dashboard to display account summaries
* Build way to regenerate positions and networth for an account using it's past transactions
* Add more seed data tied to user
  - Build script to generate transaction data from Quicken export
    - Export Quicken
    - Put into CSV (manually)
    - Write script to parse CSV
    - Maintain CSV
* Build lambda process to re-generate positions and point-in-time networth for an account
* Build dashboard to display account summaries
* Switch from Sheet to Dialog for Account and Transactions
  `- BUG: After adding new Creatable type, the newly added type doesn't show up with editing the item
`- BUG: Prevent creating duplicate Payees/Categories in backend especially when editing item (frontend creatable prevents it)
* Improve error message when creating/updating items fails
* Style creatable select to match shadcn
* Style currency input field

#### Tech Debt

- Switch to Next-Auth using CredentialsProvider - https://github.com/dango0812/nextauth-cognito/tree/main
- Switch to using Amplify UI Authenticator component - https://github.com/focusOtter/fullstack-nextjs-cdk-starter/tree/main

##### References

- Budget Tracker
  - https://github.com/monirhabderabby/budget-tracker - Ppb!hZ$#3\*Q9UL
  - https://github.com/AyushGlitch/budget-tracker
- Finance Dashboard
  - https://appfinance.vercel.app/
  - https://github.com/sanidhyy/finance-dashboard
- Shadcn UI examples
  - https://github.com/shadcn-ui/ui
- Auth
  - https://github.com/focusOtter/fullstack-nextjs-cdk-starter/tree/main
  - https://github.com/alexrusin/nextjs-cognito-auth/tree/5-reset-password-end
- Dashboard Template
  - Shadcn
    - https://github.com/bradtraversy/traversypress-ui
    - https://github.com/Kiranism/next-shadcn-dashboard-starter?tab=readme-ov-file
    - https://github.com/sachidumaleesha/shadcn-dashboard
    - https://github.com/horizon-ui/horizon-tailwind-react-nextjs
  - NextUI
    - https://github.com/Siumauricio/nextui-dashboard-template?tab=readme-ov-file
