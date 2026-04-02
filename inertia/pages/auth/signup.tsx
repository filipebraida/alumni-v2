import MinimalLayout from '~/layouts/minimal'
import { Link } from '@adonisjs/inertia/react'
import { Form } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle, CardPanel } from '~/components/ui/card'
import { Field, FieldError, FieldLabel } from '~/components/ui/field'

export default function Signup() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="border-b">
        <CardTitle>Signup</CardTitle>
        <CardDescription>Enter your details below to create your account</CardDescription>
      </CardHeader>

      <CardPanel>
        <Form route="new_account.store">
          {({ processing }) => (
            <div className="flex flex-col gap-4">
              <Field name="fullName">
                <FieldLabel htmlFor="fullName">Full name</FieldLabel>
                <Input type="text" id="fullName" placeholder="Enter fullname" />
                <FieldError />
              </Field>

              <Field name="email">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input type="email" id="email" autoComplete="email" placeholder="Enter email" />
                <FieldError />
              </Field>

              <Field name="password">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  placeholder="Enter password"
                />
                <FieldError />
              </Field>

              <Field name="passwordConfirmation">
                <FieldLabel htmlFor="passwordConfirmation">Confirm password</FieldLabel>
                <Input
                  type="password"
                  id="passwordConfirmation"
                  autoComplete="new-password"
                  placeholder="Enter confirm password"
                />
                <FieldError />
              </Field>

              <Button className="w-full mt-4" disabled={processing} type="submit">
                Signup
              </Button>
            </div>
          )}
        </Form>
      </CardPanel>
      <div className="px-6 py-4 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link route="session.create" className="text-foreground underline underline-offset-4">
          Login
        </Link>
      </div>
    </Card>
  )
}

Signup.layout = (page: React.ReactElement) => <MinimalLayout>{page}</MinimalLayout>
