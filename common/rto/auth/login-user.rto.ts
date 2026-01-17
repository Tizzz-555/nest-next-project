import type { UserRto } from "./user.rto";

export interface LoginUserRto {
  accessToken: string;
  user: UserRto;
}

