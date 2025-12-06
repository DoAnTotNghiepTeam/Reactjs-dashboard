export interface UserType {
  id: number;
  username: string;
  email: string;
  fullName: string;
  status: string | null;
  roles: string[];
}

export interface GetAllUserResponse {
  data: UserType[];
}
