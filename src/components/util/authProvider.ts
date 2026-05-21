// @deprecated — Duplicate types. Use the canonical types from src/context/AuthProvider.tsx instead.
// Note: the `allowedApps` field here uses `string` but the canonical type uses `number` — prefer the canonical.
type user = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isdbSynced: boolean;
  allowedApps: {
    [key: string]: string;
  };
};

export type AuthContextType = {
  user: user | null;
};
