// Simple routing guards
// These would need proper JSX setup to work fully

export const basicAuthCheck = (user: any) => {
  return !!user
}

export const roleCheck = (user: any, allowedRoles: string[]) => {
  return user && allowedRoles.includes(user.role)
}