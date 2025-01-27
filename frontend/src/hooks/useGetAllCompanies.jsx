import { setCompanies } from "@/redux/companySlice";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllCompanies = () => {
  const dispatch = useDispatch();
  const companies = useSelector((state) => state.company.companies); // Get from Redux

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`https://jobhunt-vpo9.onrender.com/api/v1/company/get`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setCompanies(res.data.companies));
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, [dispatch]); // Re-run when `dispatch` changes

  return companies; // Return companies list
};

export default useGetAllCompanies;









// {
//   company.logo ? (
//     <img src={company.logo} alt={`${company.name} Logo`} />
//   ) : (
//   <img className='w-9 h-9 rounded' src="https://tse2.mm.bing.net/th?id=OIP.SlLZkdnEOb9Nz0DYUpfn0AHaEK&pid=Api&P=0&h=220" alt="Default Logo" />
// )
// }