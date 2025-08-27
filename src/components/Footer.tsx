export function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary">Sweet Delights</h3>
            <p className="text-muted-foreground">
              Crafting artisanal desserts with love and the finest ingredients since 2020.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <div className="space-y-2 text-muted-foreground">
              <p>Menu</p>
              <p>Featured Items</p>
              <p>Contact Us</p>
              <p>About</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Contact Info</h4>
            <div className="space-y-2 text-muted-foreground">
              <p>123 Dessert Lane</p>
              <p>Sweet City, SC 12345</p>
              <p>(555) 123-CAKE</p>
              <p>hello@sweetdelights.com</p>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-8 mt-8 text-center text-muted-foreground">
          <p>&copy; 2024 Sweet Delights. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}