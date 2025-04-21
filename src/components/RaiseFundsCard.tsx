import { CircleDollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const RaiseFundsCard = () => (
  <div className="glass-card p-6 rounded-2xl hover:shadow-md transition-all duration-300 hover:-translate-y-1">
    <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
      <CircleDollarSign size={24} className="text-primary" />
    </div>
    <h3 className="text-xl font-medium mb-3">Raise Funds</h3>
    <p className="text-muted-foreground mb-6">
      Create a fundraiser and receive financial support for your cause.
    </p>
    <Button asChild variant="outline" className="w-full rounded-full">
      <Link to="/raise-funds">
        Start Fundraiser <ArrowRight size={16} className="ml-2" />
      </Link>
    </Button>
  </div>
);

export default RaiseFundsCard;
