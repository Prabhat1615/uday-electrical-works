// Technician authorization business rule.
//
// A Technician may access the Technician Portal and technician APIs ONLY
// when explicitly approved: status === 'Approved'. This is a fail-closed
// check — any status other than 'Approved' (Pending, Rejected, missing,
// or unknown) means the account is NOT authorized to work.
//
// Note on legacy records (accounts created before the technician
// application system existed, i.e. before the `status` field was added):
// Mongoose hydrates missing fields with the schema default on read, so
// such records materialize as 'Pending' and are DENIED by default. The
// branch below additionally guards NON-hydrated paths (e.g. aggregate
// pipelines where defaults are not applied): a raw document with no
// `status` and no application markers is only allowed when it provably
// predates the application system (technician accounts could then only
// be created by an Admin). A raw document with no `status` but WITH
// application markers is always denied.

export const isTechnicianAuthorized = (user) => {
  if (!user) return false;
  if (user.role !== 'Technician') return true;

  // Explicitly approved — the only state that grants access.
  if (user.status === 'Approved') return true;

  // Missing status (legacy record). Authorized only if the record shows
  // no sign of the public application flow, i.e. it can only have been
  // created by an Admin.
  if (user.status === undefined || user.status === null || user.status === '') {
    const hasApplicationMarkers =
      !!user.submittedAt ||
      (Array.isArray(user.applicationHistory) && user.applicationHistory.length > 0);
    return !hasApplicationMarkers;
  }

  // 'Pending', 'Rejected' or any unknown value → denied.
  return false;
};

// Friendly, human-readable message for blocked technician logins.
export const getTechnicianAuthorizationMessage = (user) => {
  if (user?.status === 'Pending') {
    return 'Your technician application is still under review. You will be able to access the Technician Portal after Admin approval.';
  }
  if (user?.status === 'Rejected') {
    const reason = user.rejectionReason ? ` Reason: ${user.rejectionReason}` : '';
    return `Your technician application was not approved.${reason}`;
  }
  return 'Your technician account is not yet approved for field work';
};
