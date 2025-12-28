import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getGroupExpenses, getGroups } from "../../api/client/groupClient";
import { Group, GroupExpense } from "../../api/interface/groupInterface";

// Define the initial state
interface GroupState {
  groups: Group[];
  currentGroupExpense: GroupExpense[];
  isLoading: boolean;
  error: string | null;
}

const initialState: GroupState = {
  groups: [],
  currentGroupExpense: [],
  isLoading: false,
  error: null,
};

// Async thunk for fetching groups
export const fetchGroups = createAsyncThunk(
  "group/fetchGroups",
  async (token: string, { rejectWithValue }) => {
    try {
      const data = await getGroups(token); // Call the API client function
      return data; // Return the groups array
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for fetching group expenses
export const fetchGroupExpenses = createAsyncThunk(
  "group/fetchGroupExpenses",
  async ({ token, groupId }: { token: string; groupId: string }, { rejectWithValue }) => {
    try {
      const data = await getGroupExpenses(token, groupId);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create the group slice
const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    // Action to clear groupexpense
    clearGroupExpenses(state) {
      state.currentGroupExpense = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch groups cases
      .addCase(fetchGroups.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.isLoading = false;
        state.groups = action.payload; // Update the groups array
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch group expenses cases
      .addCase(fetchGroupExpenses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGroupExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGroupExpense = action.payload; // Update expenses in the state
      })
      .addCase(fetchGroupExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearGroupExpenses } = groupSlice.actions;

export default groupSlice.reducer;