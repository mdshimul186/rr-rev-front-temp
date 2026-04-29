import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "./components/Layout/AppLayout";
import { About } from "./pages/landing/About";
import { Contact } from "./pages/landing/Contact";
import { Home } from "./pages/landing/Home";
import { Testimonial } from "./pages/landing/Testimonial";
import { PrivacyPolicy } from "./pages/landing/PrivacyPolicy";
import { TermsCondition } from "./pages/landing/TermsCondition";
import { Blog } from "./pages/landing/Blog";
import { Login } from "./pages/login-flow/Login";
import { Pricing } from "./pages/login-flow/Pricing";
import { Register } from "./pages/login-flow/Register";
import { Services } from "./pages/landing/Services";
import { Verification } from "./pages/login-flow/Verification";
import "./App.css";
import "./responsive.css";
import { ForgotPassword } from "./pages/login-flow/ForgotPassword";
import { ResetPassword } from "./pages/login-flow/ResetPassword";
import { DashboardLayout } from "./components/Layout/DashboardLayout";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { CustomerList } from "./pages/dashboard/CustomerList";
import { CustomerProfile } from "./pages/dashboard/CustomerProfile";
import { BusinessProfile } from "./pages/dashboard/BusinessProfile";
import { AdditionalUsers } from "./pages/dashboard/AdditionalUsers";
import { Analytics } from "./pages/dashboard/Analytics";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import { BusinessRegistrationRoute } from "./BusinessRegistrationRoute";
import CheckoutStripe from "./pages/dashboard/CheckoutStripe";
import { StripeSubscriptions } from "./pages/dashboard/StripeSubscription";
import EmployeeRoute from "./utils/employeeAuthRole";
import { LoginVerificationModal } from "./pages/login-flow/LoginVerificationModal";
import { EmailVerificationModal } from "./pages/login-flow/EmailVerificationModal";
import ErrorPage from "./pages/login-flow/errorPage";
import PPCCheckoutStripe from "./pages/dashboard/PPCCheckoutStripe";
import AdditionalCheckoutStripe from "./pages/dashboard/AdditionalCheckoutStripe";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "services",
        element: <Services />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "blog",
        element: <Blog />,
      },
      {
        path: "testimonial",
        element: <Testimonial />,
      },
      {
        path: "privacyPolicy",
        element: <PrivacyPolicy />,
      },
      {
        path: "termsAndCondition",
        element: <TermsCondition />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "verification",
        element: <Verification />,
      },
      {
        path: "verification-modal",
        element: <LoginVerificationModal />,
      },
      {
        path: "email-verification-modal",
        element: <EmailVerificationModal />,
      },
      {
        path: "registration",
        element: <BusinessRegistrationRoute />,
      },
      {
        path: "pricing",
        element: <Pricing />,
      },
      {
        path: "/error",
        element: <ErrorPage />,
      },
    ],
  },
  {
    path: "/app",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // {
      //   path: "business-list",
      //   element: <BusinessList />,
      // },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "customer-list",
        element: (
          <EmployeeRoute>
            <CustomerList />
          </EmployeeRoute>
        ),
      },
      {
        path: "customer-profile/:id",
        element: (
          <EmployeeRoute>
            <CustomerProfile />
          </EmployeeRoute>
        ),
      },
      {
        path: "subscriptions",
        element: (
          <EmployeeRoute>
            <StripeSubscriptions />
          </EmployeeRoute>
        ),
      },
      {
        path: "checkout",
        element: (
          <EmployeeRoute>
            <CheckoutStripe />
          </EmployeeRoute>
        ),
      },
      {
        path: "user-checkout",
        element: (
          <EmployeeRoute>
            <PPCCheckoutStripe />
          </EmployeeRoute>
        ),
      },
      {
        path: "add-user-checkout",
        element: (
          <EmployeeRoute>
            <AdditionalCheckoutStripe />
          </EmployeeRoute>
        ),
      },
      {
        path: "business-profile",
        element: <BusinessProfile />,
      },
      {
        path: "additional-users",
        element: (
          <EmployeeRoute>
            <AdditionalUsers />
          </EmployeeRoute>
        ),
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
    ],
  },
]);

const App = () => {
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router}></RouterProvider>
    </>
  );
};

export default App;
