# TIS Opportunities Platform

This application allows students at The International School to browse and apply for internship and service opportunities.

## Tech Stack

- Next.js 15.x
- TypeScript
- Prisma
- GOV.UK Design System (via govuk-react)
- Microsoft Entra ID Authentication

## Getting Started

1. Clone the repository
2. Create a `.env.local` file using the `.env.local.example` as a template
3. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Authentication

This application uses Microsoft Entra ID (Azure AD) for authentication. You'll need to set up your Entra ID tenant and register an application to get the required client ID, client secret, and tenant ID.

## Design System

This application follows the GOV.UK Design System guidelines and uses the govuk-react component library. The key components used include:

- TopNav: For the main navigation
- GridRow/GridCol: For page layout
- Panel: For information displays
- Buttons: For action items
- Form components: For data entry
- Typography components: For consistent text styling (H1, H2, Paragraph, etc.)

## Project Structure

- `/app`: Next.js app router with pages and components
- `/app/api`: API routes including authentication
- `/app/components`: Shared React components
- `/lib`: Utility functions and types
- `/prisma`: Database schema and client

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
