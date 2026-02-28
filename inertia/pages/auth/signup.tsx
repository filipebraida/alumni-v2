import { Form } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Field, FieldError, FieldLabel } from '~/components/ui/field'

export default function Signup() {
  return (
    <div className="form-container">
      <div>
        <h1> Signup </h1>
        <p>Enter your details below to create your account</p>
      </div>

      <div>
        <Form route="new_account.store">
          {({ processing }) => (
            <>
              <Field name="fullName">
                <FieldLabel htmlFor="fullName">Full name</FieldLabel>
                <Input type="text" id="fullName" required />
                <FieldError />
              </Field>

              <Field name="email">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input type="email" id="email" autoComplete="email" required />
                <FieldError />
              </Field>

              <Field name="password">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input type="password" id="password" autoComplete="new-password" required />
                <FieldError />
              </Field>

              <Field name="passwordConfirmation">
                <FieldLabel htmlFor="passwordConfirmation">Confirm password</FieldLabel>
                <Input
                  type="password"
                  id="passwordConfirmation"
                  autoComplete="new-password"
                  required
                />
                <FieldError />
              </Field>

              <Button disabled={processing} type="submit">
                Signup
              </Button>
            </>
          )}
        </Form>
      </div>
    </div>
  )
}
