import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Pill, AlertCircle, ShoppingBag, TrendingUp, Clock, FileText, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { user, alerts, orders } = useApp();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Hello, {user?.name.split(' ')[0]} 👋
          </h1>
          <p className="text-muted-foreground">Here's your health overview for today.</p>
        </div>
        <Link href="/chat">
          <Button size="lg" className="shadow-lg shadow-primary/25 rounded-full px-6">
            Ask AI Pharmacist <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Pill className="h-8 w-8 text-primary" />
              <span className="text-3xl font-bold font-mono">4</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-accent shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-8 w-8 text-accent" />
              <span className="text-3xl font-bold font-mono">
                {orders.filter(o => o.status === 'pending').length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Refills Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-8 w-8 text-orange-500" />
              <span className="text-3xl font-bold font-mono">{alerts.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-xl p-6 animate-in slide-in-from-left-2">
          <div className="flex items-start gap-4">
            <div className="bg-orange-100 dark:bg-orange-900/50 p-3 rounded-full">
              <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100">Refill Attention Needed</h3>
              <p className="text-orange-700 dark:text-orange-300 mb-4">
                Based on your order history, your supply of <strong>{alerts[0].medicineName}</strong> is running low (approx. {alerts[0].daysRemaining} days left).
              </p>
              <div className="flex gap-3">
                <Link href={`/shop?q=${alerts[0].medicineName}`}>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white border-none">
                    Refill Now
                  </Button>
                </Link>
                <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
                No recent orders found.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 3).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-transparent hover:border-border transition-colors">
                    <div>
                      <p className="font-medium text-sm">Order #{order.id.slice(-6)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold font-mono">${order.total.toFixed(2)}</p>
                      <Badge variant="secondary" className="text-[10px] uppercase">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Health Tips / AI Suggestions */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/10 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-accent" /> AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-white/60 dark:bg-black/20 rounded-lg backdrop-blur-sm border border-white/20">
              <p className="text-sm italic text-muted-foreground">"Taking your Amoxicillin with food can help prevent stomach upset."</p>
            </div>
             <div className="p-3 bg-white/60 dark:bg-black/20 rounded-lg backdrop-blur-sm border border-white/20">
              <p className="text-sm italic text-muted-foreground">"You've maintained a great refill streak! Consistency is key to health."</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
