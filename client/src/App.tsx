import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider, useApp } from "@/context/AppContext";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import Layout from "@/components/layout/Layout";
import Shop from "@/pages/shop";
import Chat from "@/pages/chat";
import Cart from "@/pages/cart";
import Admin from "@/pages/admin";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user } = useApp();
  
  if (!user) {
    return <AuthPage />;
  }

  return (
    <Layout>
      <Component />
    </Layout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={AuthPage} />
      
      {/* Protected Routes */}
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/shop">
        <ProtectedRoute component={Shop} />
      </Route>
      <Route path="/chat">
        <ProtectedRoute component={Chat} />
      </Route>
      <Route path="/cart">
        <ProtectedRoute component={Cart} />
      </Route>
      <Route path="/admin">
        <ProtectedRoute component={Admin} />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Router />
        <Toaster />
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
