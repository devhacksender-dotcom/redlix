"use client";

import React, { useState, useEffect } from "react";
import {
    Search,
    Mail,
    Phone,
    User,
    Building,
    Calendar,
    CheckCircle2,
    Inbox,
    LogOut,
    Users,
    Send,
    Loader2,
    MessageSquare,
    Briefcase,
    Globe,
    Clock,
    CreditCard,
    ChevronDown,
    ListTodo,
    Hand,
    AlertTriangle
} from "lucide-react";
import { useRouter } from "next/navigation";
import Script from "next/script";

interface Inquiry {
    id: number;
    name: string;
    email: string;
    isRead: boolean;
}

interface SupportTicket {
    id: number;
    status: string;
}

interface Client {
    id: number;
    meetingTime?: string;
    companyName: string;
    meetingTemplate?: string;
}

interface InternSupport {
    id: number;
    name: string;
    batchNumber: string;
    college: string;
    email: string;
    problemPage: string;
    description: string;
    status: string;
    createdAt: string;
}

export default function EmployeePortal() {
    const router = useRouter();
    const [employeeInfo, setEmployeeInfo] = useState<{
        id: number;
        name: string;
        email: string;
        role: string;
        phone?: string;
        upiId?: string;
        fatherName?: string;
        mobile?: string;
        altEmail?: string;
        address?: string;
        joinedAt?: string;
    } | null>(null);
    const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "intern-support" | "attendance" | "settings">("overview");

    // Task states
    interface EmployeeTask {
        id: number;
        title: string;
        description?: string;
        status: string;
        deadline?: string;
        createdAt: string;
    }
    const [employeeTasks, setEmployeeTasks] = useState<EmployeeTask[]>([]);
    const [selectedEmployeeTask, setSelectedEmployeeTask] = useState<EmployeeTask | null>(null);
    const [tasksLoading, setTasksLoading] = useState(false);

    // Attendance states
    interface AttendanceRecord {
        id: number;
        punchIn: string;
        punchOut?: string;
        workMinutes: number;
    }
    const [activeAttendanceSession, setActiveAttendanceSession] = useState<AttendanceRecord | null>(null);
    const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
    const [attendanceLoading, setAttendanceLoading] = useState(false);
    const [isPunching, setIsPunching] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Helper to generate daily attendance logs (e.g. past 30 days) and check 10:00 AM check-in constraint
    const getDailyAttendanceList = (history: AttendanceRecord[], joinedAtStr?: string) => {
        const report: {
            dateStr: string;
            punchIn: string;
            punchOut: string;
            status: "Present" | "Absent" | "Pending";
            statusReason: string;
            workMinutes: number;
            isActive: boolean;
            rawDate: Date;
        }[] = [];
        
        const today = new Date();
        const start = joinedAtStr ? new Date(joinedAtStr) : new Date();
        if (!joinedAtStr) {
            start.setDate(today.getDate() - 30);
        } else {
            const limitDate = new Date();
            limitDate.setDate(today.getDate() - 30);
            if (start.getTime() < limitDate.getTime()) {
                start.setTime(limitDate.getTime());
            }
        }
        
        const curr = new Date(start);
        curr.setHours(0, 0, 0, 0);
        
        const end = new Date(today);
        end.setHours(23, 59, 59, 999);
        
        while (curr.getTime() <= end.getTime()) {
            const dateStrKey = curr.toLocaleDateString();
            const dateObj = new Date(curr);
            
            const logsForDay = history.filter(h => {
                const d = new Date(h.punchIn);
                return d.toLocaleDateString() === dateStrKey;
            }).sort((a, b) => new Date(a.punchIn).getTime() - new Date(b.punchIn).getTime());
            
            if (logsForDay.length > 0) {
                const firstLog = logsForDay[0];
                const lastLog = logsForDay[logsForDay.length - 1];
                
                const pIn = new Date(firstLog.punchIn);
                const pOut = lastLog.punchOut ? new Date(lastLog.punchOut) : null;
                
                const hour = pIn.getHours();
                const minute = pIn.getMinutes();
                const isLate = hour > 10 || (hour === 10 && minute > 0);
                
                const punchInTimeStr = pIn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const punchOutTimeStr = pOut 
                    ? pOut.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                    : (lastLog.punchOut === null ? "Active" : "-");
                
                const dayWorkMinutes = logsForDay.reduce((sum, r) => sum + r.workMinutes, 0);
                
                report.push({
                    dateStr: dateStrKey,
                    punchIn: punchInTimeStr,
                    punchOut: punchOutTimeStr,
                    status: isLate ? "Absent" : "Present",
                    statusReason: isLate ? "Late Check-in (after 10:00 AM)" : "Present on time",
                    workMinutes: dayWorkMinutes,
                    isActive: lastLog.punchOut === null,
                    rawDate: dateObj
                });
            } else {
                const isToday = dateObj.toLocaleDateString() === today.toLocaleDateString();
                const isBefore10AM = today.getHours() < 10;
                
                let status: "Present" | "Absent" | "Pending" = "Absent";
                let statusReason = "No Check-in recorded";
                
                if (isToday) {
                    if (isBefore10AM) {
                        status = "Pending";
                        statusReason = "Pending Check-in (cutoff 10:00 AM)";
                    } else {
                        status = "Absent";
                        statusReason = "Missed 10:00 AM cutoff";
                    }
                }
                
                report.push({
                    dateStr: dateStrKey,
                    punchIn: "-",
                    punchOut: "-",
                    status,
                    statusReason,
                    workMinutes: 0,
                    isActive: false,
                    rawDate: dateObj
                });
            }
            
            curr.setDate(curr.getDate() + 1);
        }
        
        return report.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
    };

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Stats states
    const [internTickets, setInternTickets] = useState<InternSupport[]>([]);
    
    // Intern tickets states
    const [loading, setLoading] = useState(true);
    const [selectedInternTicket, setSelectedInternTicket] = useState<InternSupport | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Settings states
    const [settingsName, setSettingsName] = useState("");
    const [settingsEmail, setSettingsEmail] = useState("");
    const [settingsPhone, setSettingsPhone] = useState("");
    const [settingsUpiId, setSettingsUpiId] = useState("");
    const [settingsFatherName, setSettingsFatherName] = useState("");
    const [settingsMobile, setSettingsMobile] = useState("");
    const [settingsAltEmail, setSettingsAltEmail] = useState("");
    const [settingsAddress, setSettingsAddress] = useState("");
    const [isSavingSettings, setIsSavingSettings] = useState(false);
    const [settingsSuccess, setSettingsSuccess] = useState("");
    const [settingsError, setSettingsError] = useState("");

    // Load logged in employee info
    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await fetch("/api/employee/me");
                const data = await res.json();
                if (data.success) {
                    setEmployeeInfo(data.data);
                    setSettingsName(data.data.name || "");
                    setSettingsEmail(data.data.email || "");
                    setSettingsPhone(data.data.phone || "");
                    setSettingsUpiId(data.data.upiId || "");
                    setSettingsFatherName(data.data.fatherName || "");
                    setSettingsMobile(data.data.mobile || "");
                    setSettingsAltEmail(data.data.altEmail || "");
                    setSettingsAddress(data.data.address || "");
                } else {
                    router.push("/employee/login");
                }
            } catch (error) {
                console.error("Failed to load employee info:", error);
                router.push("/employee/login");
            }
        };
        fetchMe();
    }, [router]);

    useEffect(() => {
        if (!employeeInfo) return;

        if (activeTab === "overview") {
            fetchAllOverviewData();
        } else if (activeTab === "intern-support") {
            fetchInternTickets();
        } else if (activeTab === "tasks") {
            fetchEmployeeTasks();
        } else if (activeTab === "attendance") {
            fetchAttendanceInfo();
        }
    }, [activeTab, employeeInfo]);

    const fetchEmployeeTasks = async () => {
        setTasksLoading(true);
        try {
            const res = await fetch("/api/employee/tasks");
            const data = await res.json();
            if (data.success) {
                setEmployeeTasks(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch employee tasks:", error);
        } finally {
            setTasksLoading(false);
        }
    };

    const handleUpdateEmployeeTaskStatus = async (id: number, status: string) => {
        try {
            const res = await fetch(`/api/employee/tasks/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (data.success) {
                setEmployeeTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
                if (selectedEmployeeTask?.id === id) {
                    setSelectedEmployeeTask(prev => prev ? { ...prev, status } : null);
                }
            } else {
                alert(data.message || "Failed to update task status");
            }
        } catch (error) {
            console.error("Failed to update task status:", error);
        }
    };

    const fetchAttendanceInfo = async () => {
        setAttendanceLoading(true);
        try {
            const res = await fetch("/api/employee/attendance");
            const data = await res.json();
            if (data.success) {
                setActiveAttendanceSession(data.activeSession || null);
                setAttendanceHistory(data.history || []);
            }
        } catch (error) {
            console.error("Failed to fetch attendance:", error);
        } finally {
            setAttendanceLoading(false);
        }
    };

    const handlePunchIn = async () => {
        setIsPunching(true);
        try {
            const res = await fetch("/api/employee/attendance/punch-in", { method: "POST" });
            const data = await res.json();
            if (data.success) {
                setActiveAttendanceSession(data.data);
                setAttendanceHistory(prev => [data.data, ...prev]);
            } else {
                alert(data.message || "Failed to punch in");
            }
        } catch (error) {
            console.error("Punch-in connection error:", error);
        } finally {
            setIsPunching(false);
        }
    };

    const handlePunchOut = async () => {
        setIsPunching(true);
        try {
            const res = await fetch("/api/employee/attendance/punch-out", { method: "POST" });
            const data = await res.json();
            if (data.success) {
                setActiveAttendanceSession(null);
                setAttendanceHistory(prev => prev.map(record => record.id === data.data.id ? data.data : record));
            } else {
                alert(data.message || "Failed to punch out");
            }
        } catch (error) {
            console.error("Punch-out connection error:", error);
        } finally {
            setIsPunching(false);
        }
    };

    const fetchAllOverviewData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchEmployeeTasks(),
                fetchAttendanceInfo(),
                fetchInternTickets()
            ]);
        } catch (error) {
            console.error("Failed to fetch overview data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchInternTickets = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/intern-support");
            if (res.status === 401) return router.push("/employee/login");
            const data = await res.json();
            if (data.success) {
                setInternTickets(data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateInternTicketStatus = async (id: number, status: string) => {
        try {
            const res = await fetch(`/api/admin/intern-support/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (data.success) {
                setInternTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
                if (selectedInternTicket?.id === id) {
                    setSelectedInternTicket(prev => prev ? { ...prev, status } : null);
                }
            } else {
                alert(data.message || "Failed to update ticket status");
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingSettings(true);
        setSettingsSuccess("");
        setSettingsError("");

        try {
            const res = await fetch("/api/employee/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: settingsName,
                    email: settingsEmail,
                    phone: settingsPhone,
                    upiId: settingsUpiId,
                    fatherName: settingsFatherName,
                    mobile: settingsMobile,
                    altEmail: settingsAltEmail,
                    address: settingsAddress,
                })
            });

            const data = await res.json();

            if (data.success) {
                setSettingsSuccess(data.message || "Profile settings saved successfully");
                setEmployeeInfo(prev => prev ? { ...prev, ...data.data } : null);
            } else {
                setSettingsError(data.message || "Failed to save settings");
            }
        } catch (error) {
            setSettingsError("Connection error. Please try again.");
            console.error("Save settings error:", error);
        } finally {
            setIsSavingSettings(false);
        }
    };

    const handleLogout = async () => {
        await fetch("/api/employee/logout", { method: "POST" });
        router.push("/employee/login");
    };

    // Hand raise state
    const [isRaisingHand, setIsRaisingHand] = useState(false);
    const [handRaiseSuccess, setHandRaiseSuccess] = useState(false);

    const handleRaiseHand = async () => {
        if (isRaisingHand || handRaiseSuccess) return;
        setIsRaisingHand(true);
        try {
            const res = await fetch("/api/employee/raise-hand", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ employeeName: employeeInfo?.name, employeeEmail: employeeInfo?.email })
            });
            const data = await res.json();
            if (data.success) {
                setHandRaiseSuccess(true);
                setTimeout(() => setHandRaiseSuccess(false), 5000);
            } else {
                alert(data.message || "Failed to notify admin");
            }
        } catch (error) {
            console.error("Hand raise error:", error);
            alert("Connection error. Please try again.");
        } finally {
            setIsRaisingHand(false);
        }
    };

    const filteredInternTickets = internTickets.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.problemPage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.batchNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="h-screen bg-[#0a0a0a] text-white flex font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-[#0f0f0f] flex flex-col shrink-0 h-full">
                {/* Logo */}
                <div className="px-6 pt-6 pb-4">
                    <div className="flex items-center gap-2">
                        <img
                            src="https://ik.imagekit.io/dypkhqxip/logo.png"
                            alt="Redlix Logo"
                            className="h-[24px] w-auto brightness-0 invert opacity-95"
                        />
                        <span className="text-white text-[17px] font-bold tracking-tight select-none">
                            Redlix
                        </span>
                        <span className="bg-[#E61E32]/10 text-[#E61E32] text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-none border border-[#E61E32]/20">
                            Employee
                        </span>
                    </div>
                </div>

                {/* Separator between logo and nav */}
                <div className="h-[1px] bg-white/5 mx-0" />

                <nav className="flex-grow space-y-1 px-3 pt-4">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'overview' ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <Globe className="w-4 h-4" />
                        Overview
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("tasks")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'tasks' ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <ListTodo className="w-4 h-4" />
                        Tasks
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("intern-support")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'intern-support' ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <Users className="w-4 h-4" />
                        Intern Support
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("attendance")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'attendance' ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <Clock className="w-4 h-4" />
                        Attendance
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("settings")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'settings' ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <CreditCard className="w-4 h-4" />
                        Settings
                    </button>
                </nav>

                {/* Profile card at bottom */}
                <div className="px-4 pb-4 space-y-3">
                    <div className="h-[1px] bg-white/5" />
                    <div className="bg-white/[0.03] border border-white/8 p-3 space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#E61E32]/15 border border-[#E61E32]/25 flex items-center justify-center shrink-0">
                                <User className="w-4 h-4 text-[#E61E32]" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-[12px] font-bold text-white tracking-tight truncate" title={employeeInfo?.name}>
                                    {employeeInfo?.name || "Loading..."}
                                </div>
                                <div className="text-[9px] text-white/40 uppercase font-semibold tracking-wider truncate" title={employeeInfo?.role}>
                                    {employeeInfo?.role || "Team Member"}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-white/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span>Online</span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 bg-[#E61E32] hover:bg-[#E61E32]/90 text-white transition-all text-sm font-semibold shadow-lg shadow-[#E61E32]/10 rounded-none"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
                {/* Red Top Bar */}
                <div className="shrink-0 bg-[#E61E32] flex items-center justify-between px-6 py-3">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-4 h-4 text-white/80" />
                        <span className="text-white text-[13px] font-semibold tracking-wide">
                            {activeTab === "overview" ? "Dashboard Overview" :
                                activeTab === "tasks" ? "Assigned Tasks" :
                                    activeTab === "intern-support" ? "Intern Support System" :
                                        activeTab === "attendance" ? "Time Log & Attendance" : "Profile & Settings"}
                        </span>
                        <span className="text-white/50 text-[11px] hidden sm:inline">
                            — {activeTab === "overview" ? "your stats and activity" :
                                activeTab === "tasks" ? "view and update task progress" :
                                    activeTab === "intern-support" ? "manage intern technical issues" :
                                        activeTab === "attendance" ? "punch in/out to log work hours" : "update personal, payroll and address info"}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        {activeTab === "intern-support" && (
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                                <input
                                    type="text"
                                    placeholder="Search support..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-64 bg-white/20 border border-white/30 text-white placeholder-white/50 px-10 py-1.5 text-sm focus:outline-none focus:bg-white/30 rounded-none"
                                />
                            </div>
                        )}
                        {handRaiseSuccess ? (
                            <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 text-white text-[11px] font-bold uppercase tracking-wider">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Admin Notified!
                            </div>
                        ) : (
                            <button
                                onClick={handleRaiseHand}
                                disabled={isRaisingHand}
                                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 px-3 py-1.5 text-white text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-60"
                            >
                                {isRaisingHand ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Hand className="w-3.5 h-3.5" />
                                )}
                                Raise Hand
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="space-y-8 h-full flex flex-col">
                    {/* Conditional Rendering of Tabs */}
                    <div className="flex-grow overflow-hidden">
                        {activeTab === "overview" && (
                            <div className="h-full space-y-8 animate-in fade-in duration-500 overflow-y-auto pr-2">
                                {/* Welcome message */}
                                <div className="bg-white/[0.01] border border-white/5 p-6 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold">Welcome back, {employeeInfo?.name}!</h3>
                                        <p className="text-xs text-white/40 mt-1">Here is your daily task assignments and logged work hours.</p>
                                    </div>
                                    <div className="px-4 py-2 border border-[#E61E32]/25 bg-[#E61E32]/5 text-[#E61E32] text-xs font-bold uppercase tracking-wider">
                                        {employeeInfo?.role}
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                    <StatCard
                                        icon={<ListTodo className="w-5 h-5" />}
                                        label="Total Tasks"
                                        value={employeeTasks.length}
                                        sublabel={`${employeeTasks.filter(t => t.status === 'completed').length} completed`}
                                        color="text-blue-500"
                                    />
                                    <StatCard
                                        icon={<Clock className="w-5 h-5" />}
                                        label="Pending Tasks"
                                        value={employeeTasks.filter(t => t.status === 'pending').length}
                                        sublabel="Awaiting action"
                                        color="text-yellow-500"
                                    />
                                    <StatCard
                                        icon={<Loader2 className="w-5 h-5 animate-spin" />}
                                        label="In Progress"
                                        value={employeeTasks.filter(t => t.status === 'in_progress').length}
                                        sublabel="Currently working"
                                        color="text-orange-500"
                                    />
                                    <StatCard
                                        icon={<CheckCircle2 className="w-5 h-5" />}
                                        label="Completed"
                                        value={employeeTasks.filter(t => t.status === 'completed').length}
                                        sublabel="All closed tasks"
                                        color="text-green-500"
                                    />
                                    <StatCard
                                        icon={<Briefcase className="w-5 h-5" />}
                                        label="Hours Worked"
                                        value={Number((attendanceHistory.reduce((sum, r) => sum + r.workMinutes, 0) / 60).toFixed(1))}
                                        sublabel={`${attendanceHistory.length} clock logs`}
                                        color="text-[#E61E32]"
                                    />
                                </div>

                                {/* Main Overview Sections */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Recent Tasks */}
                                    <div className="bg-white/[0.02] border border-white/5 p-6 space-y-4">
                                        <h3 className="text-[11px] font-medium text-white/30 flex items-center gap-2">
                                            <ListTodo className="w-3.5 h-3.5" />
                                            Your Active Tasks
                                        </h3>
                                        <div className="space-y-4">
                                            {employeeTasks.filter(t => t.status !== 'completed').slice(0, 5).map(task => (
                                                <div key={task.id} className="flex justify-between items-center p-3 bg-white/5 border border-white/5">
                                                    <div>
                                                        <p className="text-sm font-semibold">{task.title}</p>
                                                        {task.deadline && (
                                                            <p className="text-[10px] text-white/30">Due {new Date(task.deadline).toLocaleDateString()}</p>
                                                        )}
                                                    </div>
                                                    <span className={`px-1.5 py-0.5 text-[8px] uppercase tracking-widest font-black ${task.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                        {task.status.replace("_", " ")}
                                                    </span>
                                                </div>
                                            ))}
                                            {employeeTasks.filter(t => t.status !== 'completed').length === 0 && (
                                                <p className="text-xs text-white/20 py-4 text-center">No active tasks.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Recent Attendance Logs */}
                                    <div className="bg-white/[0.02] border border-white/5 p-6 space-y-4">
                                        <h3 className="text-[11px] font-medium text-white/30 flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5" />
                                            Recent Attendance Logs (Cutoff: 10:00 AM)
                                        </h3>
                                        <div className="space-y-4">
                                            {getDailyAttendanceList(attendanceHistory, employeeInfo?.joinedAt).slice(0, 5).map(att => (
                                                <div key={att.dateStr} className="flex justify-between items-center p-3 bg-white/5 border border-white/5">
                                                    <div>
                                                        <p className="text-sm font-semibold">{att.dateStr}</p>
                                                        <p className="text-[10px] text-white/30">
                                                            Check In: {att.punchIn} | Check Out: {att.punchOut}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`px-1.5 py-0.5 text-[8px] uppercase tracking-widest font-black ${att.status === 'Present' ? 'bg-green-500/10 text-green-500' : att.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-[#E61E32]/10 text-[#E61E32]'}`}>
                                                            {att.status}
                                                        </span>
                                                        <p className="text-[9px] text-white/30 mt-0.5">{att.statusReason}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {attendanceHistory.length === 0 && (
                                                <p className="text-xs text-white/20 py-4 text-center">No attendance logs logged yet.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "tasks" && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                                {/* Tasks List */}
                                <div className="overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                                    {tasksLoading ? (
                                        <p className="text-white/20 text-center py-10 animate-pulse">Loading tasks...</p>
                                    ) : employeeTasks.length > 0 ? (
                                        employeeTasks.map((t) => (
                                            <div
                                                key={t.id}
                                                onClick={() => setSelectedEmployeeTask(t)}
                                                className={`p-5 border transition-all cursor-pointer ${selectedEmployeeTask?.id === t.id ? 'bg-white/5 border-white/20' : 'bg-transparent border-white/5 hover:border-white/10'}`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-white flex items-center gap-2">
                                                        {t.title}
                                                        <span className={`px-1.5 py-0.5 text-[8px] uppercase tracking-widest font-black ${t.status === 'completed' ? 'bg-green-500/10 text-green-500' : t.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                            {t.status.replace("_", " ")}
                                                        </span>
                                                    </h3>
                                                    {t.deadline && (
                                                        <span className="text-[9px] text-white/20 uppercase tracking-tighter">
                                                            Due {new Date(t.deadline).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-white/40 truncate">{t.description || "No description provided."}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-20 text-center border border-dashed border-white/5">
                                            <p className="text-white/20 text-sm">No tasks assigned to you.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Task Details & Progress Action Panel */}
                                <div className="bg-white/5 border border-white/5 p-8 overflow-y-auto">
                                    {selectedEmployeeTask ? (
                                        <div className="space-y-8 animate-in fade-in duration-300">
                                            <div className="space-y-4 pb-6 border-b border-white/5">
                                                <h3 className="text-xl font-bold">{selectedEmployeeTask.title}</h3>
                                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/30 font-medium">
                                                    <span className="flex items-center gap-1.5">
                                                        Status: 
                                                        <span className={`px-1.5 py-0.5 text-[8px] uppercase tracking-widest font-black ${selectedEmployeeTask.status === 'completed' ? 'bg-green-500/10 text-green-500' : selectedEmployeeTask.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                            {selectedEmployeeTask.status.replace("_", " ")}
                                                        </span>
                                                    </span>
                                                    {selectedEmployeeTask.deadline && (
                                                        <span>Due: {new Date(selectedEmployeeTask.deadline).toLocaleDateString()}</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">Task Description</h4>
                                                <p className="text-sm leading-relaxed text-white/70 whitespace-pre-wrap">
                                                    {selectedEmployeeTask.description || "No description provided."}
                                                </p>
                                            </div>

                                            <div className="space-y-3 pt-6 border-t border-white/5">
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">Update Task Status</h4>
                                                <div className="flex gap-3">
                                                    {(["pending", "in_progress", "completed"] as const).map((status) => (
                                                        <button
                                                            key={status}
                                                            onClick={() => handleUpdateEmployeeTaskStatus(selectedEmployeeTask.id, status)}
                                                            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest border transition-all cursor-pointer rounded-none ${selectedEmployeeTask.status === status
                                                                ? status === 'completed'
                                                                    ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                                                    : status === 'in_progress'
                                                                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                                                                        : 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                                                                : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                                                            }`}
                                                        >
                                                            {status.replace("_", " ")}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-center opacity-20">
                                            <p className="text-sm uppercase tracking-widest font-medium">Select a task to view details</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "attendance" && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                                {/* Punch Actions Card */}
                                <div className="bg-white/5 border border-white/5 p-8 flex flex-col items-center justify-center text-center space-y-8 min-h-[350px]">
                                    <div className="space-y-2">
                                        <div className="text-4xl font-mono font-bold tracking-widest text-white/90">
                                            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </div>
                                        <div className="text-xs text-white/30 uppercase tracking-widest">
                                            {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </div>
                                    </div>

                                    <div className="space-y-4 w-full max-w-sm">
                                        <div className="p-4 bg-white/[0.02] border border-white/5">
                                            <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Current Status</p>
                                            <p className="text-sm font-semibold mt-1">
                                                {activeAttendanceSession ? (
                                                    <span className="text-[#E61E32] flex items-center justify-center gap-1.5">
                                                        <span className="w-2 h-2 rounded-full bg-[#E61E32] animate-pulse" />
                                                        Active session started at {new Date(activeAttendanceSession.punchIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                ) : (
                                                    <span className="text-white/40">You are clocked out.</span>
                                                )}
                                            </p>
                                        </div>

                                        {activeAttendanceSession ? (
                                            <button
                                                disabled={isPunching}
                                                onClick={handlePunchOut}
                                                className="w-full bg-[#E61E32] hover:bg-[#ff1f34] text-white font-bold py-5 text-sm uppercase tracking-widest transition-all rounded-none cursor-pointer flex items-center justify-center gap-2"
                                            >
                                                {isPunching ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : "Punch Out"}
                                            </button>
                                        ) : (
                                            <button
                                                disabled={isPunching}
                                                onClick={handlePunchIn}
                                                className="w-full bg-white hover:bg-white/95 text-black font-bold py-5 text-sm uppercase tracking-widest transition-all rounded-none cursor-pointer flex items-center justify-center gap-2"
                                            >
                                                {isPunching ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : "Punch In"}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Attendance History Table */}
                                <div className="bg-white/5 border border-white/5 p-8 flex flex-col overflow-hidden h-full">
                                    <div className="mb-4 shrink-0 flex justify-between items-center">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-white/40">Your Daily Attendance Logs</h3>
                                        {/* Summary badges */}
                                        <div className="flex gap-2">
                                            <div className="px-2.5 py-1 bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold uppercase tracking-widest">
                                                Present: {getDailyAttendanceList(attendanceHistory, employeeInfo?.joinedAt).filter(d => d.status === "Present").length}
                                            </div>
                                            <div className="px-2.5 py-1 bg-[#E61E32]/10 border border-[#E61E32]/20 text-[#E61E32] text-[10px] font-bold uppercase tracking-widest">
                                                Absent: {getDailyAttendanceList(attendanceHistory, employeeInfo?.joinedAt).filter(d => d.status === "Absent").length}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-y-auto pr-1 flex-grow scrollbar-thin">
                                        {attendanceLoading ? (
                                            <p className="text-white/20 text-center py-10 animate-pulse">Loading logs...</p>
                                        ) : getDailyAttendanceList(attendanceHistory, employeeInfo?.joinedAt).length > 0 ? (
                                            <table className="w-full text-left text-xs">
                                                <thead>
                                                    <tr className="border-b border-white/10 text-white/30 uppercase tracking-wider text-[9px] font-bold">
                                                        <th className="py-2.5">Date</th>
                                                        <th className="py-2.5">Punch In</th>
                                                        <th className="py-2.5">Punch Out</th>
                                                        <th className="py-2.5">Status</th>
                                                        <th className="py-2.5 text-right">Work Time</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {getDailyAttendanceList(attendanceHistory, employeeInfo?.joinedAt).map((att) => {
                                                        const hours = Math.floor(att.workMinutes / 60);
                                                        const mins = att.workMinutes % 60;
                                                        const durationStr = att.punchIn !== "-" 
                                                            ? (att.isActive ? "Active" : `${hours > 0 ? `${hours}h ` : ''}${mins}m`)
                                                            : "-";

                                                        return (
                                                            <tr key={att.dateStr} className="border-b border-white/5 text-white/70 hover:bg-white/[0.01]">
                                                                <td className="py-2.5">{att.dateStr}</td>
                                                                <td className="py-2.5">{att.punchIn}</td>
                                                                <td className="py-2.5">{att.punchOut}</td>
                                                                <td className="py-2.5 flex items-center gap-2">
                                                                    <span className={`px-1.5 py-0.5 text-[8px] uppercase tracking-widest font-black ${att.status === 'Present' ? 'bg-green-500/10 text-green-500' : att.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-[#E61E32]/10 text-[#E61E32]'}`}>
                                                                        {att.status}
                                                                    </span>
                                                                    <span className="text-[9px] text-white/20 hidden md:inline">({att.statusReason})</span>
                                                                </td>
                                                                <td className={`py-2.5 text-right font-semibold ${att.isActive ? 'text-[#E61E32] animate-pulse' : 'text-white/50'}`}>{durationStr}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div className="py-20 text-center border border-dashed border-white/5">
                                                <p className="text-white/20 text-sm">No attendance records found.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "intern-support" && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                                {/* Ticket List */}
                                <div className="overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                                    {loading ? (
                                        <p className="text-white/20 text-center py-10">Loading tickets...</p>
                                    ) : filteredInternTickets.length > 0 ? (
                                        filteredInternTickets.map((t) => (
                                            <div
                                                key={t.id}
                                                onClick={() => setSelectedInternTicket(t)}
                                                className={`p-5 border transition-all cursor-pointer ${selectedInternTicket?.id === t.id ? 'bg-white/5 border-white/20' : 'bg-transparent border-white/5 hover:border-white/10'}`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-white flex items-center gap-2">
                                                        {t.problemPage}
                                                        <span className={`px-1.5 py-0.5 text-[8px] uppercase tracking-widest font-black ${t.status === 'pending' ? 'bg-[#E61E32]/10 text-[#E61E32]' : 'bg-green-500/10 text-green-500'}`}>
                                                            {t.status}
                                                        </span>
                                                    </h3>
                                                    <span className="text-[10px] text-white/20 uppercase tracking-tighter">
                                                        {new Date(t.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">{t.name} • {t.batchNumber}</p>
                                                <p className="text-xs text-white/40 truncate">{t.description}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-20 text-center border border-dashed border-white/5">
                                            <p className="text-white/20 text-sm">No intern support tickets found.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Ticket Details */}
                                <div className="bg-white/5 border border-white/5 p-8 overflow-y-auto">
                                    {selectedInternTicket ? (
                                        <div className="space-y-8 animate-in fade-in duration-300">
                                            <div className="space-y-4 pb-6 border-b border-white/5">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-xl font-bold">{selectedInternTicket.problemPage}</h3>
                                                    <div className="flex gap-2">
                                                        {selectedInternTicket.status === 'pending' && (
                                                            <button
                                                                onClick={() => handleUpdateInternTicketStatus(selectedInternTicket.id, 'resolved')}
                                                                className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest border border-green-500/20 hover:bg-green-500 hover:text-white transition-all cursor-pointer"
                                                            >
                                                                Mark Resolved
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/30 font-medium">
                                                    <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {selectedInternTicket.name}</span>
                                                    <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {selectedInternTicket.email}</span>
                                                    <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5" /> {selectedInternTicket.college}</span>
                                                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {selectedInternTicket.batchNumber}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">Problem Description</h4>
                                                <p className="text-sm leading-relaxed text-white/70 whitespace-pre-wrap">
                                                    {selectedInternTicket.description}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-center opacity-20">
                                            <p className="text-sm uppercase tracking-widest font-medium">Select a ticket to view details</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "settings" && (
                            <div className="bg-white/5 border border-white/5 p-8 overflow-y-auto h-full animate-in fade-in duration-300">
                                <h3 className="text-lg font-bold uppercase tracking-tight mb-6">Profile Settings</h3>
                                
                                <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Full Name</label>
                                            <input
                                                required
                                                type="text"
                                                value={settingsName}
                                                onChange={(e) => setSettingsName(e.target.value)}
                                                className="w-full bg-[#111111] border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E61E32] transition-colors rounded-none"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                value={settingsEmail}
                                                onChange={(e) => setSettingsEmail(e.target.value)}
                                                className="w-full bg-[#111111] border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E61E32] transition-colors rounded-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={settingsPhone}
                                                onChange={(e) => setSettingsPhone(e.target.value)}
                                                placeholder="+91 XXXXX XXXXX"
                                                className="w-full bg-[#111111] border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E61E32] transition-colors rounded-none"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">UPI ID (For Payrolls)</label>
                                            <input
                                                type="text"
                                                value={settingsUpiId}
                                                onChange={(e) => setSettingsUpiId(e.target.value)}
                                                placeholder="username@upi"
                                                className="w-full bg-[#111111] border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E61E32] transition-colors rounded-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Father's Name</label>
                                            <input
                                                type="text"
                                                value={settingsFatherName}
                                                onChange={(e) => setSettingsFatherName(e.target.value)}
                                                className="w-full bg-[#111111] border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E61E32] transition-colors rounded-none"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Emergency Mobile Number</label>
                                            <input
                                                type="tel"
                                                value={settingsMobile}
                                                onChange={(e) => setSettingsMobile(e.target.value)}
                                                placeholder="XXXXXXXXXX"
                                                className="w-full bg-[#111111] border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E61E32] transition-colors rounded-none"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Alternative Email</label>
                                            <input
                                                type="email"
                                                value={settingsAltEmail}
                                                onChange={(e) => setSettingsAltEmail(e.target.value)}
                                                placeholder="name@personal.com"
                                                className="w-full bg-[#111111] border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E61E32] transition-colors rounded-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Postal Address (For Goodies/Deliveries)</label>
                                        <textarea
                                            rows={3}
                                            value={settingsAddress}
                                            onChange={(e) => setSettingsAddress(e.target.value)}
                                            placeholder="House No, Street Name, Area, City, State, Pincode"
                                            className="w-full bg-[#111111] border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E61E32] transition-colors rounded-none resize-none"
                                        />
                                    </div>

                                    {settingsSuccess && (
                                        <div className="bg-green-500/10 border border-green-500/20 p-4 text-green-500 text-xs font-bold uppercase tracking-wider">
                                            {settingsSuccess}
                                        </div>
                                    )}
                                    {settingsError && (
                                        <div className="bg-[#E61E32]/10 border border-[#E61E32]/20 p-4 text-[#E61E32] text-xs font-bold uppercase tracking-wider">
                                            {settingsError}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSavingSettings}
                                        className="w-full md:w-auto px-8 py-3.5 bg-[#E61E32] hover:bg-[#ff1f34] text-white text-xs font-bold uppercase tracking-widest transition-all rounded-none cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        {isSavingSettings ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                                            </>
                                        ) : "Save Settings"}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
                </div>
            </div>

            {/* dotlottie player script */}
            <Script
                src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs"
                type="module"
                strategy="afterInteractive"
            />
        </main>
    );
}

function StatCard({ icon, label, value, sublabel, color }: { icon: React.ReactNode, label: string, value: number, sublabel: string, color: string }) {
    return (
        <div className="bg-white/[0.02] border border-white/5 p-4 space-y-3 hover:border-white/10 transition-colors group">
            <div className={`w-8 h-8 bg-white/5 flex items-center justify-center border border-white/10 ${color}`}>
                <div className="w-4 h-4 flex items-center justify-center">
                    {icon}
                </div>
            </div>
            <div>
                <p className="text-[11px] font-medium text-white/40">{label}</p>
                <h4 className="text-xl font-semibold mt-0.5">{value}</h4>
                <p className="text-[10px] text-white/20 mt-0.5">{sublabel}</p>
            </div>
        </div>
    );
}
