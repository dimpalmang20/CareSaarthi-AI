import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Package, AlertTriangle, FileSpreadsheet, Activity } from "lucide-react";
import Papa from "papaparse";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const { medicines, orders, alerts, addMedicinesFromCSV, user } = useApp();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const { toast } = useToast();

  if (user?.role !== 'admin') {
    return <div className="p-8 text-center text-destructive">Access Denied: Admin privileges required.</div>;
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
    }
  };

  const processCSV = () => {
    if (!csvFile) return;

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        addMedicinesFromCSV(results.data);
        setCsvFile(null);
      },
      error: (error) => {
        toast({
          title: "Error Parsing CSV",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold">Admin Portal</h1>
          <p className="text-muted-foreground">Manage inventory, orders, and system alerts.</p>
        </div>
        <Badge variant="outline" className="h-8 px-3 font-mono">System Status: Online</Badge>
      </div>

      <Tabs defaultValue="inventory">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="space-y-6">
          <Card>
             <CardHeader className="flex flex-row items-center justify-between">
                <div>
                   <CardTitle>Medicine Inventory</CardTitle>
                   <CardDescription>Current stock levels and catalog.</CardDescription>
                </div>
                <div className="flex gap-2">
                   <div className="flex items-center gap-2">
                     <Input 
                       type="file" 
                       accept=".csv" 
                       className="w-[200px] h-9 text-xs"
                       onChange={handleFileUpload}
                     />
                     <Button size="sm" onClick={processCSV} disabled={!csvFile}>
                       <Upload className="h-4 w-4 mr-2" /> Import CSV
                     </Button>
                   </div>
                </div>
             </CardHeader>
             <CardContent>
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>ID</TableHead>
                     <TableHead>Name</TableHead>
                     <TableHead>Category</TableHead>
                     <TableHead>Price</TableHead>
                     <TableHead>Stock</TableHead>
                     <TableHead>Status</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {medicines.map((med) => (
                     <TableRow key={med.id}>
                       <TableCell className="font-mono text-xs">{med.id.substring(0,6)}</TableCell>
                       <TableCell className="font-medium">{med.name}</TableCell>
                       <TableCell>{med.category}</TableCell>
                       <TableCell>${med.price.toFixed(2)}</TableCell>
                       <TableCell>{med.stock}</TableCell>
                       <TableCell>
                         {med.stock < 10 ? (
                           <Badge variant="destructive">Low Stock</Badge>
                         ) : (
                           <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-none">In Stock</Badge>
                         )}
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Monitor incoming orders and dispatch status.</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                 <div className="text-center py-10 text-muted-foreground">No orders processed yet.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono">{order.id}</TableCell>
                        <TableCell>{order.userId}</TableCell>
                        <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                           <Badge>{order.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                     <Activity className="h-5 w-5" /> LangSmith Traces
                   </CardTitle>
                   <CardDescription>Mock visualization of AI agent traces.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <div className="space-y-4">
                       <div className="border rounded-md p-3 bg-muted/20">
                          <div className="flex justify-between text-xs mb-2">
                             <span className="font-bold">Trace ID: trc-82910</span>
                             <span className="text-green-600">SUCCESS</span>
                          </div>
                          <p className="text-sm font-mono text-muted-foreground">Input: &quot;Buy Aspirin&quot;</p>
                          <p className="text-sm font-mono text-muted-foreground">Agent: IntentClassifier -&gt; OrderFlow</p>
                          <p className="text-sm font-mono text-muted-foreground">Output: Action(add_to_cart)</p>
                       </div>
                       <div className="border rounded-md p-3 bg-muted/20">
                          <div className="flex justify-between text-xs mb-2">
                             <span className="font-bold">Trace ID: trc-82911</span>
                             <span className="text-green-600">SUCCESS</span>
                          </div>
                          <p className="text-sm font-mono text-muted-foreground">Input: &quot;Refill check&quot;</p>
                          <p className="text-sm font-mono text-muted-foreground">Agent: HistoryAnalyzer -&gt; RefillAlert</p>
                       </div>
                    </div>
                 </CardContent>
              </Card>

              <Card>
                <CardHeader>
                   <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex justify-between items-center">
                      <span>Database Connection (Supabase)</span>
                      <Badge className="bg-green-500">Connected</Badge>
                   </div>
                   <div className="flex justify-between items-center">
                      <span>AI Model (Llama 3 via Groq)</span>
                      <Badge className="bg-green-500">Operational</Badge>
                   </div>
                   <div className="flex justify-between items-center">
                      <span>Refill Prediction Agent</span>
                      <Badge className="bg-blue-500">Running</Badge>
                   </div>
                </CardContent>
              </Card>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
