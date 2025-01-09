import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Vote from './vote';
import Editor from './Editor';
import { Toaster } from "@/components/ui/toaster";

import PollResults from './Poll';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader } from './components/ui/card';
import { ChartColumn, Coins, PackageOpen, Users } from 'lucide-react';

const Home = () => 
  <div className="min-h-screen flex flex-col">
  <main>
    <section className="hero bg-primary text-white py-20 lg:py-32">
      <div className="container mx-auto text-center px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">Create Live Polls in Seconds</h1>
        <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
          Create a poll and share it with your friends, family, students or coworkers. Open-source, real-time, and completely free.
        </p>
        <Button 
          size="lg" 
          variant="secondary"
          className="text-lg px-8 py-6"
          onClick={() => { location.href = "/editor"; }}
        >
          Create Your Poll
        </Button>
      </div>
    </section>

    <section className="features py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose My Polling App?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Live Polls", icon: ChartColumn, description: "Create and manage live polls in real-time" },
            { title: "Unlimited Participants", icon: Users, description: "No limit on the number of voters" },
            { title: "Open-Source", icon: PackageOpen, description: "Transparent and community-driven development" },
            { title: "Always Free", icon: Coins, description: "No hidden costs, free forever" }
          ].map((feature, index) => (
            <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-xl font-semibold text-center pb-2">{feature.title}</CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <feature.icon size={48} className="text-primary mb-4"/>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>


    <section className="cta bg-secondary text-white py-20">
      <div className="container mx-auto text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-secondary-foreground">Ready to create your first poll?</h2>
        <p className="text-xl text-secondary-foreground/90 mb-8 max-w-2xl mx-auto">
          Join our community and start creating engaging polls today!
        </p>
        <Button 
          variant="default" 
          size="lg"
          className="text-lg px-8 py-6"
          onClick={() => { location.href = "/editor"; }}
        >
          Get Started Now
        </Button>
      </div>
    </section>
  </main>

  {/* Footer */}
  <footer className="w-full text-center p-6 bg-background border-t border-border">
    <p className="text-muted-foreground">
      &copy; {new Date().getFullYear()} Hexagonical | VotingApp is an open-source project
    </p>
  </footer>
  </div>
  ;

function App() {
  if (localStorage.getItem('uuid') === null) {
    localStorage.setItem('uuid', crypto.randomUUID());
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vote/:pollid" element={<Vote />} />
        <Route path='/editor' element={<Editor />} />
        <Route path="/poll/:pollid" element={<PollResults />} />
        <Route path='*' element={<h1>404</h1>} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;