import { myAxios } from "../myAxios";
import { AxiosResponse } from "axios";
import { Group, GroupExpense } from "../interface/groupInterface";

export const getGroups = async (token: string): Promise<Group[]> => {
  try {
    const response: AxiosResponse<Group[]> = await myAxios.get("/group", {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching groups:", error);
    throw error;
  }
}

export const getGroupExpenses = async (token: string, groupId: string): Promise<GroupExpense[]> => {
  try {
    const response: AxiosResponse<GroupExpense[]> = await myAxios.get("/expense/group", {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
      params: {
        groupId,
      }
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching group expenses:", error);
    throw error;
  }
};