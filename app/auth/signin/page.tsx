'use client'

import { useState, FormEvent, ChangeEvent, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { 
  H1, 
  ErrorSummary, 
  Button,
  GridRow,
  GridCol,
  Label,
  Input
} from "govuk-react";

// Create a component that uses useSearchParams
function SignInContent() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const error = searchParams.get('error')
  
  const [debugMode, setDebugMode] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('student')
  const [loading, setLoading] = useState(false)

  const handleAzureSignIn = async () => {
    setLoading(true)
    await signIn('microsoft-entra-id', { callbackUrl })
  }

  const handleCredentialsSignIn = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    await signIn('credentials', {
      email,
      name,
      role,
      callbackUrl
    })
  }

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value)
  }

  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <GridRow>
      <GridCol setWidth="two-thirds">
        <H1>Sign in to TIS Opportunities</H1>
        
        {error && (
          <ErrorSummary
            heading="There is a problem"
            description={error === 'CredentialsSignin' ? 'Invalid credentials' : error}
          />
        )}

        <Button 
          onClick={handleAzureSignIn}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in with Azure AD'}
        </Button>

        {isDevelopment && (
          <div style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <hr style={{ flex: 1 }} />
              <span className="govuk-body-s">or</span>
              <hr style={{ flex: 1 }} />
            </div>

            <Button
              type="button"
              onClick={() => setDebugMode(!debugMode)}
              buttonColour="#f3f2f1"
              buttonTextColour="#0b0c0c"
            >
              {debugMode ? 'Hide Debug Login' : 'Show Debug Login'}
            </Button>

            {debugMode && (
              <form onSubmit={handleCredentialsSignIn} style={{ marginTop: '1rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={handleEmailChange}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <Label htmlFor="name">Name (optional)</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    name="role"
                    value={role}
                    onChange={handleRoleChange}
                    className="govuk-select"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Debug Sign In'}
                </Button>
              </form>
            )}
          </div>
        )}
      </GridCol>
    </GridRow>
  )
}

// Wrap in Suspense
const SignInPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  )
}

export default SignInPage 