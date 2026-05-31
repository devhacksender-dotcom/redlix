"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    Calendar,
    Clock,
    Plus,
    Loader2,
    LogOut,
    ListTodo,
    Trash2,
    Edit2,
    X,
    Users,
    AlertCircle,
    CheckCircle2,
    Briefcase,
    FileText,
    Download
} from "lucide-react";
import Script from "next/script";

interface Employee {
    id: number;
    name: string;
    email: string;
    role: string;
    isDeptAdmin?: boolean;
}

interface AttendanceRecord {
    id: number;
    employeeId: number;
    punchIn: string;
    punchOut?: string;
    workMinutes: number;
    employee?: Employee;
}

interface Task {
    id: number;
    title: string;
    description?: string;
    status: string; // pending | in_progress | completed
    deadline?: string;
    employeeId: number;
    createdAt: string;
    employee?: Employee;
}

interface Document {
    id: number;
    title: string;
    description?: string | null;
    category: string;
    fileUrl: string;
    fileName: string;
    uploadedBy: string;
    createdAt: string;
}

const renderTextWithLinks = (text: string) => {
    if (!text) return "";
    const parts = text.split(/(https?:\/\/[^\s]+)/gi);
    return parts.map((part, index) => {
        if (part.match(/^https?:\/\//i)) {
            return (
                <a
                    key={index}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline break-all font-medium"
                >
                    {part}
                </a>
            );
        }
        return part;
    });
};

export default function DepartmentDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"overview" | "attendance" | "tasks" | "documents">("overview");

    // Data States
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter and Search States
    const [searchQuery, setSearchQuery] = useState("");
    const [taskFilter, setTaskFilter] = useState<"all" | "pending" | "in_progress" | "completed">("all");

    // Task Create Form States
    const [showAddTaskForm, setShowAddTaskForm] = useState(false);
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        employeeId: "",
        deadline: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Task Edit Form States
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isEditingTask, setIsEditingTask] = useState(false);

    // Document States
    const [documentsLoading, setDocumentsLoading] = useState(false);
    const [showAddDocForm, setShowAddDocForm] = useState(false);
    const [newDoc, setNewDoc] = useState({
        title: "",
        category: "company",
        fileName: "",
        fileUrl: "",
        description: ""
    });
    const [docIsSubmitting, setDocIsSubmitting] = useState(false);

    // Fetch handlers
    const fetchEmployees = async () => {
        try {
            const res = await fetch("/api/department/employees");
            const data = await res.json();
            if (data.success) setEmployees(data.data);
        } catch (error) {
            console.error("Failed to fetch employees:", error);
        }
    };

    const fetchAttendance = async () => {
        try {
            const res = await fetch("/api/department/attendance");
            const data = await res.json();
            if (data.success) setAttendanceLogs(data.data);
        } catch (error) {
            console.error("Failed to fetch attendance:", error);
        }
    };

    const fetchTasks = async () => {
        try {
            const res = await fetch("/api/department/tasks");
            const data = await res.json();
            if (data.success) setTasks(data.data);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        }
    };

    const fetchAllData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchEmployees(),
                fetchAttendance(),
                fetchTasks(),
                fetchDocuments()
            ]);
        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDocuments = async () => {
        setDocumentsLoading(true);
        try {
            const res = await fetch("/api/department/documents");
            const data = await res.json();
            if (data.success) setDocuments(data.data);
        } catch (error) {
            console.error("Failed to fetch documents:", error);
        } finally {
            setDocumentsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // Reload trigger for active tab changes to fetch freshest state
    useEffect(() => {
        if (activeTab === "attendance") {
            fetchAttendance();
        } else if (activeTab === "tasks") {
            fetchTasks();
            fetchEmployees();
        } else if (activeTab === "documents") {
            fetchDocuments();
        }
    }, [activeTab]);

    // Handle logout
    const handleLogout = async () => {
        try {
            await fetch("/api/department/logout", { method: "POST" });
            router.push("/department/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Task Mutation Actions
    const handleAddTaskSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.title || !newTask.employeeId) {
            alert("Title and Employee Assignment are required");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/department/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTask)
            });
            const data = await res.json();
            if (data.success) {
                setTasks(prev => [data.data, ...prev]);
                setShowAddTaskForm(false);
                setNewTask({ title: "", description: "", employeeId: "", deadline: "" });
                alert("Task assigned successfully!");
            } else {
                alert(data.message || "Failed to assign task");
            }
        } catch (error) {
            console.error("Failed to assign task:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateTaskSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTask) return;

        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/department/tasks/${selectedTask.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: selectedTask.title,
                    description: selectedTask.description,
                    status: selectedTask.status,
                    deadline: selectedTask.deadline,
                    employeeId: selectedTask.employeeId
                })
            });
            const data = await res.json();
            if (data.success) {
                setTasks(prev => prev.map(t => t.id === selectedTask.id ? data.data : t));
                setIsEditingTask(false);
                setSelectedTask(null);
                alert("Task updated successfully!");
            } else {
                alert(data.message || "Failed to update task");
            }
        } catch (error) {
            console.error("Failed to update task:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        if (!confirm("Are you sure you want to delete this task?")) return;

        try {
            const res = await fetch(`/api/department/tasks/${taskId}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.success) {
                setTasks(prev => prev.filter(t => t.id !== taskId));
                alert("Task deleted successfully!");
            } else {
                alert(data.message || "Failed to delete task");
            }
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    };

    const handleAddDocument = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDoc.title || !newDoc.fileUrl || !newDoc.fileName) {
            alert("Title, file URL and file name are required");
            return;
        }

        setDocIsSubmitting(true);
        try {
            const res = await fetch("/api/department/documents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newDoc)
            });
            const data = await res.json();
            if (data.success) {
                setDocuments(prev => [data.data, ...prev]);
                setShowAddDocForm(false);
                setNewDoc({ title: "", category: "company", fileName: "", fileUrl: "", description: "" });
                alert("Document added successfully!");
            } else {
                alert(data.message || "Failed to add document");
            }
        } catch (error) {
            console.error("Failed to add document:", error);
        } finally {
            setDocIsSubmitting(false);
        }
    };

    const handleDeleteDocument = async (id: number) => {
        if (!confirm("Are you sure you want to delete this document?")) return;

        try {
            const res = await fetch(`/api/department/documents/${id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.success) {
                setDocuments(prev => prev.filter(d => d.id !== id));
                alert("Document deleted successfully!");
            } else {
                alert(data.message || "Failed to delete document");
            }
        } catch (error) {
            console.error("Failed to delete document:", error);
        }
    };

    // IST Formatter Helper
    const formatIST = (dateStr: string | null | undefined) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "medium",
            timeStyle: "short"
        });
    };

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans">
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 bg-black border-r border-white/5 flex flex-col shrink-0">
                    <div className="p-6 border-b border-white/5 flex flex-col gap-1 shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#E61E32] animate-pulse" />
                            <span className="text-sm font-extrabold uppercase tracking-widest text-white">Redlix Leads</span>
                        </div>
                        <span className="text-[10px] text-white/30 uppercase tracking-wider font-bold">Department Terminal</span>
                    </div>

                    <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
                        <button
                            onClick={() => { setActiveTab("overview"); setSearchQuery(""); }}
                            className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'overview' ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                        >
                            <Users className="w-4 h-4" />
                            Overview
                        </button>
                        <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                        <button
                            onClick={() => { setActiveTab("attendance"); setSearchQuery(""); }}
                            className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'attendance' ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                        >
                            <Clock className="w-4 h-4" />
                            Attendance Logs
                        </button>
                        <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                        <button
                            onClick={() => { setActiveTab("tasks"); setSearchQuery(""); }}
                            className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'tasks' ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                        >
                            <ListTodo className="w-4 h-4" />
                            Task Assignment
                        </button>
                        <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                        <button
                            onClick={() => { setActiveTab("documents"); setSearchQuery(""); }}
                            className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'documents' ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                        >
                            <FileText className="w-4 h-4" />
                            Document Vault
                        </button>
                    </nav>

                    <div className="h-[1px] bg-white/5" />
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 bg-[#E61E32] hover:bg-[#E61E32]/90 text-white transition-all text-sm font-semibold shadow-lg shadow-[#E61E32]/10 rounded-none"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout Terminal
                    </button>
                </aside>

                {/* Main panel */}
                <div className="flex-grow p-8 overflow-y-auto h-full flex flex-col">
                    <div className="max-w-7xl mx-auto space-y-8 h-full flex flex-col w-full">
                        {/* Header bar */}
                        <div className="flex justify-between items-center bg-white/[0.02] p-6 border border-white/5 shrink-0">
                            <div>
                                <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-white/30 mb-1.5">
                                    <span>Department</span>
                                    <span className="text-white/10 font-normal">/</span>
                                    <span className="text-[#E61E32]">
                                        {activeTab === "overview" ? "Overview" : activeTab === "attendance" ? "Attendance" : activeTab === "tasks" ? "Tasks" : "Documents"}
                                    </span>
                                </div>
                                <h2 className="text-xl font-semibold text-white tracking-tight">
                                    {activeTab === "overview" ? "Department Overview" : activeTab === "attendance" ? "Employee Attendance logs" : activeTab === "tasks" ? "Task Board" : "Document Vault"}
                                </h2>
                                <p className="text-xs text-white/30 mt-0.5">
                                    {activeTab === "overview" ? "Real-time metrics and active team counts" : activeTab === "attendance" ? "Verify daily check-in and check-out logs (in IST)" : activeTab === "tasks" ? "Assign, update, and manage employee checklists" : "Upload and manage company and client documents"}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                {activeTab === "tasks" && (
                                    <button
                                        onClick={() => setShowAddTaskForm(true)}
                                        className="flex items-center gap-2 bg-[#E61E32] hover:bg-[#ff1f34] text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-colors rounded-none"
                                    >
                                        <Plus className="w-4 h-4" /> Create & Assign Task
                                    </button>
                                )}

                                {activeTab === "documents" && (
                                    <button
                                        onClick={() => setShowAddDocForm(true)}
                                        className="flex items-center gap-2 bg-[#E61E32] hover:bg-[#ff1f34] text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-colors rounded-none"
                                    >
                                        <Plus className="w-4 h-4" /> Add Document
                                    </button>
                                )}

                                {activeTab !== "overview" && (
                                    <div className="relative w-72">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <input
                                            type="text"
                                            placeholder={activeTab === "documents" ? "Search documents..." : "Search by employee/role..."}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 px-10 py-2.5 text-xs focus:outline-none focus:border-[#E61E32] rounded-none text-white placeholder-white/20"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content viewport */}
                        <div className="flex-grow overflow-hidden">
                            {loading ? (
                                <div className="flex items-center justify-center py-24">
                                    <Loader2 className="w-8 h-8 animate-spin text-[#E61E32]" />
                                </div>
                            ) : (
                                <>
                                    {/* ===== OVERVIEW TAB ===== */}
                                    {activeTab === "overview" && (
                                        <div className="space-y-6 animate-in fade-in duration-500 overflow-y-auto pr-2 pb-6">
                                            {/* Stat cards */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="bg-white/[0.02] border border-white/5 p-6 space-y-3">
                                                    <div className="w-8 h-8 bg-white/5 flex items-center justify-center border border-white/10 text-white">
                                                        <Users className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Total Department Employees</p>
                                                        <h3 className="text-2xl font-semibold mt-1 text-white">{employees.length}</h3>
                                                        <p className="text-[9px] text-white/20 mt-0.5">Active profiles listed</p>
                                                    </div>
                                                </div>

                                                <div className="bg-white/[0.02] border border-white/5 p-6 space-y-3">
                                                    <div className="w-8 h-8 bg-white/5 flex items-center justify-center border border-white/10 text-[#E61E32]">
                                                        <Clock className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Today's Check-ins</p>
                                                        <h3 className="text-2xl font-semibold mt-1 text-white">
                                                            {attendanceLogs.filter(log => {
                                                                const checkInDate = new Date(log.punchIn).toDateString();
                                                                const today = new Date().toDateString();
                                                                return checkInDate === today;
                                                            }).length}
                                                        </h3>
                                                        <p className="text-[9px] text-white/20 mt-0.5">Recorded check-ins today</p>
                                                    </div>
                                                </div>

                                                <div className="bg-white/[0.02] border border-white/5 p-6 space-y-3">
                                                    <div className="w-8 h-8 bg-white/5 flex items-center justify-center border border-white/10 text-green-400">
                                                        <ListTodo className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Pending Department Tasks</p>
                                                        <h3 className="text-2xl font-semibold mt-1 text-white">
                                                            {tasks.filter(t => t.status === "pending" || t.status === "in_progress").length}
                                                        </h3>
                                                        <p className="text-[9px] text-white/20 mt-0.5">Require review/completion</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Department Lead Info box */}
                                            <div className="bg-white/5 border border-white/5 p-6 flex items-center gap-6">
                                                <div className="w-12 h-12 bg-[#E61E32]/10 border border-[#E61E32]/25 flex items-center justify-center">
                                                    <Briefcase className="w-6 h-6 text-[#E61E32]" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">Department Administrator Control</h3>
                                                    <p className="text-xs text-white/50 mt-1 max-w-2xl leading-relaxed">
                                                        Use this dashboard to monitor the team's operational logs and delegate target duties. Use the navigation sidebar on the left to review employee check-in timelines under **Attendance Logs** and allocate specific assignments under **Task Assignment**.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ===== ATTENDANCE TAB ===== */}
                                    {activeTab === "attendance" && (
                                        <div className="bg-white/5 border border-white/5 p-6 flex flex-col overflow-hidden h-full animate-in fade-in duration-500">
                                            <div className="overflow-y-auto pr-1 flex-grow scrollbar-thin">
                                                {(() => {
                                                    const filtered = attendanceLogs.filter(log => {
                                                        const nameMatch = log.employee?.name.toLowerCase().includes(searchQuery.toLowerCase());
                                                        const roleMatch = log.employee?.role.toLowerCase().includes(searchQuery.toLowerCase());
                                                        return nameMatch || roleMatch;
                                                    });

                                                    return filtered.length > 0 ? (
                                                        <table className="w-full text-left text-xs">
                                                            <thead>
                                                                <tr className="border-b border-white/10 text-white/30 uppercase tracking-wider text-[9px] font-bold">
                                                                    <th className="py-3">Employee</th>
                                                                    <th className="py-3">Role</th>
                                                                    <th className="py-3">Punch-In Time (IST)</th>
                                                                    <th className="py-3">Punch-Out Time (IST)</th>
                                                                    <th className="py-3 text-right">Duration</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {filtered.map((log) => {
                                                                    const duration = log.workMinutes > 0 
                                                                        ? `${Math.floor(log.workMinutes / 60)}h ${log.workMinutes % 60}m` 
                                                                        : log.punchOut 
                                                                        ? "< 1 min" 
                                                                        : "Active Session";
                                                                    
                                                                    return (
                                                                        <tr key={log.id} className="border-b border-white/5 text-white/70 hover:bg-white/[0.01]">
                                                                            <td className="py-3.5">
                                                                                <p className="font-semibold text-white">{log.employee?.name}</p>
                                                                                <p className="text-[10px] text-white/30">{log.employee?.email}</p>
                                                                            </td>
                                                                            <td className="py-3.5 text-white/50">{log.employee?.role}</td>
                                                                            <td className="py-3.5 text-white/80 font-mono text-[11px]">{formatIST(log.punchIn)}</td>
                                                                            <td className="py-3.5 font-mono text-[11px]">
                                                                                {log.punchOut ? (
                                                                                    <span className="text-white/80">{formatIST(log.punchOut)}</span>
                                                                                ) : (
                                                                                    <span className="text-yellow-400/80 uppercase text-[9px] tracking-wider font-extrabold border border-yellow-400/20 bg-yellow-400/5 px-2 py-0.5">Punch In</span>
                                                                                )}
                                                                            </td>
                                                                            <td className="py-3.5 text-right font-semibold text-white/60">
                                                                                {log.punchOut ? (
                                                                                    <span className="text-white/80">{duration}</span>
                                                                                ) : (
                                                                                    <span className="text-yellow-400 font-extrabold tracking-wide uppercase text-[9px] animate-pulse">In Office</span>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    ) : (
                                                        <div className="py-16 text-center border border-dashed border-white/5">
                                                            <p className="text-white/20 text-xs">No attendance logs found matching filters.</p>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    )}

                                    {/* ===== TASKS TAB ===== */}
                                    {activeTab === "tasks" && (
                                        <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500 overflow-hidden">
                                            {/* Filters subbar */}
                                            <div className="flex flex-wrap items-center justify-between gap-4 shrink-0 border-b border-white/5 pb-4">
                                                <div className="flex gap-2">
                                                    {(["all", "pending", "in_progress", "completed"] as const).map((filter) => {
                                                        const count = filter === "all"
                                                            ? tasks.length
                                                            : tasks.filter(t => t.status === filter).length;
                                                        const isActive = taskFilter === filter;
                                                        return (
                                                            <button
                                                                key={filter}
                                                                onClick={() => setTaskFilter(filter)}
                                                                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border rounded-none ${
                                                                    isActive
                                                                        ? "bg-[#E61E32]/10 text-[#E61E32] border-[#E61E32]/35"
                                                                        : "bg-white/5 text-white/50 border-white/5 hover:text-white hover:bg-white/10"
                                                                }`}
                                                            >
                                                                {filter.replace("_", " ")} ({count})
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Form Panel: Add Task (Conditional Modal Overlay) */}
                                            {showAddTaskForm && (
                                                <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
                                                    <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 p-8 space-y-6">
                                                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                                            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Create & Assign Duty</h3>
                                                            <button onClick={() => setShowAddTaskForm(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
                                                        </div>

                                                        <form onSubmit={handleAddTaskSubmit} className="space-y-4">
                                                            <div className="space-y-1.5">
                                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Assign to Employee *</label>
                                                                <select
                                                                    required
                                                                    value={newTask.employeeId}
                                                                    onChange={(e) => setNewTask({ ...newTask, employeeId: e.target.value })}
                                                                    className="w-full bg-[#111] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E61E32] rounded-none"
                                                                >
                                                                    <option value="" disabled className="bg-[#111]">-- Select Assignee --</option>
                                                                    {employees.map(emp => (
                                                                        <option key={emp.id} value={emp.id} className="bg-[#111]">
                                                                            {emp.name} ({emp.role})
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            <div className="space-y-1.5">
                                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Task Title *</label>
                                                                <input
                                                                    required
                                                                    type="text"
                                                                    placeholder="e.g. Update API endpoint credentials"
                                                                    value={newTask.title}
                                                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                                                    className="w-full bg-[#111] border border-white/10 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#E61E32] rounded-none"
                                                                />
                                                            </div>

                                                            <div className="space-y-1.5">
                                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Description</label>
                                                                <textarea
                                                                    rows={3}
                                                                    placeholder="Specify action steps or target files..."
                                                                    value={newTask.description}
                                                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                                                    className="w-full bg-[#111] border border-white/10 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#E61E32] rounded-none resize-none font-sans"
                                                                />
                                                            </div>

                                                            <div className="space-y-1.5">
                                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Deadline Date</label>
                                                                <input
                                                                    type="date"
                                                                    value={newTask.deadline}
                                                                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                                                                    className="w-full bg-[#111] border border-white/10 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#E61E32] rounded-none"
                                                                />
                                                            </div>

                                                            <button
                                                                type="submit"
                                                                disabled={isSubmitting}
                                                                className="w-full bg-[#E61E32] hover:bg-[#ff1f34] text-white py-3 text-xs font-black uppercase tracking-widest transition-colors duration-200 disabled:opacity-50"
                                                            >
                                                                {isSubmitting ? "Submitting..." : "Assign Task"}
                                                            </button>
                                                        </form>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Form Panel: Edit Task (Conditional Modal Overlay) */}
                                            {isEditingTask && selectedTask && (
                                                <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
                                                    <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 p-8 space-y-6">
                                                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                                            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Modify Task Details</h3>
                                                            <button onClick={() => { setIsEditingTask(false); setSelectedTask(null); }} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
                                                        </div>

                                                        <form onSubmit={handleUpdateTaskSubmit} className="space-y-4">
                                                            <div className="space-y-1.5">
                                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Assigned Employee *</label>
                                                                <select
                                                                    required
                                                                    value={selectedTask.employeeId}
                                                                    onChange={(e) => setSelectedTask({ ...selectedTask, employeeId: parseInt(e.target.value) })}
                                                                    className="w-full bg-[#111] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E61E32] rounded-none"
                                                                >
                                                                    {employees.map(emp => (
                                                                        <option key={emp.id} value={emp.id} className="bg-[#111]">
                                                                            {emp.name} ({emp.role})
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            <div className="space-y-1.5">
                                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Task Title *</label>
                                                                <input
                                                                    required
                                                                    type="text"
                                                                    value={selectedTask.title}
                                                                    onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                                                                    className="w-full bg-[#111] border border-white/10 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#E61E32] rounded-none"
                                                                />
                                                            </div>

                                                            <div className="space-y-1.5">
                                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Description</label>
                                                                <textarea
                                                                    rows={3}
                                                                    value={selectedTask.description || ""}
                                                                    onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                                                                    className="w-full bg-[#111] border border-white/10 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#E61E32] rounded-none resize-none font-sans"
                                                                />
                                                            </div>

                                                            <div className="space-y-1.5">
                                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Status</label>
                                                                <select
                                                                    value={selectedTask.status}
                                                                    onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value })}
                                                                    className="w-full bg-[#111] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E61E32] rounded-none"
                                                                >
                                                                    <option value="pending" className="bg-[#111]">Pending</option>
                                                                    <option value="in_progress" className="bg-[#111]">In Progress</option>
                                                                    <option value="completed" className="bg-[#111]">Completed</option>
                                                                </select>
                                                            </div>

                                                            <div className="space-y-1.5">
                                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Deadline Date</label>
                                                                <input
                                                                    type="date"
                                                                    value={selectedTask.deadline ? selectedTask.deadline.split("T")[0] : ""}
                                                                    onChange={(e) => setSelectedTask({ ...selectedTask, deadline: e.target.value })}
                                                                    className="w-full bg-[#111] border border-white/10 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#E61E32] rounded-none"
                                                                />
                                                            </div>

                                                            <button
                                                                type="submit"
                                                                disabled={isSubmitting}
                                                                className="w-full bg-[#E61E32] hover:bg-[#ff1f34] text-white py-3 text-xs font-black uppercase tracking-widest transition-colors duration-200 disabled:opacity-50"
                                                            >
                                                                {isSubmitting ? "Saving..." : "Save Changes"}
                                                            </button>
                                                        </form>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Scrollable Tasks Grid */}
                                            <div className="flex-grow overflow-y-auto pr-1 scrollbar-thin">
                                                {(() => {
                                                    const filtered = tasks.filter(t => {
                                                        const matchesStatus = taskFilter === "all" || t.status === taskFilter;
                                                        const matchesQuery = t.employee?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                            t.employee?.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                            (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
                                                        return matchesStatus && matchesQuery;
                                                    });

                                                    return filtered.length > 0 ? (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                                                            {filtered.map((task) => (
                                                                <div key={task.id} className="bg-white/5 border border-white/5 p-6 flex flex-col justify-between space-y-4 hover:border-white/10 transition-colors">
                                                                    <div className="space-y-3">
                                                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                                                            <div>
                                                                                <h4 className="text-sm font-bold text-white line-clamp-1">{task.title}</h4>
                                                                                <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mt-1">Assignee: {task.employee?.name} ({task.employee?.role})</p>
                                                                            </div>
                                                                            <span className={`px-2 py-0.5 text-[8px] uppercase tracking-widest font-black border self-start sm:self-auto shrink-0 ${
                                                                                task.status === 'completed'
                                                                                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                                                    : task.status === 'in_progress'
                                                                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                                                    : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                                            }`}>
                                                                                {task.status.replace("_", " ")}
                                                                            </span>
                                                                        </div>

                                                                        <div className="h-[1px] bg-white/5" />

                                                                        {task.description && (
                                                                            <p className="text-xs text-white/50 leading-relaxed break-words line-clamp-3">
                                                                                {renderTextWithLinks(task.description)}
                                                                            </p>
                                                                        )}

                                                                        <div className="flex items-center gap-4 text-[10px] text-white/30 pt-1">
                                                                            <span className="flex items-center gap-1">
                                                                                <Calendar className="w-3.5 h-3.5" /> Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium' }) : "None"}
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                                                                        <button
                                                                            onClick={() => { setSelectedTask(task); setIsEditingTask(true); }}
                                                                            className="p-1.5 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                                                                            title="Edit Task"
                                                                        >
                                                                            <Edit2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteTask(task.id)}
                                                                            className="p-1.5 text-white/40 hover:text-[#E61E32] bg-white/5 hover:bg-[#E61E32]/10 border border-white/10 hover:border-[#E61E32]/25 transition-all"
                                                                            title="Delete Task"
                                                                        >
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="py-16 text-center border border-dashed border-white/5">
                                                            <p className="text-white/20 text-xs">No tasks found matching filters.</p>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    )}

                                    {/* ===== DOCUMENTS TAB ===== */}
                                    {activeTab === "documents" && (
                                        <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500 overflow-hidden">
                                            {/* Form Panel: Add Document Modal */}
                                            {showAddDocForm && (
                                                <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
                                                    <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 p-8 space-y-6">
                                                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                                            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Add New Document</h3>
                                                            <button onClick={() => setShowAddDocForm(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
                                                        </div>

                                                        <form onSubmit={handleAddDocument} className="space-y-4">
                                                            <div className="space-y-1.5">
                                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Document Title *</label>
                                                                <input
                                                                    required
                                                                    type="text"
                                                                    placeholder="e.g. Q2 Performance Report"
                                                                    value={newDoc.title}
                                                                    onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                                                                    className="w-full bg-[#111] border border-white/10 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#E61E32] rounded-none"
                                                                />
                                                            </div>

                                                            <div className="space-y-1.5">
                                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Category</label>
                                                                <select
                                                                    value={newDoc.category}
                                                                    onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                                                                    className="w-full bg-[#111] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E61E32] rounded-none"
                                                                >
                                                                    <option value="company" className="bg-[#111]">Company Document</option>
                                                                    <option value="client" className="bg-[#111]">Client Document</option>
                                                                    <option value="requirement" className="bg-[#111]">Requirement Document</option>
                                                                    <option value="legal" className="bg-[#111]">Legal / Compliance</option>
                                                                    <option value="other" className="bg-[#111]">Other</option>
                                                                </select>
                                                            </div>

                                                            <div className="space-y-1.5">
                                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">File Name *</label>
                                                                <input
                                                                    required
                                                                    type="text"
                                                                    placeholder="e.g. Q2_Performance.pdf"
                                                                    value={newDoc.fileName}
                                                                    onChange={(e) => setNewDoc({ ...newDoc, fileName: e.target.value })}
                                                                    className="w-full bg-[#111] border border-white/10 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#E61E32] rounded-none"
                                                                />
                                                            </div>

                                                            <div className="space-y-1.5">
                                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">File URL *</label>
                                                                <input
                                                                    required
                                                                    type="text"
                                                                    placeholder="e.g. https://drive.google.com/..."
                                                                    value={newDoc.fileUrl}
                                                                    onChange={(e) => setNewDoc({ ...newDoc, fileUrl: e.target.value })}
                                                                    className="w-full bg-[#111] border border-white/10 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#E61E32] rounded-none"
                                                                />
                                                            </div>

                                                            <div className="space-y-1.5">
                                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Description</label>
                                                                <textarea
                                                                    rows={3}
                                                                    placeholder="Specify details about this document..."
                                                                    value={newDoc.description}
                                                                    onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
                                                                    className="w-full bg-[#111] border border-white/10 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#E61E32] rounded-none resize-none font-sans"
                                                                />
                                                            </div>

                                                            <button
                                                                type="submit"
                                                                disabled={docIsSubmitting}
                                                                className="w-full bg-[#E61E32] hover:bg-[#ff1f34] text-white py-3 text-xs font-black uppercase tracking-widest transition-colors duration-200 disabled:opacity-50"
                                                            >
                                                                {docIsSubmitting ? "Adding..." : "Add Document"}
                                                            </button>
                                                        </form>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Scrollable Documents Grid */}
                                            <div className="flex-grow overflow-y-auto pr-1 scrollbar-thin">
                                                {documentsLoading ? (
                                                    <div className="flex items-center justify-center py-24">
                                                        <Loader2 className="w-8 h-8 animate-spin text-[#E61E32]" />
                                                    </div>
                                                ) : (() => {
                                                    const filtered = documents.filter(doc => {
                                                        const matchesQuery = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                            doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                            doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                            (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()));
                                                        return matchesQuery;
                                                    });

                                                    return filtered.length > 0 ? (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                                                            {filtered.map((doc) => {
                                                                const categoryColors: Record<string, string> = {
                                                                    company: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
                                                                    client: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
                                                                    requirement: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
                                                                    legal: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
                                                                    other: 'text-white/40 bg-white/5 border-white/10'
                                                                };
                                                                return (
                                                                    <div key={doc.id} className="bg-white/5 border border-white/5 p-6 flex flex-col justify-between space-y-4 hover:border-white/10 transition-colors group">
                                                                        <div className="space-y-3">
                                                                            <div className="flex justify-between items-start gap-4">
                                                                                <div className="flex items-center gap-2">
                                                                                    <FileText className="w-5 h-5 text-[#E61E32] shrink-0" />
                                                                                    <div>
                                                                                        <h4 className="text-sm font-bold text-white line-clamp-1">{doc.title}</h4>
                                                                                        <p className="text-[10px] text-white/30">{doc.fileName}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <button
                                                                                    onClick={() => handleDeleteDocument(doc.id)}
                                                                                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-[#E61E32]/10 text-white/30 hover:text-[#E61E32] transition-all"
                                                                                    title="Delete Document"
                                                                                >
                                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                                </button>
                                                                            </div>

                                                                            <div className="h-[1px] bg-white/5" />

                                                                            {doc.description && (
                                                                                <p className="text-xs text-white/50 leading-relaxed break-words line-clamp-3">
                                                                                    {doc.description}
                                                                                </p>
                                                                            )}

                                                                            <div className="flex items-center justify-between text-[10px] text-white/30 pt-1">
                                                                                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border ${categoryColors[doc.category] || categoryColors.other}`}>
                                                                                    {doc.category}
                                                                                </span>
                                                                                <span>{new Date(doc.createdAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium' })}</span>
                                                                            </div>
                                                                        </div>

                                                                        <div className="pt-2 border-t border-white/5">
                                                                            <a
                                                                                href={doc.fileUrl}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="flex items-center gap-2 w-full py-2 bg-white/5 hover:bg-[#E61E32]/10 border border-white/10 hover:border-[#E61E32]/20 text-white/60 hover:text-[#E61E32] text-xs font-medium transition-all justify-center"
                                                                            >
                                                                                <Download className="w-3.5 h-3.5" /> View / Download
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <div className="py-16 text-center border border-dashed border-white/5">
                                                            <p className="text-white/20 text-xs">No documents found matching filters.</p>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
