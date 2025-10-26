export const ALL_ROLES: Record<string, string[]> = {
    admin: [
        "/docters",
        "/menu-manager",
        "/careers",
        "/services",
        "/branches",
        "/users",
        
    ],
    dataOfficer: [
        
    ],
} as const

type RoleKey = keyof typeof ALL_ROLES


export const roles = Object.fromEntries(
    Object.keys(ALL_ROLES).map((key) => [key, key])
) as Record<RoleKey, RoleKey>;

export const roleRights = new Map(Object.entries(ALL_ROLES));
