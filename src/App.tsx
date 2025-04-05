import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
// import Toaster from "./components/ui/toaster";
import { ThemeProvider } from "./components/theme-provider";
import Sidebar from "./components/layout/sidebar";
import Dashboard from "./pages/dashboard";
import Campaigns from "./pages/campaigns";
import CallHistory from "./pages/call-history";
import Billing from "./pages/billing";
import Settings from "./pages/settings";
import NotFound from "./pages/not-found";
import Login from "./pages/login";
import Register from "./pages/register";
import CampaignCreate from "./pages/campaign-create";
import CampaignAudience from "./pages/campaign-audience";
import CampaignConfigure from "./pages/campaign-configure";

// Simple auth context for demo purposes
const isAuthenticated = () => {
  return localStorage.getItem("authenticated") === "true";
};

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-background text-foreground">
        {children}
      </main>
    </div>
  );
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-screen w-screen bg-background text-foreground">
      {children}
    </main>
  );
}

function Router() {
  const [location, setLocation] = useLocation();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Check authentication status on mount and redirect if needed
  useEffect(() => {
    // Exclude auth pages from the redirect
    const isAuthPage = location === "/login" || location === "/register";

    if (!isAuthenticated() && !isAuthPage) {
      setLocation("/login");
    } else if (isAuthenticated() && isAuthPage) {
      setLocation("/dashboard");
    }
    setIsAuthChecked(true);
  }, [location, setLocation]);

  if (!isAuthChecked) {
    return null; // Show nothing until we check auth
  }

  return (
    <Switch>
      <Route path="/login">
        <PublicLayout>
          <Login />
        </PublicLayout>
      </Route>
      <Route path="/register">
        <PublicLayout>
          <Register />
        </PublicLayout>
      </Route>
      <Route path="/">
        <AuthenticatedLayout>
          <Dashboard />
        </AuthenticatedLayout>
      </Route>
      <Route path="/dashboard">
        <AuthenticatedLayout>
          <Dashboard />
        </AuthenticatedLayout>
      </Route>
      <Route path="/campaigns">
        <AuthenticatedLayout>
          <Campaigns />
        </AuthenticatedLayout>
      </Route>
      <Route path="/call-history">
        <AuthenticatedLayout>
          <CallHistory />
        </AuthenticatedLayout>
      </Route>
      <Route path="/billing">
        <AuthenticatedLayout>
          <Billing />
        </AuthenticatedLayout>
      </Route>
      <Route path="/settings">
        <AuthenticatedLayout>
          <Settings />
        </AuthenticatedLayout>
      </Route>
      <Route path="/campaign-create">
        <AuthenticatedLayout>
          <CampaignCreate />
        </AuthenticatedLayout>
      </Route>
      <Route path="/campaign-audience">
        <AuthenticatedLayout>
          <CampaignAudience />
        </AuthenticatedLayout>
      </Route>
      <Route path="/campaign-configure">
        <AuthenticatedLayout>
          <CampaignConfigure />
        </AuthenticatedLayout>
      </Route>
      <Route>
        <AuthenticatedLayout>
          <NotFound />
        </AuthenticatedLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <Router />
        {/* <Toaster /> */}
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
