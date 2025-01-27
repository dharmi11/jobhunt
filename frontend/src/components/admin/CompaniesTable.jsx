import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Edit2, MoreHorizontal } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setCompanies } from '@/redux/companySlice';  // Ensure this action exists
import { COMPANY_API_END_POINT } from '@/utils/constant';

const CompaniesTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();     

    const { companies = [], searchCompanyByText } = useSelector(store => store.company);

    const [filterCompany, setFilterCompany] = useState([]);


    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await axios.get(`https://jobhunt-vpo9.onrender.com/api/v1/company/get`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setCompanies(res.data.companies)); // ✅ Update Redux store
                }
            } catch (error) {
                console.error("Error fetching companies:", error.response?.data || error.message);
            }
        };
    
        fetchCompanies(); // ✅ Ensure data is fetched on mount
    }, [dispatch]); // Runs only when component mounts
    
    useEffect(() => {
        if (!companies) return;
        const filteredCompany = companies.length > 0
            ? companies.filter(company => !searchCompanyByText || company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase()))
            : [];
        setFilterCompany(filteredCompany);
    }, [companies, searchCompanyByText]);  // ✅ Trigger filter when companies update
     

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent registered companies</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Logo</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterCompany.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">
                                No companies found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        filterCompany.map(company => (
                            <TableRow  key={company._id}>
                                <TableCell>
                                    {/* <Avatar>
                                        <AvatarImage src={company.logo} />
                                    </Avatar> */}

                                    {company.logo ? (
                                        <img src={company.logo} alt={`${company.name} Logo`} />
                                    ) : (
                                        <img className='w-9 h-9 rounded-lg' src="https://tse2.mm.bing.net/th?id=OIP.SlLZkdnEOb9Nz0DYUpfn0AHaEK&pid=Api&P=0&h=220" alt="Default Logo" />
                                    )}
                                </TableCell>
                                <TableCell>{company.name}</TableCell>
                                <TableCell>{company.createdAt?.split("T")[0]}</TableCell>
                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            <div
                                                onClick={() => navigate(`/admin/companies/${company._id}`)}
                                                className="flex items-center gap-2 w-fit cursor-pointer"
                                            >
                                                <Edit2 className="w-4" />
                                                <span>Edit</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default CompaniesTable;
