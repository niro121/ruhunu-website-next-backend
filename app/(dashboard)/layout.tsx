import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Profile } from "./profile"
import Providers from "./providers"
import {
  BadgeCheck,
  BadgePercent,
  BriefcaseIcon,
  Building2Icon,
  ClapperboardIcon,
  Contact,
  FolderSyncIcon,
  GiftIcon,
  Handshake,
  Images,
  Megaphone,
  PanelLeft,
  RectangleHorizontal,
  TheaterIcon,
  Utensils,
} from "lucide-react"
import { Session } from "next-auth";
import {
  UserGroup,
  FileUser,
  DoubleArrow,
  Earth,
  Article,
  DBIcon,
  // FolderLock,
  SettingIcon,
  AnalyticsIcon,
  StockIcon,
  UserAnalyticsIcon
} from "@/components/icons"
import DashboardBreadcrumb from "./breadcrumbs"
import { fetchServerSession } from "@/lib/session"
import { ALL_ROLES } from "@/lib/roles"
import Logo from "@/public/logo.png"
import { NavLink } from "@/components/common/nav-link"

async function DesktopNav({ session }: { session: Session | null }) {

  const role = session?.user?.role

  const hasAccess = (path: string) => {
    if (role !== undefined) {
      return ALL_ROLES[role]?.includes(path)
    }

    return
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-56 flex-col border-r bg-[#18CE67] sm:flex">
      <nav className="flex flex-col items-stretch gap-2 px-3 sm:py-5">

        {/* // =========================== LOGO =========================== */}
        <div className="mb-1 bg-white p-2 rounded-[10px]">
          <Link
            href="/welcome"
            className="group flex shrink-0 items-center justify-center text-base text-white"
          >
            <Image
              src={Logo}
              alt="Home"
              width={100}
              height={100}
              unoptimized
              className="object-contain"
            />
            {/* <span>Scope</span> */}
          </Link>
        </div>
        <div className="mb-2 px-1">
          <div className="h-px bg-white/10" />
        </div>

        {/* // =========================== DOCTERS =========================== */}
        <NavLink
          href={hasAccess("/docters") ? "/docters" : "unauthorized-access"}
          label="Docters"
          icon={<UserGroup className="h-5 w-5" />}
        />

        {/* // =========================== MENU MANAGER =========================== */}
        <NavLink
          href={hasAccess("/menu-manager") ? "/menu-manager" : "unauthorized-access"}
          label="Menu Manager"
          icon={<UserGroup className="h-5 w-5" />}
        />

        {/* // =========================== CAREERS =========================== */}
        <NavLink
          href={hasAccess("/careers") ? "/careers" : "unauthorized-access"}
          label="Careers Manager"
          icon={<BriefcaseIcon className="h-5 w-5" />}
        />

        {/* // =========================== SERVICES =========================== */}
        <NavLink
          href={hasAccess("/services") ? "/services" : "unauthorized-access"}
          label="Services Manager"
          icon={<BriefcaseIcon className="h-5 w-5" />}
        />

        {/* // =========================== USERS =========================== */}
        <NavLink
          href={hasAccess("/users") ? "/users" : "unauthorized-access"}
          label="Users"
          icon={<UserGroup className="h-5 w-5" />}
        />

        {/* // =========================== NTS Application =========================== */}
        <NavLink
          href={hasAccess("/nts") ? "/nts" : "unauthorized-access"}
          label="NTS Application"
          icon={<UserGroup className="h-5 w-5" />}
        />

      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <p className="text-white">
          {process.env.APP_VERSION}
        </p>
      </nav>
    </aside>
  )
}

async function MobileNav({ session }: { session: Session | null }) {
  const role = session?.user?.role

  const hasAccess = (path: string) => {
    if (role !== undefined) {
      return ALL_ROLES[role]?.includes(path)
    }

    return
  }

  return (
    <Sheet>
      <div></div>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs bg-black">

        {/* // =========================== LOGO =========================== */}
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="/welcome"
            className="group flex shrink-0 items-center justify-center text-base text-white"
          >
            <Image
              src={Logo}
              alt="Home"
              width={50}
              height={50}
              unoptimized
              className="object-contain"
            />
          </Link>

          {/* // =========================== DOCTERS =========================== */}
          <NavLink
            href={hasAccess("/docters") ? "/docters" : "unauthorized-access"}
            label="Docters"
            icon={<UserGroup className="h-5 w-5" />}
          />

          {/* // =========================== MENU MANAGER =========================== */}
          <NavLink
            href={hasAccess("/menu-manager") ? "/menu-manager" : "unauthorized-access"}
            label="Menu Manager"
            icon={<UserGroup className="h-5 w-5" />}
          />

          {/* // =========================== CAREERS =========================== */}
          <NavLink
            href={hasAccess("/careers") ? "/careers" : "unauthorized-access"}
            label="Careers Manager"
            icon={<BriefcaseIcon className="h-5 w-5" />}
          />

          {/* // =========================== SERVICES =========================== */}
          <NavLink
            href={hasAccess("/services") ? "/services" : "unauthorized-access"}
            label="Services Manager"
            icon={<BriefcaseIcon className="h-5 w-5" />}
          />

          {/* // =========================== USERS =========================== */}
          <NavLink
            href={hasAccess("/users") ? "/users" : "unauthorized-access"}
            label="Users"
            icon={<UserGroup className="h-5 w-5" />}
          />

        </nav>
      </SheetContent>
    </Sheet>
  )
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await fetchServerSession();

  return (
    <Providers session={session}>
      <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <DesktopNav session={session} />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-56">
          <header className="sticky top-0 z-30 flex h-14 items-center border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <MobileNav session={session} />
            <DashboardBreadcrumb />
            <div className="mr-4 ml-4 sm:ml-auto relative flex-1 md:grow-0">
              {/* <SearchInput
                name="search"
                placeholder={"Search..."}
                className={
                  "w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                }
              /> */}
            </div>
            <Profile />
          </header>
          <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
            {children}
          </main>
        </div>
      </main>
    </Providers>
  )
}
