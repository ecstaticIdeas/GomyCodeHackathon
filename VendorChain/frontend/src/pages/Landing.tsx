import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { ArrowRight, Sparkles, Users, Calendar, MessageSquare } from 'lucide-react'

export default function LandingPage() {
  const currentYear = new Date().getFullYear()

  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">V</div>
            <span className="font-bold text-lg">VendorChain</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
            Connect Events with the Perfect Vendors
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            VendorChain bridges event organizers and service providers. Find trusted vendors, send proposals, and handle payments instantly on the Blockchain.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/signup/organizer" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-14 text-base gap-2 bg-primary hover:bg-primary/90">
                I'm an Organizer
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/signup/vendor" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 text-base gap-2">
                I'm a Vendor
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* ... (Features Section omitted for brevity, looks the same) ... */}
      
    </main>
  )
}