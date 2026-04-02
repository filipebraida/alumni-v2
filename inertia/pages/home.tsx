import DefaultLayout from '~/layouts/default'
import { Book, MessageCircle, Video } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

export default function Home() {
  return (
    <div className="px-5">
      <div className="container mx-auto flex flex-col">
        <div className="hero max-w-2xl pt-20">
          <h1 className="text-5xl font-medium">
            It works — welcome to the power of a full-stack React app
          </h1>
          <p className="mt-5 text-muted-foreground">
            Powered by Inertia and React, this setup blends server-driven routing with rich
            client-side interactivity — seamless, fast, and cohesive.
          </p>
        </div>

        <div className="grid grid-cols-3 mt-30 gap-10">
          <Card
            className="py-7 px-4"
            render={<a href="https://docs.adonisjs.com/" target="_blank" />}
          >
            <CardHeader>
              <Book className="size-8 mb-5" aria-hidden="true" />
              <CardTitle>Official Docs</CardTitle>
              <CardDescription className="mt-1">
                Comprehensive reference for building with AdonisJS
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="py-7 px-4" render={<a href="https://adocasts.com/" target="_blank"></a>}>
            <CardHeader>
              <Video className="size-8 mb-5" aria-hidden="true" />
              <CardTitle>Adocasts</CardTitle>
              <CardDescription className="mt-1">
                Guided video tutorials for everyday development
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="py-7 px-4"
            render={<a href="https://discord.gg/vDcEjq6" target="_blank"></a>}
          >
            <CardHeader>
              <MessageCircle className="size-8 mb-5" aria-hidden="true" />
              <CardTitle>Discord</CardTitle>
              <CardDescription className="mt-1">
                Connect with developers building with AdonisJS every day
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}

Home.layout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>
