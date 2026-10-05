export interface UserCreationInterface {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface UserInterface extends UserCreationInterface {
  id: string;
  created_at: number;
  updated_at: number;
}
