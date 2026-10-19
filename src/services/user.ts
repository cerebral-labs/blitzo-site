import { post } from "@/utils/http";

/**
 * 
 * @param data {
  "game_data": "string",
  "invite_code": "string",
  "token": "string"
}
 * @returns 
 */
export const userlogin = (data: any) => {
  return post("/api/v1/users/login", data);
};
