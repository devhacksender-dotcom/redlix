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
    AlertTriangle,
    Video,
    Download,
    FileText,
    Link as LinkIcon
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
    const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "attendance" | "settings" | "meetings" | "documents" | "payrolls">("overview");

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

    // Meeting states (read-only for employee)
    interface EmployeeMeetingAttendee {
        id: number;
        employeeId: number;
        employee: { id: number; name: string; role: string };
    }
    interface EmployeeMeeting {
        id: number;
        title: string;
        description?: string;
        meetingLead: string;
        meetingLink?: string;
        scheduledAt: string;
        attendees: EmployeeMeetingAttendee[];
        createdAt: string;
    }
    const [employeeMeetings, setEmployeeMeetings] = useState<EmployeeMeeting[]>([]);
    const [selectedEmpMeeting, setSelectedEmpMeeting] = useState<EmployeeMeeting | null>(null);
    const [meetingsLoading, setMeetingsLoading] = useState(false);

    // Document states (read-only for employee)
    interface EmployeeDocument {
        id: number;
        title: string;
        description?: string;
        category: string;
        fileUrl: string;
        fileName: string;
        uploadedBy: string;
        createdAt: string;
    }
    const [employeeDocuments, setEmployeeDocuments] = useState<EmployeeDocument[]>([]);
    const [documentsLoading, setDocumentsLoading] = useState(false);

    // Payroll states
    interface EmployeePayroll {
        id: number;
        month: string;
        amount: number;
        status: string;
        upiId?: string;
        paidAt?: string;
        createdAt: string;
    }
    const [employeePayrolls, setEmployeePayrolls] = useState<EmployeePayroll[]>([]);
    const [payrollsLoading, setPayrollsLoading] = useState(false);

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
        
        const getISTTimeParts = (date: Date) => {
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: 'Asia/Kolkata',
                hour: 'numeric',
                minute: 'numeric',
                hour12: false
            });
            const parts = formatter.formatToParts(date);
            const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10);
            const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10);
            return { hour, minute };
        };

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
            const dateStrKey = curr.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
            const dateObj = new Date(curr);
            
            const logsForDay = history.filter(h => {
                const d = new Date(h.punchIn);
                return d.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }) === dateStrKey;
            }).sort((a, b) => new Date(a.punchIn).getTime() - new Date(b.punchIn).getTime());
            
            if (logsForDay.length > 0) {
                const firstLog = logsForDay[0];
                const lastLog = logsForDay[logsForDay.length - 1];
                
                const pIn = new Date(firstLog.punchIn);
                const pOut = lastLog.punchOut ? new Date(lastLog.punchOut) : null;
                
                const istTime = getISTTimeParts(pIn);
                const isLate = istTime.hour > 10 || (istTime.hour === 10 && istTime.minute > 0);
                
                const punchInTimeStr = pIn.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
                const punchOutTimeStr = pOut 
                    ? pOut.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) 
                    : (lastLog.punchOut === null ? "Active" : "-");
                
                const dayWorkMinutes = logsForDay.reduce((sum, r) => sum + r.workMinutes, 0);
                
                report.push({
                    dateStr: dateStrKey,
                    punchIn: punchInTimeStr,
                    punchOut: punchOutTimeStr,
                    status: isLate ? "Absent" : "Present",
                    statusReason: isLate ? "Late Check-in (after 10:00 AM IST)" : "Present on time",
                    workMinutes: dayWorkMinutes,
                    isActive: lastLog.punchOut === null,
                    rawDate: dateObj
                });
            } else {
                const todayISTStr = today.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
                const isToday = dateStrKey === todayISTStr;
                const todayISTTime = getISTTimeParts(today);
                const isBefore10AM = todayISTTime.hour < 10;
                
                let status: "Present" | "Absent" | "Pending" = "Absent";
                let statusReason = "No Check-in recorded";
                
                if (isToday) {
                    if (isBefore10AM) {
                        status = "Pending";
                        statusReason = "Pending Check-in (cutoff 10:00 AM IST)";
                    } else {
                        status = "Absent";
                        statusReason = "Missed 10:00 AM IST cutoff";
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

    const getAttendanceStats = (report: ReturnType<typeof getDailyAttendanceList>) => {
        const totalDays = report.length;
        const presentDays = report.filter(r => r.status === "Present").length;
        const absentDays = report.filter(r => r.status === "Absent").length;
        const pendingDays = report.filter(r => r.status === "Pending").length;
        
        const totalMinutes = report.reduce((sum, r) => sum + r.workMinutes, 0);
        const totalHours = (totalMinutes / 60).toFixed(1);
        
        const avgMinutes = presentDays > 0 ? (totalMinutes / presentDays) : 0;
        const avgHours = (avgMinutes / 60).toFixed(1);
        
        return {
            totalDays,
            presentDays,
            absentDays,
            pendingDays,
            totalHours,
            avgHours
        };
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
        } else if (activeTab === "tasks") {
            fetchEmployeeTasks();
        } else if (activeTab === "attendance") {
            fetchAttendanceInfo();
        } else if (activeTab === "meetings") {
            fetchEmployeeMeetings();
        } else if (activeTab === "documents") {
            fetchEmployeeDocuments();
        } else if (activeTab === "payrolls") {
            fetchEmployeePayrolls();
        }
    }, [activeTab, employeeInfo]);

    const fetchEmployeeMeetings = async () => {
        setMeetingsLoading(true);
        try {
            const res = await fetch("/api/employee/meetings");
            const data = await res.json();
            if (data.success) setEmployeeMeetings(data.data);
        } catch (error) {
            console.error("Failed to fetch meetings:", error);
        } finally {
            setMeetingsLoading(false);
        }
    };

    const fetchEmployeeDocuments = async () => {
        setDocumentsLoading(true);
        try {
            const res = await fetch("/api/employee/documents");
            const data = await res.json();
            if (data.success) setEmployeeDocuments(data.data);
        } catch (error) {
            console.error("Failed to fetch documents:", error);
        } finally {
            setDocumentsLoading(false);
        }
    };

    const fetchEmployeePayrolls = async () => {
        setPayrollsLoading(true);
        try {
            const res = await fetch("/api/employee/payrolls");
            const data = await res.json();
            if (data.success) setEmployeePayrolls(data.data);
        } catch (error) {
            console.error("Failed to fetch payrolls:", error);
        } finally {
            setPayrollsLoading(false);
        }
    };

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
                fetchInternTickets(),
                fetchEmployeeMeetings(),
                fetchEmployeeDocuments()
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

                <nav className="flex-grow space-y-1 px-3 pt-4 overflow-y-auto min-h-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                        onClick={() => setActiveTab("attendance")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'attendance' ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <Clock className="w-4 h-4" />
                        Attendance
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("meetings")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'meetings' ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <Video className="w-4 h-4" />
                        Meetings
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("documents")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'documents' ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <FileText className="w-4 h-4" />
                        Documents
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("payrolls")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'payrolls' ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <CreditCard className="w-4 h-4" />
                        Payrolls
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("settings")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'settings' ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <User className="w-4 h-4" />
                        Profile & Settings
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
                    <div className="flex items-center gap-2 text-[12px] font-medium text-white">
                        <span className="opacity-60 uppercase tracking-wider text-[11px]">Portal</span>
                        <span className="opacity-40">/</span>
                        <span className="font-bold uppercase tracking-wider">
                            {activeTab === "overview" ? "Overview" :
                                activeTab === "tasks" ? "Assigned Tasks" :
                                    activeTab === "attendance" ? "Attendance" :
                                        activeTab === "meetings" ? "Meetings" :
                                            activeTab === "documents" ? "Documents" :
                                                activeTab === "payrolls" ? "Payrolls" : "Settings"}
                        </span>
                        <span className="text-white/50 text-[10px] hidden sm:inline ml-3 border-l border-white/20 pl-3">
                            — {activeTab === "overview" ? "your stats and activity" :
                                activeTab === "tasks" ? "view and update task progress" :
                                    activeTab === "attendance" ? "punch in/out to log work hours" :
                                        activeTab === "meetings" ? "meetings you are invited to" :
                                            activeTab === "documents" ? "company and client resource files" :
                                                activeTab === "payrolls" ? "monthly payments and history" : "update personal, payroll and address info"}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
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
                                    <StatCard
                                        icon={<Video className="w-5 h-5" />}
                                        label="Meetings"
                                        value={employeeMeetings.length}
                                        sublabel={`${employeeMeetings.filter(m => new Date(m.scheduledAt) > new Date()).length} upcoming`}
                                        color="text-pink-500"
                                    />
                                    <StatCard
                                        icon={<FileText className="w-5 h-5" />}
                                        label="Documents"
                                        value={employeeDocuments.length}
                                        sublabel="Shared resources"
                                        color="text-purple-500"
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
                            <div className="space-y-6 h-full flex flex-col overflow-y-auto pr-2 pb-6">
                                {/* Attendance Statistics */}
                                {(() => {
                                    const stats = getAttendanceStats(getDailyAttendanceList(attendanceHistory, employeeInfo?.joinedAt));
                                    return (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 shrink-0">
                                            <div className="bg-white/[0.02] border border-white/5 p-4 space-y-1.5 hover:border-white/10 transition-colors">
                                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Present Days</p>
                                                <h4 className="text-xl font-bold text-green-400">{stats.presentDays}</h4>
                                                <p className="text-[9px] text-white/20">Checked in on-time</p>
                                            </div>
                                            <div className="bg-white/[0.02] border border-white/5 p-4 space-y-1.5 hover:border-white/10 transition-colors">
                                                <p className="text-[10px] font-bold text-[#E61E32] uppercase tracking-widest font-black">Absent Days</p>
                                                <h4 className="text-xl font-bold text-[#E61E32]">{stats.absentDays}</h4>
                                                <p className="text-[9px] text-white/20">Missed / Late check-ins</p>
                                            </div>
                                            <div className="bg-white/[0.02] border border-white/5 p-4 space-y-1.5 hover:border-white/10 transition-colors">
                                                <p className="text-[10px] font-bold text-yellow-500/80 uppercase tracking-widest">Pending Today</p>
                                                <h4 className="text-xl font-bold text-yellow-500">{stats.pendingDays}</h4>
                                                <p className="text-[9px] text-white/20">Before 10:00 AM today</p>
                                            </div>
                                            <div className="bg-white/[0.02] border border-white/5 p-4 space-y-1.5 hover:border-white/10 transition-colors">
                                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Total Work Time</p>
                                                <h4 className="text-xl font-bold text-white/90">{stats.totalHours} hrs</h4>
                                                <p className="text-[9px] text-white/20">Accrued this period</p>
                                            </div>
                                            <div className="bg-white/[0.02] border border-white/5 p-4 space-y-1.5 hover:border-white/10 transition-colors">
                                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Avg Hours / Day</p>
                                                <h4 className="text-xl font-bold text-white/95">{stats.avgHours} hrs</h4>
                                                <p className="text-[9px] text-white/20">Per present day</p>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Main Attendance Content */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow min-h-[400px]">
                                    {/* Punch Actions Card */}
                                    <div className="bg-white/5 border border-white/5 p-8 flex flex-col items-center justify-center text-center space-y-8 min-h-[350px]">
                                        <div className="space-y-2">
                                            <div className="text-4xl font-mono font-bold tracking-widest text-white/90">
                                                {currentTime.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </div>
                                            <div className="text-xs text-white/30 uppercase tracking-widest">
                                                {currentTime.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </div>
                                        </div>

                                        <div className="space-y-4 w-full max-w-sm">
                                            <div className="p-4 bg-white/[0.02] border border-white/5">
                                                <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Current Status</p>
                                                <p className="text-sm font-semibold mt-1">
                                                    {activeAttendanceSession ? (
                                                        <span className="text-[#E61E32] flex items-center justify-center gap-1.5">
                                                            <span className="w-2 h-2 rounded-full bg-[#E61E32] animate-pulse" />
                                                            Active session started at {new Date(activeAttendanceSession.punchIn).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })}
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

                        {/* ===== MEETINGS TAB ===== */}
                        {activeTab === "meetings" && (
                            <div className="h-full flex gap-6 animate-in fade-in duration-500 overflow-hidden">
                                {/* Left: meetings list */}
                                <div className="w-[380px] shrink-0 flex flex-col gap-3 overflow-y-auto pr-1">
                                    {meetingsLoading ? (
                                        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-white/20" /></div>
                                    ) : employeeMeetings.length === 0 ? (
                                        <div className="text-center py-16 space-y-2">
                                            <Video className="w-10 h-10 text-white/10 mx-auto" />
                                            <p className="text-white/20 text-sm">No meetings scheduled for you yet.</p>
                                        </div>
                                    ) : (
                                        employeeMeetings.map(meeting => (
                                            <div
                                                key={meeting.id}
                                                onClick={() => setSelectedEmpMeeting(meeting)}
                                                className={`p-4 border cursor-pointer transition-all space-y-2 ${
                                                    selectedEmpMeeting?.id === meeting.id
                                                        ? 'border-[#E61E32]/40 bg-[#E61E32]/5'
                                                        : 'border-white/5 bg-white/[0.02] hover:border-white/15'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <p className="text-sm font-semibold text-white">{meeting.title}</p>
                                                        <p className="text-[10px] text-white/40 mt-0.5">Lead: {meeting.meetingLead}</p>
                                                    </div>
                                                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 ${
                                                        new Date(meeting.scheduledAt) > new Date()
                                                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                            : 'bg-white/5 text-white/30 border border-white/10'
                                                    }`}>
                                                        {new Date(meeting.scheduledAt) > new Date() ? 'Upcoming' : 'Done'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-[10px] text-white/30">
                                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(meeting.scheduledAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })}</span>
                                                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{meeting.attendees.length}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Right: detail panel */}
                                {selectedEmpMeeting ? (
                                    <div className="flex-1 bg-white/[0.02] border border-white/5 p-6 overflow-y-auto space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-white">{selectedEmpMeeting.title}</h3>
                                            {selectedEmpMeeting.description && <p className="text-sm text-white/40 mt-1">{selectedEmpMeeting.description}</p>}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/[0.03] border border-white/5 p-4 space-y-1">
                                                <p className="text-[10px] text-white/30 uppercase tracking-wider">Meeting Lead</p>
                                                <p className="text-sm font-semibold text-white">{selectedEmpMeeting.meetingLead}</p>
                                            </div>
                                            <div className="bg-white/[0.03] border border-white/5 p-4 space-y-1">
                                                <p className="text-[10px] text-white/30 uppercase tracking-wider">Date & Time</p>
                                                <p className="text-sm font-semibold text-white">{new Date(selectedEmpMeeting.scheduledAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' })}</p>
                                            </div>
                                        </div>

                                        {selectedEmpMeeting.meetingLink && (
                                            <div className="bg-white/[0.03] border border-white/5 p-4">
                                                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Join Meeting</p>
                                                <a href={selectedEmpMeeting.meetingLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#E61E32] text-sm hover:underline">
                                                    <LinkIcon className="w-4 h-4" />{selectedEmpMeeting.meetingLink}
                                                </a>
                                            </div>
                                        )}

                                        <div>
                                            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-3">All Attendees ({selectedEmpMeeting.attendees.length})</p>
                                            <div className="space-y-2">
                                                {selectedEmpMeeting.attendees.map(att => (
                                                    <div key={att.id} className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/5">
                                                        <div className="w-7 h-7 rounded-full bg-[#E61E32]/10 border border-[#E61E32]/20 flex items-center justify-center">
                                                            <User className="w-3.5 h-3.5 text-[#E61E32]" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-white">{att.employee.name}</p>
                                                            <p className="text-[10px] text-white/30">{att.employee.role}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center text-white/15 text-sm">
                                        Select a meeting to view details
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ===== DOCUMENTS TAB ===== */}
                        {activeTab === "documents" && (
                            <div className="h-full flex flex-col gap-4 animate-in fade-in duration-500 overflow-y-auto">
                                {documentsLoading ? (
                                    <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-white/20" /></div>
                                ) : employeeDocuments.length === 0 ? (
                                    <div className="text-center py-16 space-y-2">
                                        <FileText className="w-10 h-10 text-white/10 mx-auto" />
                                        <p className="text-white/20 text-sm">No documents have been uploaded yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                        {employeeDocuments.map(doc => {
                                            const categoryColors: Record<string, string> = {
                                                company: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
                                                client: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
                                                requirement: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
                                                legal: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
                                                other: 'text-white/40 bg-white/5 border-white/10'
                                            };
                                            return (
                                                <div key={doc.id} className="bg-white/[0.02] border border-white/5 hover:border-white/15 p-5 space-y-3 transition-colors">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-5 h-5 text-[#E61E32] shrink-0" />
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-semibold text-white truncate">{doc.title}</p>
                                                            <p className="text-[10px] text-white/30 truncate">{doc.fileName}</p>
                                                        </div>
                                                    </div>
                                                    {doc.description && <p className="text-xs text-white/40 line-clamp-2">{doc.description}</p>}
                                                    <div className="flex items-center justify-between">
                                                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border ${categoryColors[doc.category] || categoryColors.other}`}>
                                                            {doc.category}
                                                        </span>
                                                        <span className="text-[10px] text-white/20">{new Date(doc.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 w-full py-2 bg-white/5 hover:bg-[#E61E32]/10 border border-white/10 hover:border-[#E61E32]/20 text-white/60 hover:text-[#E61E32] text-xs font-medium transition-all justify-center">
                                                        <Download className="w-3.5 h-3.5" /> View / Download
                                                    </a>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ===== PAYROLLS TAB ===== */}
                        {activeTab === "payrolls" && (
                            <div className="space-y-6 h-full flex flex-col overflow-y-auto pr-2 pb-6 animate-in fade-in duration-500">
                                {/* Payroll Overview Cards */}
                                {(() => {
                                    const totalPaid = employeePayrolls
                                        .filter(p => p.status === "paid")
                                        .reduce((sum, p) => sum + p.amount, 0);
                                    const totalPending = employeePayrolls
                                        .filter(p => p.status === "pending")
                                        .reduce((sum, p) => sum + p.amount, 0);

                                    return (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
                                            <div className="bg-white/[0.02] border border-white/5 p-5 space-y-2 hover:border-white/10 transition-colors">
                                                <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Total Paid</p>
                                                <h4 className="text-2xl font-bold text-white">₹{totalPaid.toLocaleString('en-IN')}</h4>
                                                <p className="text-[10px] text-white/30">Transferred to your linked UPI ID</p>
                                            </div>
                                            <div className="bg-white/[0.02] border border-white/5 p-5 space-y-2 hover:border-white/10 transition-colors">
                                                <p className="text-[10px] font-bold text-[#E61E32] uppercase tracking-widest font-black">Total Pending</p>
                                                <h4 className="text-2xl font-bold text-white">₹{totalPending.toLocaleString('en-IN')}</h4>
                                                <p className="text-[10px] text-white/30">Awaiting bank/admin processing</p>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Payroll History Table */}
                                <div className="bg-white/5 border border-white/5 p-6 flex flex-col overflow-hidden h-full">
                                    <div className="mb-4 shrink-0">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-white/40">Monthly Payrolls & Payouts</h3>
                                    </div>

                                    <div className="overflow-y-auto pr-1 flex-grow scrollbar-thin">
                                        {payrollsLoading ? (
                                            <p className="text-white/20 text-center py-10 animate-pulse">Loading payroll records...</p>
                                        ) : employeePayrolls.length > 0 ? (
                                            <table className="w-full text-left text-xs">
                                                <thead>
                                                    <tr className="border-b border-white/10 text-white/30 uppercase tracking-wider text-[9px] font-bold">
                                                        <th className="py-3">Payout Month</th>
                                                        <th className="py-3">Amount</th>
                                                        <th className="py-3">UPI Address</th>
                                                        <th className="py-3">Status</th>
                                                        <th className="py-3 text-right">Transfer Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {employeePayrolls.map((payroll) => (
                                                        <tr key={payroll.id} className="border-b border-white/5 text-white/70 hover:bg-white/[0.01]">
                                                            <td className="py-3 font-semibold text-white">{payroll.month}</td>
                                                            <td className="py-3 text-white/90 font-semibold">₹{payroll.amount.toLocaleString('en-IN')}</td>
                                                            <td className="py-3 font-mono text-[11px] text-white/40">{payroll.upiId || employeeInfo?.upiId || "No UPI ID set"}</td>
                                                            <td className="py-3">
                                                                <span className={`px-2 py-0.5 text-[8px] uppercase tracking-widest font-black border ${
                                                                    payroll.status === 'paid'
                                                                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                                        : 'bg-[#E61E32]/10 text-[#E61E32] border-[#E61E32]/20'
                                                                }`}>
                                                                    {payroll.status}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 text-right text-white/40">
                                                                {payroll.paidAt
                                                                    ? new Date(payroll.paidAt).toLocaleString('en-IN', {
                                                                          timeZone: 'Asia/Kolkata',
                                                                          dateStyle: 'medium',
                                                                          timeStyle: 'short'
                                                                      })
                                                                    : "-"}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div className="py-20 text-center border border-dashed border-white/5">
                                                <p className="text-white/20 text-sm">No payroll records allocated yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
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
