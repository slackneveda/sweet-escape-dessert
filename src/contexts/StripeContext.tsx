import React, { createContext, useContext } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe('pk_test_51RnoADC2x3xqWzx4bJrS0MFF1eCID80RUy9c4RFWptwhq6khTbv5zeW3AwCufPgdlemEg6HjIsCSjEhida7n4rTO00ue0yFARw')

interface StripeContextType {
  // We can add custom methods here if needed
}

const StripeContext = createContext<StripeContextType | undefined>(undefined)

export function StripeProvider({ children }: { children: React.ReactNode }) {
  return (
    <Elements 
      stripe={stripePromise}
      options={{
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#B7410E', // Rust color
            colorBackground: '#ffffff',
            colorText: '#B7410E',
            colorDanger: '#df1b41',
            fontFamily: 'Inter, system-ui, sans-serif',
            spacingUnit: '2px',
            borderRadius: '8px',
          },
        },
      }}
    >
      <StripeContext.Provider value={{}}>
        {children}
      </StripeContext.Provider>
    </Elements>
  )
}

export function useStripe() {
  const context = useContext(StripeContext)
  if (context === undefined) {
    throw new Error('useStripe must be used within a StripeProvider')
  }
  return context
}