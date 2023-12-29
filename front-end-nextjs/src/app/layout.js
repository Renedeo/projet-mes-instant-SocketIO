import { Inter } from 'next/font/google'
// import './globals.css'
import '../styles/Login.styles.css'
import { SocketProvider } from '@/Context/SocketContext'
import { AuthProvider } from '@/Context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <SocketProvider>
      <AuthProvider>
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
      </AuthProvider>
    </SocketProvider>
  )
}
