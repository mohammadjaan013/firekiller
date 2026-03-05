import { Truck, ShieldCheck, Banknote, Headphones, Clock } from "lucide-react";

const features = [
  { icon: Truck, label: "Free Shipping" },
  { icon: ShieldCheck, label: "1-Year Warranty" },
  { icon: Banknote, label: "COD Available" },
  { icon: Headphones, label: "24x7 Support" },
  { icon: Clock, label: "Fast Delivery" },
];

export default function TrustBar() {
  return (
    <section className="bg-white border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-5 overflow-x-auto gap-6 scrollbar-hide">
          {features.map(({ icon: Icon, label }, i) => (
            <div
              key={label}
              className="flex items-center gap-2.5 flex-shrink-0"
            >
              <div className="p-2 bg-muted rounded-lg">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-secondary whitespace-nowrap">
                {label}
              </span>
              {i < features.length - 1 && (
                <div className="hidden md:block w-px h-8 bg-border ml-6" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
