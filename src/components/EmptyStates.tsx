import { AlertCircle, Search, Film, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <Card className="bg-cinema-card border-cinema-border">
      <CardContent className="text-center py-12">
        <div className="mb-4">
          {icon || <Search className="h-12 w-12 text-muted-foreground mx-auto" />}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4 max-w-md mx-auto">
          {description}
        </p>
        {action && (
          <Button onClick={action.onClick} variant="outline">
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export const NoMoviesFound = ({ searchTerm }: { searchTerm?: string }) => (
  <EmptyState
    icon={<Search className="h-12 w-12 text-muted-foreground mx-auto" />}
    title="No movies found"
    description={
      searchTerm
        ? `No movies match "${searchTerm}". Try adjusting your search or filter criteria.`
        : "No movies are available at the moment. Check back later for new releases."
    }
  />
);

export const EmptyWatchlist = () => (
  <EmptyState
    icon={<Film className="h-12 w-12 text-muted-foreground mx-auto" />}
    title="Your watchlist is empty"
    description="Start building your movie collection by adding films you want to watch later."
    action={{
      label: "Browse Movies",
      onClick: () => window.location.href = "/"
    }}
  />
);

export const ErrorState = ({ 
  title = "Something went wrong", 
  description = "We encountered an error while loading this content.",
  onRetry 
}: { 
  title?: string; 
  description?: string; 
  onRetry?: () => void; 
}) => (
  <EmptyState
    icon={<AlertCircle className="h-12 w-12 text-destructive mx-auto" />}
    title={title}
    description={description}
    action={onRetry ? {
      label: "Try Again",
      onClick: onRetry
    } : undefined}
  />
);