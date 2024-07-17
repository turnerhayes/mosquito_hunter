import { RootState } from "./store";

export const getSubmissions = (state: RootState) =>
  state.submissions.submissions;
