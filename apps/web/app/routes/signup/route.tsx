import { getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { type ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { client } from "~/api";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { SignupSchema } from "~/routes/signup/schema";

export async function loader() {
  const res = await client.users.$get({ query: {} });
  if (res.ok) {
    const data = await res.json();
    return { users: data.users };
  }
  return { users: [] };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: SignupSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  return redirect("/");
}

export default function Page() {
  const data = useLoaderData<typeof loader>();

  console.log(data.users);

  const lastResult = useActionData<typeof action>();

  const [form, fields] = useForm({
    lastResult,
    constraint: getZodConstraint(SignupSchema),
    shouldValidate: "onSubmit",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: SignupSchema });
    },
  });

  return (
    <Form
      method="post"
      id={form.id}
      aria-invalid={form.errors ? true : undefined}
      aria-describedby={form.errors ? form.errorId : undefined}
    >
      <div id={form.errorId}>{form.errors}</div>
      <div>
        <Label htmlFor={fields.email.id}>Email</Label>
        <Input {...getInputProps(fields.email, { type: "email" })} />
        <div id={fields.email.errorId}>{fields.email.errors}</div>
      </div>
      <div>
        <Label htmlFor={fields.password.id}>Password</Label>
        <Input {...getInputProps(fields.password, { type: "password" })} />
        <div id={fields.password.errorId}>{fields.password.errors}</div>
      </div>
      <button type="submit">Sign Up</button>
    </Form>
  );
}
