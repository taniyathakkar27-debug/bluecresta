/**
 * Sub-admin (role ADMIN) menu and route access from permissions.
 * Super admin (SUPER_ADMIN) bypasses all checks.
 */

export function isSuperAdmin(adminUser) {
  return adminUser?.role === 'SUPER_ADMIN'
}

function perm(adminUser) {
  return adminUser?.permissions || {}
}

/**
 * Whether the current admin may open a sidebar item / route (exact path).
 */
export function canAccessAdminPath(pathname, adminUser) {
  if (!adminUser) return false
  if (isSuperAdmin(adminUser)) return true

  const p = perm(adminUser)

  const rules = {
    '/admin/dashboard': () => true,
    '/admin/users': () => p.canViewUsers || p.canManageUsers,
    '/admin/accounts': () =>
      p.canManageAccounts || p.canCreateAccounts || p.canViewUsers || p.canManageUsers,
    '/admin/account-types': () => p.canManageAccounts || p.canCreateAccounts,
    '/admin/transactions': () =>
      p.canViewReports || p.canManageDeposits || p.canApproveDeposits || p.canManageWithdrawals,
    '/admin/payment-methods': () => p.canManageSettings,
    '/admin/trades': () => p.canManageTrades,
    '/admin/funds': () =>
      p.canManageDeposits ||
      p.canManageWithdrawals ||
      p.canApproveDeposits ||
      p.canApproveWithdrawals,
    '/admin/credit-requests': () =>
      p.canManageDeposits || p.canApproveDeposits || p.canManageWithdrawals,
    '/admin/bank-settings': () => p.canManageSettings,
    '/admin/ib-management': () => p.canManageIB,
    '/admin/forex-charges': () => p.canManageSettings,
    '/admin/indian-charges': () => p.canManageSettings,
    '/admin/earnings': () => p.canViewReports,
    '/admin/copy-trade': () => p.canManageCopyTrading,
    '/admin/prop-firm': () => p.canManageAccounts,
    '/admin/prop-trading': () => p.canManageAccounts,
    '/admin/investor-access': () => p.canViewUsers,
    '/admin/margin-alerts': () => p.canManageTrades,
    '/admin/theme': () => p.canManageTheme,
    '/admin/email-templates': () => p.canManageSettings,
    '/admin/bonus-management': () =>
      p.canManageDeposits || p.canApproveDeposits || p.canManageSettings,
    '/admin/admin-management': () => false,
    '/admin/kyc': () => p.canManageKYC || p.canApproveKYC,
    '/admin/support': () => p.canViewUsers || p.canManageUsers,
    '/admin/technical-analysis': () => p.canViewReports || p.canManageSettings,
  }

  const fn = rules[pathname]
  if (!fn) return true
  return fn()
}
