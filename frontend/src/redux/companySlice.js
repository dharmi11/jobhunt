import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
  name: "company",
  initialState: {
    companies: [],  // ✅ Initialize with an empty array
    singleCompany: null,
    searchCompanyByText : "",
  },
  reducers: {
      setSingleCompany: (state, action) => {
        state.singleCompany = action.payload;
      },
    setCompanies: (state, action) => {
      state.companies = action.payload;
    },
    setSearchCompanyByText :(state , action)=>{
      state.searchCompanyByText = action.payload; 
    }
  }
});

export const { setCompanies, setSingleCompany , setSearchCompanyByText} = companySlice.actions;
export default companySlice.reducer;
