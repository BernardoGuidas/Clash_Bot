import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Cards from "./pages/Cards";
import PopularCards from "./pages/PopularCards";
import CompareCards from "./pages/CompareCards";
import DeckBuilder from "./pages/DeckBuilder";
import Rankings from "./pages/Rankings";
import Login from "./pages/Login";
import { OfflineNotice } from "./components/OfflineNotice";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"\\"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/chat"} component={Chat} />
      <Route path={"/cards"} component={Cards} />
      <Route path={"/popular"} component={PopularCards} />
      <Route path={"/compare"} component={CompareCards} />
      <Route path={"/deck-builder"} component={DeckBuilder} />
      <Route path={"/rankings"} component={Rankings} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <OfflineNotice />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
