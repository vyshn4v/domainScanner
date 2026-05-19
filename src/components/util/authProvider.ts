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
