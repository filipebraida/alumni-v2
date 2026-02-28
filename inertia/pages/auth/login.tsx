import { Form } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Field, FieldError, FieldLabel } from '~/components/ui/field'

export default function Login() {
  return (
    <div className="form-container">
      <div>
        <h1> Login </h1>
        <p>Enter your details below to login to your account</p>
      </div>

      <div>
        <Form route="session.store">
          {({ processing }) => (
            <>
              <Field name="email">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input type="email" id="email" autoComplete="username" required />
                <FieldError />
              </Field>

              <Field name="password">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input type="password" id="password" autoComplete="current-password" required />
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
