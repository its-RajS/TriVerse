import { Routes, Route } from "react-router-dom";
import {
  AllUsers,
  CreatePost,
  EditPost,
  EditProfile,
  Explore,
  Home,
  PostDetails,
  Profile,
  Saved,
} from "./_root/pages";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import SignInForm from "./_auth/forms/SignInForm";
import SignUpForm from "./_auth/forms/SignUpForm";
import "./index.css";
import { Toaster } from "@/components/ui/sonner";

// The key change is wrapping your entire app
// content with <BrowserRouter>.
// This provides the routing context that React
// Router needs to function properly.

const App = () => {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* public route */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SignInForm />} />
          <Route path="/sign-up" element={<SignUpForm />} />
        </Route>

        {/* private route */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/edit-post/:id" element={<EditPost />} />
          <Route path="/post/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/edit-profile/:id" element={<EditProfile />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
};

export default App;
