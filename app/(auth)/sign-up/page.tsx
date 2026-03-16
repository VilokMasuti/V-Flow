"use client";

import AuthForm from "@/components/auth/AuthForm";
import { signUpWithCredentials } from "@/lib/actions/auth.actions";
import { SignUpSchema } from "@/lib/validations";
const SignUp = () => {
  return (
    <AuthForm
      formType="SIGN_UP"
      schema={SignUpSchema}
      defaultValues={{ email: "", password: "", name: "", username: "" }}
      onSubmit={signUpWithCredentials}
    />
  );
};

export default SignUp;
