'use client'

import Link from "next/link"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"

type Path = {
    path: string
    name: string
}

const pathArray: Path[] = [
    { path: "accounts", name: "Accounts" },
    { path: "welcome", name: "Welcome" },
    { path: "users", name: "Users" },
    { path: "movies", name: "Movies" },
]

// Capitalize first letter of any string
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

function DashboardBreadcrumb() {
    const pathname = usePathname() || ""
    const pathNames = pathname.split('/').filter(path => path)

    const getLinkName = (link: string) => {
        const foundLink = pathArray.find(item => item.path === link)
        return foundLink ? foundLink.name : capitalize(link)
    }

    // Build the URL for each breadcrumb
    const buildHref = (index: number) => "/" + pathNames.slice(0, index + 1).join("/")

    return (
        <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
                {/* Dashboard home */}
                <BreadcrumbItem>
                    <Link href="/welcome">
                        <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </Link>
                </BreadcrumbItem>

                {pathNames.map((link, index) => (
                    <div key={link} className="flex items-center gap-1.5 sm:gap-2.5">
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Link href={buildHref(index)}>
                                <BreadcrumbPage>{getLinkName(link)}</BreadcrumbPage>
                            </Link>
                        </BreadcrumbItem>
                    </div>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default DashboardBreadcrumb