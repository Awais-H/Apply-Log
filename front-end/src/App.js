"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Plus, X, ChevronDown, FileText } from 'lucide-react';
export default function App({ onLogout }) {
    const [applications, setApplications] = useState([
        {
            id: "1",
            position: "Senior Software Developer",
            company: "Shopify",
            salary: "$95,000 CAD",
            employmentType: "fulltime",
            location: "Toronto, ON",
            applicationDeadline: "2024-02-15",
            status: "applied",
        },
        {
            id: "2",
            position: "Software Development Engineer",
            company: "Apple",
            salary: "$85,000 CAD",
            employmentType: "fulltime",
            location: "Toronto, ON",
            applicationDeadline: "2024-02-20",
            status: "applied",
        },
        {
            id: "3",
            position: "Frontend Developer",
            company: "Wealthsimple",
            salary: "$75,000 CAD",
            employmentType: "fulltime",
            location: "Toronto, ON",
            interviewDeadline: "2024-02-10",
            status: "interview",
        },
        {
            id: "4",
            position: "Full Stack Developer",
            company: "Mogo",
            salary: "$80,000 CAD",
            employmentType: "fulltime",
            location: "Vancouver, BC",
            status: "offer",
        },
        {
            id: "5",
            position: "Software Engineering Intern",
            company: "BlackBerry",
            salary: "$25/hour CAD",
            employmentType: "internship",
            location: "Waterloo, ON",
            status: "rejected",
        },
    ]);
    const [showModal, setShowModal] = useState(false);
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [editingApp, setEditingApp] = useState(null);
    const [showMoveModal, setShowMoveModal] = useState(false);
    const [expandedCards, setExpandedCards] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingAppForEdit, setEditingAppForEdit] = useState(null);
    const [formData, setFormData] = useState({
        position: "",
        company: "",
        salary: "",
        employmentType: "fulltime",
        location: "",
        applicationDeadline: "",
        interviewDeadline: "",
    });
    const [editFormData, setEditFormData] = useState({
        position: "",
        company: "",
        salary: "",
        employmentType: "fulltime",
        location: "",
        applicationDeadline: "",
        interviewDeadline: "",
    });
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleEditInputChange = (e) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value,
        });
    };
    const openEditModal = (app) => {
        setEditingAppForEdit(app);
        setEditFormData({
            position: app.position,
            company: app.company,
            salary: app.salary,
            employmentType: app.employmentType,
            location: app.location,
            applicationDeadline: app.applicationDeadline || "",
            interviewDeadline: app.interviewDeadline || "",
        });
        setShowEditModal(true);
    };
    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!editingAppForEdit)
            return;
        const updatedApp = {
            ...editingAppForEdit,
            position: editFormData.position,
            company: editFormData.company,
            salary: editFormData.salary,
            employmentType: editFormData.employmentType,
            location: editFormData.location,
            applicationDeadline: editFormData.applicationDeadline || undefined,
            interviewDeadline: editFormData.interviewDeadline || undefined,
        };
        setApplications(applications.map((app) => (app.id === editingAppForEdit.id ? updatedApp : app)));
        setShowEditModal(false);
        setEditingAppForEdit(null);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const newApp = {
            id: Date.now().toString(),
            position: formData.position,
            company: formData.company,
            salary: formData.salary,
            employmentType: formData.employmentType,
            location: formData.location,
            applicationDeadline: formData.applicationDeadline,
            status: "applied",
        };
        setApplications([...applications, newApp]);
        setFormData({
            position: "",
            company: "",
            salary: "",
            employmentType: "fulltime",
            location: "",
            applicationDeadline: "",
            interviewDeadline: "",
        });
        setShowModal(false);
    };
    const moveApplication = (appId, newStatus) => {
        setApplications(applications.map((app) => {
            if (app.id === appId) {
                const updatedApp = { ...app, status: newStatus };
                // Remove application deadline when moving to interview
                if (newStatus === "interview") {
                    delete updatedApp.applicationDeadline;
                }
                // Remove interview deadline when moving to offer or rejected
                if (newStatus === "offer" || newStatus === "rejected") {
                    delete updatedApp.interviewDeadline;
                }
                return updatedApp;
            }
            return app;
        }));
        setShowMoveModal(false);
        setEditingApp(null);
    };
    const deleteApplication = (appId) => {
        setApplications(prevApplications => prevApplications.filter((app) => app.id !== appId));
    };
    const updateApplicationNotes = (appId, notes) => {
        setApplications(applications.map((app) => (app.id === appId ? { ...app, notes } : app)));
    };
    const getApplicationsByStatus = (status) => {
        const byStatus = applications.filter((app) => app.status === status);
        const q = searchQuery.trim().toLowerCase();
        if (q.length === 0)
            return byStatus;
        return byStatus.filter((app) => {
            const haystack = `${app.company} ${app.position} ${app.location ?? ""}`.toLowerCase();
            return haystack.includes(q);
        });
    };
    const openNotesModal = (app) => {
        setSelectedApp(app);
        setShowNotesModal(true);
    };
    const openMoveModal = (app) => {
        setEditingApp(app);
        setShowMoveModal(true);
    };
    const toggleCardExpansion = (appId) => {
        if (expandedCards.includes(appId)) {
            setExpandedCards(expandedCards.filter((id) => id !== appId));
        }
        else {
            setExpandedCards([...expandedCards, appId]);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-slate-900 text-white", children: [_jsxs("div", { className: "bg-slate-800 p-4 flex items-center justify-between rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "bg-blue-600 p-2 rounded-lg", children: _jsx(FileText, { className: "w-6 h-6" }) }), _jsx("h1", { className: "text-xl font-bold", children: "Apply Log " }), _jsx("div", { className: "relative", children: _jsx("input", { type: "text", placeholder: "Search jobs...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "bg-slate-700 px-4 py-2 rounded-lg w-80 pt-2 pl-3.5", "aria-label": "Search jobs" }) })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("button", { onClick: () => setShowModal(true), className: "bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2", children: [_jsx(Plus, { className: "w-4 h-4" }), "Add Application"] }), _jsx("button", { onClick: onLogout, className: "text-gray-400 hover:text-white", children: "Logout" })] })] }), _jsx("div", { className: "p-6", children: _jsxs("div", { className: "grid grid-cols-4 gap-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx("div", { className: "w-3 h-3 bg-yellow-500 rounded-full" }), _jsx("h2", { className: "font-semibold", children: "Applied" }), _jsx("span", { className: "bg-slate-700 px-2 py-1 text-sm rounded-lg", children: getApplicationsByStatus("applied").length })] }), _jsx("div", { className: "space-y-4", children: getApplicationsByStatus("applied").map((app) => (_jsxs("div", { className: "bg-slate-800 p-4 rounded-lg", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold", children: app.company }), _jsx("p", { className: "text-gray-400 text-sm", children: app.position })] }), _jsx("button", { onClick: () => toggleCardExpansion(app.id), className: "text-gray-400 hover:text-white", children: _jsx(ChevronDown, { className: `w-4 h-4 transition-transform ${expandedCards.includes(app.id) ? "rotate-180" : ""}` }) })] }), expandedCards.includes(app.id) && (_jsxs("div", { className: "mt-2 space-y-1", children: [_jsx("p", { className: "text-gray-400 text-sm", children: app.salary }), _jsx("p", { className: "text-gray-400 text-sm", children: app.location }), app.applicationDeadline && (_jsxs("p", { className: "text-yellow-400 text-sm", children: ["Due: ", app.applicationDeadline] })), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => openEditModal(app), className: "mt-2 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm", children: "Edit" }), _jsxs("button", { onClick: () => openMoveModal(app), className: "mt-2 bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-lg text-sm flex items-center gap-1", children: ["Move ", _jsx(ChevronDown, { className: "w-3 h-3" })] }), _jsx("button", { onClick: () => deleteApplication(app.id), className: "mt-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm", children: "Delete" })] })] }))] }, app.id))) })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx("div", { className: "w-3 h-3 bg-purple-500 rounded-full" }), _jsx("h2", { className: "font-semibold", children: "Interviews" }), _jsx("span", { className: "bg-slate-700 px-2 py-1 text-sm rounded-lg", children: getApplicationsByStatus("interview").length })] }), _jsx("div", { className: "space-y-4", children: getApplicationsByStatus("interview").map((app) => (_jsxs("div", { className: "bg-slate-800 p-4 rounded-lg", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold", children: app.company }), _jsx("p", { className: "text-gray-400 text-sm", children: app.position })] }), _jsx("button", { onClick: () => toggleCardExpansion(app.id), className: "text-gray-400 hover:text-white", children: _jsx(ChevronDown, { className: `w-4 h-4 transition-transform ${expandedCards.includes(app.id) ? "rotate-180" : ""}` }) })] }), expandedCards.includes(app.id) && (_jsxs("div", { className: "mt-2 space-y-1", children: [_jsx("p", { className: "text-gray-400 text-sm", children: app.salary }), _jsx("p", { className: "text-gray-400 text-sm", children: app.location }), app.interviewDeadline && (_jsxs("p", { className: "text-purple-400 text-sm", children: ["Interview: ", app.interviewDeadline] })), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => openEditModal(app), className: "mt-2 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm", children: "Edit" }), _jsxs("button", { onClick: () => openMoveModal(app), className: "mt-2 bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-lg text-sm flex items-center gap-1", children: ["Move ", _jsx(ChevronDown, { className: "w-3 h-3" })] }), _jsx("button", { onClick: () => deleteApplication(app.id), className: "mt-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm", children: "Delete" })] })] }))] }, app.id))) })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx("div", { className: "w-3 h-3 bg-green-500 rounded-full" }), _jsx("h2", { className: "font-semibold", children: "Offers" }), _jsx("span", { className: "bg-slate-700 px-2 py-1 text-sm rounded-lg", children: getApplicationsByStatus("offer").length })] }), _jsx("div", { className: "space-y-4", children: getApplicationsByStatus("offer").map((app) => (_jsxs("div", { className: "bg-slate-800 p-4 rounded-lg", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold", children: app.company }), _jsx("p", { className: "text-gray-400 text-sm", children: app.position })] }), _jsx("button", { onClick: () => toggleCardExpansion(app.id), className: "text-gray-400 hover:text-white", children: _jsx(ChevronDown, { className: `w-4 h-4 transition-transform ${expandedCards.includes(app.id) ? "rotate-180" : ""}` }) })] }), expandedCards.includes(app.id) && (_jsxs("div", { className: "mt-2 space-y-1", children: [_jsx("p", { className: "text-gray-400 text-sm", children: app.salary }), _jsx("p", { className: "text-gray-400 text-sm", children: app.location }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => openEditModal(app), className: "mt-2 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm", children: "Edit" }), _jsxs("button", { onClick: () => openMoveModal(app), className: "mt-2 bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-lg text-sm flex items-center gap-1", children: ["Move ", _jsx(ChevronDown, { className: "w-3 h-3" })] }), _jsx("button", { onClick: () => deleteApplication(app.id), className: "mt-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm", children: "Delete" })] })] }))] }, app.id))) })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx("div", { className: "w-3 h-3 bg-red-500 rounded-full" }), _jsx("h2", { className: "font-semibold", children: "Rejected" }), _jsx("span", { className: "bg-slate-700 px-2 py-1 text-sm rounded-lg", children: getApplicationsByStatus("rejected").length })] }), _jsx("div", { className: "space-y-4", children: getApplicationsByStatus("rejected").map((app) => (_jsxs("div", { className: "bg-slate-800 p-4 rounded-lg", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold", children: app.company }), _jsx("p", { className: "text-gray-400 text-sm", children: app.position })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => openNotesModal(app), className: "bg-red-600 hover:bg-red-700 px-3 py-1 text-sm rounded-lg", children: "Notes" }), _jsx("button", { onClick: () => toggleCardExpansion(app.id), className: "text-gray-400 hover:text-white", children: _jsx(ChevronDown, { className: `w-4 h-4 transition-transform ${expandedCards.includes(app.id) ? "rotate-180" : ""}` }) })] })] }), expandedCards.includes(app.id) && (_jsxs("div", { className: "mt-2 space-y-1", children: [_jsx("p", { className: "text-gray-400 text-sm", children: app.salary }), _jsx("p", { className: "text-gray-400 text-sm", children: app.location }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => openEditModal(app), className: "mt-2 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm", children: "Edit" }), _jsxs("button", { onClick: () => openMoveModal(app), className: "mt-2 bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-md text-sm flex items-center gap-1", children: ["Move ", _jsx(ChevronDown, { className: "w-3 h-3" })] }), _jsx("button", { onClick: () => deleteApplication(app.id), className: "mt-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm", children: "Delete" })] })] }))] }, app.id))) })] })] }) }), showModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-slate-800 text-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Add Application" }), _jsx("button", { onClick: () => setShowModal(false), className: "text-gray-400 hover:text-white", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Position*" }), _jsx("input", { type: "text", name: "position", value: formData.position, onChange: handleInputChange, placeholder: "Ex: Software Developer", className: "w-full p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Employment Type" }), _jsxs("select", { name: "employmentType", value: formData.employmentType, onChange: handleInputChange, className: "w-full p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400", children: [_jsx("option", { value: "fulltime", children: "Full-time" }), _jsx("option", { value: "parttime", children: "Part-time" }), _jsx("option", { value: "internship", children: "Internship" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Company Name*" }), _jsx("input", { type: "text", name: "company", value: formData.company, onChange: handleInputChange, placeholder: "Ex: Google", className: "w-full p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Salary/Wage" }), _jsx("input", { type: "text", name: "salary", value: formData.salary, onChange: handleInputChange, placeholder: "Ex: $75,000 CAD or $25/hour CAD", className: "w-full p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Location" }), _jsx("input", { type: "text", name: "location", value: formData.location, onChange: handleInputChange, placeholder: "Ex: Toronto, ON", className: "w-full p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Application Deadline" }), _jsx("input", { type: "date", name: "applicationDeadline", value: formData.applicationDeadline, onChange: handleInputChange, className: "w-full p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400" })] }), _jsx("button", { type: "submit", className: "w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700", children: "Save" })] })] }) })), showMoveModal && editingApp && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-slate-800 text-white p-6 rounded-lg w-80", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Move Application" }), _jsxs("p", { className: "text-sm text-gray-400 mb-4", children: ["Move ", editingApp.company, " - ", editingApp.position, " to:"] }), _jsxs("div", { className: "space-y-2", children: [editingApp.status !== "applied" && (_jsx("button", { onClick: () => moveApplication(editingApp.id, "applied"), className: "w-full text-left p-2 hover:bg-slate-700 rounded", children: "Applied" })), editingApp.status !== "interview" && (_jsx("button", { onClick: () => moveApplication(editingApp.id, "interview"), className: "w-full text-left p-2 hover:bg-slate-700 rounded", children: "Interview" })), editingApp.status !== "offer" && (_jsx("button", { onClick: () => moveApplication(editingApp.id, "offer"), className: "w-full text-left p-2 hover:bg-slate-700 rounded", children: "Offer" })), editingApp.status !== "rejected" && (_jsx("button", { onClick: () => moveApplication(editingApp.id, "rejected"), className: "w-full text-left p-2 hover:bg-slate-700 rounded", children: "Rejected" }))] }), _jsx("button", { onClick: () => setShowMoveModal(false), className: "mt-4 w-full bg-slate-700 text-white py-2 rounded hover:bg-slate-600", children: "Cancel" })] }) })), showNotesModal && selectedApp && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-slate-800 text-white p-6 rounded-lg w-96", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Rejection Notes" }), _jsx("button", { onClick: () => setShowNotesModal(false), className: "text-gray-400 hover:text-white", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("p", { className: "text-sm text-gray-400 mb-4", children: [selectedApp.company, " - ", selectedApp.position] }), _jsx("textarea", { value: selectedApp.notes || "", onChange: (e) => {
                                const updatedApp = { ...selectedApp, notes: e.target.value };
                                setSelectedApp(updatedApp);
                                updateApplicationNotes(selectedApp.id, e.target.value);
                            }, placeholder: "Add notes about why you were rejected and areas for improvement...", className: "w-full h-32 p-2 bg-slate-700 border border-slate-600 rounded resize-none text-white placeholder-gray-400" }), _jsx("button", { onClick: () => setShowNotesModal(false), className: "mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700", children: "Save Notes" })] }) })), showEditModal && editingAppForEdit && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-slate-800 text-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Edit Application" }), _jsx("button", { onClick: () => setShowEditModal(false), className: "text-gray-400 hover:text-white", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("form", { onSubmit: handleEditSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Position*" }), _jsx("input", { type: "text", name: "position", value: editFormData.position, onChange: handleEditInputChange, placeholder: "Ex: Software Developer", className: "w-full p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Employment Type" }), _jsxs("select", { name: "employmentType", value: editFormData.employmentType, onChange: handleEditInputChange, className: "w-full p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400", children: [_jsx("option", { value: "fulltime", children: "Full-time" }), _jsx("option", { value: "parttime", children: "Part-time" }), _jsx("option", { value: "internship", children: "Internship" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Company Name*" }), _jsx("input", { type: "text", name: "company", value: editFormData.company, onChange: handleEditInputChange, placeholder: "Ex: Google", className: "w-full p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Salary/Wage" }), _jsx("input", { type: "text", name: "salary", value: editFormData.salary, onChange: handleEditInputChange, placeholder: "Ex: $75,000 CAD or $25/hour CAD", className: "w-full p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Location" }), _jsx("input", { type: "text", name: "location", value: editFormData.location, onChange: handleEditInputChange, placeholder: "Ex: Toronto, ON", className: "w-full p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400" })] }), editingAppForEdit.status === "applied" && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Application Deadline" }), _jsx("input", { type: "date", name: "applicationDeadline", value: editFormData.applicationDeadline, onChange: handleEditInputChange, className: "w-full p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400" })] })), editingAppForEdit.status === "interview" && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Interview Deadline" }), _jsx("input", { type: "date", name: "interviewDeadline", value: editFormData.interviewDeadline, onChange: handleEditInputChange, className: "w-full p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400" })] })), _jsx("button", { type: "submit", className: "w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700", children: "Update Application" })] })] }) }))] }));
}
