import { ReactElement } from 'react'
import { Data } from '@generated/data'
import { Logo } from '~/components/logo'
import { usePage } from '@inertiajs/react'
import { useFlashToasts } from '~/hooks/use_flash'
import { Form, Link } from '@adonisjs/inertia/react'
import { AnchoredToastProvider, ToastProvider } from '~/components/ui/toast'

export default function Layout({ children }: { children: ReactElement }) {
  const { user } = usePage<Data.SharedProps>().props
  useFlashToasts()

  return (
    <>
      <header className="bg-card border-b border-border px-5">
        <div className="container mx-auto flex h-18 py-4 items-center justify-between">
          <div>
            <Logo />
          </div>
          <div>
            <nav className="flex gap-5 text-muted-foreground">
              {user ? (
                <>
                  <span>{user.initials}</span>
                  <Form route="session.destroy">
                    <button type="submit"> Logout </button>
                  </Form>
                </>
              ) : (
                <>
                  <Link route="new_account.create">Signup</Link>
                  <Link route="session.create">Login</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
      <ToastProvider position="top-center">
        <AnchoredToastProvider>
          <main className="flex-1">{children}</main>
        </AnchoredToastProvider>
      </ToastProvider>
    </>
  )
}
