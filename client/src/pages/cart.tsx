import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Trash2, CreditCard, ArrowRight, FileCheck, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function Cart() {
  const { cart, medicines, removeFromCart, placeOrder, checkPrescription, clearCart } = useApp();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const cartItems = cart.map(item => {
    const med = medicines.find(m => m.id === item.medicineId);
    return { ...item, medicine: med };
  }).filter(item => item.medicine !== undefined);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.medicine!.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const requiresPrescription = cartItems.some(item => item.medicine?.prescriptionRequired);

  const handlePrescriptionUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleCheckout = async () => {
    if (requiresPrescription) {
        if (!file) {
            toast({
                title: "Prescription Required",
                description: "One or more items in your cart require a prescription. Please upload it to proceed.",
                variant: "destructive"
            });
            return;
        }
        
        setIsVerifying(true);
        const isValid = await checkPrescription(file);
        setIsVerifying(false);

        if (!isValid) {
            toast({
                title: "Verification Failed",
                description: "We could not verify your prescription document. Please try again.",
                variant: "destructive"
            });
            return;
        }
    }

    await placeOrder();
    setIsCheckoutOpen(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <CreditCard className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="text-muted-foreground max-w-sm">Looks like you haven't added any medicines yet.</p>
        <Link href="/shop">
          <Button size="lg" className="mt-4">Browse Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-3xl font-heading font-bold">Your Cart</h1>
        
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Medicine</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.medicineId}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{item.medicine!.name}</span>
                        {item.medicine!.prescriptionRequired && (
                          <span className="text-xs text-destructive flex items-center gap-1">
                            <FileCheck className="h-3 w-3" /> Rx Required
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>${item.medicine!.price.toFixed(2)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right font-mono font-bold">
                      ${(item.medicine!.price * item.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeFromCart(item.medicineId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="bg-muted/30 p-4 flex justify-between">
             <Button variant="ghost" onClick={clearCart} className="text-muted-foreground">Clear Cart</Button>
             <Link href="/shop"><Button variant="link">Continue Shopping</Button></Link>
          </CardFooter>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-6 shadow-md border-primary/10">
          <CardHeader className="bg-muted/30 pb-4">
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
              <DialogTrigger asChild>
                <Button className="w-full h-12 text-md shadow-lg shadow-primary/20" size="lg">
                  Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Secure Checkout</DialogTitle>
                  <DialogDescription>
                    Complete your purchase securely.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  {requiresPrescription && (
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-4 space-y-3">
                      <div className="flex items-start gap-3">
                         <FileCheck className="h-5 w-5 text-amber-600 mt-0.5" />
                         <div className="space-y-1">
                           <h4 className="font-medium text-amber-900 dark:text-amber-100">Prescription Required</h4>
                           <p className="text-sm text-amber-700 dark:text-amber-300">
                             Some items in your cart require a valid doctor's prescription.
                           </p>
                         </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rx-upload" className="text-xs font-bold uppercase text-muted-foreground">Upload Document (PDF/JPG)</Label>
                        <div className="flex items-center gap-2">
                          <Input id="rx-upload" type="file" onChange={handlePrescriptionUpload} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <div className="p-3 border rounded-md flex items-center justify-between bg-muted/20">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span className="font-mono text-sm">•••• 4242</span>
                      </div>
                      <Badge variant="outline">Default</Badge>
                    </div>
                  </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>Cancel</Button>
                  <Button onClick={handleCheckout} disabled={isVerifying} className="w-full sm:w-auto">
                    {isVerifying ? (
                       <>
                         <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying Rx...
                       </>
                    ) : (
                       `Pay $${total.toFixed(2)}`
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
