import React, { useState } from 'react'
import { Card, Button } from '@shared/components'
import { useTheme, useAppDispatch, uiActions } from '@shared/store'

export const Contact: React.FC = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const containerStyle = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#000000',
    minHeight: '100vh',
    padding: '2rem',
  }

  const inputStyle = {
    backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
    borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
    color: theme === 'dark' ? '#ffffff' : '#000000',
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      dispatch(uiActions.addNotification({
        notification: {
          type: 'success',
          title: 'Message Sent!',
          message: 'Thank you for contacting us. We\'ll get back to you within 24 hours.',
          dismissible: true,
        },
      }))

      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
      })
    } catch (error) {
      dispatch(uiActions.addNotification({
        notification: {
          type: 'error',
          title: 'Error',
          message: 'Failed to send message. Please try again.',
          dismissible: true,
        },
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      title: 'Sales Inquiries',
      email: 'sales@corp-auth.com',
      phone: '+1 (555) 123-4567',
      description: 'Questions about our services and pricing',
    },
    {
      title: 'Technical Support',
      email: 'support@corp-auth.com',
      phone: '+1 (555) 123-4568',
      description: 'Help with integration and technical issues',
    },
    {
      title: 'Partnership',
      email: 'partners@corp-auth.com',
      phone: '+1 (555) 123-4569',
      description: 'Explore partnership opportunities',
    },
  ]

  return (
    <div style={containerStyle}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl opacity-75 max-w-2xl mx-auto">
            Get in touch with our team. We're here to help you with any questions about our services.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg"
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg"
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium mb-2">
                  Company Name
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                  style={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                  style={inputStyle}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="sales">Sales Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full p-3 border rounded-lg"
                  style={inputStyle}
                  placeholder="Tell us how we can help you..."
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                loading={isSubmitting}
                disabled={!formData.name || !formData.email || !formData.subject || !formData.message}
              >
                Send Message
              </Button>
            </form>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
                    <p className="opacity-75 mb-3">{info.description}</p>
                    <div className="space-y-1">
                      <p>
                        <span className="font-medium">Email:</span>{' '}
                        <a
                          href={`mailto:${info.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {info.email}
                        </a>
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span>{' '}
                        <a
                          href={`tel:${info.phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {info.phone}
                        </a>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Office Hours</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Monday - Friday:</span> 9:00 AM - 6:00 PM EST</p>
                <p><span className="font-medium">Saturday:</span> 10:00 AM - 4:00 PM EST</p>
                <p><span className="font-medium">Sunday:</span> Closed</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm opacity-75">
                  For urgent technical issues outside business hours, please email support with
                  "URGENT" in the subject line.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}