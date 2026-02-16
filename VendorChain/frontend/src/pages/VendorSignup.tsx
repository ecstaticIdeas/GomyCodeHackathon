import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { ArrowLeft, Mail, Lock, User, Store } from 'lucide-react'
import { useWeb3 } from '../context/Web3Context'

export default function VendorSignupPage() {
  const navigate = useNavigate()
  const { connectWallet } = useWeb3()
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Here we would normally save the form data to a DB
    // For now, we connect wallet to proceed
    await connectWallet()
    navigate('/dashboard') // Redirect to dashboard to complete registration
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
            <div className="w-12 h-12 rounded-lg bg-accent text-accent-foreground flex items-center justify-center font-bold mx-auto mb-4">V</div>
            <h1 className="text-2xl font-bold">Become a Vendor</h1>
            <p className="text-muted-foreground">Start offering your services</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Business Name</label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input placeholder="Your Business Name" className="pl-10" required />
              </div>
            </div>
             {/* Keep other fields for visual if needed... */}
            
            <Button type="submit" className="w-full h-11 text-base bg-accent hover:bg-accent/90" disabled={loading}>
              {loading ? 'Connecting...' : 'Connect Wallet & Create Account'}
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}