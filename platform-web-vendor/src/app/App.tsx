import AppProviders from './providers/AppProviders';
import AppRouter from './routing';
import './styles/global.css'; // Assuming global styles are managed here

/**
 * The root component of the entire vendor web application.
 *
 * This component's primary responsibility is to set up the application's
 * foundational structure by composing the global providers and the main router.
 * It ensures that all necessary contexts (Authentication, API Client,
 * Notifications, Routing) are available to the entire component tree.
 *
 * As per Feature-Sliced Design (FSD), this is the entry point of the 'app' layer,
 * orchestrating the different parts of the application.
 *
 * @returns {JSX.Element} The root element of the React application.
 */
function App(): JSX.Element {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}

export default App;