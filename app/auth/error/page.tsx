'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { 
  H1, 
  ErrorSummary, 
  Button,
  GridRow,
  GridCol
} from "govuk-react";

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorPageContent />
    </Suspense>
  )
}

function ErrorPageContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = () => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration. Please contact support.'
      case 'AccessDenied':
        return 'You do not have access to this resource.'
      case 'Verification':
        return 'The verification link may have expired or was already used.'
      case 'CredentialsSignin':
        return 'The provided credentials were invalid.'
      default:
        return 'An unexpected error occurred during authentication.'
    }
  }

  return (
    <GridRow>
      <GridCol setWidth="two-thirds">
        <H1>Authentication Error</H1>
        <ErrorSummary
          heading="There is a problem"
          description={getErrorMessage()}
        />

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Button as={Link} href="/auth/signin">
            Return to Sign In
          </Button>
        </div>
      </GridCol>
    </GridRow>
  )
} 