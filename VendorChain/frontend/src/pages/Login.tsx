import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { ArrowLeft, Mail, Lock } from 'lucide-react'
import { useWeb3 } from '../context/Web3Context'

export default function LoginPage() {
  const navigate = useNavigate()
  const { connectWallet } = useWeb3()
  const [loading, setLoading] = useState(false)

  // NOTE: For the Hackathon, we are bypassing Email/Pass and using Wallet
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await connectWallet()
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold mx-auto mb-4">V</div>
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your VendorHub account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input type="email" placeholder="you@example.com" className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input type="password" placeholder="********" className="pl-10" />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
              {loading ? 'Connecting...' : 'Sign In with Wallet'}
            </Button>
          </form>

          <div className="flex gap-3">
            <Link to="/signup/organizer" className="flex-1">
              <Button variant="outline" className="w-full">Sign up Organizer</Button>
            </Link>
            <Link to="/signup/vendor" className="flex-1">
              <Button variant="outline" className="w-full">Sign up Vendor</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}