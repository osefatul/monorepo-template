import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Button } from '@shared/components'
import { useAuth, useTheme } from '@shared/store'

export const Home: React.FC = () => {
  const auth = useAuth()
  const theme = useTheme()

  const containerStyle = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#000000',
    minHeight: '100vh',
    padding: '2rem',
  }

  const features = [
    {
      title: 'Digital Signing',
      description: 'Securely sign documents with our advanced digital signature technology.',
      icon: '✍️',
    },
    {
      title: 'Document Verification',
      description: 'Verify the authenticity and integrity of signed documents.',
      icon: '🔍',
    },
    {
      title: 'Partnership Portal',
      description: 'Access partnership resources and collaboration tools.',
      icon: '🤝',
    },
    {
      title: '24/7 Support',
      description: 'Get help when you need it with our round-the-clock support.',
      icon: '💬',
    },
  ]

  return (
    <div style={containerStyle}>
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto text-center py-16">
        <h1 className="text-5xl font-bold mb-6">
          Corporate Authentication & Signing
        </h1>
        <p className="text-xl opacity-75 mb-8 max-w-3xl mx-auto">
          Streamline your document workflows with secure digital signatures and authentication services.
          Trusted by leading organizations worldwide.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {auth.user ? (
            <Link to="/signing">
              <Button variant="primary" size="large">
                Access Signing Portal
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button variant="primary" size="large">
                Get Started
              </Button>
            </Link>
          )}
          <Link to="/contact">
            <Button variant="outline" size="large">
              Contact Sales
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Our Platform?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="opacity-75">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto text-center py-16">
        <Card className="p-12">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg opacity-75 mb-8">
            Join thousands of organizations that trust our platform for their document signing needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/partnership">
              <Button variant="primary" size="large">
                Become a Partner
              </Button>
            </Link>
            <Link to="/support">
              <Button variant="outline" size="large">
                Learn More
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}