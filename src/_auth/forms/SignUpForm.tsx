import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignUpValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useCreateUserMutation,
  useSignInAccount,
} from "@/lib/react_query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";

const SignUpForm = () => {
  const navigate = useNavigate();
  //
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const { mutateAsync: createUser, isPending: isCreatingUser } =
    useCreateUserMutation();
  const { mutateAsync: signInAccount, isPending: isSigningIn } =
    useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignUpValidation>) {
    //create new user
    const newUser = await createUser(values);

    if (!newUser) {
      return toast("Sign Up Failed", {
        description: "Please try again",
      });
    } else {
      return toast("Sign Up Success", {
        description: "Now Sign In",
      });
    }

    // const session = await signInAccount({
    //   email: values.email,
    //   password: values.password,
    // });

    // if (!session)
    //   return toast("Sign In Failed", {
    //     description: "Please try again",
    //   });

    // const isLoggedIn = await checkAuthUser();

    // if (isLoggedIn) {
    //   form.reset();
    //   navigate("/");
    // } else {
    //   return toast("Not Logged In ", {
    //     description: "Please try again",
    //   });
    // }
  }

  return (
    <Form {...form}>
      <div className="sm:w-[420px] flex-center flex-col ">
        <h2 className="text-[24px] font-bold leading-[140%] tracking-tighter md:text-[30px]  pt-5 sm:pt-12">
          Create a new Account
        </h2>
        <p className=" text-[#7878A3] text-[14px] font-medium leading-[140%] md:text-[16px]  mt-2">
          To Use TriVerse, please enter your details
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4 "
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    className="h-12 bg-[#1F1F22] border-none placeholder:text-[#5C5C7B] focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-[#7878A3] !important"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    className="h-12 bg-[#1F1F22] border-none placeholder:text-[#5C5C7B] focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-[#7878A3] !important"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="h-12 bg-[#1F1F22] border-none placeholder:text-[#5C5C7B] focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-[#7878A3] !important"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    className="h-12 bg-[#1F1F22] border-none placeholder:text-[#5C5C7B] focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-[#7878A3] !important"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className=" bg-[#877EFF] hover:bg-[#877EFF] text-[#FFFFFF] flex gap-2 !important"
          >
            {isCreatingUser ? (
              <>
                <div className="flex justify-items-center">
                  <Loader /> Loading
                </div>
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
          <p className="text-[14px] font-normal leading-[140%] text-[#EFEFEF] text-center mt-2 ">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-[#877EFF] text-[14px] font-semibold leading-[140%] tracking-tighter ml-1 "
            >
              Log In
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignUpForm;
