'use client'

import { BadgeCheck, Bell, ChevronsUpDown, LogIn, LogOut } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { type SidebarUser } from '@/types/Users'
import Link from 'next/link'
import { useTransition } from 'react'
import { signOutAction } from '@/api/auth'
import { useUser } from '@/app/contexts/UserContext'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import { type NotificatonsInfo } from '@/types/Notifications'
import { Badge } from '@/components/ui/badge'

interface NavUserProps {
  user: SidebarUser | null
  notificationInfos: NotificatonsInfo
}

export function NavUser({ user, notificationInfos }: NavUserProps) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { refetchUser } = useUser()

  const handleSignOut = () => {
    startTransition(async () => {
      const response = await signOutAction()
      const { errorMessage } = response

      if (!errorMessage) {
        await refetchUser()
        toast({
          title: 'Success!',
          description: 'Signed out successfully',
        })
        router.push('/')
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorMessage,
        })
      }
    })
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={`${user?.profile_image_url}?t=${Date.now()}`}
                  alt={user?.username}
                />
                <AvatarFallback className="rounded-lg">{user?.username?.charAt(0).toUpperCase() ?? 'G'}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold">
                    {user?.username ?? "Guest"}
                  </span>
                  {notificationInfos.count > 0 && (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={`${user?.profile_image_url}?t=${Date.now()}`}
                    alt={user?.username}
                  />
                  <AvatarFallback className="rounded-lg">{user?.username?.charAt(0).toUpperCase() ?? 'G'}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.username ?? "Guest"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user ? (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link
                      className="flex w-full cursor-pointer items-center gap-2"
                      href={`/profiles/${user.username}`}
                    >
                      <BadgeCheck />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      className="flex w-full cursor-pointer items-center justify-between"
                      href={'/notifications'}
                    >
                      <div className='flex items-center gap-2'>
                        <Bell />
                        Notifications
                      </div>
                      {notificationInfos.count > 0 &&
                        <Badge>{notificationInfos.count}</Badge>
                      }
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  disabled={isPending}
                  className="flex w-full cursor-pointer items-center gap-2"
                >
                  <LogOut />
                  {isPending ? 'Signing out...' : 'Sign Out'}
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem asChild>
                <Link
                  className="flex w-full cursor-pointer items-center gap-2"
                  href={'/login'}
                >
                  <LogIn />
                  Login
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
