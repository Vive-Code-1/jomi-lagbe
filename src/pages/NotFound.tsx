import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import LottieAnimation from "@/components/LottieAnimation";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const { lang } = useI18n();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center max-w-md px-6">
        <LottieAnimation
          url="https://assets2.lottiefiles.com/packages/lf20_kcsr6fcp.json"
          className="w-64 h-64 mx-auto mb-6"
        />
        <h1 className="mb-4 text-5xl font-bold text-primary">404</h1>
        <p className="mb-6 text-lg text-muted-foreground">
          {lang === 'bn' ? 'দুঃখিত! এই পেজটি খুঁজে পাওয়া যায়নি।' : 'Oops! Page not found'}
        </p>
        <Link to="/">
          <Button className="bg-primary text-primary-foreground rounded-xl font-bold px-8">
            {lang === 'bn' ? 'হোমে ফিরুন' : 'Return to Home'}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
