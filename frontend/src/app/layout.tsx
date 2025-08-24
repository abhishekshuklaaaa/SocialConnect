import React from 'react'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import { NotificationProvider } from '@/components/NotificationContext'
import { ThemeProvider } from '@/components/ThemeProvider'
import ToastContainer from '@/components/Toast'

export const metadata = {
  title: 'SocialConnect',
  description: 'Social Media Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              {children}
              <ToastContainer />
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}