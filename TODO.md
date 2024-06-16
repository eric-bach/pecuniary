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

- Sort and categorize Accounts in UI
  X Add ability to add category
  X Group and display accounts by category

  - Switch zod implementation to course implementation
    Add link to each accounts page
    Add pagination to accounts list

- User HeroIcons SVG instead of Lucide
- Build ability to add transactions to an Account
- Build way to regenerate positions and networth for an account using it's past transactions
- Add more seed data tied to user
- Build dashboard to display account summaries

#### Tech Debt

- Switch to Next-Auth using CredentialsProvider - https://github.com/dango0812/nextauth-cognito/tree/main
- Switch to using Amplify UI Authenticator component - https://github.com/focusOtter/fullstack-nextjs-cdk-starter/tree/main

##### References

- Auth
  - https://github.com/focusOtter/fullstack-nextjs-cdk-starter/tree/main
  - https://github.com/alexrusin/nextjs-cognito-auth/tree/5-reset-password-end
- Dashboard Template
  - https://github.com/Siumauricio/nextui-dashboard-template?tab=readme-ov-file
