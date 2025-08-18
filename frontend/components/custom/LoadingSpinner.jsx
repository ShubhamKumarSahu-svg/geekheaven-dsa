const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
    <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-primary"></div>
    <p className="mt-6 text-xl tracking-wider">Loading...</p>
  </div>
);

export default LoadingSpinner;
