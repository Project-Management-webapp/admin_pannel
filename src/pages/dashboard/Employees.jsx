import React, { useState, useEffect } from 'react';
import { FiUsers, FiMail, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getAllEmployee } from '../../api/employee';
import EmployeeDetailModal from '../../components/EmployeeDetailModal';
import Toaster from '../../components/Toaster';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'info',
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await getAllEmployee();
      if (response.success) {
        // Handle nested data structure: response.data.employees
        const employeesData = response.data?.employees || response.data;
        const employees = Array.isArray(employeesData) ? employeesData : [];
        setEmployees(employees);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      setEmployees([]);
      setToast({
        show: true,
        message: error.message || 'Failed to fetch employees',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(employees.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Employees</h1>
          <p className="text-gray-400 mt-1">Total: {employees.length} employees</p>
        </div>
        <button
          onClick={fetchEmployees}
          className="px-4 py-2 bg-linear-to-r from-[#ac51fc] to-[#8800FF] text-white rounded-lg hover:from-[#9640e0] hover:to-[#7700ee] transition-all shadow-lg hover:shadow-[#ac51fc]/50"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 animate-pulse"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-white/5 shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-white/5 rounded w-3/4"></div>
                  <div className="h-4 bg-white/5 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-white/5 rounded w-full"></div>
                <div className="h-4 bg-white/5 rounded w-2/3"></div>
                <div className="h-6 bg-white/5 rounded w-1/3 mt-3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : employees.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-12 border border-white/20 text-center">
          <FiUsers size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-xl text-gray-400">No employees found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentEmployees.map((employee) => (
              <div
                key={employee.id}
                onClick={() => handleCardClick(employee)}
                className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:border-[#ac51fc] hover:shadow-lg hover:shadow-[#ac51fc]/30 transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-500 shrink-0">
                    <FiUsers size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white truncate">
                      {employee.fullName || 'N/A'}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">Employee</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FiMail size={16} className="text-gray-400 shrink-0" />
                    <p className="text-sm text-gray-300 truncate">{employee.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">ID:</span>
                    <p className="text-sm text-gray-300">{employee.employeeId || 'N/A'}</p>
                  </div>
                  <div className="mt-3">
                    {employee.approvalStatus === 'approved' ? (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-500">
                        Approved
                      </span>
                    ) : employee.approvalStatus === 'pending' ? (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500/20 text-yellow-500">
                        Pending
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-500/20 text-red-500">
                        Rejected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === 1
                    ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <FiChevronLeft size={20} />
              </button>

              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    currentPage === page
                      ? 'bg-linear-to-r from-[#ac51fc] to-[#8800FF] text-white shadow-lg shadow-[#ac51fc]/50'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}

      <EmployeeDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
      />

      {toast.show && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default Employees;
