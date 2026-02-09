import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Shop() {
  const { medicines, addToCart } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(medicines.map(m => m.category)))];

  const filteredMedicines = medicines.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          med.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All" || med.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Pharmacy Shop</h1>
          <p className="text-muted-foreground">Browse our catalog of verified medications.</p>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search medicines..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <Button 
            key={cat}
            variant={filter === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(cat)}
            className="whitespace-nowrap rounded-full"
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMedicines.map(med => (
          <Card key={med.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group border-border/50">
            <div className="aspect-[4/3] w-full overflow-hidden bg-muted relative">
              <img 
                src={med.image} 
                alt={med.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {med.prescriptionRequired && (
                <Badge variant="destructive" className="absolute top-2 right-2 shadow-sm">
                  Rx Required
                </Badge>
              )}
            </div>
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="outline" className="mb-2 text-[10px]">{med.category}</Badge>
                  <CardTitle className="text-lg leading-tight">{med.name}</CardTitle>
                </div>
                <span className="font-mono font-bold text-primary">${med.price.toFixed(2)}</span>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <p className="text-sm text-muted-foreground line-clamp-2">{med.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button 
                className="w-full group-hover:bg-primary/90" 
                onClick={() => addToCart(med.id)}
                disabled={med.stock <= 0}
              >
                {med.stock > 0 ? (
                  <>
                    <Plus className="h-4 w-4 mr-2" /> Add to Cart
                  </>
                ) : (
                  "Out of Stock"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredMedicines.length === 0 && (
        <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
          <p>No medicines found matching your criteria.</p>
          <Button variant="link" onClick={() => { setSearchTerm(""); setFilter("All"); }}>Clear Filters</Button>
        </div>
      )}
    </div>
  );
}
