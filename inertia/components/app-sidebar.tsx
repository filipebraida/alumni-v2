import * as React from 'react'
import { LayoutDashboard, Sun, Moon, Monitor, User } from 'lucide-react'
import { Link, Form } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'
import { Data } from '@generated/data'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '~/components/ui/sidebar'
import { Menu, MenuTrigger, MenuItem, MenuPopup, MenuRadioGroup, MenuRadioItem } from '~/components/ui/menu'
import { useTheme } from '~/hooks/use_theme'

const navItems = [
  {
    title: 'Dashboard',
    route: 'dashboard',
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: 'Profile',
    route: 'dashboard',
    icon: User,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = usePage<Data.SharedProps>().props

  console.log(user, 'user')

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader className="px-4 py-5 h-15 leading-7">
        <Link route="home">
          <svg
            width="100"
            height="20"
            viewBox="0 0 195 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-foreground"
          >
            <path
              d="M180 37.5v-30h-7.5V0H195v7.5h-7.5v30H180ZM150 15V7.5h-15V0h15v7.5h7.5V15H150Zm-15 22.5V30h-7.5V7.5h7.5V30h15v7.5h-15Zm15-7.5v-7.5h7.5V30H150ZM82.5 37.5v-30H90V0h15v7.5h7.5v30H105v-15H90v15h-7.5ZM90 15h15V7.8H90V15ZM45 37.5V0h22.5v7.5h-15V15h15v7.5h-15V30h15v7.5H45ZM0 37.5V0h22.5v7.5H30V15h-7.5v15H30v7.5h-7.5V30H15v-7.5H7.5v15H0ZM7.5 15h14.7V7.5H7.5V15Z"
              fill="currentColor"
            />
          </svg>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  render={<Link route={item.route} />}
                  isActive={item.isActive}>
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator className="mx-0" />
      <SidebarFooter>
        <Menu>
          <MenuTrigger render={<button className="inline-flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer" />}>
            {user && (
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                {user.initials}
              </span>
            )}
            <span>{user?.fullName ?? 'Account'}</span>
          </MenuTrigger>
          <MenuPopup>
            <MenuItem closeOnClick>
              <Link href="/">Profile</Link>
            </MenuItem>
            <MenuItem>
              <Form route="session.destroy">
                <button className='' type="submit">
                  Logout
                </button>
              </Form>
            </MenuItem>
          </MenuPopup>
        </Menu>
      </SidebarFooter>
    </Sidebar>
  )
}

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <Menu>
      <MenuTrigger className="inline-flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer">
        {theme === 'light' && <Sun className="size-4" />}
        {theme === 'dark' && <Moon className="size-4" />}
        {theme === 'system' && <Monitor className="size-4" />}
        <span className="capitalize">{theme}</span>
      </MenuTrigger>
      <MenuPopup side="top" align="start">
        <MenuRadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}
        >
          <MenuRadioItem value="light" className={theme !== 'light' ? 'text-muted-foreground' : ''}>
            <span className="inline-flex items-center gap-2">
              <Sun className="size-4" />
              Light
            </span>
          </MenuRadioItem>
          <MenuRadioItem value="dark" className={theme !== 'dark' ? 'text-muted-foreground' : ''}>
            <span className="inline-flex items-center gap-2">
              <Moon className="size-4" />
              Dark
            </span>
          </MenuRadioItem>
          <MenuRadioItem
            value="system"
            className={theme !== 'system' ? 'text-muted-foreground' : ''}
          >
            <span className="inline-flex items-center gap-2">
              <Monitor className="size-4" />
              System
            </span>
          </MenuRadioItem>
        </MenuRadioGroup>
      </MenuPopup>
    </Menu>
  )
}
