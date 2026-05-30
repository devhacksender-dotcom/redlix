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
    AlertCircle,
    Video,
    Download,
    FileText,
    Link as LinkIcon,
    Menu,
    Heart,
    BarChart3,
    ExternalLink,
    X,
    FolderUp,
    Upload,
    CheckCheck,
    Hourglass
} from "lucide-react";
import { useRouter } from "next/navigation";
import Script from "next/script";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "dotlottie-wc": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
                src?: string;
                autoplay?: boolean;
                loop?: boolean;
                style?: React.CSSProperties;
            }, HTMLElement>;
        }
    }
    namespace React {
        namespace JSX {
            interface IntrinsicElements {
                "dotlottie-wc": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
                    src?: string;
                    autoplay?: boolean;
                    loop?: boolean;
                    style?: React.CSSProperties;
                }, HTMLElement>;
            }
        }
    }
}

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
    const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "attendance" | "settings" | "meetings" | "documents" | "payrolls" | "leaves" | "community" | "declarations">("overview");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Community standup states
    interface CommunityUpdate {
        id: number;
        employeeId: number;
        tasksDone: string;
        learnt: string;
        gained: string;
        docLink?: string | null;
        createdAt: string;
        employee: {
            id: number;
            name: string;
            role: string;
            email: string;
        };
    }
    const [communityUpdates, setCommunityUpdates] = useState<CommunityUpdate[]>([]);
    const [communityLoading, setCommunityLoading] = useState(false);
    const [tasksDone, setTasksDone] = useState("");
    const [learnt, setLearnt] = useState("");
    const [gained, setGained] = useState("");
    const [docLink, setDocLink] = useState("");
    const [isStandupModalOpen, setIsStandupModalOpen] = useState(false);
    const [submittingCommunityUpdate, setSubmittingCommunityUpdate] = useState(false);
    const [likedUpdates, setLikedUpdates] = useState<Record<number, boolean>>({});
    const [showUpdatesPopup, setShowUpdatesPopup] = useState(false);

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

    // Leave requests states
    interface EmployeeLeave {
        id: number;
        startDate: string;
        endDate: string;
        type: string;
        reason: string;
        status: string;
        adminNotes?: string;
        createdAt: string;
    }
    const [employeeLeaves, setEmployeeLeaves] = useState<EmployeeLeave[]>([]);
    const [leavesLoading, setLeavesLoading] = useState(false);
    const [leaveStartDate, setLeaveStartDate] = useState("");
    const [leaveEndDate, setLeaveEndDate] = useState("");
    const [leaveType, setLeaveType] = useState("sick");
    const [leaveReason, setLeaveReason] = useState("");
    const [leaveIsSubmitting, setLeaveIsSubmitting] = useState(false);

    // Declarations states
    interface EmployeeDeclaration {
        id: number;
        fileName: string;
        fileType: string;
        fileSize: number;
        clientName?: string;
        notes?: string;
        status: string;
        createdAt: string;
    }
    const [declarations, setDeclarations] = useState<EmployeeDeclaration[]>([]);
    const [declarationsLoading, setDeclarationsLoading] = useState(false);
    const [declarationFiles, setDeclarationFiles] = useState<File[]>([]);
    const [declarationClientName, setDeclarationClientName] = useState("");
    const [declarationNotes, setDeclarationNotes] = useState("");
    const [declarationSubmitting, setDeclarationSubmitting] = useState(false);
    const [declarationDragOver, setDeclarationDragOver] = useState(false);
    const [declarationSuccess, setDeclarationSuccess] = useState("");
    const [declarationError, setDeclarationError] = useState("");

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
        const hasSeenUpdates = localStorage.getItem("redlix_updates_v2_seen");
        if (!hasSeenUpdates) {
            setShowUpdatesPopup(true);
        }
    }, []);

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
        } else if (activeTab === "leaves") {
            fetchEmployeeLeaves();
        } else if (activeTab === "community") {
            fetchCommunityUpdates();
        } else if (activeTab === "declarations") {
            fetchDeclarations();
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

    const fetchEmployeeLeaves = async () => {
        setLeavesLoading(true);
        try {
            const res = await fetch("/api/employee/leaves");
            const data = await res.json();
            if (data.success) setEmployeeLeaves(data.data);
        } catch (error) {
            console.error("Failed to fetch leaves:", error);
        } finally {
            setLeavesLoading(false);
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

    const fetchDeclarations = async () => {
        setDeclarationsLoading(true);
        try {
            const res = await fetch("/api/employee/declarations");
            const data = await res.json();
            if (data.success) setDeclarations(data.data);
        } catch (error) {
            console.error("Failed to fetch declarations:", error);
        } finally {
            setDeclarationsLoading(false);
        }
    };

    const handleDeclarationDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDeclarationDragOver(false);
        const dropped = Array.from(e.dataTransfer.files);
        const allowed = dropped.filter(f =>
            f.type.startsWith("image/") ||
            f.type === "application/pdf" ||
            f.type === "application/msword" ||
            f.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );
        if (allowed.length !== dropped.length) {
            setDeclarationError("Only PDF, image, and Word files are allowed.");
        }
        setDeclarationFiles(prev => [...prev, ...allowed]);
    };

    const handleDeclarationFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setDeclarationFiles(prev => [...prev, ...files]);
        e.target.value = "";
    };

    const handleRemoveDeclarationFile = (index: number) => {
        setDeclarationFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmitDeclarations = async () => {
        if (declarationFiles.length === 0) {
            setDeclarationError("Please select at least one file.");
            return;
        }
        setDeclarationSubmitting(true);
        setDeclarationError("");
        setDeclarationSuccess("");

        try {
            for (const file of declarationFiles) {
                const fileData = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });

                const res = await fetch("/api/employee/declarations", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        fileName: file.name,
                        fileType: file.type,
                        fileData,
                        fileSize: file.size,
                        clientName: declarationClientName.trim() || null,
                        notes: declarationNotes.trim() || null
                    })
                });
                const data = await res.json();
                if (!data.success) {
                    throw new Error(data.message || "Upload failed");
                }
                setDeclarations(prev => [data.data, ...prev]);
            }

            setDeclarationFiles([]);
            setDeclarationClientName("");
            setDeclarationNotes("");
            setDeclarationSuccess(`${declarationFiles.length} declaration(s) submitted successfully!`);
            setTimeout(() => setDeclarationSuccess(""), 5000);
        } catch (err: unknown) {
            setDeclarationError(err instanceof Error ? err.message : "Upload failed. Please try again.");
        } finally {
            setDeclarationSubmitting(false);
        }
    };

    const fetchCommunityUpdates = async () => {
        setCommunityLoading(true);
        try {
            const res = await fetch("/api/employee/community");
            const data = await res.json();
            if (data.success) {
                setCommunityUpdates(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch community updates:", error);
        } finally {
            setCommunityLoading(false);
        }
    };

    const handleSubmitCommunityUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tasksDone.trim() || !learnt.trim() || !gained.trim()) return;

        setSubmittingCommunityUpdate(true);
        try {
            const res = await fetch("/api/employee/community", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tasksDone,
                    learnt,
                    gained,
                    docLink: docLink.trim() || null
                }),
            });
            const data = await res.json();
            if (data.success) {
                setTasksDone("");
                setLearnt("");
                setGained("");
                setDocLink("");
                setIsStandupModalOpen(false);
                setCommunityUpdates(prev => [data.data, ...prev]);
            } else {
                alert(data.message || "Failed to post update");
            }
        } catch (error) {
            console.error("Failed to submit community update:", error);
            alert("An error occurred while posting the update");
        } finally {
            setSubmittingCommunityUpdate(false);
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
                fetchEmployeeDocuments(),
                fetchEmployeeLeaves()
            ]);
        } catch (error) {
            console.error("Failed to fetch overview data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitLeave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLeaveIsSubmitting(true);
        try {
            const res = await fetch("/api/employee/leaves", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    startDate: leaveStartDate,
                    endDate: leaveEndDate,
                    type: leaveType,
                    reason: leaveReason
                })
            });
            const data = await res.json();
            if (data.success) {
                setEmployeeLeaves(prev => [data.data, ...prev]);
                setLeaveStartDate("");
                setLeaveEndDate("");
                setLeaveType("sick");
                setLeaveReason("");
                alert("Leave request submitted successfully!");
            } else {
                alert(data.message || "Failed to submit leave request");
            }
        } catch (error) {
            console.error("Failed to submit leave request:", error);
            alert("A connection error occurred. Please try again.");
        } finally {
            setLeaveIsSubmitting(false);
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
            {/* Sidebar (Desktop only) */}
            <aside className="hidden md:flex w-64 border-r border-white/5 bg-[#0f0f0f] flex flex-col shrink-0 h-full">
                {/* Logo */}
                <div className="px-6 h-[44px] flex items-center shrink-0">
                    <div className="flex items-center gap-2 w-full">
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
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'overview' ? 'bg-white/10 text-white border-l-2 border-white pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <Globe className="w-4 h-4" />
                        Overview
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("tasks")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'tasks' ? 'bg-white/10 text-white border-l-2 border-white pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <ListTodo className="w-4 h-4" />
                        Tasks
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("attendance")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'attendance' ? 'bg-white/10 text-white border-l-2 border-white pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <Clock className="w-4 h-4" />
                        Attendance
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("meetings")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'meetings' ? 'bg-white/10 text-white border-l-2 border-white pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <Video className="w-4 h-4" />
                        Meetings
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("documents")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'documents' ? 'bg-white/10 text-white border-l-2 border-white pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <FileText className="w-4 h-4" />
                        Documents
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("payrolls")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'payrolls' ? 'bg-white/10 text-white border-l-2 border-white pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <CreditCard className="w-4 h-4" />
                        Payrolls
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("leaves")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'leaves' ? 'bg-white/10 text-white border-l-2 border-white pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <Calendar className="w-4 h-4" />
                        Leaves
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("community")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'community' ? 'bg-white/10 text-white border-l-2 border-white pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <MessageSquare className="w-4 h-4" />
                        Community
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("declarations")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'declarations' ? 'bg-white/10 text-white border-l-2 border-white pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <FolderUp className="w-4 h-4" />
                        Declarations
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("settings")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'settings' ? 'bg-white/10 text-white border-l-2 border-white pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <User className="w-4 h-4" />
                        Profile & Settings
                    </button>
                </nav>

                {/* Profile card at bottom */}
                <div className="px-4 pb-4 space-y-3">
                    <div className="h-[1px] bg-white/5" />
                    <div className="bg-white/[0.03] border border-white/8 p-3 space-y-2 rounded-none">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-none bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                <User className="w-4 h-4 text-white/70" />
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
            <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 pb-16 md:pb-0">
                {/* Red Top Bar */}
                <div className="shrink-0 bg-[#E61E32] flex items-center justify-between px-6 h-[44px]">
                    <div className="flex items-center gap-2 text-[12px] font-medium text-white">
                        <span className="opacity-60 uppercase tracking-wider text-[11px]">Portal</span>
                        <span className="opacity-40">/</span>
                        <span className="font-bold uppercase tracking-wider">
                            {activeTab === "overview" ? "Overview" :
                                activeTab === "tasks" ? "Assigned Tasks" :
                                    activeTab === "attendance" ? "Attendance" :
                                        activeTab === "meetings" ? "Meetings" :
                                            activeTab === "documents" ? "Documents" :
                                                activeTab === "payrolls" ? "Payrolls" :
                                                    activeTab === "leaves" ? "Leaves" :
                                                        activeTab === "community" ? "Community" :
                                                            activeTab === "declarations" ? "Declarations" : "Settings"}
                        </span>
                        <span className="text-white/50 text-[10px] hidden sm:inline ml-3 border-l border-white/20 pl-3">
                            — {activeTab === "overview" ? "your stats and activity" :
                                activeTab === "tasks" ? "view and update task progress" :
                                    activeTab === "attendance" ? "punch in/out to log work hours" :
                                        activeTab === "meetings" ? "meetings you are invited to" :
                                            activeTab === "documents" ? "company and client resource files" :
                                                activeTab === "payrolls" ? "monthly payments and history" :
                                                    activeTab === "leaves" ? "submit and track leave requests" :
                                                        activeTab === "community" ? "what you and others did today" :
                                                            activeTab === "declarations" ? "upload & submit client declaration documents" : "update personal, payroll and address info"}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        {handRaiseSuccess ? (
                            <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 text-white text-[11px] font-bold uppercase tracking-wider rounded-lg">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Admin Notified!
                            </div>
                        ) : (
                            <div className="relative group">
                                <button
                                    onClick={handleRaiseHand}
                                    disabled={isRaisingHand}
                                    className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 px-3 py-1.5 text-white text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer rounded-lg disabled:opacity-60"
                                >
                                    {isRaisingHand ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <Hand className="w-3.5 h-3.5" />
                                    )}
                                    Raise Hand
                                </button>
                                
                                {/* Tooltip */}
                                <div className="absolute right-0 top-full mt-2 w-56 bg-[#0a0a0a] border border-white/10 p-3 text-[10px] leading-normal text-white/70 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 rounded-lg shadow-xl font-normal tracking-normal normal-case">
                                    <p className="font-semibold text-white mb-1 uppercase tracking-wider text-[9px] text-[#E61E32] flex items-center gap-1.5">
                                        <AlertCircle className="w-3 h-3 text-[#E61E32]" />
                                        Raise Hand Alert
                                    </p>
                                    This button instantly alerts the administrator that you need assistance or have a query regarding tasks, attendance, or payrolls.
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <div className="space-y-8 h-full flex flex-col">
                    {/* Conditional Rendering of Tabs */}
                    <div className="flex-grow overflow-hidden">
                        {activeTab === "overview" && (
                            <div className="h-full space-y-8 animate-in fade-in duration-500 overflow-y-auto pr-2">
                                {/* Welcome message */}
                                <div className="bg-white/[0.01] border border-white/5 p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl">
                                    <div>
                                        <h3 className="text-base md:text-lg font-bold">Welcome back, {employeeInfo?.name}!</h3>
                                        <p className="text-[11px] md:text-xs text-white/40 mt-1">Here is your daily task assignments and logged work hours.</p>
                                    </div>
                                    <div className="self-start sm:self-auto px-4 py-2 border border-[#E61E32]/25 bg-[#E61E32]/5 text-[#E61E32] text-xs font-bold uppercase tracking-wider rounded-md">
                                        {employeeInfo?.role}
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4">
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
                                        value={employeeTasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length}
                                        sublabel="Awaiting action or in progress"
                                        color="text-yellow-500"
                                    />
                                    <StatCard
                                        icon={<CheckCircle2 className="w-5 h-5" />}
                                        label="Completed Tasks"
                                        value={employeeTasks.filter(t => t.status === 'completed').length}
                                        sublabel="All closed duties"
                                        color="text-green-500"
                                    />
                                    <StatCard
                                        icon={<Briefcase className="w-5 h-5" />}
                                        label="Hours Worked"
                                        value={Number((attendanceHistory.reduce((sum, r) => sum + r.workMinutes, 0) / 60).toFixed(1))}
                                        sublabel="Total logged work duration"
                                        color="text-[#E61E32]"
                                    />
                                    <StatCard
                                        icon={<Video className="w-5 h-5" />}
                                        label="Meetings"
                                        value={employeeMeetings.filter(m => new Date(m.scheduledAt) > new Date()).length}
                                        sublabel={`${employeeMeetings.length} total meetings`}
                                        color="text-pink-500"
                                    />
                                </div>

                                {/* Main Overview Sections */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Recent Tasks */}
                                    <div className="bg-white/[0.02] border border-white/5 p-6 space-y-4 rounded-xl">
                                        <h3 className="text-[11px] font-medium text-white/30 flex items-center gap-2">
                                            <ListTodo className="w-3.5 h-3.5" />
                                            Your Active Tasks
                                        </h3>
                                        <div className="space-y-4">
                                            {employeeTasks.filter(t => t.status !== 'completed').slice(0, 5).map(task => (
                                                <div key={task.id} className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-lg">
                                                    <div>
                                                        <p className="text-sm font-semibold">{task.title}</p>
                                                        {task.deadline && (
                                                            <p className="text-[10px] text-white/30">Due {new Date(task.deadline).toLocaleDateString()}</p>
                                                        )}
                                                    </div>
                                                    <span className={`px-1.5 py-0.5 text-[8px] uppercase tracking-widest font-black rounded-md ${task.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
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
                                    <div className="bg-white/[0.02] border border-white/5 p-6 space-y-4 rounded-xl">
                                        <h3 className="text-[11px] font-medium text-white/30 flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5" />
                                            Recent Attendance Logs (Cutoff: 10:00 AM)
                                        </h3>
                                        <div className="space-y-4">
                                            {getDailyAttendanceList(attendanceHistory, employeeInfo?.joinedAt).slice(0, 5).map(att => (
                                                <div key={att.dateStr} className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-lg">
                                                    <div>
                                                        <p className="text-sm font-semibold">{att.dateStr}</p>
                                                        <p className="text-[10px] text-white/30">
                                                            Check In: {att.punchIn} | Check Out: {att.punchOut}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`px-1.5 py-0.5 text-[8px] uppercase tracking-widest font-black rounded-md ${att.status === 'Present' ? 'bg-green-500/10 text-green-500' : att.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-[#E61E32]/10 text-[#E61E32]'}`}>
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
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 h-full">
                                {/* Tasks List */}
                                <div className={`overflow-y-auto space-y-3 pr-2 scrollbar-thin ${selectedEmployeeTask ? 'hidden lg:block' : 'block'}`}>
                                    {tasksLoading ? (
                                        <p className="text-white/20 text-center py-10 animate-pulse">Loading tasks...</p>
                                    ) : employeeTasks.length > 0 ? (
                                        employeeTasks.map((t) => (
                                            <div
                                                key={t.id}
                                                onClick={() => setSelectedEmployeeTask(t)}
                                                className={`p-5 border transition-all cursor-pointer rounded-xl ${selectedEmployeeTask?.id === t.id ? 'bg-white/5 border-white/20' : 'bg-transparent border-white/5 hover:border-white/10'}`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-white flex items-center gap-2">
                                                        {t.title}
                                                        <span className={`px-1.5 py-0.5 text-[8px] uppercase tracking-widest font-black rounded-md ${t.status === 'completed' ? 'bg-green-500/10 text-green-500' : t.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
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
                                        <div className="py-20 text-center border border-dashed border-white/5 rounded-xl">
                                            <p className="text-white/20 text-sm">No tasks assigned to you.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Task Details & Progress Action Panel */}
                                <div className={`bg-white/5 border border-white/5 p-5 md:p-8 overflow-y-auto rounded-xl ${selectedEmployeeTask ? 'block' : 'hidden lg:block'}`}>
                                    {selectedEmployeeTask ? (
                                        <div className="space-y-8 animate-in fade-in duration-300">
                                            {/* Mobile Back Button */}
                                            <button
                                                onClick={() => setSelectedEmployeeTask(null)}
                                                className="flex items-center gap-2 text-xs text-[#E61E32] hover:text-[#ff1f34] transition-colors lg:hidden font-medium mb-4"
                                            >
                                                &larr; Back to Task List
                                            </button>
                                            <div className="space-y-4 pb-6 border-b border-white/5">
                                                <h3 className="text-xl font-bold">{selectedEmployeeTask.title}</h3>
                                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/30 font-medium">
                                                    <span className="flex items-center gap-1.5">
                                                        Status: 
                                                        <span className={`px-1.5 py-0.5 text-[8px] uppercase tracking-widest font-black rounded-md ${selectedEmployeeTask.status === 'completed' ? 'bg-green-500/10 text-green-400' : selectedEmployeeTask.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
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
                                                            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest border transition-all cursor-pointer rounded-lg ${selectedEmployeeTask.status === status
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
                                            <div className="bg-white/[0.02] border border-white/5 p-4 space-y-1.5 hover:border-white/10 transition-colors rounded-xl">
                                                <p className="text-[10px] font-normal text-white/30">Present Days</p>
                                                <h4 className="text-xl font-bold text-green-400">{stats.presentDays}</h4>
                                                <p className="text-[9px] text-white/20">Checked in on-time</p>
                                            </div>
                                            <div className="bg-white/[0.02] border border-white/5 p-4 space-y-1.5 hover:border-white/10 transition-colors rounded-xl">
                                                <p className="text-[10px] font-normal text-[#E61E32]">Absent Days</p>
                                                <h4 className="text-xl font-bold text-[#E61E32]">{stats.absentDays}</h4>
                                                <p className="text-[9px] text-white/20">Missed / Late check-ins</p>
                                            </div>
                                            <div className="bg-white/[0.02] border border-white/5 p-4 space-y-1.5 hover:border-white/10 transition-colors rounded-xl">
                                                <p className="text-[10px] font-normal text-yellow-500/80">Pending Today</p>
                                                <h4 className="text-xl font-bold text-yellow-500">{stats.pendingDays}</h4>
                                                <p className="text-[9px] text-white/20">Before 10:00 AM today</p>
                                            </div>
                                            <div className="bg-white/[0.02] border border-white/5 p-4 space-y-1.5 hover:border-white/10 transition-colors rounded-xl">
                                                <p className="text-[10px] font-normal text-white/30">Total Work Time</p>
                                                <h4 className="text-xl font-bold text-white/90">{stats.totalHours} hrs</h4>
                                                <p className="text-[9px] text-white/20">Accrued this period</p>
                                            </div>
                                            <div className="bg-white/[0.02] border border-white/5 p-4 space-y-1.5 hover:border-white/10 transition-colors rounded-xl">
                                                <p className="text-[10px] font-normal text-white/30">Avg Hours / Day</p>
                                                <h4 className="text-xl font-bold text-white/95">{stats.avgHours} hrs</h4>
                                                <p className="text-[9px] text-white/20">Per present day</p>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Main Attendance Content */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow min-h-[400px]">
                                    {/* Punch Actions Card */}
                                    <div className="bg-white/5 border border-white/5 p-8 flex flex-col items-center justify-center text-center space-y-8 min-h-[350px] rounded-xl">
                                        <div className="space-y-2">
                                            <div className="text-4xl font-mono font-bold tracking-widest text-white/90">
                                                {currentTime.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </div>
                                            <div className="text-xs text-white/30 uppercase tracking-widest">
                                                {currentTime.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </div>
                                        </div>

                                        <div className="space-y-4 w-full max-w-sm">
                                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-lg">
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
                                                    className="w-full bg-[#E61E32] hover:bg-[#ff1f34] text-white font-bold py-5 text-sm uppercase tracking-widest transition-all rounded-lg cursor-pointer flex items-center justify-center gap-2"
                                                >
                                                    {isPunching ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : "Punch Out"}
                                                </button>
                                            ) : (
                                                <button
                                                    disabled={isPunching}
                                                    onClick={handlePunchIn}
                                                    className="w-full bg-white hover:bg-white/95 text-black font-bold py-5 text-sm uppercase tracking-widest transition-all rounded-lg cursor-pointer flex items-center justify-center gap-2"
                                                >
                                                    {isPunching ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : "Punch In"}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Attendance History Table */}
                                    <div className="bg-white/5 border border-white/5 p-8 flex flex-col overflow-hidden h-full rounded-xl">
                                        <div className="mb-4 shrink-0 flex justify-between items-center">
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-white/40">Your Daily Attendance Logs</h3>
                                            {/* Summary badges */}
                                            <div className="flex gap-2">
                                                <div className="px-2.5 py-1 bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold uppercase tracking-widest rounded-md">
                                                    Present: {getDailyAttendanceList(attendanceHistory, employeeInfo?.joinedAt).filter(d => d.status === "Present").length}
                                                </div>
                                                <div className="px-2.5 py-1 bg-[#E61E32]/10 border border-[#E61E32]/20 text-[#E61E32] text-[10px] font-bold uppercase tracking-widest rounded-md">
                                                    Absent: {getDailyAttendanceList(attendanceHistory, employeeInfo?.joinedAt).filter(d => d.status === "Absent").length}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="overflow-y-auto pr-1 flex-grow scrollbar-thin">
                                            {attendanceLoading ? (
                                                <p className="text-white/20 text-center py-10 animate-pulse">Loading logs...</p>
                                            ) : getDailyAttendanceList(attendanceHistory, employeeInfo?.joinedAt).length > 0 ? (
                                                <div className="overflow-x-auto scrollbar-thin">
                                                    <table className="w-full text-left text-xs min-w-[500px] md:min-w-0">
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
                                                                            <span className={`px-1.5 py-0.5 text-[8px] uppercase tracking-widest font-black rounded-md ${att.status === 'Present' ? 'bg-green-500/10 text-green-500' : att.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-[#E61E32]/10 text-[#E61E32]'}`}>
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
                                                </div>
                                            ) : (
                                                <div className="py-20 text-center border border-dashed border-white/5">
                                                    <p className="text-white/20 text-sm">No attendance records found.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}                        {activeTab === "settings" && (
                            <div className="bg-white/5 border border-white/5 p-8 overflow-y-auto h-full animate-in fade-in duration-300 rounded-xl">
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
                                                className="w-full bg-[#111111] border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E61E32] transition-colors rounded-lg"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                value={settingsEmail}
                                                onChange={(e) => setSettingsEmail(e.target.value)}
                                                className="w-full bg-[#111111] border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E61E32] transition-colors rounded-lg"
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
                                                className="w-full bg-[#111111] border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E61E32] transition-colors rounded-lg"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">UPI ID (For Payrolls)</label>
                                            <input
                                                type="text"
                                                value={settingsUpiId}
                                                onChange={(e) => setSettingsUpiId(e.target.value)}
                                                placeholder="username@upi"
                                                className="w-full bg-[#111111] border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E61E32] transition-colors rounded-lg"
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
                                                className="w-full bg-[#111111] border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E61E32] transition-colors rounded-lg"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Emergency Mobile Number</label>
                                            <input
                                                type="tel"
                                                value={settingsMobile}
                                                onChange={(e) => setSettingsMobile(e.target.value)}
                                                placeholder="XXXXXXXXXX"
                                                className="w-full bg-[#111111] border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E61E32] transition-colors rounded-lg"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Alternative Email</label>
                                            <input
                                                type="email"
                                                value={settingsAltEmail}
                                                onChange={(e) => setSettingsAltEmail(e.target.value)}
                                                placeholder="name@personal.com"
                                                className="w-full bg-[#111111] border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E61E32] transition-colors rounded-lg"
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
                                            className="w-full bg-[#111111] border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E61E32] transition-colors rounded-lg resize-none"
                                        />
                                    </div>
 
                                    {settingsSuccess && (
                                        <div className="bg-green-500/10 border border-green-500/20 p-4 text-green-500 text-xs font-bold uppercase tracking-wider rounded-lg">
                                            {settingsSuccess}
                                        </div>
                                    )}
                                    {settingsError && (
                                        <div className="bg-[#E61E32]/10 border border-[#E61E32]/20 p-4 text-[#E61E32] text-xs font-bold uppercase tracking-wider rounded-lg">
                                            {settingsError}
                                        </div>
                                    )}
 
                                    <button
                                        type="submit"
                                        disabled={isSavingSettings}
                                        className="w-full md:w-auto px-8 py-3.5 bg-[#E61E32] hover:bg-[#ff1f34] text-white text-xs font-bold uppercase tracking-widest transition-all rounded-lg cursor-pointer flex items-center justify-center gap-2"
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
                            <div className="h-full flex flex-col lg:flex-row gap-6 animate-in fade-in duration-500 overflow-hidden">
                                {/* Left: meetings list */}
                                <div className={`w-full lg:w-[380px] shrink-0 flex flex-col gap-3 overflow-y-auto pr-1 ${selectedEmpMeeting ? 'hidden lg:flex' : 'flex'}`}>
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
                                                className={`p-4 border cursor-pointer transition-all space-y-2 rounded-xl ${
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
                                <div className={`flex-grow bg-white/[0.02] border border-white/5 p-6 overflow-y-auto space-y-6 rounded-xl ${selectedEmpMeeting ? 'block' : 'hidden lg:block'}`}>
                                    {selectedEmpMeeting ? (
                                        <div className="space-y-6">
                                            {/* Mobile Back Button */}
                                            <button
                                                onClick={() => setSelectedEmpMeeting(null)}
                                                className="flex items-center gap-2 text-xs text-[#E61E32] hover:text-[#ff1f34] transition-colors lg:hidden font-medium mb-4"
                                            >
                                                &larr; Back to Meetings
                                            </button>
                                            <div>
                                                <h3 className="text-lg font-bold text-white">{selectedEmpMeeting.title}</h3>
                                                {selectedEmpMeeting.description && <p className="text-sm text-white/40 mt-1">{selectedEmpMeeting.description}</p>}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="bg-white/[0.03] border border-white/5 p-4 space-y-1 rounded-lg">
                                                    <p className="text-[10px] text-white/30 uppercase tracking-wider">Meeting Lead</p>
                                                    <p className="text-sm font-semibold text-white">{selectedEmpMeeting.meetingLead}</p>
                                                </div>
                                                <div className="bg-white/[0.03] border border-white/5 p-4 space-y-1 rounded-lg">
                                                    <p className="text-[10px] text-white/30 uppercase tracking-wider">Date & Time</p>
                                                    <p className="text-sm font-semibold text-white">{new Date(selectedEmpMeeting.scheduledAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' })}</p>
                                                </div>
                                            </div>

                                            {selectedEmpMeeting.meetingLink && (
                                                <div className="bg-white/[0.03] border border-white/5 p-4 rounded-lg">
                                                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Join Meeting</p>
                                                    <a href={selectedEmpMeeting.meetingLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#E61E32] text-sm hover:underline break-all">
                                                        <LinkIcon className="w-4 h-4 shrink-0" />{selectedEmpMeeting.meetingLink}
                                                    </a>
                                                </div>
                                            )}

                                            <div>
                                                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-3">All Attendees ({selectedEmpMeeting.attendees.length})</p>
                                                <div className="space-y-2">
                                                    {selectedEmpMeeting.attendees.map(att => (
                                                        <div key={att.id} className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/5 rounded-lg">
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
                                        <div className="h-full flex items-center justify-center text-white/15 text-sm">
                                            Select a meeting to view details
                                        </div>
                                    )}
                                </div>
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
                                                <div key={doc.id} className="bg-white/[0.02] border border-white/5 hover:border-white/15 p-5 space-y-3 transition-colors rounded-xl">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-5 h-5 text-[#E61E32] shrink-0" />
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-semibold text-white truncate">{doc.title}</p>
                                                            <p className="text-[10px] text-white/30 truncate">{doc.fileName}</p>
                                                        </div>
                                                    </div>
                                                    {doc.description && <p className="text-xs text-white/40 line-clamp-2">{doc.description}</p>}
                                                    <div className="flex items-center justify-between">
                                                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-md ${categoryColors[doc.category] || categoryColors.other}`}>
                                                            {doc.category}
                                                        </span>
                                                        <span className="text-[10px] text-white/20">{new Date(doc.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 w-full py-2 bg-white/5 hover:bg-[#E61E32]/10 border border-white/10 hover:border-[#E61E32]/20 text-white/60 hover:text-[#E61E32] text-xs font-medium transition-all justify-center rounded-lg">
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
                                            <div className="bg-white/[0.02] border border-white/5 p-5 space-y-2 hover:border-white/10 transition-colors rounded-xl">
                                                <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Total Paid</p>
                                                <h4 className="text-2xl font-bold text-white">₹{totalPaid.toLocaleString('en-IN')}</h4>
                                                <p className="text-[10px] text-white/30">Transferred to your linked UPI ID</p>
                                            </div>
                                            <div className="bg-white/[0.02] border border-white/5 p-5 space-y-2 hover:border-white/10 transition-colors rounded-xl">
                                                <p className="text-[10px] font-bold text-[#E61E32] uppercase tracking-widest font-black">Total Pending</p>
                                                <h4 className="text-2xl font-bold text-white">₹{totalPending.toLocaleString('en-IN')}</h4>
                                                <p className="text-[10px] text-white/30">Awaiting bank/admin processing</p>
                                            </div>
                                        </div>
                                    );
                                })()}
 
                                {/* Payroll History Table */}
                                <div className="bg-white/5 border border-white/5 p-6 flex flex-col overflow-hidden h-full rounded-xl">
                                    <div className="mb-4 shrink-0">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-white/40">Monthly Payrolls & Payouts</h3>
                                    </div>

                                    <div className="overflow-y-auto pr-1 flex-grow scrollbar-thin">
                                        {payrollsLoading ? (
                                            <p className="text-white/20 text-center py-10 animate-pulse">Loading payroll records...</p>
                                        ) : employeePayrolls.length > 0 ? (
                                            <div className="overflow-x-auto scrollbar-thin">
                                                <table className="w-full text-left text-xs min-w-[500px] md:min-w-0">
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
                                                                    <span className={`px-2 py-0.5 text-[8px] uppercase tracking-widest font-black border rounded-md ${
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
                                            </div>
                                        ) : (
                                            <div className="py-10 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-xl">
                                                <dotlottie-wc
                                                    src="https://lottie.host/145c7d5f-32df-4078-b824-2a772802a107/ukxQPKRGny.lottie"
                                                    style={{ width: "300px", height: "300px" }}
                                                    autoplay
                                                    loop
                                                />
                                                <p className="text-white/20 text-sm mt-4">No payroll records allocated yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ===== LEAVES TAB ===== */}
                        {activeTab === "leaves" && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-y-auto pr-2 pb-6 animate-in fade-in duration-500">
                                {/* Left Column: Leave Form (5 cols) */}
                                <div className="lg:col-span-5 space-y-6">
                                    <div className="bg-white/5 border border-white/5 p-6 rounded-xl">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Request Time Off</h3>
                                        <form onSubmit={handleSubmitLeave} className="space-y-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2">Leave Type</label>
                                                <select
                                                    value={leaveType}
                                                    onChange={(e) => setLeaveType(e.target.value)}
                                                    required
                                                    className="w-full bg-[#121212] border border-white/10 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#E61E32] transition-colors rounded-lg"
                                                >
                                                    <option value="sick">Sick Leave</option>
                                                    <option value="casual">Casual Leave</option>
                                                    <option value="personal">Personal Leave</option>
                                                    <option value="paid">Paid Leave</option>
                                                    <option value="unpaid">Unpaid Leave</option>
                                                </select>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2">Start Date</label>
                                                    <input
                                                        type="date"
                                                        value={leaveStartDate}
                                                        onChange={(e) => setLeaveStartDate(e.target.value)}
                                                        required
                                                        className="w-full bg-[#121212] border border-white/10 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#E61E32] transition-colors rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2">End Date</label>
                                                    <input
                                                        type="date"
                                                        value={leaveEndDate}
                                                        onChange={(e) => setLeaveEndDate(e.target.value)}
                                                        required
                                                        className="w-full bg-[#121212] border border-white/10 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#E61E32] transition-colors rounded-lg"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2">Reason</label>
                                                <textarea
                                                    value={leaveReason}
                                                    onChange={(e) => setLeaveReason(e.target.value)}
                                                    required
                                                    rows={4}
                                                    placeholder="State the reason for your leave request..."
                                                    className="w-full bg-[#121212] border border-white/10 px-3 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E61E32] transition-colors rounded-lg resize-none"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={leaveIsSubmitting}
                                                className="w-full bg-[#E61E32] hover:bg-[#C81428] text-white py-3 text-xs font-black uppercase tracking-widest transition-colors duration-200 disabled:opacity-50 rounded-lg"
                                            >
                                                {leaveIsSubmitting ? "Submitting..." : "Submit Request"}
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                {/* Right Column: Leave History (7 cols) */}
                                <div className="lg:col-span-7 flex flex-col h-full overflow-hidden">
                                    <div className="bg-white/5 border border-white/5 p-6 flex flex-col overflow-hidden h-full rounded-xl">
                                        <div className="mb-4 shrink-0 flex justify-between items-center">
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-white/40">Request History</h3>
                                            <span className="text-[10px] text-white/30">{employeeLeaves.length} requests</span>
                                        </div>

                                        <div className="overflow-y-auto pr-1 flex-grow scrollbar-thin space-y-3">
                                            {leavesLoading ? (
                                                <p className="text-white/20 text-center py-10 animate-pulse text-xs">Loading leave history...</p>
                                            ) : employeeLeaves.length > 0 ? (
                                                employeeLeaves.map((leave) => {
                                                    const start = new Date(leave.startDate);
                                                    const end = new Date(leave.endDate);
                                                    const diffTime = Math.abs(end.getTime() - start.getTime());
                                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                                                    return (
                                                        <div key={leave.id} className="bg-white/[0.02] border border-white/5 p-4 space-y-3 hover:border-white/10 transition-colors rounded-lg">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 bg-white/5 border border-white/10 text-white/70 rounded-md">
                                                                        {leave.type} leave
                                                                    </span>
                                                                    <h4 className="text-xs font-semibold text-white mt-2">
                                                                        {start.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' })}
                                                                        {" - "}
                                                                        {end.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' })}
                                                                    </h4>
                                                                    <p className="text-[10px] text-white/30 mt-0.5">{diffDays} {diffDays === 1 ? 'day' : 'days'}</p>
                                                                </div>
 
                                                                <span className={`px-2.5 py-0.5 text-[8px] uppercase tracking-widest font-black border rounded-md ${
                                                                    leave.status === 'approved'
                                                                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                                        : leave.status === 'rejected'
                                                                        ? 'bg-[#E61E32]/10 text-[#E61E32] border-[#E61E32]/20'
                                                                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                                }`}>
                                                                    {leave.status}
                                                                </span>
                                                            </div>
 
                                                            <div className="text-xs text-white/70 bg-black/20 p-2.5 border border-white/[0.02] break-words rounded-md">
                                                                <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Reason</p>
                                                                {leave.reason}
                                                            </div>
 
                                                            {leave.adminNotes && (
                                                                <div className="text-xs text-white/70 bg-[#E61E32]/5 p-2.5 border border-[#E61E32]/10 break-words rounded-md">
                                                                    <p className="text-[10px] font-semibold text-[#E61E32] uppercase tracking-wider mb-1">Admin Remarks</p>
                                                                    {leave.adminNotes}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="py-16 text-center border border-dashed border-white/5">
                                                    <p className="text-white/20 text-xs">No leave requests submitted yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ===== COMMUNITY TAB ===== */}
                        {activeTab === "community" && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-y-auto pr-2 pb-6 animate-in fade-in duration-500 relative">
                                {/* Left Column: Submit daily progress (5 cols) */}
                                <div className="lg:col-span-5 space-y-6">
                                    <div className="bg-white/5 border border-white/5 p-6 rounded-xl space-y-4">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">Share Daily Standup</h3>
                                        <p className="text-[11px] text-white/40 leading-relaxed">
                                            Log what you did today, new concepts learned, references/document links, and progress. Your update will be posted to the live standup feed.
                                        </p>
                                        
                                        <button
                                            onClick={() => setIsStandupModalOpen(true)}
                                            className="w-full bg-[#E61E32] hover:bg-[#C81428] text-white py-3 text-xs font-black uppercase tracking-widest transition-colors duration-200 rounded-lg flex items-center justify-center gap-2"
                                        >
                                            <Send className="w-3.5 h-3.5" />
                                            + Write Daily Standup
                                        </button>
                                    </div>

                                    {/* Standup Tips Info Box */}
                                    <div className="bg-white/[0.01] border border-white/5 p-5 rounded-xl space-y-3">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#E61E32] flex items-center gap-1.5">
                                            <AlertCircle className="w-4 h-4 text-[#E61E32]" />
                                            Standup Guidelines
                                        </h4>
                                        <ul className="text-[11px] text-white/50 space-y-2 list-disc list-inside">
                                            <li>Keep it concise and focused on actual outcomes.</li>
                                            <li>Highlight any issues/blockers hindering your work.</li>
                                            <li>Be collaborative and read updates from other team members.</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Right Column: Community Standups Feed (7 cols) */}
                                <div className="lg:col-span-7 flex flex-col h-full overflow-hidden">
                                    <div className="bg-white/5 border border-white/5 p-6 flex flex-col overflow-hidden h-full rounded-xl">
                                        <div className="mb-4 shrink-0 flex justify-between items-center">
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-white/40">Today's Standups</h3>
                                            <span className="text-[10px] text-white/30 bg-white/5 px-2 py-0.5 border border-white/5 rounded-md">{communityUpdates.length} updates</span>
                                        </div>

                                        <div className="overflow-y-auto pr-1 flex-grow scrollbar-thin space-y-4">
                                            {communityLoading ? (
                                                <div className="py-16 text-center space-y-3">
                                                    <Loader2 className="w-6 h-6 animate-spin text-[#E61E32] mx-auto" />
                                                    <p className="text-white/20 text-xs">Loading community standup updates...</p>
                                                </div>
                                            ) : communityUpdates.length > 0 ? (
                                                communityUpdates.map((update) => {
                                                    const initials = update.employee?.name
                                                        ? update.employee.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
                                                        : "?";

                                                    const handleName = update.employee?.name
                                                        ? update.employee.name.toLowerCase().replace(/\s+/g, "_")
                                                        : "user";
                                                    const handleRole = update.employee?.role
                                                        ? update.employee.role.toLowerCase().replace(/[^a-z0-9]/g, "")
                                                        : "member";
                                                    const handle = `@${handleName}_${handleRole}`;

                                                    const timeFormatted = (() => {
                                                        try {
                                                            const date = new Date(update.createdAt);
                                                            const now = new Date();
                                                            const isToday = date.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }) === 
                                                                            now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
                                                            const yesterday = new Date(now);
                                                            yesterday.setDate(now.getDate() - 1);
                                                            const isYesterday = date.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }) === 
                                                                                yesterday.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
                                                                                
                                                            const timeStr = date.toLocaleTimeString('en-IN', { 
                                                                timeZone: 'Asia/Kolkata', 
                                                                hour: '2-digit', 
                                                                minute: '2-digit', 
                                                                hour12: true 
                                                            });

                                                            if (isToday) return `Today at ${timeStr}`;
                                                            if (isYesterday) return `Yesterday at ${timeStr}`;
                                                            
                                                            return `${date.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short' })} at ${timeStr}`;
                                                        } catch (e) {
                                                            return "";
                                                        }
                                                    })();

                                                    const isLiked = likedUpdates[update.id] || false;

                                                    return (
                                                        <div key={update.id} className="bg-[#0c0c0c]/85 border border-white/10 p-5 rounded-xl space-y-4 hover:bg-[#0c0c0c] transition-all duration-200 group text-left relative">
                                                            {/* Top row: profile & handles */}
                                                            <div className="flex justify-between items-start gap-4">
                                                                <div className="flex gap-3 min-w-0">
                                                                    <div className="w-10 h-10 rounded-full bg-[#E61E32]/10 border border-[#E61E32]/25 flex items-center justify-center text-[#E61E32] font-black text-sm uppercase shrink-0">
                                                                        {initials}
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                                            <span className="font-bold text-white text-xs hover:underline cursor-pointer flex items-center gap-1">
                                                                                {update.employee?.name}
                                                                                <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#1d9bf0] text-white select-none">
                                                                                    <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-current"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.99-3.818-3.99-.48 0-.94.1-1.348.27C14.825 2.515 13.512 1.5 12 1.5s-2.825 1.015-3.422 2.28c-.408-.17-.867-.27-1.348-.27-2.108 0-3.818 1.78-3.818 3.99 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.71 3.99 3.818 3.99.48 0 .94-.1 1.348-.27.597 1.265 1.91 2.28 3.422 2.28s2.825-1.015 3.422-2.28c.408.17.867.27 1.348.27 2.108 0 3.818-1.78 3.818-3.99 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.72 3.12l-3.24-3.24 1.41-1.42 1.83 1.83 4.54-4.54 1.42 1.41-5.96 5.96z"></path></g></svg>
                                                                                </span>
                                                                            </span>
                                                                            <span className="text-white/40 text-[11px] truncate shrink-0">{handle}</span>
                                                                            <span className="text-white/45 text-[11px] shrink-0">·</span>
                                                                            <span className="text-white/40 text-[11px] hover:underline cursor-pointer shrink-0">{timeFormatted}</span>
                                                                        </div>
                                                                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mt-0.5">{update.employee?.role || "Team Member"}</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Standup Content Area */}
                                                            <div className="space-y-3.5 pl-[52px] text-xs">
                                                                {/* Tasks Done */}
                                                                <div className="space-y-1">
                                                                    <span className="text-[10px] font-bold text-[#E61E32] uppercase tracking-wider block">Tasks Completed</span>
                                                                    <p className="text-white/90 leading-relaxed break-words whitespace-pre-wrap">{update.tasksDone}</p>
                                                                </div>

                                                                {/* What You Learnt */}
                                                                <div className="space-y-1">
                                                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">Learning & Discoveries</span>
                                                                    <p className="text-white/80 leading-relaxed break-words whitespace-pre-wrap">{update.learnt}</p>
                                                                </div>

                                                                {/* Progress Gained */}
                                                                <div className="space-y-1">
                                                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">Gained / Key Progress</span>
                                                                    <p className="text-white/80 leading-relaxed break-words whitespace-pre-wrap">{update.gained}</p>
                                                                </div>

                                                                {/* Document/Resource Link Card Preview */}
                                                                {update.docLink && (
                                                                    <a
                                                                        href={update.docLink}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="block border border-white/10 rounded-xl overflow-hidden hover:border-[#E61E32]/35 transition-all bg-white/[0.01] hover:bg-white/[0.03] max-w-md cursor-pointer"
                                                                    >
                                                                        <div className="p-3 flex items-center gap-3">
                                                                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-[#E61E32] shrink-0">
                                                                                <LinkIcon className="w-4 h-4" />
                                                                            </div>
                                                                            <div className="min-w-0 flex-1">
                                                                                <p className="text-[10px] font-black text-white/90 truncate uppercase tracking-widest">Shared Document</p>
                                                                                <p className="text-[11px] text-[#E61E32] truncate mt-0.5 flex items-center gap-1">
                                                                                    {update.docLink}
                                                                                    <ExternalLink className="w-2.5 h-2.5 inline" />
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </a>
                                                                )}
                                                            </div>

                                                            {/* Bottom row: Twitter Action Bar */}
                                                            <div className="flex items-center justify-between max-w-sm pl-[52px] pt-1 text-white/35">
                                                                {/* Comments Mock */}
                                                                <button type="button" className="flex items-center gap-1 hover:text-[#1d9bf0] transition-colors group cursor-pointer text-[11px] bg-transparent border-0 outline-none">
                                                                    <span className="w-7 h-7 rounded-full flex items-center justify-center group-hover:bg-[#1d9bf0]/10 transition-colors">
                                                                        <MessageSquare className="w-3.5 h-3.5" />
                                                                    </span>
                                                                    <span className="font-semibold select-none">3</span>
                                                                </button>
                                                                {/* Repost Mock */}
                                                                <button type="button" className="flex items-center gap-1 hover:text-[#00ba7c] transition-colors group cursor-pointer text-[11px] bg-transparent border-0 outline-none">
                                                                    <span className="w-7 h-7 rounded-full flex items-center justify-center group-hover:bg-[#00ba7c]/10 transition-colors">
                                                                        <Globe className="w-3.5 h-3.5" />
                                                                    </span>
                                                                    <span className="font-semibold select-none">1</span>
                                                                </button>
                                                                {/* Like Button */}
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setLikedUpdates(prev => ({
                                                                            ...prev,
                                                                            [update.id]: !prev[update.id]
                                                                        }));
                                                                    }}
                                                                    className={`flex items-center gap-1 hover:text-[#f91880] transition-colors group cursor-pointer text-[11px] bg-transparent border-0 outline-none ${isLiked ? 'text-[#f91880]' : ''}`}
                                                                >
                                                                    <span className="w-7 h-7 rounded-full flex items-center justify-center group-hover:bg-[#f91880]/10 transition-colors">
                                                                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-[#f91880]' : ''}`} />
                                                                    </span>
                                                                    <span className="font-semibold select-none">{isLiked ? 1 : 0}</span>
                                                                </button>
                                                                {/* Views Mock */}
                                                                <div className="flex items-center gap-1 text-[11px]">
                                                                    <span className="w-7 h-7 rounded-full flex items-center justify-center">
                                                                        <BarChart3 className="w-3.5 h-3.5" />
                                                                    </span>
                                                                    <span className="font-semibold select-none">42</span>
                                                                </div>
                                                                {/* Share Mock */}
                                                                <button type="button" className="flex items-center hover:text-[#1d9bf0] transition-colors group cursor-pointer bg-transparent border-0 outline-none">
                                                                    <span className="w-7 h-7 rounded-full flex items-center justify-center group-hover:bg-[#1d9bf0]/10 transition-colors">
                                                                        <Send className="w-3.5 h-3.5" />
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="py-20 text-center border border-dashed border-white/5 rounded-lg">
                                                    <p className="text-white/20 text-xs">No standups shared today yet.</p>
                                                    <p className="text-white/10 text-[10px] mt-1">Be the first to share your progress!</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* STANDUP MODAL OVERLAY */}
                                {isStandupModalOpen && (
                                    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 animate-in fade-in duration-200">
                                        {/* Backdrop */}
                                        <div 
                                            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
                                            onClick={() => setIsStandupModalOpen(false)} 
                                        />
                                        
                                        {/* Modal Body */}
                                        <div className="relative bg-[#0b0b0b] border border-white/10 w-full max-w-lg p-6 rounded-2xl shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 z-10 text-left">
                                            <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-[#E61E32]/10 border border-[#E61E32]/25 flex items-center justify-center text-[#E61E32]">
                                                        <Send className="w-3.5 h-3.5" />
                                                    </div>
                                                    <h3 className="text-xs font-bold uppercase tracking-widest text-white">Create Standup Update</h3>
                                                </div>
                                                <button 
                                                    onClick={() => setIsStandupModalOpen(false)} 
                                                    className="text-white/40 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-full"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            <form onSubmit={handleSubmitCommunityUpdate} className="space-y-4">
                                                <div className="space-y-1.5">
                                                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">Tasks You Have Done</label>
                                                    <textarea
                                                        value={tasksDone}
                                                        onChange={(e) => setTasksDone(e.target.value)}
                                                        required
                                                        rows={3}
                                                        placeholder="What tasks did you complete today?"
                                                        className="w-full bg-[#121212] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E61E32] transition-colors rounded-lg resize-none leading-relaxed"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">What You Have Learnt</label>
                                                    <textarea
                                                        value={learnt}
                                                        onChange={(e) => setLearnt(e.target.value)}
                                                        required
                                                        rows={2}
                                                        placeholder="What new concepts, library patterns, or features did you learn?"
                                                        className="w-full bg-[#121212] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E61E32] transition-colors rounded-lg resize-none leading-relaxed"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">How Much You Have Gained Till Now</label>
                                                    <textarea
                                                        value={gained}
                                                        onChange={(e) => setGained(e.target.value)}
                                                        required
                                                        rows={2}
                                                        placeholder="What is your progress / takeaway gained so far?"
                                                        className="w-full bg-[#121212] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E61E32] transition-colors rounded-lg resize-none leading-relaxed"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">Document/Resource Link (Optional)</label>
                                                    <input
                                                        type="text"
                                                        value={docLink}
                                                        onChange={(e) => setDocLink(e.target.value)}
                                                        placeholder="e.g., github.com/pulls or Figma link..."
                                                        className="w-full bg-[#121212] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E61E32] transition-colors rounded-lg"
                                                    />
                                                </div>
                                                <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsStandupModalOpen(false)}
                                                        className="px-4 py-2 text-xs font-semibold text-white/60 hover:text-white bg-white/5 border border-white/5 hover:bg-white/10 transition-colors rounded-lg"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={submittingCommunityUpdate || !tasksDone.trim() || !learnt.trim() || !gained.trim()}
                                                        className="px-5 py-2 bg-[#E61E32] hover:bg-[#C81428] text-white text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50 rounded-lg flex items-center gap-1.5"
                                                    >
                                                        {submittingCommunityUpdate ? (
                                                            <>
                                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                                Submitting...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Send className="w-3 h-3" />
                                                                Submit Standup
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ─── DECLARATIONS TAB ─────────────────────────────────── */}
                        {activeTab === "declarations" && (
                            <div className="h-full space-y-6 animate-in fade-in duration-500 overflow-y-auto pr-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold text-white">Client Declarations</h2>
                                        <p className="text-xs text-white/40 mt-1">Upload client declaration documents — PDFs, images, or Word files. Admin will review them.</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-white/30 bg-white/5 border border-white/10 px-3 py-2 rounded-lg">
                                        <FolderUp className="w-3.5 h-3.5" />
                                        <span className="uppercase tracking-wider font-semibold">{declarations.filter(d => d.status === "pending").length} Pending</span>
                                    </div>
                                </div>

                                {/* Upload Section */}
                                <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 space-y-5">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-2">
                                        <Upload className="w-3.5 h-3.5" />
                                        Drop Documents Here
                                    </h3>

                                    {/* Drag and Drop Zone */}
                                    <div
                                        onDragOver={(e) => { e.preventDefault(); setDeclarationDragOver(true); }}
                                        onDragLeave={() => setDeclarationDragOver(false)}
                                        onDrop={handleDeclarationDrop}
                                        className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 cursor-pointer group ${
                                            declarationDragOver
                                                ? "border-[#E61E32] bg-[#E61E32]/5 scale-[1.01]"
                                                : "border-white/10 hover:border-white/25 hover:bg-white/[0.02]"
                                        }`}
                                        onClick={() => document.getElementById('decl-file-input')?.click()}
                                    >
                                        <input
                                            id="decl-file-input"
                                            type="file"
                                            multiple
                                            accept="image/*,.pdf,.doc,.docx"
                                            className="hidden"
                                            onChange={handleDeclarationFileInput}
                                        />
                                        <div className="flex flex-col items-center gap-3">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                                                declarationDragOver ? "bg-[#E61E32]/20 text-[#E61E32]" : "bg-white/5 text-white/30 group-hover:bg-white/10 group-hover:text-white/60"
                                            }`}>
                                                <FolderUp className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <p className={`text-sm font-semibold transition-colors ${
                                                    declarationDragOver ? "text-[#E61E32]" : "text-white/50 group-hover:text-white/70"
                                                }`}>
                                                    {declarationDragOver ? "Release to drop files" : "Drag & drop files here"}
                                                </p>
                                                <p className="text-xs text-white/25 mt-1">or click to browse — PDF, Images, Word docs • Max 10MB each</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Selected Files Preview */}
                                    {declarationFiles.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">{declarationFiles.length} file{declarationFiles.length > 1 ? 's' : ''} selected</p>
                                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                                {declarationFiles.map((file, i) => (
                                                    <div key={i} className="flex items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className="w-8 h-8 rounded-lg bg-[#E61E32]/10 border border-[#E61E32]/20 flex items-center justify-center shrink-0">
                                                                <FileText className="w-4 h-4 text-[#E61E32]" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-xs font-semibold text-white truncate">{file.name}</p>
                                                                <p className="text-[10px] text-white/30">{(file.size / 1024).toFixed(1)} KB • {file.type.split('/')[1]?.toUpperCase()}</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveDeclarationFile(i)}
                                                            className="text-white/30 hover:text-[#E61E32] transition-colors p-1 rounded-lg hover:bg-[#E61E32]/10 shrink-0"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Metadata Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Client Name <span className="text-white/20">(optional)</span></label>
                                            <input
                                                type="text"
                                                value={declarationClientName}
                                                onChange={(e) => setDeclarationClientName(e.target.value)}
                                                placeholder="e.g. Acme Corp"
                                                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#E61E32]/50 transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Notes <span className="text-white/20">(optional)</span></label>
                                            <input
                                                type="text"
                                                value={declarationNotes}
                                                onChange={(e) => setDeclarationNotes(e.target.value)}
                                                placeholder="Any relevant notes..."
                                                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#E61E32]/50 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Error & Success */}
                                    {declarationError && (
                                        <div className="bg-[#E61E32]/10 border border-[#E61E32]/20 rounded-xl p-3">
                                            <p className="text-xs text-[#E61E32] font-medium">{declarationError}</p>
                                        </div>
                                    )}
                                    {declarationSuccess && (
                                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                                            <p className="text-xs text-green-400 font-medium">{declarationSuccess}</p>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        onClick={handleSubmitDeclarations}
                                        disabled={declarationSubmitting || declarationFiles.length === 0}
                                        className="w-full py-3.5 bg-[#E61E32] hover:bg-[#C81428] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#E61E32]/10"
                                    >
                                        {declarationSubmitting ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                                        ) : (
                                            <><Send className="w-4 h-4" /> Submit {declarationFiles.length > 0 ? `${declarationFiles.length} Declaration${declarationFiles.length > 1 ? 's' : ''}` : 'Declarations'}</>
                                        )}
                                    </button>
                                </div>

                                {/* Submitted Declarations History */}
                                <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 space-y-4">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-2">
                                        <FileText className="w-3.5 h-3.5" />
                                        Submitted Declarations
                                        <span className="ml-auto text-white/20 font-normal normal-case tracking-normal">{declarations.length} total</span>
                                    </h3>

                                    {declarationsLoading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <Loader2 className="w-6 h-6 animate-spin text-white/20" />
                                        </div>
                                    ) : declarations.length === 0 ? (
                                        <div className="text-center py-12 space-y-2">
                                            <FolderUp className="w-10 h-10 text-white/10 mx-auto" />
                                            <p className="text-sm text-white/20">No declarations submitted yet.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {declarations.map((decl) => (
                                                <div key={decl.id} className="flex items-center justify-between gap-4 p-4 bg-white/[0.02] border border-white/8 rounded-xl hover:border-white/15 transition-all">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="w-9 h-9 rounded-xl bg-[#E61E32]/10 border border-[#E61E32]/20 flex items-center justify-center shrink-0">
                                                            <FileText className="w-4 h-4 text-[#E61E32]" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-semibold text-white truncate">{decl.fileName}</p>
                                                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                                                {decl.clientName && (
                                                                    <span className="text-[10px] text-white/40">Client: {decl.clientName}</span>
                                                                )}
                                                                {decl.notes && (
                                                                    <span className="text-[10px] text-white/30 truncate max-w-[160px]">{decl.notes}</span>
                                                                )}
                                                                <span className="text-[10px] text-white/20">{(decl.fileSize / 1024).toFixed(1)} KB</span>
                                                                <span className="text-[10px] text-white/20">{new Date(decl.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="shrink-0">
                                                        {decl.status === "reviewed" ? (
                                                            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                                                                <CheckCheck className="w-3 h-3" /> Reviewed
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 rounded-full">
                                                                <Hourglass className="w-3 h-3" /> Pending
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                </div>
            </div>

            {/* Bottom Navigation Bar (Mobile) */}
            <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#0f0f0f]/95 border-t border-white/5 backdrop-blur-md z-40 flex md:hidden items-center justify-around pb-safe shadow-2xl">
                <button
                    onClick={() => {
                        setActiveTab("overview");
                        setIsMobileMenuOpen(false);
                    }}
                    className={`flex flex-col items-center justify-center gap-1 text-center transition-colors ${
                        activeTab === "overview" && !isMobileMenuOpen ? "text-[#E61E32]" : "text-white/40 hover:text-white"
                    }`}
                >
                    <Globe className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Overview</span>
                </button>
                <button
                    onClick={() => {
                        setActiveTab("tasks");
                        setIsMobileMenuOpen(false);
                    }}
                    className={`flex flex-col items-center justify-center gap-1 text-center transition-colors ${
                        activeTab === "tasks" && !isMobileMenuOpen ? "text-[#E61E32]" : "text-white/40 hover:text-white"
                    }`}
                >
                    <ListTodo className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Tasks</span>
                </button>
                <button
                    onClick={() => {
                        setActiveTab("attendance");
                        setIsMobileMenuOpen(false);
                    }}
                    className={`flex flex-col items-center justify-center gap-1 text-center transition-colors ${
                        activeTab === "attendance" && !isMobileMenuOpen ? "text-[#E61E32]" : "text-white/40 hover:text-white"
                    }`}
                >
                    <Clock className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Attendance</span>
                </button>
                <button
                    onClick={() => {
                        setActiveTab("meetings");
                        setIsMobileMenuOpen(false);
                    }}
                    className={`flex flex-col items-center justify-center gap-1 text-center transition-colors ${
                        activeTab === "meetings" && !isMobileMenuOpen ? "text-[#E61E32]" : "text-white/40 hover:text-white"
                    }`}
                >
                    <Video className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Meetings</span>
                </button>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className={`flex flex-col items-center justify-center gap-1 text-center transition-colors ${
                        isMobileMenuOpen ? "text-[#E61E32]" : "text-white/40 hover:text-white"
                    }`}
                >
                    <Menu className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Menu</span>
                </button>
            </div>

            {/* Sliding Mobile Menu Drawer */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-55 md:hidden flex flex-col justify-end">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    
                    {/* Drawer Content */}
                    <div className="relative bg-[#0f0f0f] border-t border-white/10 rounded-t-2xl p-6 space-y-6 max-h-[80vh] overflow-y-auto z-10 animate-in slide-in-from-bottom duration-300">
                        {/* Drawer Handle */}
                        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto -mt-2 mb-2" />
                        
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-2">Additional Pages</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => {
                                        setActiveTab("documents");
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                        activeTab === "documents"
                                            ? "bg-[#E61E32]/10 border-[#E61E32]/20 text-[#E61E32]"
                                            : "bg-white/[0.02] border-white/5 text-white/70 hover:border-white/10"
                                    }`}
                                >
                                    <FileText className="w-4 h-4" />
                                    <span className="text-xs font-semibold">Documents</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveTab("payrolls");
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                        activeTab === "payrolls"
                                            ? "bg-[#E61E32]/10 border-[#E61E32]/20 text-[#E61E32]"
                                            : "bg-white/[0.02] border-white/5 text-white/70 hover:border-white/10"
                                    }`}
                                >
                                    <CreditCard className="w-4 h-4" />
                                    <span className="text-xs font-semibold">Payrolls</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveTab("leaves");
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                        activeTab === "leaves"
                                            ? "bg-[#E61E32]/10 border-[#E61E32]/20 text-[#E61E32]"
                                            : "bg-white/[0.02] border-white/5 text-white/70 hover:border-white/10"
                                    }`}
                                >
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-xs font-semibold">Leaves</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveTab("settings");
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                        activeTab === "settings"
                                            ? "bg-[#E61E32]/10 border-[#E61E32]/20 text-[#E61E32]"
                                            : "bg-white/[0.02] border-white/5 text-white/70 hover:border-white/10"
                                    }`}
                                >
                                    <User className="w-4 h-4" />
                                    <span className="text-xs font-semibold">Profile Settings</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveTab("community");
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                        activeTab === "community"
                                            ? "bg-[#E61E32]/10 border-[#E61E32]/20 text-[#E61E32]"
                                            : "bg-white/[0.02] border-white/5 text-white/70 hover:border-white/10"
                                    }`}
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    <span className="text-xs font-semibold">Community</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveTab("declarations");
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                        activeTab === "declarations"
                                            ? "bg-[#E61E32]/10 border-[#E61E32]/20 text-[#E61E32]"
                                            : "bg-white/[0.02] border-white/5 text-white/70 hover:border-white/10"
                                    }`}
                                >
                                    <FolderUp className="w-4 h-4" />
                                    <span className="text-xs font-semibold">Declarations</span>
                                </button>
                            </div>
                        </div>

                        {/* User Profile Summary */}
                        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-full bg-[#E61E32]/15 border border-[#E61E32]/25 flex items-center justify-center shrink-0">
                                    <User className="w-4.5 h-4.5 text-[#E61E32]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-white truncate">{employeeInfo?.name}</p>
                                    <p className="text-[10px] text-white/40 uppercase tracking-wider truncate mt-0.5">{employeeInfo?.role || "Team Member"}</p>
                                </div>
                            </div>
                            <span className="flex items-center gap-1 text-[9px] text-white/30 bg-white/5 px-2 py-1 rounded-md">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                Online
                            </span>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                handleLogout();
                            }}
                            className="w-full flex items-center justify-center gap-3 py-3.5 bg-[#E61E32] hover:bg-[#E61E32]/95 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#E61E32]/10"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            )}

            {/* dotlottie player script */}
            <Script
                src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs"
                type="module"
                strategy="afterInteractive"
            />
            <Script
                src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.9.14/dist/dotlottie-wc.js"
                type="module"
                strategy="afterInteractive"
            />

            {/* PORTAL UPDATES POPUP MODAL */}
            {showUpdatesPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
                        onClick={() => {
                            localStorage.setItem("redlix_updates_v2_seen", "true");
                            setShowUpdatesPopup(false);
                        }} 
                    />
                    
                    {/* Modal Content */}
                    <div className="relative bg-[#0a0a0a]/95 border border-white/10 w-full max-w-2xl p-7 rounded-2xl shadow-2xl space-y-6 animate-in zoom-in-95 duration-350 z-10 text-left overflow-hidden">
                        {/* Red Accent line at top */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-[#E61E32]" />

                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 bg-[#E61E32]/10 border border-[#E61E32]/25 text-[#E61E32] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    System Release v2.0
                                </span>
                                <h3 className="text-base font-black uppercase tracking-wider text-white mt-1">What's New in Redlix</h3>
                            </div>
                            <button 
                                onClick={() => {
                                    localStorage.setItem("redlix_updates_v2_seen", "true");
                                    setShowUpdatesPopup(false);
                                }} 
                                className="text-white/40 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-full"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* List of features */}
                        <div className="space-y-5 max-h-[50vh] overflow-y-auto pr-1 scrollbar-thin">
                            {/* Feature 1 */}
                            <div className="flex gap-4 items-start">
                                <div className="w-9 h-9 rounded-lg bg-[#E61E32]/10 border border-[#E61E32]/25 flex items-center justify-center text-[#E61E32] shrink-0 mt-0.5">
                                    <MessageSquare className="w-4 h-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Community Standup Board</h4>
                                    <p className="text-[11px] text-white/50 leading-relaxed font-normal">
                                        We added a new "Community" page to the employee dashboard. Here, you can share the tasks you completed today, what you learned, and your progress. Teammates can see your updates and interact with them.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="flex gap-4 items-start">
                                <div className="w-9 h-9 rounded-lg bg-[#E61E32]/10 border border-[#E61E32]/25 flex items-center justify-center text-[#E61E32] shrink-0 mt-0.5">
                                    <Globe className="w-4 h-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Mobile App Layout</h4>
                                    <p className="text-[11px] text-white/50 leading-relaxed font-normal">
                                        The employee portal is now fully responsive on mobile screens. You can use the bottom tabs and the slide-up menu to visit different pages easily.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="flex gap-4 items-start">
                                <div className="w-9 h-9 rounded-lg bg-[#E61E32]/10 border border-[#E61E32]/25 flex items-center justify-center text-[#E61E32] shrink-0 mt-0.5">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Auto-Punch-Out at 7:30 PM</h4>
                                    <p className="text-[11px] text-white/50 leading-relaxed font-normal">
                                        If you forget to punch out, the website will automatically punch you out at 7:30 PM IST daily. This ensures your logged hours are accurate.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 4 */}
                            <div className="flex gap-4 items-start">
                                <div className="w-9 h-9 rounded-lg bg-[#E61E32]/10 border border-[#E61E32]/25 flex items-center justify-center text-[#E61E32] shrink-0 mt-0.5">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Document Vault Sync</h4>
                                    <p className="text-[11px] text-white/50 leading-relaxed font-normal">
                                        You can now view and download resource files shared by department admins directly in the documents tab.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] text-white/30">You won't see this pop up again.</span>
                            <button
                                type="button"
                                onClick={() => {
                                    localStorage.setItem("redlix_updates_v2_seen", "true");
                                    setShowUpdatesPopup(false);
                                }}
                                className="px-6 py-2.5 bg-[#E61E32] hover:bg-[#C81428] text-white text-[11px] font-black uppercase tracking-widest transition-all rounded-lg"
                            >
                                Let's Go
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

function StatCard({ icon, label, value, sublabel, color }: { icon: React.ReactNode, label: string, value: number, sublabel: string, color: string }) {
    return (
        <div className="bg-white/[0.02] border border-white/5 p-4 space-y-3 hover:border-white/10 transition-colors group rounded-xl">
            <div className={`w-8 h-8 bg-white/5 flex items-center justify-center border border-white/10 rounded-lg ${color}`}>
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
