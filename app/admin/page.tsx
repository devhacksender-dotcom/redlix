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
    Plus,
    Send,
    Loader2,
    ExternalLink,
    MessageSquare,
    Briefcase,
    Globe,
    Clock,
    Trash2,
    Edit2,
    CreditCard,
    FileText,
    AlertCircle,
    ChevronDown,
    ListTodo,
    Video,
    Download,
    Link as LinkIcon,
    X,
    Settings,
    Bell,
    ShieldAlert,
    UserCheck,
    FileSignature,
    UserPlus,
    PenLine,
    FolderUp,
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
    phone?: string;
    company?: string;
    service?: string;
    message: string;
    createdAt: string;
    isRead: boolean;
}

interface Employee {
    id: number;
    name: string;
    email: string;
    role: string;
    password?: string;
    offerLetterLink?: string;
    joinedAt: string;
    phone?: string;
    upiId?: string;
    fatherName?: string;
    mobile?: string;
    altEmail?: string;
    address?: string;
    isDeptAdmin?: boolean;
}

interface SupportTicket {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    createdAt: string;
}

interface Client {
    id: number;
    companyName: string;
    appName?: string;
    clientName: string;
    email: string;
    phone?: string;
    meetingTemplate?: string;
    meetingTime?: string;
    developerName?: string;
    meetingLink?: string;
    createdAt: string;
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

export default function AdminPortal() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"overview" | "inquiries" | "employees" | "attendance" | "tasks" | "support" | "intern-support" | "clients" | "payment-due-sender" | "payment-received-sender" | "meetings" | "documents" | "payrolls" | "leaves" | "alerts" | "settings" | "declarations">("overview");

    // Task management states
    interface Task {
        id: number;
        title: string;
        description?: string;
        status: string;
        deadline?: string;
        employeeId: number;
        createdAt: string;
        employee?: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    }

    // Meeting states
    interface MeetingAttendee {
        id: number;
        employeeId: number;
        employee: { id: number; name: string; email: string; role: string };
    }
    interface Meeting {
        id: number;
        title: string;
        description?: string;
        meetingLead: string;
        meetingLink?: string;
        scheduledAt: string;
        attendees: MeetingAttendee[];
        createdAt: string;
    }
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
    const [showAddMeetingForm, setShowAddMeetingForm] = useState(false);
    const [newMeeting, setNewMeeting] = useState({ title: "", description: "", meetingLead: "", meetingLink: "", scheduledAt: "", attendeeIds: [] as number[] });
    const [meetingsLoading, setMeetingsLoading] = useState(false);

    // Document states
    interface Document {
        id: number;
        title: string;
        description?: string;
        category: string;
        fileUrl: string;
        fileName: string;
        uploadedBy: string;
        createdAt: string;
    }
    const [documents, setDocuments] = useState<Document[]>([]);
    const [showAddDocForm, setShowAddDocForm] = useState(false);
    const [newDoc, setNewDoc] = useState({ title: "", description: "", category: "company", fileUrl: "", fileName: "" });
    const [documentsLoading, setDocumentsLoading] = useState(false);

    // Admin Declarations states
    interface AdminDeclaration {
        id: number;
        fileName: string;
        fileType: string;
        fileSize: number;
        fileData: string;
        clientName?: string;
        notes?: string;
        status: string;
        createdAt: string;
        employee: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    }
    const [adminDeclarations, setAdminDeclarations] = useState<AdminDeclaration[]>([]);
    const [declarationsLoading, setDeclarationsLoading] = useState(false);

    const [tasks, setTasks] = useState<Task[]>([]);
    const [showAddTaskForm, setShowAddTaskForm] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isEditingTask, setIsEditingTask] = useState(false);
    const [newTask, setNewTask] = useState({ title: "", description: "", employeeId: "", deadline: "" });
    const [taskFilter, setTaskFilter] = useState<"all" | "pending" | "in_progress" | "completed">("all");
    const [taskSearchQuery, setTaskSearchQuery] = useState("");
    const [leaveStatusFilter, setLeaveStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
    const [leaveRemarks, setLeaveRemarks] = useState<{ [key: number]: string }>({});

    // Attendance state for selected employee
    interface Attendance {
        id: number;
        employeeId: number;
        punchIn: string;
        punchOut?: string;
        workMinutes: number;
        employee?: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    }
    const [selectedEmployeeAttendance, setSelectedEmployeeAttendance] = useState<Attendance[]>([]);
    const [loadingAttendance, setLoadingAttendance] = useState(false);

    // Global attendance states
    const [globalAttendance, setGlobalAttendance] = useState<Attendance[]>([]);
    const [globalAttendanceLoading, setGlobalAttendanceLoading] = useState(false);

    // Payment Due Sender Form State
    const [paymentClientId, setPaymentClientId] = useState<number | "">("");
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentDueDate, setPaymentDueDate] = useState("");
    const [paymentInvoiceFile, setPaymentInvoiceFile] = useState<{ name: string; type: string; base64: string } | null>(null);
    const [paymentSendStatus, setPaymentSendStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [paymentErrorMessage, setPaymentErrorMessage] = useState("");

    // Payment Received Sender Form State
    const [receivedClientId, setReceivedClientId] = useState<number | "">("");
    const [receivedAmount, setReceivedAmount] = useState("");
    const [receivedDate, setReceivedDate] = useState("");
    const [receivedTransactionId, setReceivedTransactionId] = useState("");
    const [receivedReceiptFile, setReceivedReceiptFile] = useState<{ name: string; type: string; base64: string } | null>(null);
    const [receivedSendStatus, setReceivedSendStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [receivedErrorMessage, setReceivedErrorMessage] = useState("");
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [internTickets, setInternTickets] = useState<InternSupport[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [selectedInternTicket, setSelectedInternTicket] = useState<InternSupport | null>(null);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [isEditingClient, setIsEditingClient] = useState(false);
    const [isEditingEmployee, setIsEditingEmployee] = useState(false);
    const [isPaymentsOpen, setIsPaymentsOpen] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [attendanceSubView, setAttendanceSubView] = useState<"logs" | "today">("logs");

    // Employee Form State
    const [showAddForm, setShowAddForm] = useState(false);
    const [showOnboardForm, setShowOnboardForm] = useState(false);
    const [newEmployee, setNewEmployee] = useState({ name: "", email: "", role: "", password: "", offerLetterLink: "", isDeptAdmin: false });
    const [newOnboardEmployee, setNewOnboardEmployee] = useState({ name: "", email: "", role: "", isDeptAdmin: false });

    // Client Form State
    const [showAddClientForm, setShowAddClientForm] = useState(false);
    const [newClient, setNewClient] = useState({
        companyName: "",
        appName: "",
        clientName: "",
        email: "",
        phone: "",
        meetingTemplate: "Discovery Call",
        meetingTime: "",
        developerName: "",
        meetingLink: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sendEmailStatus, setSendEmailStatus] = useState<{ id: number, action?: string, status: 'idle' | 'sending' | 'success' | 'error' } | null>(null);
    
    // Alert Sender states
    const [alertType, setAlertType] = useState<"dashboard_access_pending" | "profile_pending" | "terms_update" | "client_info_update" | "new_client_welcome" | "custom">("dashboard_access_pending");
    const [alertSelectedEmployeeIds, setAlertSelectedEmployeeIds] = useState<number[]>([]);
    const [alertSelectedClientIds, setAlertSelectedClientIds] = useState<number[]>([]);
    const [alertSingleClientId, setAlertSingleClientId] = useState<number | "">("" );
    const [alertCustomRecipients, setAlertCustomRecipients] = useState("");
    const [alertCustomMessage, setAlertCustomMessage] = useState("");
    const [alertCustomSubject, setAlertCustomSubject] = useState("");
    const [alertCustomBody, setAlertCustomBody] = useState("");
    const [alertEffectiveDate, setAlertEffectiveDate] = useState("");
    const [alertSendStatus, setAlertSendStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [alertSendMessage, setAlertSendMessage] = useState("");
    const [alertSelectAllClients, setAlertSelectAllClients] = useState(false);

    // Reset DB states
    const [resetInput, setResetInput] = useState("");
    const [resetLoading, setResetLoading] = useState(false);

    // Payroll Management States
    interface AdminPayroll {
        id: number;
        employeeId: number;
        month: string;
        amount: number;
        status: string;
        upiId?: string;
        paidAt?: string;
        createdAt: string;
        employee: {
            id: number;
            name: string;
            email: string;
            role: string;
            upiId?: string;
        };
    }
    const [payrolls, setPayrolls] = useState<AdminPayroll[]>([]);
    const [payrollsLoading, setPayrollsLoading] = useState(false);
    const [selectedPayroll, setSelectedPayroll] = useState<AdminPayroll | null>(null);
    const [showAddPayrollForm, setShowAddPayrollForm] = useState(false);
    const [newPayroll, setNewPayroll] = useState({
        employeeId: "",
        month: "",
        amount: "",
        status: "pending"
    });

    // Leave Management States
    interface AdminLeave {
        id: number;
        employeeId: number;
        startDate: string;
        endDate: string;
        type: string;
        reason: string;
        status: string;
        adminNotes?: string;
        createdAt: string;
        employee: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    }
    const [leaves, setLeaves] = useState<AdminLeave[]>([]);
    const [leavesLoading, setLeavesLoading] = useState(false);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/tasks");
            const data = await res.json();
            if (data.success) {
                setTasks(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    const getAnalyticsData = () => {
        const now = new Date();
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({
                label: d.toLocaleString("default", { month: "short" }) + " " + d.getFullYear().toString().slice(-2),
                year: d.getFullYear(),
                monthVal: d.getMonth(),
            });
        }
        
        const employeeData = months.map(m => {
            const endOfMonth = new Date(m.year, m.monthVal + 1, 0, 23, 59, 59, 999);
            return employees.filter(emp => {
                const joined = emp.joinedAt ? new Date(emp.joinedAt) : null;
                if (!joined || isNaN(joined.getTime())) return false;
                return joined <= endOfMonth;
            }).length;
        });

        const amountData = months.map(m => {
            return payrolls.filter(p => {
                const pDate = p.createdAt ? new Date(p.createdAt) : null;
                if (!pDate || isNaN(pDate.getTime())) return false;
                return pDate.getFullYear() === m.year && pDate.getMonth() === m.monthVal;
            }).reduce((sum, p) => sum + (p.amount || 0), 0);
        });

        const hoursData = months.map(m => {
            const totalMinutes = globalAttendance.filter(a => {
                const attDate = a.punchIn ? new Date(a.punchIn) : null;
                if (!attDate || isNaN(attDate.getTime())) return false;
                return attDate.getFullYear() === m.year && attDate.getMonth() === m.monthVal;
            }).reduce((sum, a) => sum + (a.workMinutes || 0), 0);
            return Math.round((totalMinutes / 60) * 10) / 10;
        });

        return {
            labels: months.map(m => m.label),
            employees: employeeData,
            amount: amountData,
            hours: hoursData,
        };
    };

    useEffect(() => {
        if (activeTab === "overview") {
            fetchAllData();
        } else if (activeTab === "inquiries") {
            fetchInquiries();
        } else if (activeTab === "employees") {
            fetchEmployees();
        } else if (activeTab === "tasks") {
            fetchTasks();
            fetchEmployees(); // needed to assign tasks
        } else if (activeTab === "support") {
            fetchTickets();
        } else if (activeTab === "intern-support") {
            fetchInternTickets();
        } else if (activeTab === "meetings") {
            fetchMeetings();
            fetchEmployees();
        } else if (activeTab === "documents") {
            fetchDocuments();
        } else if (activeTab === "declarations") {
            fetchAdminDeclarations();
        } else if (activeTab === "attendance") {
            fetchGlobalAttendance();
            fetchEmployees();
        } else if (activeTab === "payrolls") {
            fetchPayrolls();
            fetchEmployees(); // needed to allocate payrolls
        } else if (activeTab === "leaves") {
            fetchLeaves();
        } else if (activeTab === "alerts") {
            fetchEmployees();
            fetchClients();
        } else {
            fetchClients();
        }
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === "payment-due-sender" || activeTab === "payment-received-sender" || activeTab === "payrolls") {
            setIsPaymentsOpen(true);
        }
        if (activeTab === "inquiries" || activeTab === "support" || activeTab === "intern-support") {
            setIsSupportOpen(true);
        }
    }, [activeTab]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchInquiries(),
                fetchEmployees(),
                fetchTickets(),
                fetchInternTickets(),
                fetchClients(),
                fetchTasks(),
                fetchMeetings(),
                fetchDocuments(),
                fetchGlobalAttendance(),
                fetchPayrolls(),
                fetchLeaves()
            ]);
        } catch (error) {
            console.error("Failed to fetch all data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMeetings = async () => {
        setMeetingsLoading(true);
        try {
            const res = await fetch("/api/admin/meetings");
            const data = await res.json();
            if (data.success) setMeetings(data.data);
        } catch (error) {
            console.error("Failed to fetch meetings:", error);
        } finally {
            setMeetingsLoading(false);
        }
    };

    const handleAddMeeting = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/admin/meetings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newMeeting)
            });
            const data = await res.json();
            if (data.success) {
                setMeetings(prev => [data.data, ...prev]);
                setShowAddMeetingForm(false);
                setNewMeeting({ title: "", description: "", meetingLead: "", meetingLink: "", scheduledAt: "", attendeeIds: [] });
            } else {
                alert(data.message || "Failed to create meeting");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteMeeting = async (id: number) => {
        if (!confirm("Delete this meeting?")) return;
        try {
            const res = await fetch(`/api/admin/meetings/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                setMeetings(prev => prev.filter(m => m.id !== id));
                if (selectedMeeting?.id === id) setSelectedMeeting(null);
            }
        } catch (err) { console.error(err); }
    };

    const fetchGlobalAttendance = async () => {
        setGlobalAttendanceLoading(true);
        try {
            const res = await fetch("/api/admin/attendance");
            const data = await res.json();
            if (data.success) setGlobalAttendance(data.data);
        } catch (error) {
            console.error("Failed to fetch global attendance:", error);
        } finally {
            setGlobalAttendanceLoading(false);
        }
    };

    const fetchDocuments = async () => {
        setDocumentsLoading(true);
        try {
            const res = await fetch("/api/admin/documents");
            const data = await res.json();
            if (data.success) setDocuments(data.data);
        } catch (error) {
            console.error("Failed to fetch documents:", error);
        } finally {
            setDocumentsLoading(false);
        }
    };

    const fetchAdminDeclarations = async () => {
        setDeclarationsLoading(true);
        try {
            const res = await fetch("/api/admin/declarations");
            const data = await res.json();
            if (data.success) setAdminDeclarations(data.data);
        } catch (error) {
            console.error("Failed to fetch declarations:", error);
        } finally {
            setDeclarationsLoading(false);
        }
    };

    const handleReviewDeclaration = async (id: number, status: "pending" | "reviewed") => {
        try {
            const res = await fetch(`/api/admin/declarations/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (data.success) {
                setAdminDeclarations(prev => prev.map(d => d.id === id ? { ...d, status } : d));
            } else {
                alert(data.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Review declaration error:", error);
        }
    };

    const handleDeleteDeclaration = async (id: number) => {
        if (!confirm("Delete this declaration?")) return;
        try {
            const res = await fetch(`/api/admin/declarations/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                setAdminDeclarations(prev => prev.filter(d => d.id !== id));
            } else {
                alert(data.message || "Failed to delete declaration");
            }
        } catch (error) {
            console.error("Delete declaration error:", error);
        }
    };

    const handleAddDocument = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/admin/documents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newDoc)
            });
            const data = await res.json();
            if (data.success) {
                setDocuments(prev => [data.data, ...prev]);
                setShowAddDocForm(false);
                setNewDoc({ title: "", description: "", category: "company", fileUrl: "", fileName: "" });
            } else {
                alert(data.message || "Failed to add document");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteDocument = async (id: number) => {
        if (!confirm("Delete this document?")) return;
        try {
            const res = await fetch(`/api/admin/documents/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) setDocuments(prev => prev.filter(d => d.id !== id));
        } catch (err) { console.error(err); }
    };

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/inquiries");
            const data = await res.json();
            if (data.success) {
                setInquiries(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch inquiries:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/employees");
            const data = await res.json();
            if (data.success) {
                setEmployees(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch employees:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPayrolls = async () => {
        setPayrollsLoading(true);
        try {
            const res = await fetch("/api/admin/payrolls");
            const data = await res.json();
            if (data.success) setPayrolls(data.data);
        } catch (error) {
            console.error("Failed to fetch payrolls:", error);
        } finally {
            setPayrollsLoading(false);
        }
    };

    const handleAllocatePayroll = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/admin/payrolls", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPayroll)
            });
            const data = await res.json();
            if (data.success) {
                setPayrolls([data.data, ...payrolls]);
                setShowAddPayrollForm(false);
                setNewPayroll({ employeeId: "", month: "", amount: "", status: "pending" });
            } else {
                alert(data.message || "Failed to allocate payroll");
            }
        } catch (error) {
            console.error("Failed to allocate payroll:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMarkPayrollPaid = async (payrollId: number) => {
        try {
            const res = await fetch(`/api/admin/payrolls/${payrollId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "paid" })
            });
            const data = await res.json();
            if (data.success) {
                setPayrolls(prev => prev.map(p => p.id === payrollId ? data.data : p));
            } else {
                alert(data.message || "Failed to update payroll status");
            }
        } catch (error) {
            console.error("Failed to update payroll status:", error);
        }
    };

    const handleDeletePayroll = async (payrollId: number) => {
        if (!confirm("Are you sure you want to delete this payroll record?")) return;
        try {
            const res = await fetch(`/api/admin/payrolls/${payrollId}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                setPayrolls(prev => prev.filter(p => p.id !== payrollId));
            } else {
                alert(data.message || "Failed to delete payroll record");
            }
        } catch (error) {
            console.error("Failed to delete payroll:", error);
        }
    };

    const fetchLeaves = async () => {
        setLeavesLoading(true);
        try {
            const res = await fetch("/api/admin/leaves");
            const data = await res.json();
            if (data.success) setLeaves(data.data);
        } catch (error) {
            console.error("Failed to fetch leaves:", error);
        } finally {
            setLeavesLoading(false);
        }
    };

    const handleReviewLeave = async (leaveId: number, status: "approved" | "rejected", adminNotes: string) => {
        try {
            const res = await fetch(`/api/admin/leaves/${leaveId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status, adminNotes })
            });
            const data = await res.json();
            if (data.success) {
                setLeaves(prev => prev.map(l => l.id === leaveId ? data.data : l));
                alert(`Leave request successfully ${status}!`);
            } else {
                alert(data.message || "Failed to update leave status");
            }
        } catch (error) {
            console.error("Failed to review leave:", error);
            alert("A connection error occurred. Please try again.");
        }
    };

    const handleMasterReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (resetInput !== "RESET") {
            alert("Please type RESET to confirm");
            return;
        }

        if (!confirm("CRITICAL WARNING: Are you absolutely sure you want to perform a factory reset? This will delete all employees, payrolls, tasks, clients, and meetings permanently!")) {
            return;
        }

        setResetLoading(true);
        try {
            const res = await fetch("/api/admin/reset", {
                method: "POST"
            });
            const data = await res.json();
            if (data.success) {
                alert(data.message || "Factory reset complete!");
                window.location.reload();
            } else {
                alert(data.message || "Failed to perform factory reset");
            }
        } catch (error) {
            console.error("Master reset error:", error);
            alert("A connection error occurred. Please try again.");
        } finally {
            setResetLoading(false);
        }
    };

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/support");
            const data = await res.json();
            if (data.success) {
                setTickets(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchInternTickets = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/intern-support");
            const data = await res.json();
            if (data.success) {
                setInternTickets(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch intern tickets:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/clients");
            const data = await res.json();
            if (data.success) {
                setClients(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch clients:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployeeAttendance = async (employeeId: number) => {
        setLoadingAttendance(true);
        try {
            const res = await fetch(`/api/admin/employees/${employeeId}/attendance`);
            const data = await res.json();
            if (data.success) {
                setSelectedEmployeeAttendance(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch attendance:", err);
        } finally {
            setLoadingAttendance(false);
        }
    };

    useEffect(() => {
        if (selectedEmployee) {
            fetchEmployeeAttendance(selectedEmployee.id);
        } else {
            setSelectedEmployeeAttendance([]);
        }
    }, [selectedEmployee]);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/admin/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTask),
            });
            const data = await res.json();
            if (data.success) {
                setTasks([data.data, ...tasks]);
                setShowAddTaskForm(false);
                setNewTask({ title: "", description: "", employeeId: "", deadline: "" });
            } else {
                alert(data.message || "Failed to add task");
            }
        } catch (error) {
            console.error("Failed to add task:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTask) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/admin/tasks/${selectedTask.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedTask),
            });
            const data = await res.json();
            if (data.success) {
                setTasks(tasks.map(t => t.id === selectedTask.id ? data.data : t));
                setIsEditingTask(false);
                setSelectedTask(data.data);
            } else {
                alert(data.message || "Failed to update task");
            }
        } catch (error) {
            console.error("Failed to update task:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTask = async (id: number) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        try {
            const res = await fetch(`/api/admin/tasks/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                setTasks(prev => prev.filter(t => t.id !== id));
                if (selectedTask?.id === id) setSelectedTask(null);
            } else {
                alert(data.message || "Failed to delete task");
            }
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    };

    const handleUpdateTaskStatus = async (id: number, status: string) => {
        try {
            const res = await fetch(`/api/admin/tasks/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (data.success) {
                setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
                if (selectedTask?.id === id) {
                    setSelectedTask(prev => prev ? { ...prev, status } : null);
                }
            } else {
                alert(data.message || "Failed to update task status");
            }
        } catch (error) {
            console.error("Failed to update task status:", error);
        }
    };

    const handleUpdateTicketStatus = async (id: number, status: string) => {
        try {
            const res = await fetch(`/api/admin/support/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (data.success) {
                setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
                if (selectedTicket?.id === id) {
                    setSelectedTicket(prev => prev ? { ...prev, status } : null);
                }
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const handleAddEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/admin/employees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newEmployee),
            });
            const data = await res.json();
            if (data.success) {
                setEmployees([data.data, ...employees]);
                setShowAddForm(false);
                setNewEmployee({ name: "", email: "", role: "", password: "", offerLetterLink: "", isDeptAdmin: false });
            } else {
                alert(data.message || "Failed to add employee");
            }
        } catch (error) {
            console.error("Failed to add employee:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOnboardEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/admin/employees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newOnboardEmployee),
            });
            const data = await res.json();
            if (data.success) {
                setEmployees([data.data, ...employees]);
                setShowOnboardForm(false);
                setNewOnboardEmployee({ name: "", email: "", role: "", isDeptAdmin: false });
                sendOnboardingEmail(data.data.id);
            } else {
                alert(data.message || "Failed to onboard employee");
            }
        } catch (error) {
            console.error("Failed to onboard employee:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteEmployee = async (id: number) => {
        if (!confirm("Are you sure you want to delete this employee?")) return;
        try {
            const res = await fetch(`/api/admin/employees/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                setEmployees(prev => prev.filter(emp => emp.id !== id));
                if (selectedEmployee?.id === id) setSelectedEmployee(null);
            } else {
                alert(data.message || "Failed to delete employee");
            }
        } catch (error) {
            console.error("Failed to delete employee:", error);
        }
    };

    const handleUpdateEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEmployee) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/admin/employees/${selectedEmployee.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedEmployee),
            });
            const data = await res.json();
            if (data.success) {
                setEmployees(employees.map(emp => emp.id === selectedEmployee.id ? data.data : emp));
                setIsEditingEmployee(false);
            } else {
                alert(data.message || "Failed to update employee");
            }
        } catch (error) {
            console.error("Failed to update employee:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddClient = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/admin/clients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newClient),
            });
            const data = await res.json();
            if (data.success) {
                setClients([data.data, ...clients]);
                setShowAddClientForm(false);
                setNewClient({
                    companyName: "",
                    appName: "",
                    clientName: "",
                    email: "",
                    phone: "",
                    meetingTemplate: "Discovery Call",
                    meetingTime: "",
                    developerName: "",
                    meetingLink: ""
                });
            }
        } catch (error) {
            console.error("Failed to add client:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClient = async (id: number) => {
        if (!confirm("Are you sure you want to delete this client?")) return;
        try {
            const res = await fetch(`/api/admin/clients/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                setClients(prev => prev.filter(c => c.id !== id));
                if (selectedClient?.id === id) setSelectedClient(null);
            }
        } catch (error) {
            console.error("Failed to delete client:", error);
        }
    };

    const handleUpdateClient = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClient) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/admin/clients/${selectedClient.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedClient),
            });
            const data = await res.json();
            if (data.success) {
                setClients(clients.map(c => c.id === selectedClient.id ? data.data : c));
                setIsEditingClient(false);
            }
        } catch (error) {
            console.error("Failed to update client:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const sendMeetingEmail = async (clientId: number) => {
        setSendEmailStatus({ id: clientId, status: 'sending' });
        try {
            const res = await fetch("/api/admin/clients/send-meeting", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ clientId }),
            });
            const data = await res.json();
            if (data.success) {
                setSendEmailStatus({ id: clientId, status: 'success' });
                setTimeout(() => setSendEmailStatus(null), 3000);
            } else {
                setSendEmailStatus({ id: clientId, status: 'error' });
            }
        } catch (error) {
            console.error("Failed to send meeting email:", error);
            setSendEmailStatus({ id: clientId, status: 'error' });
        }
    };

    const sendOfferLetter = async (employeeId: number) => {
        setSendEmailStatus({ id: employeeId, action: 'offer', status: 'sending' });
        try {
            const res = await fetch("/api/admin/employees/send-offer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ employeeId }),
            });
            const data = await res.json();
            if (data.success) {
                setSendEmailStatus({ id: employeeId, action: 'offer', status: 'success' });
                setTimeout(() => setSendEmailStatus(null), 3000);
            } else {
                setSendEmailStatus({ id: employeeId, action: 'offer', status: 'error' });
            }
        } catch (error) {
            console.error("Failed to send email:", error);
            setSendEmailStatus({ id: employeeId, action: 'offer', status: 'error' });
        }
    };

    const sendOnboardingEmail = async (employeeId: number) => {
        setSendEmailStatus({ id: employeeId, action: 'onboarding', status: 'sending' });
        try {
            const res = await fetch("/api/admin/employees/send-onboarding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ employeeId }),
            });
            const data = await res.json();
            if (data.success) {
                setSendEmailStatus({ id: employeeId, action: 'onboarding', status: 'success' });
                setTimeout(() => setSendEmailStatus(null), 3000);
            } else {
                setSendEmailStatus({ id: employeeId, action: 'onboarding', status: 'error' });
            }
        } catch (error) {
            console.error("Failed to send onboarding email:", error);
            setSendEmailStatus({ id: employeeId, action: 'onboarding', status: 'error' });
        }
    };

    const handleSendPaymentDue = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!paymentClientId || !paymentAmount || !paymentDueDate) {
            alert("Please fill in all required fields.");
            return;
        }
        setPaymentSendStatus('sending');
        setPaymentErrorMessage("");

        try {
            const res = await fetch("/api/admin/clients/send-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clientId: Number(paymentClientId),
                    amount: paymentAmount,
                    dueDate: paymentDueDate,
                    invoiceFile: paymentInvoiceFile,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setPaymentSendStatus('success');
                // Reset form values on success
                setPaymentClientId("");
                setPaymentAmount("");
                setPaymentDueDate("");
                setPaymentInvoiceFile(null);
                setTimeout(() => setPaymentSendStatus('idle'), 4000);
            } else {
                setPaymentSendStatus('error');
                setPaymentErrorMessage(data.message || "Failed to send payment due notification.");
            }
        } catch (error) {
            console.error("Failed to send payment due notification:", error);
            setPaymentSendStatus('error');
            setPaymentErrorMessage("An error occurred. Please try again.");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            alert("Only PDF files are supported.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPaymentInvoiceFile({
                name: file.name,
                type: file.type,
                base64: reader.result as string,
            });
        };
        reader.readAsDataURL(file);
    };

    const handleSendPaymentReceived = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!receivedClientId || !receivedAmount || !receivedDate) {
            alert("Please fill in all required fields.");
            return;
        }
        setReceivedSendStatus('sending');
        setReceivedErrorMessage("");

        try {
            const res = await fetch("/api/admin/clients/send-receipt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clientId: Number(receivedClientId),
                    amount: receivedAmount,
                    paymentDate: receivedDate,
                    transactionId: receivedTransactionId || undefined,
                    receiptFile: receivedReceiptFile,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setReceivedSendStatus('success');
                // Reset form values on success
                setReceivedClientId("");
                setReceivedAmount("");
                setReceivedDate("");
                setReceivedTransactionId("");
                setReceivedReceiptFile(null);
                setTimeout(() => setReceivedSendStatus('idle'), 4000);
            } else {
                setReceivedSendStatus('error');
                setReceivedErrorMessage(data.message || "Failed to send payment received notification.");
            }
        } catch (error) {
            console.error("Failed to send payment received notification:", error);
            setReceivedSendStatus('error');
            setReceivedErrorMessage("An error occurred. Please try again.");
        }
    };

    const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            alert("Only PDF files are supported.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setReceivedReceiptFile({
                name: file.name,
                type: file.type,
                base64: reader.result as string,
            });
        };
        reader.readAsDataURL(file);
    };

    const handleLogout = async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
    };

    const markAsRead = async (id: number) => {
        try {
            await fetch(`/api/admin/inquiries/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isRead: true })
            });
            setInquiries(prev => prev.map(inv => inv.id === id ? { ...inv, isRead: true } : inv));
            if (selectedInquiry?.id === id) {
                setSelectedInquiry(prev => prev ? { ...prev, isRead: true } : null);
            }
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const filteredInquiries = inquiries.filter(inv =>
        inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.phone && emp.phone.includes(searchQuery)) ||
        (emp.upiId && emp.upiId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (emp.mobile && emp.mobile.includes(searchQuery))
    );

    const filteredTickets = tickets.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredClients = clients.filter(c =>
        c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.appName && c.appName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const filteredTasks = tasks.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (t.employee && t.employee.name.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesFilter = taskFilter === "all" || t.status === taskFilter;
        return matchesSearch && matchesFilter;
    });

    const analyticsData = activeTab === "overview" ? getAnalyticsData() : null;

    return (
        <main className="h-screen bg-[#0a0a0a] text-white flex font-sans overflow-hidden">
            {/* Simple Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-[#0f0f0f] flex flex-col p-6 space-y-8 shrink-0 h-full">
                <div className="px-4 space-y-4">
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
                            Admin
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-white/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span>Online</span>
                    </div>
                </div>

                <nav className="flex-grow space-y-1">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'overview' ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <Globe className="w-4 h-4" />
                        Overview
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <div className="space-y-1">
                        <button
                            onClick={() => setIsSupportOpen(!isSupportOpen)}
                            className={`w-full flex items-center justify-between text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${(activeTab === 'inquiries' || activeTab === 'support' || activeTab === 'intern-support')
                                ? 'text-[#E61E32] bg-[#E61E32]/5 border-l-2 border-[#E61E32] pl-[14px]'
                                : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <MessageSquare className="w-4 h-4" />
                                <span>Support</span>
                            </div>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isSupportOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isSupportOpen && (
                            <div className="pl-4 space-y-1 mt-1 animate-in slide-in-from-top-1 duration-150">
                                <button
                                    onClick={() => setActiveTab("inquiries")}
                                    className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2 text-xs font-medium transition-all duration-200 rounded-none ${activeTab === 'inquiries'
                                        ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]'
                                        : 'text-white/40 hover:text-white hover:bg-white/5 hover:pl-5'
                                        }`}
                                >
                                    <div className="w-1 h-1 rounded-full bg-current animate-pulse" />
                                    Inquiries
                                </button>
                                <button
                                    onClick={() => setActiveTab("intern-support")}
                                    className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2 text-xs font-medium transition-all duration-200 rounded-none ${activeTab === 'intern-support'
                                        ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]'
                                        : 'text-white/40 hover:text-white hover:bg-white/5 hover:pl-5'
                                        }`}
                                >
                                    <div className="w-1 h-1 rounded-full bg-current animate-pulse" />
                                    Intern Support
                                </button>
                                <button
                                    onClick={() => setActiveTab("support")}
                                    className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2 text-xs font-medium transition-all duration-200 rounded-none ${activeTab === 'support'
                                        ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]'
                                        : 'text-white/40 hover:text-white hover:bg-white/5 hover:pl-5'
                                        }`}
                                >
                                    <div className="w-1 h-1 rounded-full bg-current animate-pulse" />
                                    Support Tickets
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("employees")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'employees' ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <Users className="w-4 h-4" />
                        Employees
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
                        onClick={() => setActiveTab("tasks")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'tasks' ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <ListTodo className="w-4 h-4" />
                        Tasks
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("clients")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'clients' ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <Briefcase className="w-4 h-4" />
                        Clients
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
                        onClick={() => setActiveTab("declarations")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'declarations' ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <FolderUp className="w-4 h-4" />
                        Declarations
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("leaves")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'leaves' ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <Calendar className="w-4 h-4" />
                        Leaves
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <div className="space-y-1">
                        <button
                            onClick={() => setIsPaymentsOpen(!isPaymentsOpen)}
                            className={`w-full flex items-center justify-between text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${(activeTab === 'payment-due-sender' || activeTab === 'payment-received-sender' || activeTab === 'payrolls')
                                ? 'text-[#E61E32] bg-[#E61E32]/5 border-l-2 border-[#E61E32] pl-[14px]'
                                : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <CreditCard className="w-4 h-4" />
                                <span>Payments</span>
                            </div>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isPaymentsOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isPaymentsOpen && (
                            <div className="pl-4 space-y-1 mt-1 animate-in slide-in-from-top-1 duration-150">
                                <button
                                    onClick={() => setActiveTab("payment-due-sender")}
                                    className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2 text-xs font-medium transition-all duration-200 rounded-none ${activeTab === 'payment-due-sender'
                                        ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]'
                                        : 'text-white/40 hover:text-white hover:bg-white/5 hover:pl-5'
                                        }`}
                                >
                                    <div className="w-1 h-1 rounded-full bg-current animate-pulse" />
                                    Due Mail Sender
                                </button>
                                <button
                                    onClick={() => setActiveTab("payment-received-sender")}
                                    className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2 text-xs font-medium transition-all duration-200 rounded-none ${activeTab === 'payment-received-sender'
                                        ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]'
                                        : 'text-white/40 hover:text-white hover:bg-white/5 hover:pl-5'
                                        }`}
                                >
                                    <div className="w-1 h-1 rounded-full bg-current animate-pulse" />
                                    Payment Received Sender
                                </button>
                                <button
                                    onClick={() => setActiveTab("payrolls")}
                                    className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2 text-xs font-medium transition-all duration-200 rounded-none ${activeTab === 'payrolls'
                                        ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]'
                                        : 'text-white/40 hover:text-white hover:bg-white/5 hover:pl-5'
                                        }`}
                                >
                                    <div className="w-1 h-1 rounded-full bg-current animate-pulse" />
                                    Payrolls
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("alerts")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'alerts' ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <Bell className="w-4 h-4" />
                        Alert Sender
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("settings")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'settings' ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </button>
                </nav>

                <div className="h-[1px] bg-white/5" />

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 bg-[#E61E32] hover:bg-[#E61E32]/90 text-white transition-all text-sm font-semibold shadow-lg shadow-[#E61E32]/10 rounded-none"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <div className="flex-grow p-8 overflow-y-auto h-full">
                <div className={`${activeTab === 'attendance' ? 'max-w-none' : 'max-w-7xl'} mx-auto space-y-8 h-full flex flex-col w-full`}>
                    {/* Header */}
                    <div className="flex justify-between items-center bg-white/[0.02] p-6 border border-white/5 shrink-0">
                        <div>
                            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-white/30 mb-1.5">
                                <span>Admin</span>
                                <span className="text-white/10 font-normal">/</span>
                                <span className="text-[#E61E32]">
                                    {activeTab === "overview" ? "Overview" :
                                        activeTab === "inquiries" ? "Inquiries" :
                                            activeTab === "employees" ? "Employees" :
                                                activeTab === "attendance" ? "Attendance" :
                                                    activeTab === "tasks" ? "Tasks" :
                                                        activeTab === "support" ? "Support" :
                                                            activeTab === "intern-support" ? "Intern Support" :
                                                                activeTab === "clients" ? "Clients" :
                                                                    activeTab === "meetings" ? "Meetings" :
                                                                        activeTab === "documents" ? "Documents" :
                                                                            activeTab === "declarations" ? "Declarations" :
                                                                            activeTab === "payrolls" ? "Payrolls" :
                                                                                activeTab === "leaves" ? "Leaves" :
                                                                                    activeTab === "settings" ? "Settings" :
                                                                                        activeTab === "payment-due-sender" ? "Due Mail Sender" : "Received Mail Sender"}
                                </span>
                            </div>
                            <h2 className="text-xl font-semibold text-white tracking-tight">
                                {activeTab === "overview" ? "Dashboard overview" :
                                    activeTab === "inquiries" ? "Inquiry management" :
                                        activeTab === "employees" ? "Employee portal" :
                                            activeTab === "attendance" ? "Employee attendance logs" :
                                                activeTab === "tasks" ? "Task management" :
                                                    activeTab === "support" ? "Support system" :
                                                        activeTab === "intern-support" ? "Intern support system" :
                                                            activeTab === "clients" ? "Client management" :
                                                                activeTab === "meetings" ? "Meeting management" :
                                                                    activeTab === "documents" ? "Document vault" :
                                                                        activeTab === "payrolls" ? "Payroll allocation" :
                                                                            activeTab === "leaves" ? "Leave Requests" :
                                                                                activeTab === "settings" ? "System Settings" :
                                                                                    activeTab === "payment-due-sender" ? "Payment Due Sender" : "Payment Received Sender"}
                            </h2>
                            <p className="text-xs text-white/30 mt-0.5">
                                {activeTab === "overview" ? "real-time system metrics and activity" :
                                    activeTab === "inquiries" ? "view and respond to incoming messages" :
                                        activeTab === "support" ? "manage and resolve technical issues" :
                                            activeTab === "intern-support" ? "manage intern technical and portal issues" :
                                                activeTab === "employees" ? "manage organization structure" :
                                                    activeTab === "attendance" ? "monitor employee check-in and check-out logs" :
                                                        activeTab === "tasks" ? "assign and track tasks for team members" :
                                                            activeTab === "clients" ? "monitor client projects and meetings" :
                                                                activeTab === "meetings" ? "schedule and manage internal employee meetings" :
                                                                    activeTab === "documents" ? "upload and manage company and client documents" :
                                                                        activeTab === "declarations" ? "review employee-submitted client declaration documents" :
                                                                        activeTab === "payrolls" ? "manage, allocate and track employee monthly payouts" :
                                                                            activeTab === "leaves" ? "review, approve or reject employee leave submissions" :
                                                                                activeTab === "settings" ? "manage system controls and master settings" :
                                                                                    activeTab === "payment-due-sender" ? "send billing notices to registered clients" : "send payment receipts to registered clients"}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            {activeTab === "employees" && (
                                <>
                                    <button
                                        onClick={() => { setShowAddForm(!showAddForm); setShowOnboardForm(false); }}
                                        className="flex items-center gap-2 bg-[#E61E32] hover:bg-[#E61E32]/80 text-white px-4 py-2 text-xs font-semibold transition-colors rounded-none"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add employee
                                    </button>
                                    <button
                                        onClick={() => { setShowOnboardForm(!showOnboardForm); setShowAddForm(false); }}
                                        className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 text-xs font-semibold transition-colors rounded-none"
                                    >
                                        <Users className="w-4 h-4" />
                                        Onboard employee
                                    </button>
                                </>
                            )}
                            {activeTab === "tasks" && (
                                <button
                                    onClick={() => { setShowAddTaskForm(!showAddTaskForm); setIsEditingTask(false); setSelectedTask(null); }}
                                    className="flex items-center gap-2 bg-[#E61E32] hover:bg-[#E61E32]/80 text-white px-4 py-2 text-xs font-semibold transition-colors rounded-none"
                                >
                                    <Plus className="w-4 h-4" />
                                    Assign Task
                                </button>
                            )}
                            {activeTab === "meetings" && (
                                <button
                                    onClick={() => setShowAddMeetingForm(!showAddMeetingForm)}
                                    className="flex items-center gap-2 bg-[#E61E32] hover:bg-[#E61E32]/80 text-white px-4 py-2 text-xs font-semibold transition-colors rounded-none"
                                >
                                    <Plus className="w-4 h-4" />
                                    Schedule Meeting
                                </button>
                            )}
                            {activeTab === "documents" && (
                                <button
                                    onClick={() => setShowAddDocForm(!showAddDocForm)}
                                    className="flex items-center gap-2 bg-[#E61E32] hover:bg-[#E61E32]/80 text-white px-4 py-2 text-xs font-semibold transition-colors rounded-none"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Document
                                </button>
                            )}
                            {activeTab === "clients" && (
                                <button
                                    onClick={() => setShowAddClientForm(!showAddClientForm)}
                                    className="flex items-center gap-2 bg-[#E61E32] hover:bg-[#E61E32]/80 text-white px-4 py-2 text-xs font-semibold transition-colors rounded-none"
                                >
                                    <Plus className="w-4 h-4" />
                                    Register client
                                </button>
                            )}
                            {activeTab === "payrolls" && (
                                <button
                                    onClick={() => setShowAddPayrollForm(!showAddPayrollForm)}
                                    className="flex items-center gap-2 bg-[#E61E32] hover:bg-[#E61E32]/80 text-white px-4 py-2 text-xs font-semibold transition-colors rounded-none"
                                >
                                    <Plus className="w-4 h-4" />
                                    Allocate Payroll
                                </button>
                            )}
                            <div className="relative w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <input
                                    type="text"
                                    placeholder={activeTab === "documents" ? "Search documents..." : activeTab === "attendance" ? "Search attendance..." : activeTab === "settings" ? "Search settings..." : "Search..."}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 px-10 py-2.5 text-xs focus:outline-none focus:border-[#E61E32] rounded-none text-white placeholder-white/20"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Conditional Rendering of Tabs */}
                    <div className="flex-grow overflow-hidden">
                        {activeTab === "overview" && analyticsData && (
                            <div className="h-full space-y-8 animate-in fade-in duration-500 overflow-y-auto pr-2">
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                    <StatCard
                                        icon={<Users className="w-5 h-5" />}
                                        label="Total Employees"
                                        value={employees.length}
                                        sublabel="Registered profiles"
                                        color="text-blue-500"
                                    />
                                    <StatCard
                                        icon={<Clock className="w-5 h-5" />}
                                        label="Active Check-ins"
                                        value={globalAttendance.filter(log => !log.punchOut).length}
                                        sublabel="Currently in office"
                                        color="text-green-500"
                                    />
                                    <StatCard
                                        icon={<ListTodo className="w-5 h-5" />}
                                        label="Pending Tasks"
                                        value={tasks.filter(t => t.status === "pending" || t.status === "in_progress").length}
                                        sublabel="Awaiting action"
                                        color="text-yellow-500"
                                    />
                                    <StatCard
                                        icon={<Calendar className="w-5 h-5" />}
                                        label="Pending Leaves"
                                        value={leaves.filter(l => l.status === "pending").length}
                                        sublabel="Awaiting approval"
                                        color="text-orange-500"
                                    />
                                    <StatCard
                                        icon={<MessageSquare className="w-5 h-5" />}
                                        label="Support Tickets"
                                        value={tickets.length}
                                        sublabel={`${tickets.filter(t => t.status === 'pending').length} open tickets`}
                                        color="text-[#E61E32]"
                                    />
                                </div>

                                {/* All Analytics Section */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#E61E32]">
                                        all analytics
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Employees Analytics Card */}
                                        <div className="bg-white/[0.02] border border-white/5 p-6 space-y-4 hover:border-white/10 transition-colors">
                                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Employees</span>
                                            <SharpLineChart 
                                                data={analyticsData.employees} 
                                                labels={analyticsData.labels} 
                                                color="#3b82f6" 
                                                gradientId="empGrad" 
                                            />
                                        </div>

                                        {/* Amount Generated Analytics Card */}
                                        <div className="bg-white/[0.02] border border-white/5 p-6 space-y-4 hover:border-white/10 transition-colors">
                                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Amount generated</span>
                                            <SharpLineChart 
                                                data={analyticsData.amount} 
                                                labels={analyticsData.labels} 
                                                color="#10b981" 
                                                gradientId="amtGrad" 
                                            />
                                        </div>

                                        {/* Work Hours Analytics Card */}
                                        <div className="bg-white/[0.02] border border-white/5 p-6 space-y-4 hover:border-white/10 transition-colors">
                                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Work Hours</span>
                                            <SharpLineChart 
                                                data={analyticsData.hours} 
                                                labels={analyticsData.labels} 
                                                color="#ef4444" 
                                                gradientId="hrsGrad" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "inquiries" && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                                {/* Inquiry List */}
                                <div className="overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                                    {loading ? (
                                        <p className="text-white/20 text-center py-10">Loading inquiries...</p>
                                    ) : filteredInquiries.length > 0 ? (
                                        filteredInquiries.map((inv) => (
                                            <div
                                                key={inv.id}
                                                onClick={() => {
                                                    setSelectedInquiry(inv);
                                                    if (!inv.isRead) markAsRead(inv.id);
                                                }}
                                                className={`p-5 border transition-all cursor-pointer ${selectedInquiry?.id === inv.id ? 'bg-white/5 border-white/20' : 'bg-transparent border-white/5 hover:border-white/10'}`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-white flex items-center gap-2">
                                                        {inv.name}
                                                        {!inv.isRead && <span className="w-1.5 h-1.5 bg-[#E61E32] rounded-full" />}
                                                    </h3>
                                                    <span className="text-[10px] text-white/20 uppercase tracking-tighter">
                                                        {new Date(inv.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-white/40 truncate">{inv.message}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-20 text-center border border-dashed border-white/5">
                                            <p className="text-white/20 text-sm">No inquiries found.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Inquiry Details */}
                                <div className="bg-white/5 border border-white/5 p-8 overflow-y-auto">
                                    {selectedInquiry ? (
                                        <div className="space-y-8 animate-in fade-in duration-300">
                                            <div className="space-y-2 pb-6 border-b border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-xl font-bold">{selectedInquiry.name}</h3>
                                                    {selectedInquiry.isRead && <CheckCircle2 className="w-4 h-4 text-green-500/50" />}
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-white/30 font-medium">
                                                    <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {selectedInquiry.email}</span>
                                                    {selectedInquiry.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {selectedInquiry.phone}</span>}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <InfoBlock label="Company" value={selectedInquiry.company} />
                                                <InfoBlock label="Service" value={selectedInquiry.service} />
                                            </div>

                                            <div className="space-y-3 pt-6 border-t border-white/5">
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">Message</h4>
                                                <p className="text-sm leading-relaxed text-white/70 whitespace-pre-wrap">
                                                    {selectedInquiry.message}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-center opacity-20">
                                            <p className="text-sm uppercase tracking-widest font-medium">Select an inquiry to view details</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "support" && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                                {/* Ticket List */}
                                <div className="overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                                    {loading ? (
                                        <p className="text-white/20 text-center py-10">Loading tickets...</p>
                                    ) : filteredTickets.length > 0 ? (
                                        filteredTickets.map((t) => (
                                            <div
                                                key={t.id}
                                                onClick={() => setSelectedTicket(t)}
                                                className={`p-5 border transition-all cursor-pointer ${selectedTicket?.id === t.id ? 'bg-white/5 border-white/20' : 'bg-transparent border-white/5 hover:border-white/10'}`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-white flex items-center gap-2">
                                                        {t.subject}
                                                        <span className={`px-1.5 py-0.5 text-[8px] uppercase tracking-widest font-black ${t.status === 'pending' ? 'bg-[#E61E32]/10 text-[#E61E32]' : 'bg-green-500/10 text-green-500'}`}>
                                                            {t.status}
                                                        </span>
                                                    </h3>
                                                    <span className="text-[10px] text-white/20 uppercase tracking-tighter">
                                                        {new Date(t.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">{t.name}</p>
                                                <p className="text-xs text-white/40 truncate">{t.message}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-20 text-center border border-dashed border-white/5">
                                            <p className="text-white/20 text-sm">No support tickets found.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Ticket Details */}
                                <div className="bg-white/5 border border-white/5 p-8 overflow-y-auto">
                                    {selectedTicket ? (
                                        <div className="space-y-8 animate-in fade-in duration-300">
                                            <div className="space-y-4 pb-6 border-b border-white/5">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-xl font-bold">{selectedTicket.subject}</h3>
                                                    <div className="flex gap-2">
                                                        {selectedTicket.status === 'pending' && (
                                                            <button
                                                                onClick={() => handleUpdateTicketStatus(selectedTicket.id, 'resolved')}
                                                                className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest border border-green-500/20 hover:bg-green-500 hover:text-white transition-all"
                                                            >
                                                                Mark Resolved
                                                            </button>
                                                        )}
                                                        <button className="px-3 py-1 bg-white/5 text-white/40 text-[10px] font-bold uppercase tracking-widest border border-white/10 hover:bg-white/10 hover:text-white transition-all">
                                                            Close Ticket
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-white/30 font-medium">
                                                    <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {selectedTicket.name}</span>
                                                    <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {selectedTicket.email}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">Query Details</h4>
                                                <div className="bg-white/[0.02] border border-white/5 p-6">
                                                    <p className="text-sm leading-relaxed text-white/80 whitespace-pre-wrap">
                                                        {selectedTicket.message}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="pt-6">
                                                <button className="w-full flex items-center justify-center gap-2 bg-[#E61E32] text-white font-bold py-4 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                                                    <Send className="w-4 h-4" />
                                                    Reply via Email
                                                </button>
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

                        {activeTab === "intern-support" && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                                {/* Intern Ticket List */}
                                <div className="overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                                    {loading ? (
                                        <p className="text-white/20 text-center py-10">Loading tickets...</p>
                                    ) : internTickets.length > 0 ? (
                                        internTickets.map((t) => (
                                            <div
                                                key={t.id}
                                                onClick={() => setSelectedInternTicket(t)}
                                                className={`p-5 border transition-all cursor-pointer ${selectedInternTicket?.id === t.id ? 'bg-white/5 border-white/20' : 'bg-transparent border-white/5 hover:border-white/10'}`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-white flex items-center gap-2">
                                                        {t.name}
                                                        <span className={`px-1.5 py-0.5 text-[8px] uppercase tracking-widest font-black ${t.status === 'pending' ? 'bg-[#E61E32]/10 text-[#E61E32]' : 'bg-green-500/10 text-green-500'}`}>
                                                            {t.status}
                                                        </span>
                                                    </h3>
                                                    <span className="text-[10px] text-white/20 uppercase tracking-tighter">
                                                        {new Date(t.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">{t.batchNumber} | {t.college}</p>
                                                <p className="text-xs text-white/40 truncate">{t.description}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-20 text-center border border-dashed border-white/5">
                                            <p className="text-white/20 text-sm">No intern support tickets found.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Intern Ticket Details */}
                                <div className="bg-white/5 border border-white/5 p-8 overflow-y-auto">
                                    {selectedInternTicket ? (
                                        <div className="space-y-8 animate-in fade-in duration-300">
                                            <div className="space-y-4 pb-6 border-b border-white/5">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-xl font-bold">{selectedInternTicket.name}</h3>
                                                    <span className={`px-2 py-1 text-[10px] uppercase tracking-widest font-black ${selectedInternTicket.status === 'pending' ? 'bg-[#E61E32]/10 text-[#E61E32]' : 'bg-green-500/10 text-green-500'}`}>
                                                        {selectedInternTicket.status}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-white/30 font-medium">
                                                    <span className="flex items-center gap-1.5 font-bold text-white/60"><Building className="w-3.5 h-3.5" /> {selectedInternTicket.college}</span>
                                                    <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {selectedInternTicket.email}</span>
                                                    <span className="flex items-center gap-1.5 text-[#E61E32] font-black uppercase tracking-tighter"><Search className="w-3.5 h-3.5" /> {selectedInternTicket.batchNumber}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="space-y-1">
                                                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-white/20">Problem Page</h4>
                                                    <div className="text-sm font-mono bg-white/5 p-2 rounded border border-white/5 flex items-center gap-2">
                                                        <ExternalLink className="w-3.5 h-3.5 text-white/40" />
                                                        {selectedInternTicket.problemPage}
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-white/20">Issue Description</h4>
                                                    <div className="bg-white/[0.02] border border-white/5 p-6">
                                                        <p className="text-sm leading-relaxed text-white/80 whitespace-pre-wrap">
                                                            {selectedInternTicket.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-6">
                                                <button className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-4 text-xs uppercase tracking-widest hover:bg-[#E61E32] hover:text-white transition-all">
                                                    <Send className="w-4 h-4" />
                                                    Contact Intern
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-center opacity-20">
                                            <p className="text-sm uppercase tracking-widest font-medium">Select an intern ticket to view details</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "tasks" && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                                {/* Task List or Add Task Form */}
                                <div className="space-y-4 h-full flex flex-col overflow-hidden">
                                    {showAddTaskForm ? (
                                        <div className="bg-white/5 border border-white/10 p-8 animate-in slide-in-from-top-4 duration-300">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-lg font-bold uppercase tracking-tight">Assign New Task</h3>
                                                <button onClick={() => setShowAddTaskForm(false)} className="text-white/40 hover:text-white text-xs">Cancel</button>
                                            </div>
                                            <form onSubmit={handleAddTask} className="space-y-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Task Title</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={newTask.title}
                                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                                        className="w-full bg-[#111111] border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-[#E61E32] rounded-none"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Description</label>
                                                    <textarea
                                                        rows={3}
                                                        value={newTask.description}
                                                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                                        className="w-full bg-[#111111] border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-[#E61E32] rounded-none resize-none font-sans"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Assign To Employee</label>
                                                        <select
                                                            required
                                                            value={newTask.employeeId}
                                                            onChange={(e) => setNewTask({ ...newTask, employeeId: e.target.value })}
                                                            className="w-full bg-[#111111] border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-[#E61E32] rounded-none text-white"
                                                        >
                                                            <option value="" disabled>Select employee</option>
                                                            {employees.map((emp) => (
                                                                <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Deadline</label>
                                                        <input
                                                            type="date"
                                                            value={newTask.deadline}
                                                            onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                                                            className="w-full bg-[#111111] border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-[#E61E32] rounded-none"
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    disabled={isSubmitting}
                                                    type="submit"
                                                    className="w-full bg-[#E61E32] text-white font-bold py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all disabled:opacity-50 rounded-none cursor-pointer"
                                                >
                                                    {isSubmitting ? "Assigning..." : "Assign Task"}
                                                </button>
                                            </form>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex gap-2 border-b border-white/5 pb-3 shrink-0">
                                                {(["all", "pending", "in_progress", "completed"] as const).map((filter) => (
                                                    <button
                                                        key={filter}
                                                        onClick={() => setTaskFilter(filter)}
                                                        className={`px-3 py-1 text-[10px] uppercase font-bold tracking-widest border transition-all rounded-none cursor-pointer ${taskFilter === filter ? 'bg-[#E61E32]/10 border-[#E61E32] text-[#E61E32]' : 'bg-transparent border-white/5 text-white/40 hover:text-white hover:border-white/10'}`}
                                                    >
                                                        {filter.replace("_", " ")}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="overflow-y-auto space-y-3 pr-2 scrollbar-thin flex-grow">
                                                {loading ? (
                                                    <p className="text-white/20 text-center py-10 animate-pulse">Loading tasks...</p>
                                                ) : filteredTasks.length > 0 ? (
                                                    filteredTasks.map((t) => (
                                                        <div
                                                            key={t.id}
                                                            onClick={() => {
                                                                setSelectedTask(t);
                                                                setIsEditingTask(false);
                                                            }}
                                                            className={`p-5 border transition-all cursor-pointer ${selectedTask?.id === t.id ? 'bg-white/5 border-white/20' : 'bg-transparent border-white/5 hover:border-white/10'}`}
                                                        >
                                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                                                <h3 className="font-bold text-white flex items-center gap-2 flex-wrap min-w-0" title={t.title}>
                                                                    {t.title}
                                                                    <span className={`px-1.5 py-0.5 text-[8px] uppercase tracking-widest font-black rounded-md shrink-0 ${t.status === 'completed' ? 'bg-green-500/10 text-green-500' : t.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                                        {t.status.replace("_", " ")}
                                                                    </span>
                                                                </h3>
                                                            </div>
                                                            <div className="flex flex-col sm:flex-row sm:items-start md:items-end justify-between gap-2 mt-1">
                                                                <div>
                                                                    <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">Assigned: {t.employee?.name || "Unknown"}</p>
                                                                    <p className="text-xs text-white/40 truncate max-w-[250px]" title={t.description || ""}>{t.description || "No description."}</p>
                                                                </div>
                                                                {t.deadline && (
                                                                    <span className="text-[9px] text-white/20 uppercase tracking-wider shrink-0">
                                                                        Due {new Date(t.deadline).toLocaleDateString()}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="py-20 text-center border border-dashed border-white/5">
                                                        <p className="text-white/20 text-sm">No tasks found.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Task Details Panel */}
                                <div className="bg-white/5 border border-white/5 p-8 overflow-y-auto">
                                    {selectedTask ? (
                                        <div className="space-y-8 animate-in fade-in duration-300">
                                            <div className="flex items-center justify-between pb-6 border-b border-white/5">
                                                <div>
                                                    <h3 className="text-xl font-bold">{selectedTask.title}</h3>
                                                    <p className="text-xs text-[#E61E32] font-bold uppercase tracking-widest mt-1">Assigned to: {selectedTask.employee?.name} ({selectedTask.employee?.role})</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <button
                                                        onClick={() => setIsEditingTask(!isEditingTask)}
                                                        className={`p-2 transition-colors ${isEditingTask ? 'text-[#E61E32]' : 'text-white/20 hover:text-white'}`}
                                                        title="Edit Task"
                                                    >
                                                        <Edit2 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteTask(selectedTask.id)}
                                                        className="p-2 text-white/20 hover:text-[#E61E32] transition-colors"
                                                        title="Delete Task"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>

                                            {isEditingTask ? (
                                                <form onSubmit={handleUpdateTask} className="space-y-6 bg-white/[0.02] p-6 border border-white/5">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Task Title</label>
                                                        <input
                                                            required
                                                            type="text"
                                                            value={selectedTask.title}
                                                            onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                                                            className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30 rounded-none"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Description</label>
                                                        <textarea
                                                            rows={3}
                                                            value={selectedTask.description || ""}
                                                            onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                                                            className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30 rounded-none resize-none font-sans"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Status</label>
                                                            <select
                                                                value={selectedTask.status}
                                                                onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value })}
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30 rounded-none text-white"
                                                            >
                                                                <option value="pending">Pending</option>
                                                                <option value="in_progress">In Progress</option>
                                                                <option value="completed">Completed</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Deadline</label>
                                                            <input
                                                                type="date"
                                                                value={selectedTask.deadline ? new Date(selectedTask.deadline).toISOString().split('T')[0] : ""}
                                                                onChange={(e) => setSelectedTask({ ...selectedTask, deadline: e.target.value })}
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30 rounded-none"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <button
                                                            type="submit"
                                                            disabled={isSubmitting}
                                                            className="flex-grow bg-[#E61E32] text-white font-bold py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all disabled:opacity-50 rounded-none cursor-pointer"
                                                        >
                                                            {isSubmitting ? "Updating..." : "Save Changes"}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsEditingTask(false)}
                                                            className="px-6 bg-white/5 text-white/60 font-bold py-3 text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all border border-white/10 rounded-none cursor-pointer"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <div className="space-y-6">
                                                    <div className="p-6 bg-white/[0.02] border border-white/5 space-y-4">
                                                        <InfoBlock label="Description" value={selectedTask.description || "No description provided."} />
                                                        <InfoBlock label="Deadline" value={selectedTask.deadline ? new Date(selectedTask.deadline).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : "No deadline"} />
                                                        <div className="space-y-0.5">
                                                            <p className="text-[11px] font-medium text-white/20">Task Status</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                {(["pending", "in_progress", "completed"] as const).map((status) => (
                                                                    <button
                                                                        key={status}
                                                                        onClick={() => handleUpdateTaskStatus(selectedTask.id, status)}
                                                                        className={`px-3 py-1 text-[9px] uppercase font-bold tracking-wider border rounded-none transition-colors cursor-pointer ${selectedTask.status === status
                                                                            ? status === 'completed'
                                                                                ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                                                                : status === 'in_progress'
                                                                                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                                                                                    : 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                                                                            : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                                                                            }`}
                                                                    >
                                                                        {status.replace("_", " ")}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-center opacity-20">
                                            <p className="text-sm uppercase tracking-widest font-medium">Select a task to view details</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "employees" && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                                {/* Employee List or Add Form */}
                                <div className="space-y-4 h-full flex flex-col overflow-hidden">
                                    {showAddForm ? (
                                        <div className="bg-white/5 border border-white/10 p-8 animate-in slide-in-from-top-4 duration-300">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-lg font-bold uppercase tracking-tight">Add New Employee</h3>
                                                <button onClick={() => setShowAddForm(false)} className="text-white/40 hover:text-white text-xs">Cancel</button>
                                            </div>
                                            <form onSubmit={handleAddEmployee} className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Full Name</label>
                                                        <input
                                                            required
                                                            type="text"
                                                            value={newEmployee.name}
                                                            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Email Address</label>
                                                        <input
                                                            required
                                                            type="email"
                                                            value={newEmployee.email}
                                                            onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Job Role</label>
                                                        <input
                                                            required
                                                            type="text"
                                                            value={newEmployee.role}
                                                            onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Password</label>
                                                        <input
                                                            type="text"
                                                            value={newEmployee.password}
                                                            onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                                                            placeholder="Default: redlix_emp_2026"
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Offer Letter Link</label>
                                                    <input
                                                        type="url"
                                                        value={newEmployee.offerLetterLink}
                                                        onChange={(e) => setNewEmployee({ ...newEmployee, offerLetterLink: e.target.value })}
                                                        placeholder="https://..."
                                                        className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-3 bg-white/5 border border-white/5 p-4">
                                                    <input
                                                        type="checkbox"
                                                        id="newEmpIsDeptAdmin"
                                                        checked={newEmployee.isDeptAdmin}
                                                        onChange={(e) => setNewEmployee({ ...newEmployee, isDeptAdmin: e.target.checked })}
                                                        className="w-4 h-4 rounded bg-black border-white/10 text-[#E61E32] focus:ring-0 focus:ring-offset-0"
                                                    />
                                                    <label htmlFor="newEmpIsDeptAdmin" className="text-xs font-bold text-white uppercase tracking-widest cursor-pointer select-none">
                                                        Department Admin Login (Enable for Department Lead access)
                                                    </label>
                                                </div>
                                                <button
                                                    disabled={isSubmitting}
                                                    type="submit"
                                                    className="w-full bg-white text-black font-bold py-3 text-xs uppercase tracking-widest hover:bg-white/90 transition-colors disabled:opacity-50"
                                                >
                                                    {isSubmitting ? "Creating..." : "Save Employee"}
                                                </button>
                                            </form>
                                        </div>
                                    ) : showOnboardForm ? (
                                        <div className="bg-white/5 border border-white/10 p-8 animate-in slide-in-from-top-4 duration-300">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-lg font-bold uppercase tracking-tight">Onboard New Employee</h3>
                                                <button onClick={() => setShowOnboardForm(false)} className="text-white/40 hover:text-white text-xs">Cancel</button>
                                            </div>
                                            <form onSubmit={handleOnboardEmployee} className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Full Name</label>
                                                        <input
                                                            required
                                                            type="text"
                                                            value={newOnboardEmployee.name}
                                                            onChange={(e) => setNewOnboardEmployee({ ...newOnboardEmployee, name: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Email Address</label>
                                                        <input
                                                            required
                                                            type="email"
                                                            value={newOnboardEmployee.email}
                                                            onChange={(e) => setNewOnboardEmployee({ ...newOnboardEmployee, email: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Job Role</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={newOnboardEmployee.role}
                                                        onChange={(e) => setNewOnboardEmployee({ ...newOnboardEmployee, role: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-3 bg-white/5 border border-white/5 p-4">
                                                    <input
                                                        type="checkbox"
                                                        id="onboardEmpIsDeptAdmin"
                                                        checked={newOnboardEmployee.isDeptAdmin}
                                                        onChange={(e) => setNewOnboardEmployee({ ...newOnboardEmployee, isDeptAdmin: e.target.checked })}
                                                        className="w-4 h-4 rounded bg-black border-white/10 text-[#E61E32] focus:ring-0 focus:ring-offset-0"
                                                    />
                                                    <label htmlFor="onboardEmpIsDeptAdmin" className="text-xs font-bold text-white uppercase tracking-widest cursor-pointer select-none">
                                                        Department Admin Login (Enable for Department Lead access)
                                                    </label>
                                                </div>
                                                <button
                                                    disabled={isSubmitting}
                                                    type="submit"
                                                    className="w-full bg-white text-black font-bold py-3 text-xs uppercase tracking-widest hover:bg-white/90 transition-colors disabled:opacity-50"
                                                >
                                                    {isSubmitting ? "Onboarding..." : "Onboard Employee"}
                                                </button>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="overflow-y-auto space-y-3 pr-2 scrollbar-thin flex-grow">
                                            {loading ? (
                                                <p className="text-white/20 text-center py-10">Loading employees...</p>
                                            ) : filteredEmployees.length > 0 ? (
                                                filteredEmployees.map((emp) => (
                                                    <div
                                                        key={emp.id}
                                                        onClick={() => {
                                                            setSelectedEmployee(emp);
                                                            setIsEditingEmployee(false);
                                                        }}
                                                        className={`p-5 border transition-all cursor-pointer ${selectedEmployee?.id === emp.id ? 'bg-white/5 border-white/20' : 'bg-transparent border-white/5 hover:border-white/10'}`}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h3 className="font-bold text-white truncate max-w-[200px]">{emp.name}</h3>
                                                                <p className="text-[10px] text-[#E61E32] font-bold uppercase tracking-wider">{emp.role}</p>
                                                            </div>
                                                            <div className="flex flex-col items-end">
                                                                <span className="text-[10px] text-white/20 uppercase tracking-tighter">
                                                                    Joined {new Date(emp.joinedAt).toLocaleDateString()}
                                                                </span>
                                                                <div className="mt-2 flex gap-2">
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            sendOfferLetter(emp.id);
                                                                        }}
                                                                        disabled={sendEmailStatus?.id === emp.id && sendEmailStatus.status === 'sending'}
                                                                        className={`flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-tight border transition-colors ${sendEmailStatus?.id === emp.id && sendEmailStatus.action === 'offer' && sendEmailStatus.status === 'success'
                                                                            ? 'bg-green-500/10 border-green-500/50 text-green-500'
                                                                            : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/60 hover:text-white'
                                                                            }`}
                                                                    >
                                                                        {sendEmailStatus?.id === emp.id && sendEmailStatus.action === 'offer' && sendEmailStatus.status === 'sending' ? (
                                                                            <Loader2 className="w-3 h-3 animate-spin" />
                                                                        ) : (
                                                                            <Send className="w-3 h-3" />
                                                                        )}
                                                                        {sendEmailStatus?.id === emp.id && sendEmailStatus.action === 'offer' && sendEmailStatus.status === 'success' ? "Sent" : "Offer"}
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            sendOnboardingEmail(emp.id);
                                                                        }}
                                                                        disabled={sendEmailStatus?.id === emp.id && sendEmailStatus.status === 'sending'}
                                                                        className={`flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-tight border transition-colors ${sendEmailStatus?.id === emp.id && sendEmailStatus.action === 'onboarding' && sendEmailStatus.status === 'success'
                                                                            ? 'bg-green-500/10 border-green-500/50 text-green-500'
                                                                            : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/60 hover:text-white'
                                                                            }`}
                                                                    >
                                                                        {sendEmailStatus?.id === emp.id && sendEmailStatus.action === 'onboarding' && sendEmailStatus.status === 'sending' ? (
                                                                            <Loader2 className="w-3 h-3 animate-spin" />
                                                                        ) : (
                                                                            <Mail className="w-3 h-3" />
                                                                        )}
                                                                        {sendEmailStatus?.id === emp.id && sendEmailStatus.action === 'onboarding' && sendEmailStatus.status === 'success' ? "Sent" : "Onboard"}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-20 text-center border border-dashed border-white/5">
                                                    <p className="text-white/20 text-sm">No employees found.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Employee Details */}
                                <div className="bg-white/5 border border-white/5 p-8 overflow-y-auto">
                                    {selectedEmployee ? (
                                        <div className="space-y-8 animate-in fade-in duration-300">
                                            <div className="flex items-center justify-between pb-6 border-b border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-white/10 flex items-center justify-center border border-white/10">
                                                        <User className="w-6 h-6 text-white/40" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold">{selectedEmployee.name}</h3>
                                                        <p className="text-sm text-[#E61E32] font-bold uppercase tracking-widest">{selectedEmployee.role}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <button
                                                        onClick={() => setIsEditingEmployee(!isEditingEmployee)}
                                                        className={`p-2 transition-colors ${isEditingEmployee ? 'text-[#E61E32]' : 'text-white/20 hover:text-white'}`}
                                                        title="Edit Employee"
                                                    >
                                                        <Edit2 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteEmployee(selectedEmployee.id)}
                                                        className="p-2 text-white/20 hover:text-[#E61E32] transition-colors"
                                                        title="Delete Employee"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>

                                            {isEditingEmployee ? (
                                                <form onSubmit={handleUpdateEmployee} className="space-y-6 bg-white/[0.02] p-6 border border-white/5 animate-in slide-in-from-top-4 duration-300">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Full Name</label>
                                                            <input
                                                                required
                                                                type="text"
                                                                value={selectedEmployee.name}
                                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, name: e.target.value })}
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30 rounded-none"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Email Address</label>
                                                            <input
                                                                required
                                                                type="email"
                                                                value={selectedEmployee.email}
                                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, email: e.target.value })}
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30 rounded-none"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Job Role</label>
                                                            <input
                                                                required
                                                                type="text"
                                                                value={selectedEmployee.role}
                                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, role: e.target.value })}
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30 rounded-none"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Password</label>
                                                            <input
                                                                type="text"
                                                                value={selectedEmployee.password || ""}
                                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, password: e.target.value })}
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30 rounded-none"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Phone Number</label>
                                                            <input
                                                                type="tel"
                                                                value={selectedEmployee.phone || ""}
                                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, phone: e.target.value })}
                                                                placeholder="+91 XXXXX XXXXX"
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30 rounded-none"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">UPI ID (For Payrolls)</label>
                                                            <input
                                                                type="text"
                                                                value={selectedEmployee.upiId || ""}
                                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, upiId: e.target.value })}
                                                                placeholder="username@upi"
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30 rounded-none"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Father's Name</label>
                                                            <input
                                                                type="text"
                                                                value={selectedEmployee.fatherName || ""}
                                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, fatherName: e.target.value })}
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30 rounded-none"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Emergency Mobile</label>
                                                            <input
                                                                type="tel"
                                                                value={selectedEmployee.mobile || ""}
                                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, mobile: e.target.value })}
                                                                placeholder="XXXXXXXXXX"
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30 rounded-none"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Alternative Email</label>
                                                            <input
                                                                type="email"
                                                                value={selectedEmployee.altEmail || ""}
                                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, altEmail: e.target.value })}
                                                                placeholder="name@personal.com"
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30 rounded-none"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Postal Address (For Goodies/Deliveries)</label>
                                                        <textarea
                                                            rows={2}
                                                            value={selectedEmployee.address || ""}
                                                            onChange={(e) => setSelectedEmployee({ ...selectedEmployee, address: e.target.value })}
                                                            placeholder="House No, Street Name, Area, City, State, Pincode"
                                                            className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30 rounded-none resize-none font-sans"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Joined Date</label>
                                                            <input
                                                                type="date"
                                                                value={selectedEmployee.joinedAt ? new Date(selectedEmployee.joinedAt).toISOString().split('T')[0] : ""}
                                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, joinedAt: e.target.value ? new Date(e.target.value).toISOString() : new Date().toISOString() })}
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30 rounded-none"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Offer Letter Link</label>
                                                            <input
                                                                type="url"
                                                                value={selectedEmployee.offerLetterLink || ""}
                                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, offerLetterLink: e.target.value })}
                                                                placeholder="https://..."
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30 rounded-none"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 bg-white/5 border border-white/5 p-4">
                                                        <input
                                                            type="checkbox"
                                                            id="editEmpIsDeptAdmin"
                                                            checked={selectedEmployee.isDeptAdmin || false}
                                                            onChange={(e) => setSelectedEmployee({ ...selectedEmployee, isDeptAdmin: e.target.checked })}
                                                            className="w-4 h-4 rounded bg-black border-white/10 text-[#E61E32] focus:ring-0 focus:ring-offset-0"
                                                        />
                                                        <label htmlFor="editEmpIsDeptAdmin" className="text-xs font-bold text-white uppercase tracking-widest cursor-pointer select-none">
                                                            Department Admin Login (Enable to grant Department Lead access)
                                                        </label>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <button
                                                            type="submit"
                                                            disabled={isSubmitting}
                                                            className="flex-grow bg-[#E61E32] text-white font-bold py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all disabled:opacity-50 rounded-none"
                                                        >
                                                            {isSubmitting ? "Updating..." : "Save Changes"}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsEditingEmployee(false)}
                                                            className="px-6 bg-white/5 text-white/60 font-bold py-3 text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all border border-white/10 rounded-none"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        {/* Column 1: Employment & Contact */}
                                                        <div className="space-y-6">
                                                            <div className="p-4 bg-white/[0.02] border border-white/5 space-y-4">
                                                                <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Employment & Contact</p>
                                                                <InfoBlock label="Email Address" value={selectedEmployee.email} />
                                                                <InfoBlock label="Phone Number" value={selectedEmployee.phone || "Not Provided"} />
                                                                <InfoBlock label="Alternative Email" value={selectedEmployee.altEmail || "Not Provided"} />
                                                                <InfoBlock label="Joined Date" value={new Date(selectedEmployee.joinedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} />
                                                                <InfoBlock label="Department Admin Access" value={selectedEmployee.isDeptAdmin ? "Yes (Authorized to login to Dept Portal)" : "No"} />
                                                            </div>

                                                            <div className="p-4 bg-white/[0.02] border border-white/5">
                                                                <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-3">Offer letter</p>
                                                                {selectedEmployee.offerLetterLink ? (
                                                                    <a
                                                                        href={selectedEmployee.offerLetterLink}
                                                                        target="_blank"
                                                                        className="flex items-center justify-between group bg-white/5 hover:bg-white/10 border border-white/10 p-3 transition-colors rounded-none"
                                                                    >
                                                                        <span className="text-xs font-medium text-white/60 group-hover:text-white truncate pr-4">{selectedEmployee.offerLetterLink}</span>
                                                                        <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60" />
                                                                    </a>
                                                                ) : (
                                                                    <p className="text-xs text-white/30 italic">No link provided</p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Column 2: Payroll & Personal/Goodies */}
                                                        <div className="space-y-6">
                                                            <div className="p-4 bg-white/[0.02] border border-white/5 space-y-4">
                                                                <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Payroll Info</p>
                                                                <InfoBlock label="UPI ID" value={selectedEmployee.upiId || "Not Provided"} />
                                                            </div>

                                                            <div className="p-4 bg-white/[0.02] border border-white/5 space-y-4">
                                                                <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Personal & Goodies</p>
                                                                <InfoBlock label="Father's Name" value={selectedEmployee.fatherName || "Not Provided"} />
                                                                <InfoBlock label="Emergency Mobile" value={selectedEmployee.mobile || "Not Provided"} />
                                                                <InfoBlock label="Postal Address" value={selectedEmployee.address || "Not Provided"} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Attendance History Block */}
                                                    <div className="p-4 bg-white/[0.02] border border-white/5 space-y-4">
                                                        <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Attendance Logs</p>
                                                        {loadingAttendance ? (
                                                            <p className="text-xs text-white/30 animate-pulse py-2">Loading attendance logs...</p>
                                                        ) : selectedEmployeeAttendance.length > 0 ? (
                                                            <div className="max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                                                                <table className="w-full text-left text-xs">
                                                                    <thead>
                                                                        <tr className="border-b border-white/10 text-white/30 uppercase tracking-wider text-[9px] font-bold">
                                                                            <th className="py-2">Date</th>
                                                                            <th className="py-2">Clock In</th>
                                                                            <th className="py-2">Clock Out</th>
                                                                            <th className="py-2 text-right">Duration</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {selectedEmployeeAttendance.map((att) => {
                                                                            const pIn = new Date(att.punchIn);
                                                                            const pOut = att.punchOut ? new Date(att.punchOut) : null;
                                                                            const hours = Math.floor(att.workMinutes / 60);
                                                                            const mins = att.workMinutes % 60;
                                                                            const durationStr = pOut 
                                                                                ? `${hours > 0 ? `${hours}h ` : ''}${mins}m`
                                                                                : "Punched In";

                                                                            return (
                                                                                <tr key={att.id} className="border-b border-white/5 text-white/80 hover:bg-white/[0.02]">
                                                                                    <td className="py-2">{pIn.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                                                                                    <td className="py-2">{pIn.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })}</td>
                                                                                    <td className="py-2">{pOut ? pOut.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) : "Active"}</td>
                                                                                    <td className={`py-2 text-right font-medium ${pOut ? 'text-white/60' : 'text-[#E61E32] animate-pulse'}`}>{durationStr}</td>
                                                                                </tr>
                                                                            );
                                                                        })}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        ) : (
                                                            <p className="text-xs text-white/30 italic py-2">No attendance logs found for this employee.</p>
                                                        )}
                                                    </div>

                                                    <div className="pt-6 space-y-3">
                                                        <button
                                                            onClick={() => sendOfferLetter(selectedEmployee.id)}
                                                            disabled={sendEmailStatus?.id === selectedEmployee.id && sendEmailStatus.status === 'sending'}
                                                            className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-4 text-xs uppercase tracking-widest hover:bg-[#E61E32] hover:text-white transition-all disabled:opacity-50"
                                                        >
                                                            {sendEmailStatus?.id === selectedEmployee.id && sendEmailStatus.action === 'offer' && sendEmailStatus.status === 'sending' ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <Mail className="w-4 h-4" />
                                                            )}
                                                            Send Official Offer Email
                                                        </button>
                                                        <button
                                                            onClick={() => sendOnboardingEmail(selectedEmployee.id)}
                                                            disabled={sendEmailStatus?.id === selectedEmployee.id && sendEmailStatus.status === 'sending'}
                                                            className="w-full flex items-center justify-center gap-2 bg-white/5 text-white/80 font-bold py-4 text-xs uppercase tracking-widest border border-white/10 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
                                                        >
                                                            {sendEmailStatus?.id === selectedEmployee.id && sendEmailStatus.action === 'onboarding' && sendEmailStatus.status === 'sending' ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <Send className="w-4 h-4" />
                                                            )}
                                                            Send Onboarding Email
                                                        </button>
                                                        {sendEmailStatus?.id === selectedEmployee.id && sendEmailStatus.status === 'error' && (
                                                            <p className="text-[10px] text-[#E61E32] text-center mt-2 font-bold uppercase">Error sending email. Check logs.</p>
                                                        )}
                                                        {sendEmailStatus?.id === selectedEmployee.id && sendEmailStatus.action === 'offer' && sendEmailStatus.status === 'success' && (
                                                            <p className="text-[10px] text-green-500 text-center mt-2 font-bold uppercase">Offer letter sent successfully!</p>
                                                        )}
                                                        {sendEmailStatus?.id === selectedEmployee.id && sendEmailStatus.action === 'onboarding' && sendEmailStatus.status === 'success' && (
                                                            <p className="text-[10px] text-green-500 text-center mt-2 font-bold uppercase">Onboarding email sent successfully!</p>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-center opacity-20">
                                            <p className="text-sm uppercase tracking-widest font-medium text-center">
                                                Select an employee to<br />view profile and history
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "attendance" && (
                            <div className="bg-white/5 border border-white/5 p-6 flex flex-col overflow-hidden h-full animate-in fade-in duration-500">
                                {/* Sub Tabs toggle */}
                                <div className="flex border-b border-white/10 mb-6 shrink-0">
                                    <button
                                        onClick={() => setAttendanceSubView("logs")}
                                        className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${attendanceSubView === 'logs' ? 'border-[#E61E32] text-white' : 'border-transparent text-white/40 hover:text-white'}`}
                                    >
                                        Logs Timeline
                                    </button>
                                    <button
                                        onClick={() => setAttendanceSubView("today")}
                                        className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${attendanceSubView === 'today' ? 'border-[#E61E32] text-white' : 'border-transparent text-white/40 hover:text-white'}`}
                                    >
                                        Today's Status
                                    </button>
                                </div>

                                <div className="overflow-y-auto pr-1 flex-grow scrollbar-thin">
                                    {globalAttendanceLoading ? (
                                        <div className="flex items-center justify-center py-24">
                                            <Loader2 className="w-8 h-8 animate-spin text-[#E61E32]" />
                                        </div>
                                    ) : attendanceSubView === "logs" ? (() => {
                                        const filtered = globalAttendance.filter(log => {
                                            const nameMatch = log.employee?.name.toLowerCase().includes(searchQuery.toLowerCase());
                                            const emailMatch = log.employee?.email.toLowerCase().includes(searchQuery.toLowerCase());
                                            const roleMatch = log.employee?.role.toLowerCase().includes(searchQuery.toLowerCase());
                                            return nameMatch || emailMatch || roleMatch;
                                        });

                                        return filtered.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left text-xs min-w-[700px]">
                                                    <thead>
                                                        <tr className="border-b border-white/10 text-white/30 uppercase tracking-wider text-[9px] font-bold">
                                                            <th className="py-3">Employee</th>
                                                            <th className="py-3">Role</th>
                                                            <th className="py-3">Status</th>
                                                            <th className="py-3">Punch-In Time (IST)</th>
                                                            <th className="py-3">Punch-Out Time (IST)</th>
                                                            <th className="py-3 text-right">Duration</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filtered.map((log) => {
                                                            const isActive = !log.punchOut;
                                                            const duration = log.workMinutes > 0 
                                                                ? `${Math.floor(log.workMinutes / 60)}h ${log.workMinutes % 60}m` 
                                                                : log.punchOut 
                                                                ? "< 1 min" 
                                                                : "Active Session";
                                                            
                                                            return (
                                                                <tr key={log.id} className="border-b border-white/5 text-white/70 hover:bg-white/[0.01]">
                                                                    <td className="py-3.5">
                                                                        <p className="font-semibold text-white">{log.employee?.name || `Employee #${log.employeeId}`}</p>
                                                                        <p className="text-[10px] text-white/30">{log.employee?.email}</p>
                                                                    </td>
                                                                    <td className="py-3.5 text-white/50">{log.employee?.role || "-"}</td>
                                                                    <td className="py-3.5">
                                                                        {isActive ? (
                                                                            <span className="text-green-400 uppercase text-[9px] tracking-wider font-extrabold border border-green-500/20 bg-green-500/5 px-2.5 py-0.5 rounded-none animate-pulse">
                                                                                Active
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-white/40 uppercase text-[9px] tracking-wider font-semibold border border-white/10 bg-white/5 px-2.5 py-0.5 rounded-none">
                                                                                Inactive
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                    <td className="py-3.5 text-white/80 font-mono text-[11px]">
                                                                        {new Date(log.punchIn).toLocaleString("en-IN", {
                                                                            timeZone: "Asia/Kolkata",
                                                                            dateStyle: "medium",
                                                                            timeStyle: "short"
                                                                        })}
                                                                    </td>
                                                                    <td className="py-3.5 font-mono text-[11px]">
                                                                        {log.punchOut ? (
                                                                            <span className="text-white/85">
                                                                                {new Date(log.punchOut).toLocaleString("en-IN", {
                                                                                    timeZone: "Asia/Kolkata",
                                                                                    dateStyle: "medium",
                                                                                    timeStyle: "short"
                                                                                })}
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-yellow-400/80 uppercase text-[9px] tracking-wider font-extrabold border border-yellow-400/20 bg-yellow-400/5 px-2 py-0.5">Punch In</span>
                                                                        )}
                                                                    </td>
                                                                    <td className="py-3.5 text-right font-semibold text-white/60">
                                                                        {isActive ? (
                                                                            <span className="text-green-400 font-extrabold tracking-wide uppercase text-[9px] animate-pulse">In Office</span>
                                                                        ) : (
                                                                            <span className="text-white/85">{duration}</span>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="py-16 text-center border border-dashed border-white/5">
                                                <p className="text-white/20 text-xs">No attendance logs found matching filters.</p>
                                            </div>
                                        );
                                    })() : (() => {
                                        const now = new Date();
                                        const istTodayStr = now.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

                                        const todayLogs = globalAttendance.filter(log => {
                                            const logDayStr = new Date(log.punchIn).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
                                            return logDayStr === istTodayStr;
                                        });

                                        const presentEmployeeIds = new Set(todayLogs.map(log => log.employeeId));

                                        const presentEmployeesList = employees.filter(emp => presentEmployeeIds.has(emp.id)).map(emp => {
                                            const empLogs = todayLogs.filter(log => log.employeeId === emp.id);
                                            const isCurrentlyActive = empLogs.some(log => !log.punchOut);
                                            const latestLog = empLogs[0];
                                            return {
                                                ...emp,
                                                isCurrentlyActive,
                                                latestLog
                                            };
                                        });

                                        const absentEmployeesList = employees.filter(emp => !presentEmployeeIds.has(emp.id));

                                        const filteredPresent = presentEmployeesList.filter(emp => {
                                            const nameMatch = emp.name.toLowerCase().includes(searchQuery.toLowerCase());
                                            const emailMatch = emp.email.toLowerCase().includes(searchQuery.toLowerCase());
                                            const roleMatch = emp.role.toLowerCase().includes(searchQuery.toLowerCase());
                                            return nameMatch || emailMatch || roleMatch;
                                        });

                                        const filteredAbsent = absentEmployeesList.filter(emp => {
                                            const nameMatch = emp.name.toLowerCase().includes(searchQuery.toLowerCase());
                                            const emailMatch = emp.email.toLowerCase().includes(searchQuery.toLowerCase());
                                            const roleMatch = emp.role.toLowerCase().includes(searchQuery.toLowerCase());
                                            return nameMatch || emailMatch || roleMatch;
                                        });

                                        return (
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-6 animate-in fade-in duration-300">
                                                {/* Present Today Column */}
                                                <div className="bg-white/[0.02] border border-white/5 p-6 flex flex-col rounded-none">
                                                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center justify-between pb-3 border-b border-white/5 shrink-0">
                                                        <span className="flex items-center gap-2">
                                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                                            Present Today
                                                        </span>
                                                        <span className="bg-green-500/10 text-green-500 px-2 py-0.5 text-[10px] font-mono">{filteredPresent.length}</span>
                                                    </h3>
                                                    <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1 scrollbar-thin">
                                                        {filteredPresent.length > 0 ? (
                                                            filteredPresent.map(emp => (
                                                                <div key={emp.id} className="p-4 bg-white/5 border border-white/5 flex justify-between items-center hover:border-white/10 transition-colors">
                                                                    <div>
                                                                        <p className="font-semibold text-xs text-white">{emp.name}</p>
                                                                        <p className="text-[10px] text-white/30">{emp.email} • {emp.role}</p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        {emp.isCurrentlyActive ? (
                                                                            <span className="text-[8px] font-extrabold uppercase bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-0.5 rounded-none animate-pulse">Active</span>
                                                                        ) : (
                                                                            <span className="text-[8px] font-semibold uppercase bg-white/5 border border-white/10 text-white/40 px-2 py-0.5 rounded-none">Checked Out</span>
                                                                        )}
                                                                        {emp.latestLog && (
                                                                            <p className="text-[9px] text-white/30 mt-1.5 font-mono">
                                                                                Punched In: {new Date(emp.latestLog.punchIn).toLocaleTimeString("en-IN", {
                                                                                    timeZone: "Asia/Kolkata",
                                                                                    hour: '2-digit',
                                                                                    minute: '2-digit',
                                                                                    hour12: true
                                                                                })}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="py-10 text-center border border-dashed border-white/5">
                                                                <p className="text-white/20 text-xs">No employees present matching filters today.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Absent Today Column */}
                                                <div className="bg-white/[0.02] border border-white/5 p-6 flex flex-col rounded-none">
                                                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center justify-between pb-3 border-b border-white/5 shrink-0">
                                                        <span className="flex items-center gap-2">
                                                            <span className="w-2.5 h-2.5 bg-[#E61E32] rounded-full" />
                                                            Absent Today
                                                        </span>
                                                        <span className="bg-[#E61E32]/10 text-[#E61E32] px-2 py-0.5 text-[10px] font-mono">{filteredAbsent.length}</span>
                                                    </h3>
                                                    <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1 scrollbar-thin">
                                                        {filteredAbsent.length > 0 ? (
                                                            filteredAbsent.map(emp => (
                                                                <div key={emp.id} className="p-4 bg-white/5 border border-white/5 flex justify-between items-center hover:border-white/10 transition-colors">
                                                                    <div>
                                                                        <p className="font-semibold text-xs text-white">{emp.name}</p>
                                                                        <p className="text-[10px] text-white/30">{emp.email} • {emp.role}</p>
                                                                    </div>
                                                                    <span className="text-[8px] font-bold uppercase bg-[#E61E32]/10 border border-[#E61E32]/20 text-[#E61E32] px-2 py-0.5 rounded-none">Absent</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="py-10 text-center border border-dashed border-white/5">
                                                                <p className="text-white/20 text-xs">No absent employees matching filters today.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        )}

                        {activeTab === "clients" && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                                {/* Client List or Add Form */}
                                <div className="space-y-4 h-full flex flex-col overflow-hidden">
                                    {showAddClientForm ? (
                                        <div className="bg-white/5 border border-white/10 p-8 animate-in slide-in-from-top-4 duration-300">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-lg font-bold uppercase tracking-tight">Register New Client</h3>
                                                <button onClick={() => setShowAddClientForm(false)} className="text-white/40 hover:text-white text-xs">Cancel</button>
                                            </div>
                                            <form onSubmit={handleAddClient} className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Company Name</label>
                                                        <input
                                                            required
                                                            type="text"
                                                            value={newClient.companyName}
                                                            onChange={(e) => setNewClient({ ...newClient, companyName: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">App / Website Name</label>
                                                        <input
                                                            type="text"
                                                            value={newClient.appName}
                                                            onChange={(e) => setNewClient({ ...newClient, appName: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Client Contact Name</label>
                                                        <input
                                                            required
                                                            type="text"
                                                            value={newClient.clientName}
                                                            onChange={(e) => setNewClient({ ...newClient, clientName: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Email Address</label>
                                                        <input
                                                            required
                                                            type="email"
                                                            value={newClient.email}
                                                            onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Phone Number</label>
                                                        <input
                                                            type="tel"
                                                            value={newClient.phone}
                                                            onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Meeting Template</label>
                                                        <select
                                                            value={newClient.meetingTemplate}
                                                            onChange={(e) => setNewClient({ ...newClient, meetingTemplate: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        >
                                                            <option value="Discovery Call" className="bg-[#0f0f0f]">Discovery Call</option>
                                                            <option value="Project Onboarding" className="bg-[#0f0f0f]">Project Onboarding</option>
                                                            <option value="Weekly Sync" className="bg-[#0f0f0f]">Weekly Sync</option>
                                                            <option value="Final Delivery" className="bg-[#0f0f0f]">Final Delivery</option>
                                                            <option value="Developer Meet" className="bg-[#0f0f0f]">Developer Meet</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Developer Name (For Dev Meet)</label>
                                                        <input
                                                            type="text"
                                                            value={newClient.developerName}
                                                            onChange={(e) => setNewClient({ ...newClient, developerName: e.target.value })}
                                                            placeholder="Lead Engineer Name"
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Meeting Link (Custom)</label>
                                                        <input
                                                            type="url"
                                                            value={newClient.meetingLink}
                                                            onChange={(e) => setNewClient({ ...newClient, meetingLink: e.target.value })}
                                                            placeholder="https://meet.google.com/..."
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Preferred Meeting Time</label>
                                                    <input
                                                        type="datetime-local"
                                                        value={newClient.meetingTime}
                                                        onChange={(e) => setNewClient({ ...newClient, meetingTime: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                    />
                                                </div>
                                                <button
                                                    disabled={isSubmitting}
                                                    type="submit"
                                                    className="w-full bg-white text-black font-bold py-3 text-xs uppercase tracking-widest hover:bg-[#E61E32] hover:text-white transition-all disabled:opacity-50"
                                                >
                                                    {isSubmitting ? "Registering..." : "Register Client"}
                                                </button>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="overflow-y-auto space-y-3 pr-2 scrollbar-thin flex-grow">
                                            {loading ? (
                                                <p className="text-white/20 text-center py-10">Loading clients...</p>
                                            ) : filteredClients.length > 0 ? (
                                                filteredClients.map((client) => (
                                                    <div
                                                        key={client.id}
                                                        onClick={() => setSelectedClient(client)}
                                                        className={`p-5 border transition-all cursor-pointer ${selectedClient?.id === client.id ? 'bg-white/5 border-white/20' : 'bg-transparent border-white/5 hover:border-white/10'}`}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h3 className="font-bold text-white truncate max-w-[200px] uppercase tracking-tight">{client.companyName}</h3>
                                                                <p className="text-[10px] text-[#E61E32] font-bold uppercase tracking-wider">{client.appName || "No App Specified"}</p>
                                                            </div>
                                                            <div className="flex flex-col items-end">
                                                                <span className="text-[10px] text-white/20 uppercase tracking-tighter">
                                                                    Registered {new Date(client.createdAt).toLocaleDateString()}
                                                                </span>
                                                                {client.meetingTime && (
                                                                    <div className="mt-2 flex items-center gap-1 text-[9px] text-green-500 font-bold uppercase">
                                                                        <Clock className="w-3 h-3" />
                                                                        Scheduled
                                                                    </div>
                                                                )}
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedClient(client);
                                                                        setIsEditingClient(true);
                                                                    }}
                                                                    className="mt-2 text-[10px] text-white/40 hover:text-[#E61E32] font-bold uppercase tracking-widest transition-colors"
                                                                >
                                                                    Reschedule
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-20 text-center border border-dashed border-white/5">
                                                    <p className="text-white/20 text-sm">No clients found.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Client Details */}
                                <div className="bg-white/5 border border-white/5 p-8 overflow-y-auto">
                                    {selectedClient ? (
                                        <div className="space-y-8 animate-in fade-in duration-300">
                                            <div className="space-y-2 pb-6 border-b border-white/5">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-white/10 flex items-center justify-center border border-white/10 text-white/40">
                                                            <Building className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-bold uppercase">{selectedClient.companyName}</h3>
                                                            <p className="text-sm text-[#E61E32] font-bold uppercase tracking-widest">{selectedClient.appName || "Web Project"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            onClick={() => setIsEditingClient(!isEditingClient)}
                                                            className={`p-2 transition-colors ${isEditingClient ? 'text-[#E61E32]' : 'text-white/20 hover:text-white'}`}
                                                            title="Edit Client"
                                                        >
                                                            <Edit2 className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClient(selectedClient.id)}
                                                            className="p-2 text-white/20 hover:text-[#E61E32] transition-colors"
                                                            title="Delete Client"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {isEditingClient ? (
                                                <form onSubmit={handleUpdateClient} className="space-y-6 bg-white/[0.02] p-6 border border-white/5 animate-in slide-in-from-top-4 duration-300">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Meeting Template</label>
                                                            <select
                                                                value={selectedClient.meetingTemplate || ""}
                                                                onChange={(e) => setSelectedClient({ ...selectedClient, meetingTemplate: e.target.value })}
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                            >
                                                                <option value="Discovery Call">Discovery Call</option>
                                                                <option value="Project Onboarding">Project Onboarding</option>
                                                                <option value="Weekly Sync">Weekly Sync</option>
                                                                <option value="Final Delivery">Final Delivery</option>
                                                                <option value="Developer Meet">Developer Meet</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Meeting Time</label>
                                                            <input
                                                                type="datetime-local"
                                                                value={selectedClient.meetingTime ? new Date(selectedClient.meetingTime).toISOString().slice(0, 16) : ""}
                                                                onChange={(e) => setSelectedClient({ ...selectedClient, meetingTime: e.target.value })}
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Developer Assigned</label>
                                                            <input
                                                                type="text"
                                                                value={selectedClient.developerName || ""}
                                                                onChange={(e) => setSelectedClient({ ...selectedClient, developerName: e.target.value })}
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Meeting Link</label>
                                                            <input
                                                                type="url"
                                                                value={selectedClient.meetingLink || ""}
                                                                onChange={(e) => setSelectedClient({ ...selectedClient, meetingLink: e.target.value })}
                                                                placeholder="https://..."
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <button
                                                            type="submit"
                                                            disabled={isSubmitting}
                                                            className="flex-grow bg-[#E61E32] text-white font-bold py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all disabled:opacity-50"
                                                        >
                                                            {isSubmitting ? "Updating..." : "Save Changes"}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsEditingClient(false)}
                                                            className="px-6 bg-white/5 text-white/60 font-bold py-3 text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all border border-white/10"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <>
                                                    <div className="grid grid-cols-1 gap-6">
                                                        <div className="p-6 bg-white/[0.02] border border-white/5 space-y-6">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <InfoBlock label="Client Name" value={selectedClient.clientName} />
                                                                <InfoBlock label="Email Address" value={selectedClient.email} />
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <InfoBlock label="Phone Number" value={selectedClient.phone || "N/A"} />
                                                                <InfoBlock label="Registered On" value={new Date(selectedClient.createdAt).toLocaleDateString()} />
                                                            </div>
                                                        </div>

                                                        <div className="p-6 bg-[#E61E32]/5 border border-[#E61E32]/10 space-y-4">
                                                            <h4 className="text-[10px] font-bold text-[#E61E32] uppercase tracking-widest flex items-center gap-2">
                                                                <Calendar className="w-3 h-3" />
                                                                Meeting & Schedule
                                                            </h4>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <InfoBlock label="Template Type" value={selectedClient.meetingTemplate || "Standard Call"} />
                                                                <InfoBlock
                                                                    label="Scheduled Time"
                                                                    value={selectedClient.meetingTime ? new Date(selectedClient.meetingTime).toLocaleString() : "Not Scheduled"}
                                                                />
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <InfoBlock label="Developer Assigned" value={selectedClient.developerName || "N/A"} />
                                                                <div className="space-y-1">
                                                                    <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Meeting Link</p>
                                                                    {selectedClient.meetingLink ? (
                                                                        <a href={selectedClient.meetingLink} target="_blank" className="text-sm text-[#E61E32] font-medium hover:underline truncate block max-w-[200px]">
                                                                            {selectedClient.meetingLink}
                                                                        </a>
                                                                    ) : (
                                                                        <p className="text-sm text-white/40 italic">No Link Provided</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="pt-6 flex gap-4">
                                                        <button
                                                            onClick={() => sendMeetingEmail(selectedClient.id)}
                                                            disabled={(sendEmailStatus?.id === selectedClient.id && sendEmailStatus.status === 'sending') || !selectedClient.meetingTime}
                                                            className="flex-grow flex items-center justify-center gap-2 bg-white text-black font-bold py-4 text-xs uppercase tracking-widest hover:bg-[#E61E32] hover:text-white transition-all disabled:opacity-50"
                                                        >
                                                            {sendEmailStatus?.id === selectedClient.id && sendEmailStatus.status === 'sending' ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <Mail className="w-4 h-4" />
                                                            )}
                                                            {sendEmailStatus?.id === selectedClient.id && sendEmailStatus.status === 'success' ? "Details Sent" : "Send Meeting Details"}
                                                        </button>
                                                        <button className="flex-grow flex items-center justify-center gap-2 bg-white/5 text-white/60 font-bold py-4 text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all border border-white/10">
                                                            <Globe className="w-4 h-4" />
                                                            Open Dashboard
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                            {sendEmailStatus?.id === selectedClient.id && sendEmailStatus.status === 'error' && (
                                                <p className="text-[10px] text-[#E61E32] text-center mt-2 font-bold uppercase">Error sending meeting details. Check logs.</p>
                                            )}
                                            {!selectedClient.meetingTime && (
                                                <p className="text-[10px] text-white/20 text-center mt-2 font-bold uppercase">Schedule a meeting to send details</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-center opacity-20">
                                            <p className="text-sm uppercase tracking-widest font-medium text-center">
                                                Select a client to<br />view full details and projects
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "payment-due-sender" && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full overflow-y-auto pr-2 pb-6">
                                {/* Form Container */}
                                <div className="bg-white/5 border border-white/10 p-8 space-y-6">
                                    <div>
                                        <h3 className="text-lg font-bold uppercase tracking-tight flex items-center gap-2">
                                            <CreditCard className="w-5 h-5 text-[#E61E32]" />
                                            Send Payment Pending Notice
                                        </h3>
                                        <p className="text-xs text-white/40 mt-1">Select a client and enter outstanding invoice details.</p>
                                    </div>

                                    <form onSubmit={handleSendPaymentDue} className="space-y-6">
                                        {/* Client Dropdown */}
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Select Registered Client *</label>
                                            <select
                                                required
                                                value={paymentClientId}
                                                onChange={(e) => setPaymentClientId(e.target.value === "" ? "" : Number(e.target.value))}
                                                className="w-full bg-black border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 text-white"
                                            >
                                                <option value="" className="bg-[#0f0f0f]">Choose a client...</option>
                                                {clients.map((c) => (
                                                    <option key={c.id} value={c.id} className="bg-[#0f0f0f]">
                                                        {c.companyName} ({c.clientName})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Client Preview Box (if selected) */}
                                        {paymentClientId !== "" && (
                                            (() => {
                                                const client = clients.find(c => c.id === paymentClientId);
                                                if (!client) return null;
                                                return (
                                                    <div className="p-4 bg-white/[0.02] border border-white/5 space-y-3 animate-in fade-in duration-300">
                                                        <p className="text-[10px] font-bold text-[#E61E32] uppercase tracking-widest">Selected Client Details</p>
                                                        <div className="grid grid-cols-2 gap-4 text-xs">
                                                            <div>
                                                                <span className="text-white/30 block mb-0.5">Company Name</span>
                                                                <span className="text-white/80 font-medium">{client.companyName}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-white/30 block mb-0.5">Contact Name</span>
                                                                <span className="text-white/80 font-medium">{client.clientName}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-white/30 block mb-0.5">Email Address</span>
                                                                <span className="text-white/80 font-mono">{client.email}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-white/30 block mb-0.5">Phone Number</span>
                                                                <span className="text-white/80">{client.phone || "N/A"}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })()
                                        )}

                                        {/* Amount and Due Date Row */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Amount Due *</label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="e.g. $1,500 or ₹75,000"
                                                    value={paymentAmount}
                                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                                    className="w-full bg-black border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 text-white"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Due Date *</label>
                                                <input
                                                    required
                                                    type="date"
                                                    value={paymentDueDate}
                                                    onChange={(e) => setPaymentDueDate(e.target.value)}
                                                    className="w-full bg-black border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 text-white"
                                                />
                                            </div>
                                        </div>

                                        {/* Invoice PDF Upload */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Upload Invoice PDF (Optional)</label>
                                            <div className="relative border border-dashed border-white/10 hover:border-white/20 transition-colors p-6 text-center cursor-pointer bg-black/20 flex flex-col items-center justify-center space-y-2">
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={handleFileChange}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                                <FileText className="w-8 h-8 text-white/30" />
                                                {paymentInvoiceFile ? (
                                                    <div className="space-y-1 text-center">
                                                        <p className="text-xs font-semibold text-green-500">{paymentInvoiceFile.name}</p>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => { e.stopPropagation(); setPaymentInvoiceFile(null); }}
                                                            className="text-[10px] text-white/40 hover:text-red-500 font-bold uppercase"
                                                        >
                                                            Remove File
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <p className="text-xs font-medium text-white/60">Click to upload or drag & drop</p>
                                                        <p className="text-[10px] text-white/20 mt-0.5">Only PDF files are supported</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            disabled={paymentSendStatus === 'sending' || !paymentClientId || !paymentAmount || !paymentDueDate}
                                            type="submit"
                                            className="w-full flex items-center justify-center gap-2 bg-[#E61E32] hover:bg-[#E61E32]/90 disabled:bg-[#E61E32]/50 text-white font-bold py-4 text-xs uppercase tracking-widest transition-all disabled:cursor-not-allowed"
                                        >
                                            {paymentSendStatus === 'sending' ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Sending Notice...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    Send Payment Due Notice
                                                </>
                                            )}
                                        </button>

                                        {/* Status Feedback Messages */}
                                        {paymentSendStatus === 'success' && (
                                            <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-semibold text-center uppercase tracking-wider">
                                                ✓ Payment reminder email sent successfully!
                                            </div>
                                        )}
                                        {paymentSendStatus === 'error' && (
                                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold text-center flex flex-col items-center gap-1 uppercase tracking-wider">
                                                <div className="flex items-center gap-1.5">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span>Failed to send email</span>
                                                </div>
                                                {paymentErrorMessage && (
                                                    <p className="text-[10px] text-red-400/80 mt-1 font-mono normal-case">{paymentErrorMessage}</p>
                                                )}
                                            </div>
                                        )}
                                    </form>
                                </div>

                                {/* Dynamic Live Email Preview */}
                                <div className="bg-white/5 border border-white/5 p-6 flex flex-col h-full space-y-4">
                                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                                        </div>
                                        <span className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Live Email Preview</span>
                                    </div>

                                    {/* Email Frame */}
                                    <div className="flex-grow bg-white text-black p-6 rounded shadow-inner overflow-y-auto max-h-[600px] text-left border border-white/10 font-sans">
                                        {(() => {
                                            const client = clients.find(c => c.id === paymentClientId);
                                            const name = client ? client.clientName : "[Client Contact Name]";
                                            const company = client ? client.companyName : "[Client Company Name]";
                                            const email = client ? client.email : "client@company.com";
                                            const displayAmount = paymentAmount || "[Due Amount]";
                                            const displayDate = paymentDueDate
                                                ? new Date(paymentDueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
                                                : "[Payment Due Date]";

                                            return (
                                                <div style={{ pointerEvents: 'none' }}>
                                                    {/* Email Header Info */}
                                                    <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', marginBottom: '20px', fontSize: '12px', color: '#4b5563' }}>
                                                        <div><strong style={{ color: '#111827' }}>From:</strong> Redlix Billing &lt;billing@redlix.co.in&gt;</div>
                                                        <div style={{ marginTop: '4px' }}><strong style={{ color: '#111827' }}>To:</strong> {email}</div>
                                                        <div style={{ marginTop: '4px' }}><strong style={{ color: '#111827' }}>Subject:</strong> Payment Pending Notification | Redlix Studio & {company}</div>
                                                    </div>

                                                    {/* Styled Email Body */}
                                                    <div style={{ maxWidth: '600px', margin: '0 auto', border: '1px solid #e0e0e0', backgroundColor: '#ffffff' }}>
                                                        {/* Logo */}
                                                        <div style={{ padding: '15px 30px', borderBottom: '1px solid #eee', textAlign: 'left' }}>
                                                            <img src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1776288139/Screenshot_2026-04-16_at_02.51.43-removebg-preview_ytpg09.png" alt="Redlix Studio" style={{ height: '28px' }} />
                                                        </div>

                                                        {/* Content */}
                                                        <div style={{ padding: '30px' }}>
                                                            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 5px 0', color: '#111' }}>Payment Reminder</h2>
                                                            <div style={{ width: '30px', height: '2px', backgroundColor: '#E61E32', marginBottom: '20px' }} />

                                                            <p style={{ fontSize: '14px', lineHeight: '1.5', margin: '0 0 15px 0' }}>
                                                                Hello <strong>{name}</strong>,
                                                            </p>

                                                            <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#374151', margin: '0 0 25px 0' }}>
                                                                Your payment due of <strong style={{ color: '#111' }}>{displayAmount}</strong> is pending. Please pay by <strong>{displayDate}</strong>.
                                                            </p>

                                                            {/* Billing Table */}
                                                            <h3 style={{ fontSize: '11px', fontWeight: 'bold', color: '#E61E32', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px 0' }}>Billing Details</h3>
                                                            <div style={{ backgroundColor: '#f9fafb', padding: '18px', border: '1px solid #e5e7eb', marginBottom: '25px' }}>
                                                                <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                                                                    <tbody>
                                                                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                                            <td style={{ padding: '6px 0', color: '#6b7280', width: '130px' }}>Company</td>
                                                                            <td style={{ padding: '6px 0', fontWeight: '600', color: '#111827' }}>{company}</td>
                                                                        </tr>
                                                                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                                            <td style={{ padding: '6px 0', color: '#6b7280' }}>Billing Contact</td>
                                                                            <td style={{ padding: '6px 0', fontWeight: '600', color: '#111827' }}>{name}</td>
                                                                        </tr>
                                                                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                                            <td style={{ padding: '6px 0', color: '#6b7280' }}>Amount Due</td>
                                                                            <td style={{ padding: '6px 0', fontWeight: '700', color: '#E61E32' }}>{displayAmount}</td>
                                                                        </tr>
                                                                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                                            <td style={{ padding: '6px 0', color: '#6b7280' }}>Due Date</td>
                                                                            <td style={{ padding: '6px 0', fontWeight: '600', color: '#111827' }}>{displayDate}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ padding: '6px 0', color: '#6b7280' }}>Status</td>
                                                                            <td style={{ padding: '6px 0', fontWeight: '700', color: '#E61E32' }}>PENDING</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                            {/* PDF File Attachment preview */}
                                                            {paymentInvoiceFile && (
                                                                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px', fontSize: '13px', color: '#166534', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '25px' }}>
                                                                    <span style={{ fontSize: '16px' }}>📎</span>
                                                                    <span><strong>Invoice Attached:</strong> {paymentInvoiceFile.name} (PDF)</span>
                                                                </div>
                                                            )}

                                                            <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', fontStyle: 'italic', margin: '20px 0 0 0' }}>
                                                                If you have already processed the payment, please disregard this message or share the receipt with us.
                                                            </p>
                                                        </div>

                                                        {/* Footer */}
                                                        <div style={{ backgroundColor: '#f9fafb', padding: '30px', borderTop: '1px solid #eee', fontSize: '12px' }}>
                                                            <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#E61E32', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '10px' }}>Billing Lead</p>
                                                            <p style={{ margin: '0', fontSize: '15px', fontWeight: 'bold', color: '#111' }}>Shiva Krishna Manthena</p>
                                                            <p style={{ margin: '2px 0 20px 0', color: '#4b5563' }}>Redlix Studio | Accounts Department</p>

                                                            <div style={{ fontSize: '11px', color: '#9ca3af', lineHeight: '1.6' }}>
                                                                <p style={{ margin: '0' }}>© 2026 Redlix Studio</p>
                                                                <p style={{ margin: '0' }}>Software & IT infrastructure solutions</p>
                                                                <p style={{ margin: '4px 0 0 0', color: '#E61E32', fontWeight: '600' }}>www.redlix.co.in</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "payment-received-sender" && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full overflow-y-auto pr-2 pb-6">
                                <Script
                                    src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.9.14/dist/dotlottie-wc.js"
                                    type="module"
                                    strategy="lazyOnload"
                                />
                                {/* Form Container */}
                                <div className="bg-white/5 border border-white/10 p-8 space-y-6">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-bold uppercase tracking-tight flex items-center gap-2">
                                                <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                                                Send Payment Confirmation
                                            </h3>
                                            <p className="text-xs text-white/40 mt-1">Select a client and enter received payment details.</p>
                                        </div>
                                        <div className="w-16 h-16 shrink-0 flex items-center justify-center bg-white/[0.02] border border-white/5 rounded-full overflow-hidden">
                                            <dotlottie-wc
                                                src="https://lottie.host/f13997bb-c272-480a-88bc-7207fef2de93/GBzchfk01z.lottie"
                                                autoplay
                                                loop
                                                style={{ width: "80px", height: "80px" }}
                                            />
                                        </div>
                                    </div>

                                    <form onSubmit={handleSendPaymentReceived} className="space-y-6">
                                        {/* Client Dropdown */}
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Select Registered Client *</label>
                                            <select
                                                required
                                                value={receivedClientId}
                                                onChange={(e) => setReceivedClientId(e.target.value === "" ? "" : Number(e.target.value))}
                                                className="w-full bg-black border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 text-white"
                                            >
                                                <option value="" className="bg-[#0f0f0f]">Choose a client...</option>
                                                {clients.map((c) => (
                                                    <option key={c.id} value={c.id} className="bg-[#0f0f0f]">
                                                        {c.companyName} ({c.clientName})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Client Preview Box (if selected) */}
                                        {receivedClientId !== "" && (
                                            (() => {
                                                const client = clients.find(c => c.id === receivedClientId);
                                                if (!client) return null;
                                                return (
                                                    <div className="p-4 bg-white/[0.02] border border-white/5 space-y-3 animate-in fade-in duration-300">
                                                        <p className="text-[10px] font-bold text-[#10B981] uppercase tracking-widest">Selected Client Details</p>
                                                        <div className="grid grid-cols-2 gap-4 text-xs">
                                                            <div>
                                                                <span className="text-white/30 block mb-0.5">Company Name</span>
                                                                <span className="text-white/80 font-medium">{client.companyName}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-white/30 block mb-0.5">Contact Name</span>
                                                                <span className="text-white/80 font-medium">{client.clientName}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-white/30 block mb-0.5">Email Address</span>
                                                                <span className="text-white/80 font-mono">{client.email}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-white/30 block mb-0.5">Phone Number</span>
                                                                <span className="text-white/80">{client.phone || "N/A"}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })()
                                        )}

                                        {/* Amount, Payment Date, Transaction ID */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Amount Received *</label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="e.g. $1,500 or ₹75,000"
                                                    value={receivedAmount}
                                                    onChange={(e) => setReceivedAmount(e.target.value)}
                                                    className="w-full bg-black border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 text-white"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Payment Date *</label>
                                                <input
                                                    required
                                                    type="date"
                                                    value={receivedDate}
                                                    onChange={(e) => setReceivedDate(e.target.value)}
                                                    className="w-full bg-black border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 text-white"
                                                />
                                            </div>
                                        </div>

                                        {/* Transaction ID */}
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Transaction ID (Optional)</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. TXN123456789 or UTR / UPI Ref No."
                                                value={receivedTransactionId}
                                                onChange={(e) => setReceivedTransactionId(e.target.value)}
                                                className="w-full bg-black border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 text-white font-mono"
                                            />
                                            <p className="text-[10px] text-white/20">Will appear as a reference on the payment receipt email.</p>
                                        </div>

                                        {/* Receipt PDF Upload */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Upload Receipt / Invoice PDF (Optional)</label>
                                            <div className="relative border border-dashed border-white/10 hover:border-white/20 transition-colors p-6 text-center cursor-pointer bg-black/20 flex flex-col items-center justify-center space-y-2">
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={handleReceiptFileChange}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                                <FileText className="w-8 h-8 text-white/30" />
                                                {receivedReceiptFile ? (
                                                    <div className="space-y-1 text-center">
                                                        <p className="text-xs font-semibold text-green-500">{receivedReceiptFile.name}</p>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => { e.stopPropagation(); setReceivedReceiptFile(null); }}
                                                            className="text-[10px] text-white/40 hover:text-red-500 font-bold uppercase"
                                                        >
                                                            Remove File
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <p className="text-xs font-medium text-white/60">Click to upload or drag & drop</p>
                                                        <p className="text-[10px] text-white/20 mt-0.5">Only PDF files are supported</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            disabled={receivedSendStatus === 'sending' || !receivedClientId || !receivedAmount || !receivedDate}
                                            type="submit"
                                            className="w-full flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#10B981]/90 disabled:bg-[#10B981]/50 text-white font-bold py-4 text-xs uppercase tracking-widest transition-all disabled:cursor-not-allowed"
                                        >
                                            {receivedSendStatus === 'sending' ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Sending Notice...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    Send Payment Confirmation
                                                </>
                                            )}
                                        </button>

                                        {/* Status Feedback Messages */}
                                        {receivedSendStatus === 'success' && (
                                            <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-semibold text-center uppercase tracking-wider animate-in fade-in duration-200">
                                                ✓ Payment confirmation email sent successfully!
                                            </div>
                                        )}
                                        {receivedSendStatus === 'error' && (
                                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold text-center flex flex-col items-center gap-1 uppercase tracking-wider animate-in fade-in duration-200">
                                                <div className="flex items-center gap-1.5">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span>Failed to send email</span>
                                                </div>
                                                {receivedErrorMessage && (
                                                    <p className="text-[10px] text-red-400/80 mt-1 font-mono normal-case">{receivedErrorMessage}</p>
                                                )}
                                            </div>
                                        )}
                                    </form>
                                </div>

                                {/* Dynamic Live Email Preview */}
                                <div className="bg-white/5 border border-white/5 p-6 flex flex-col h-full space-y-4">
                                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                                        </div>
                                        <span className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Live Email Preview</span>
                                    </div>

                                    {/* Email Frame */}
                                    <div className="flex-grow bg-white text-black p-6 rounded shadow-inner overflow-y-auto max-h-[600px] text-left border border-white/10 font-sans">
                                        {(() => {
                                            const client = clients.find(c => c.id === receivedClientId);
                                            const name = client ? client.clientName : "[Client Contact Name]";
                                            const company = client ? client.companyName : "[Client Company Name]";
                                            const email = client ? client.email : "client@company.com";
                                            const displayAmount = receivedAmount || "[Received Amount]";
                                            const displayDate = receivedDate
                                                ? new Date(receivedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
                                                : "[Payment Date]";

                                            return (
                                                <div style={{ pointerEvents: 'none' }}>
                                                    {/* Email Header Info */}
                                                    <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', marginBottom: '20px', fontSize: '12px', color: '#4b5563' }}>
                                                        <div><strong style={{ color: '#111827' }}>From:</strong> Redlix Accounts &lt;accounts@redlix.co.in&gt;</div>
                                                        <div style={{ marginTop: '4px' }}><strong style={{ color: '#111827' }}>To:</strong> {email}</div>
                                                        <div style={{ marginTop: '4px' }}><strong style={{ color: '#111827' }}>Subject:</strong> Payment Confirmation | Redlix Studio & {company}</div>
                                                    </div>

                                                    {/* Styled Email Body */}
                                                    <div style={{ maxWidth: '600px', margin: '0 auto', border: '1px solid #e0e0e0', backgroundColor: '#ffffff' }}>
                                                        {/* Logo */}
                                                        <div style={{ padding: '15px 30px', borderBottom: '1px solid #eee', textAlign: 'left' }}>
                                                            <img src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1776288139/Screenshot_2026-04-16_at_02.51.43-removebg-preview_ytpg09.png" alt="Redlix Studio" style={{ height: '28px' }} />
                                                        </div>

                                                        {/* Content */}
                                                        <div style={{ padding: '30px' }}>
                                                            {/* Success Animation GIF */}
                                                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                                                <img src="https://raw.githubusercontent.com/ariyanshiputech/custom_quick_alert/main/screenshots/success.gif" alt="Success Checkmark" style={{ width: '70px', height: '70px', display: 'inline-block' }} />
                                                            </div>

                                                            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 5px 0', color: '#111', textAlign: 'center' }}>Payment Confirmed</h2>
                                                            <div style={{ width: '30px', height: '2px', backgroundColor: '#10B981', margin: '0 auto 20px auto' }} />

                                                            <p style={{ fontSize: '14px', lineHeight: '1.5', margin: '0 0 15px 0' }}>
                                                                Hello <strong>{name}</strong>,
                                                            </p>

                                                            <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#374151', margin: '0 0 25px 0' }}>
                                                                We are pleased to confirm that we have received your payment of <strong style={{ color: '#111' }}>{displayAmount}</strong> on <strong>{displayDate}</strong>. Thank you for your business!
                                                            </p>

                                                            {/* Billing Table */}
                                                            <h3 style={{ fontSize: '11px', fontWeight: 'bold', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px 0' }}>Receipt Details</h3>
                                                            <div style={{ backgroundColor: '#f9fafb', padding: '18px', border: '1px solid #e5e7eb', marginBottom: '25px' }}>
                                                                <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                                                                    <tbody>
                                                                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                                            <td style={{ padding: '6px 0', color: '#6b7280', width: '130px' }}>Company</td>
                                                                            <td style={{ padding: '6px 0', fontWeight: '600', color: '#111827' }}>{company}</td>
                                                                        </tr>
                                                                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                                            <td style={{ padding: '6px 0', color: '#6b7280' }}>Billing Contact</td>
                                                                            <td style={{ padding: '6px 0', fontWeight: '600', color: '#111827' }}>{name}</td>
                                                                        </tr>
                                                                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                                            <td style={{ padding: '6px 0', color: '#6b7280' }}>Amount Received</td>
                                                                            <td style={{ padding: '6px 0', fontWeight: '700', color: '#10B981' }}>{displayAmount}</td>
                                                                        </tr>
                                                                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                                            <td style={{ padding: '6px 0', color: '#6b7280' }}>Payment Date</td>
                                                                            <td style={{ padding: '6px 0', fontWeight: '600', color: '#111827' }}>{displayDate}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ padding: '6px 0', color: '#6b7280' }}>Status</td>
                                                                            <td style={{ padding: '6px 0', fontWeight: '700', color: '#10B981' }}>SUCCESS / PAID</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                            {/* PDF File Attachment preview */}
                                                            {receivedReceiptFile && (
                                                                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px', fontSize: '13px', color: '#166534', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '25px' }}>
                                                                    <span style={{ fontSize: '16px' }}>📎</span>
                                                                    <span><strong>Receipt Attached:</strong> {receivedReceiptFile.name} (PDF)</span>
                                                                </div>
                                                            )}

                                                            <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', fontStyle: 'italic', margin: '20px 0 0 0' }}>
                                                                If you have any questions regarding this transaction, please reach out to our billing team.
                                                            </p>
                                                        </div>

                                                        {/* Footer */}
                                                        <div style={{ backgroundColor: '#f9fafb', padding: '30px', borderTop: '1px solid #eee', fontSize: '12px' }}>
                                                            <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#E61E32', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '10px' }}>Billing Lead</p>
                                                            <p style={{ margin: '0', fontSize: '15px', fontWeight: 'bold', color: '#111' }}>Shiva Krishna Manthena</p>
                                                            <p style={{ margin: '2px 0 20px 0', color: '#4b5563' }}>Redlix Studio | Accounts Department</p>

                                                            <div style={{ fontSize: '11px', color: '#9ca3af', lineHeight: '1.6' }}>
                                                                <p style={{ margin: '0' }}>© 2026 Redlix Studio</p>
                                                                <p style={{ margin: '0' }}>Software & IT infrastructure solutions</p>
                                                                <p style={{ margin: '4px 0 0 0', color: '#E61E32', fontWeight: '600' }}>www.redlix.co.in</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ===== MEETINGS TAB ===== */}
                        {activeTab === "meetings" && (
                            <div className="h-full flex gap-6 animate-in fade-in duration-500 overflow-hidden">
                                {/* Left: Meeting List + Form */}
                                <div className="w-[420px] shrink-0 flex flex-col gap-4 overflow-y-auto pr-1">
                                    {showAddMeetingForm && (
                                        <form onSubmit={handleAddMeeting} className="bg-white/[0.02] border border-white/10 p-5 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Schedule New Meeting</h3>
                                                <button type="button" onClick={() => setShowAddMeetingForm(false)}><X className="w-4 h-4 text-white/40 hover:text-white" /></button>
                                            </div>
                                            <input required placeholder="Meeting title *" value={newMeeting.title} onChange={e => setNewMeeting(p => ({ ...p, title: e.target.value }))} className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30" />
                                            <textarea placeholder="Description (optional)" value={newMeeting.description} onChange={e => setNewMeeting(p => ({ ...p, description: e.target.value }))} rows={2} className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 resize-none" />
                                            <input required placeholder="Meeting lead name *" value={newMeeting.meetingLead} onChange={e => setNewMeeting(p => ({ ...p, meetingLead: e.target.value }))} className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30" />
                                            <input placeholder="Meeting link (Google Meet / Zoom)" value={newMeeting.meetingLink} onChange={e => setNewMeeting(p => ({ ...p, meetingLink: e.target.value }))} className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30" />
                                            <div>
                                                <label className="text-[10px] text-white/30 uppercase tracking-wider mb-1 block">Scheduled Date & Time *</label>
                                                <input required type="datetime-local" value={newMeeting.scheduledAt} onChange={e => setNewMeeting(p => ({ ...p, scheduledAt: e.target.value }))} className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-white/30 uppercase tracking-wider mb-2 block">Select Attendees</label>
                                                <div className="space-y-1 max-h-40 overflow-y-auto">
                                                    {employees.map(emp => (
                                                        <label key={emp.id} className="flex items-center gap-2 cursor-pointer group">
                                                            <input
                                                                type="checkbox"
                                                                checked={newMeeting.attendeeIds.includes(emp.id)}
                                                                onChange={e => {
                                                                    if (e.target.checked) {
                                                                        setNewMeeting(p => ({ ...p, attendeeIds: [...p.attendeeIds, emp.id] }));
                                                                    } else {
                                                                        setNewMeeting(p => ({ ...p, attendeeIds: p.attendeeIds.filter(id => id !== emp.id) }));
                                                                    }
                                                                }}
                                                                className="accent-[#E61E32]"
                                                            />
                                                            <span className="text-xs text-white/60 group-hover:text-white">{emp.name} <span className="text-white/30">({emp.role})</span></span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <button type="submit" disabled={isSubmitting} className="w-full py-2.5 bg-[#E61E32] hover:bg-[#E61E32]/80 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Video className="w-4 h-4" /> Schedule Meeting</>}
                                            </button>
                                        </form>
                                    )}

                                    {meetingsLoading ? (
                                        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-white/20" /></div>
                                    ) : meetings.length === 0 ? (
                                        <div className="text-center py-12 text-white/20 text-sm">No meetings scheduled yet.</div>
                                    ) : (
                                        meetings.map(meeting => (
                                            <div
                                                key={meeting.id}
                                                onClick={() => setSelectedMeeting(meeting)}
                                                className={`p-4 border cursor-pointer transition-all space-y-2 ${
                                                    selectedMeeting?.id === meeting.id
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
                                                        {new Date(meeting.scheduledAt) > new Date() ? 'Upcoming' : 'Completed'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-[10px] text-white/30">
                                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(meeting.scheduledAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })}</span>
                                                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{meeting.attendees.length} attendees</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Right: Meeting Detail */}
                                {selectedMeeting ? (
                                    <div className="flex-1 bg-white/[0.02] border border-white/5 p-6 overflow-y-auto space-y-6">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-white">{selectedMeeting.title}</h3>
                                                {selectedMeeting.description && <p className="text-sm text-white/40 mt-1">{selectedMeeting.description}</p>}
                                            </div>
                                            <button onClick={() => handleDeleteMeeting(selectedMeeting.id)} className="p-2 hover:bg-[#E61E32]/10 text-white/30 hover:text-[#E61E32] transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/[0.03] border border-white/5 p-4 space-y-1">
                                                <p className="text-[10px] text-white/30 uppercase tracking-wider">Meeting Lead</p>
                                                <p className="text-sm font-semibold text-white">{selectedMeeting.meetingLead}</p>
                                            </div>
                                            <div className="bg-white/[0.03] border border-white/5 p-4 space-y-1">
                                                <p className="text-[10px] text-white/30 uppercase tracking-wider">Scheduled At</p>
                                                <p className="text-sm font-semibold text-white">{new Date(selectedMeeting.scheduledAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' })}</p>
                                            </div>
                                        </div>

                                        {selectedMeeting.meetingLink && (
                                            <div className="bg-white/[0.03] border border-white/5 p-4">
                                                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Meeting Link</p>
                                                <a href={selectedMeeting.meetingLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#E61E32] text-sm hover:underline">
                                                    <LinkIcon className="w-4 h-4" />{selectedMeeting.meetingLink}
                                                </a>
                                            </div>
                                        )}

                                        <div>
                                            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-3">Attendees ({selectedMeeting.attendees.length})</p>
                                            <div className="space-y-2">
                                                {selectedMeeting.attendees.map(att => (
                                                    <div key={att.id} className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/5">
                                                        <div className="w-7 h-7 rounded-full bg-[#E61E32]/10 border border-[#E61E32]/20 flex items-center justify-center">
                                                            <User className="w-3.5 h-3.5 text-[#E61E32]" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-white">{att.employee.name}</p>
                                                            <p className="text-[10px] text-white/30">{att.employee.role} &middot; {att.employee.email}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {selectedMeeting.attendees.length === 0 && (
                                                    <p className="text-sm text-white/20">No attendees assigned.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center text-white/15 text-sm">
                                        Select a meeting to see details
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ===== DOCUMENTS TAB ===== */}
                        {activeTab === "documents" && (
                            <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500 overflow-y-auto">
                                {showAddDocForm && (
                                    <form onSubmit={handleAddDocument} className="bg-white/[0.02] border border-white/10 p-5 grid grid-cols-2 gap-4">
                                        <div className="col-span-2 flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Add New Document</h3>
                                            <button type="button" onClick={() => setShowAddDocForm(false)}><X className="w-4 h-4 text-white/40 hover:text-white" /></button>
                                        </div>
                                        <input required placeholder="Document title *" value={newDoc.title} onChange={e => setNewDoc(p => ({ ...p, title: e.target.value }))} className="bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30" />
                                        <select value={newDoc.category} onChange={e => setNewDoc(p => ({ ...p, category: e.target.value }))} className="bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30">
                                            <option value="company">Company Document</option>
                                            <option value="client">Client Document</option>
                                            <option value="requirement">Requirement Document</option>
                                            <option value="legal">Legal / Compliance</option>
                                            <option value="other">Other</option>
                                        </select>
                                        <input required placeholder="File name (e.g. NDA_2026.pdf) *" value={newDoc.fileName} onChange={e => setNewDoc(p => ({ ...p, fileName: e.target.value }))} className="bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30" />
                                        <input required placeholder="File URL (Google Drive / S3 link) *" value={newDoc.fileUrl} onChange={e => setNewDoc(p => ({ ...p, fileUrl: e.target.value }))} className="bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30" />
                                        <textarea placeholder="Description (optional)" value={newDoc.description} onChange={e => setNewDoc(p => ({ ...p, description: e.target.value }))} rows={2} className="col-span-2 bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 resize-none" />
                                        <button type="submit" disabled={isSubmitting} className="col-span-2 py-2.5 bg-[#E61E32] hover:bg-[#E61E32]/80 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><FileText className="w-4 h-4" /> Add Document</>}
                                        </button>
                                    </form>
                                )}

                                {documentsLoading ? (
                                    <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-white/20" /></div>
                                ) : documents.length === 0 ? (
                                    <div className="text-center py-16 text-white/20 text-sm">No documents uploaded yet. Click &ldquo;Add Document&rdquo; to get started.</div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                        {documents.map(doc => {
                                            const categoryColors: Record<string, string> = {
                                                company: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
                                                client: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
                                                requirement: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
                                                legal: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
                                                other: 'text-white/40 bg-white/5 border-white/10'
                                            };
                                            return (
                                                <div key={doc.id} className="bg-white/[0.02] border border-white/5 hover:border-white/15 p-5 space-y-3 transition-colors group">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="w-5 h-5 text-[#E61E32] shrink-0" />
                                                            <div>
                                                                <p className="text-sm font-semibold text-white">{doc.title}</p>
                                                                <p className="text-[10px] text-white/30">{doc.fileName}</p>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => handleDeleteDocument(doc.id)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-[#E61E32]/10 text-white/30 hover:text-[#E61E32] transition-all">
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
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

                        {/* ===== DECLARATIONS TAB ===== */}
                        {activeTab === "declarations" && (
                            <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500 overflow-y-auto pr-2 pb-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                                    <div>
                                        <h2 className="text-base font-bold text-white">Employee Declarations</h2>
                                        <p className="text-xs text-white/40 mt-1">Review client declaration documents submitted by employees.</p>
                                    </div>
                                    <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
                                        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-full">
                                            <Hourglass className="w-3 h-3" />
                                            {adminDeclarations.filter(d => d.status === "pending").length} Pending
                                        </span>
                                        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
                                            <CheckCheck className="w-3 h-3" />
                                            {adminDeclarations.filter(d => d.status === "reviewed").length} Reviewed
                                        </span>
                                    </div>
                                </div>

                                {declarationsLoading ? (
                                    <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-white/20" /></div>
                                ) : adminDeclarations.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                                        <FolderUp className="w-12 h-12 text-white/10" />
                                        <p className="text-sm text-white/20">No declarations submitted by employees yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {adminDeclarations.map(decl => (
                                            <div key={decl.id} className="bg-white/[0.02] border border-white/8 rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4 hover:border-white/15 transition-all group">
                                                {/* File icon + info */}
                                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                                    <div className="w-10 h-10 rounded-xl bg-[#E61E32]/10 border border-[#E61E32]/20 flex items-center justify-center shrink-0">
                                                        <FileText className="w-5 h-5 text-[#E61E32]" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <p className="text-sm font-semibold text-white truncate">{decl.fileName}</p>
                                                            <span className="text-[9px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-white/40 px-2 py-0.5 rounded-full">
                                                                {decl.fileType.split('/')[1]?.toUpperCase() || decl.fileType}
                                                            </span>
                                                            <span className="text-[9px] text-white/30">{(decl.fileSize / 1024).toFixed(1)} KB</span>
                                                        </div>
                                                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                                            <span className="flex items-center gap-1 text-[10px] text-white/50">
                                                                <User className="w-3 h-3" />
                                                                {decl.employee.name}
                                                            </span>
                                                            <span className="text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded">{decl.employee.role}</span>
                                                            {decl.clientName && (
                                                                <span className="text-[10px] text-white/50">Client: <span className="text-white/70 font-medium">{decl.clientName}</span></span>
                                                            )}
                                                            {decl.notes && (
                                                                <span className="text-[10px] text-white/40 italic truncate max-w-[200px]">{decl.notes}</span>
                                                            )}
                                                            <span className="text-[10px] text-white/25">{new Date(decl.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2 self-start md:self-auto mt-2 md:mt-0 flex-wrap shrink-0">
                                                    {/* Status Badge + Toggle */}
                                                    <button
                                                        onClick={() => handleReviewDeclaration(decl.id, decl.status === "reviewed" ? "pending" : "reviewed")}
                                                        className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                                                            decl.status === "reviewed"
                                                                ? "text-green-400 bg-green-500/10 border-green-500/20 hover:bg-green-500/20"
                                                                : "text-yellow-400 bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/20"
                                                        }`}
                                                        title={decl.status === "reviewed" ? "Mark as pending" : "Mark as reviewed"}
                                                    >
                                                        {decl.status === "reviewed" ? (
                                                            <><CheckCheck className="w-3 h-3" /> Reviewed</>
                                                        ) : (
                                                            <><Hourglass className="w-3 h-3" /> Pending</>
                                                        )}
                                                    </button>

                                                    {/* Download */}
                                                    <a
                                                        href={decl.fileData}
                                                        download={decl.fileName}
                                                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border text-white/50 bg-white/5 border-white/10 hover:bg-white/10 hover:text-white transition-all"
                                                        title="Download file"
                                                    >
                                                        <Download className="w-3 h-3" /> Download
                                                    </a>

                                                    {/* Delete */}
                                                    <button
                                                        onClick={() => handleDeleteDeclaration(decl.id)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#E61E32]/5 border border-[#E61E32]/10 text-[#E61E32]/50 hover:bg-[#E61E32]/15 hover:text-[#E61E32] hover:border-[#E61E32]/30 transition-all"
                                                        title="Delete declaration"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ===== PAYROLLS TAB ===== */}
                        {activeTab === "payrolls" && (
                            <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500 overflow-y-auto pr-2 pb-6">
                                {showAddPayrollForm && (
                                    <form onSubmit={handleAllocatePayroll} className="bg-white/[0.02] border border-white/10 p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
                                        <div className="md:col-span-2 lg:col-span-4 flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Allocate New Payroll</h3>
                                            <button type="button" onClick={() => setShowAddPayrollForm(false)}><X className="w-4 h-4 text-white/40 hover:text-white" /></button>
                                        </div>
                                        
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Select Employee *</label>
                                            <select 
                                                required 
                                                value={newPayroll.employeeId} 
                                                onChange={e => setNewPayroll(p => ({ ...p, employeeId: e.target.value }))} 
                                                className="bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
                                            >
                                                <option value="" disabled className="bg-[#111]">-- Choose Employee --</option>
                                                {employees.map(emp => (
                                                    <option key={emp.id} value={emp.id} className="bg-[#111]">
                                                        {emp.name} ({emp.role})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Month (e.g. May 2026) *</label>
                                            <input 
                                                required 
                                                placeholder="e.g. May 2026" 
                                                value={newPayroll.month} 
                                                onChange={e => setNewPayroll(p => ({ ...p, month: e.target.value }))} 
                                                className="bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30" 
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Amount (INR) *</label>
                                            <input 
                                                required 
                                                type="number" 
                                                min="0"
                                                placeholder="e.g. 50000" 
                                                value={newPayroll.amount} 
                                                onChange={e => setNewPayroll(p => ({ ...p, amount: e.target.value }))} 
                                                className="bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30" 
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Status *</label>
                                            <select 
                                                value={newPayroll.status} 
                                                onChange={e => setNewPayroll(p => ({ ...p, status: e.target.value }))} 
                                                className="bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
                                            >
                                                <option value="pending" className="bg-[#111]">Pending</option>
                                                <option value="paid" className="bg-[#111]">Paid</option>
                                            </select>
                                        </div>

                                        <button type="submit" disabled={isSubmitting} className="md:col-span-2 lg:col-span-4 py-2.5 bg-[#E61E32] hover:bg-[#E61E32]/80 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CreditCard className="w-4 h-4" /> Allocate Payroll</>}
                                        </button>
                                    </form>
                                )}

                                {payrollsLoading ? (
                                    <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-white/20" /></div>
                                ) : (
                                    (() => {
                                        const filtered = payrolls.filter(p =>
                                            p.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            p.month.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            p.employee.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            (p.upiId && p.upiId.toLowerCase().includes(searchQuery.toLowerCase()))
                                        );

                                        return (
                                            <div className="bg-white/5 border border-white/5 p-6 flex flex-col overflow-hidden">
                                                <div className="overflow-x-auto">
                                                    {filtered.length > 0 ? (
                                                        <table className="w-full text-left text-xs">
                                                            <thead>
                                                                <tr className="border-b border-white/10 text-white/30 uppercase tracking-wider text-[9px] font-bold">
                                                                    <th className="py-3">Employee</th>
                                                                    <th className="py-3">Month</th>
                                                                    <th className="py-3">Amount</th>
                                                                    <th className="py-3">UPI ID</th>
                                                                    <th className="py-3">Status</th>
                                                                    <th className="py-3">Payment Date</th>
                                                                    <th className="py-3 text-right">Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {filtered.map(p => (
                                                                    <tr key={p.id} className="border-b border-white/5 text-white/70 hover:bg-white/[0.01]">
                                                                        <td className="py-3">
                                                                            <p className="font-semibold text-white">{p.employee.name}</p>
                                                                            <p className="text-[10px] text-white/40">{p.employee.role}</p>
                                                                        </td>
                                                                        <td className="py-3 font-medium text-white/90">{p.month}</td>
                                                                        <td className="py-3 text-white font-semibold">₹{p.amount.toLocaleString('en-IN')}</td>
                                                                        <td className="py-3 font-mono text-white/40">{p.upiId || p.employee.upiId || "Not provided"}</td>
                                                                        <td className="py-3">
                                                                            <span className={`px-2 py-0.5 text-[8px] uppercase tracking-widest font-black border ${
                                                                                p.status === 'paid'
                                                                                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                                                    : 'bg-[#E61E32]/10 text-[#E61E32] border-[#E61E32]/20'
                                                                            }`}>
                                                                                {p.status}
                                                                            </span>
                                                                        </td>
                                                                        <td className="py-3 text-white/40">
                                                                            {p.paidAt
                                                                                ? new Date(p.paidAt).toLocaleString('en-IN', {
                                                                                      timeZone: 'Asia/Kolkata',
                                                                                      dateStyle: 'medium',
                                                                                      timeStyle: 'short'
                                                                                  })
                                                                                : "-"}
                                                                        </td>
                                                                        <td className="py-3 text-right">
                                                                            <div className="flex justify-end gap-2">
                                                                                {p.status === "pending" && (
                                                                                    <button 
                                                                                        onClick={() => handleMarkPayrollPaid(p.id)}
                                                                                        className="px-2.5 py-1 bg-green-500 hover:bg-green-600 text-black text-[9px] font-extrabold uppercase tracking-wider transition-all rounded-none cursor-pointer"
                                                                                    >
                                                                                        Mark Paid
                                                                                    </button>
                                                                                )}
                                                                                <button 
                                                                                    onClick={() => handleDeletePayroll(p.id)}
                                                                                    className="p-1 text-white/35 hover:text-[#E61E32] transition-colors"
                                                                                    title="Delete allocation record"
                                                                                >
                                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                                </button>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    ) : (
                                                        <div className="py-16 text-center text-white/20 text-sm">
                                                            No payroll records found. Click &ldquo;Allocate Payroll&rdquo; to add a new record.
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })()
                                )}
                            </div>
                        )}

                        {/* ===== LEAVES TAB ===== */}
                        {activeTab === "leaves" && (
                            <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500 overflow-y-auto pr-2 pb-6">
                                {/* Leave Filters */}
                                <div className="flex flex-wrap gap-2 shrink-0 border-b border-white/5 pb-4">
                                    {(["all", "pending", "approved", "rejected"] as const).map((filter) => {
                                        const count = filter === "all" 
                                            ? leaves.length 
                                            : leaves.filter(l => l.status === filter).length;
                                        const isActive = leaveStatusFilter === filter;
                                        return (
                                            <button
                                                key={filter}
                                                onClick={() => setLeaveStatusFilter(filter)}
                                                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border rounded-none ${
                                                    isActive
                                                        ? "bg-[#E61E32]/10 text-[#E61E32] border-[#E61E32]/35"
                                                        : "bg-white/5 text-white/50 border-white/5 hover:text-white hover:bg-white/10"
                                                }`}
                                            >
                                                {filter} ({count})
                                            </button>
                                        );
                                    })}
                                </div>

                                {leavesLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="w-6 h-6 animate-spin text-white/20" />
                                    </div>
                                ) : (
                                    (() => {
                                        const filtered = leaves.filter(leave => {
                                            const matchesStatus = leaveStatusFilter === "all" || leave.status === leaveStatusFilter;
                                            const matchesQuery = leave.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                leave.employee.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                leave.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                leave.type.toLowerCase().includes(searchQuery.toLowerCase());
                                            return matchesStatus && matchesQuery;
                                        });

                                        return (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {filtered.length > 0 ? (
                                                    filtered.map((leave) => {
                                                        const start = new Date(leave.startDate);
                                                        const end = new Date(leave.endDate);
                                                        const diffTime = Math.abs(end.getTime() - start.getTime());
                                                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                                                        return (
                                                            <div key={leave.id} className="bg-white/5 border border-white/5 p-6 flex flex-col justify-between space-y-4 hover:border-white/10 transition-colors">
                                                                <div className="space-y-3">
                                                                    <div className="flex justify-between items-start gap-4">
                                                                        <div>
                                                                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">{leave.employee.name}</h4>
                                                                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mt-0.5">{leave.employee.role} &bull; {leave.employee.email}</p>
                                                                        </div>
                                                                        <span className={`px-2 py-0.5 text-[8px] uppercase tracking-widest font-black border ${
                                                                            leave.status === 'approved'
                                                                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                                                : leave.status === 'rejected'
                                                                                ? 'bg-[#E61E32]/10 text-[#E61E32] border-[#E61E32]/20'
                                                                                : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                                        }`}>
                                                                            {leave.status}
                                                                        </span>
                                                                    </div>

                                                                    <div className="h-[1px] bg-white/5" />

                                                                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                                                                        <div>
                                                                            <p className="text-[9px] text-white/30 uppercase tracking-wider font-bold">Leave Duration</p>
                                                                            <p className="font-semibold text-white mt-0.5">
                                                                                {start.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' })}
                                                                                {" - "}
                                                                                {end.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' })}
                                                                            </p>
                                                                            <p className="text-[10px] text-white/40">{diffDays} {diffDays === 1 ? 'day' : 'days'}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-[9px] text-white/30 uppercase tracking-wider font-bold text-right">Leave Type</p>
                                                                            <span className="inline-block text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 bg-white/5 border border-white/10 text-white/70 mt-1">
                                                                                {leave.type}
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="text-xs text-white/70 bg-black/20 p-3 border border-white/[0.02] break-words">
                                                                        <p className="text-[9px] font-semibold text-white/45 uppercase tracking-wider mb-1">Employee Reason</p>
                                                                        {leave.reason}
                                                                    </div>

                                                                    {leave.adminNotes && (
                                                                        <div className="text-xs text-white/70 bg-[#E61E32]/5 p-3 border border-[#E61E32]/10 break-words">
                                                                            <p className="text-[9px] font-semibold text-[#E61E32] uppercase tracking-wider mb-1 font-bold">Admin Remarks</p>
                                                                            {leave.adminNotes}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {leave.status === "pending" && (
                                                                    <div className="space-y-3 pt-2">
                                                                        <div className="flex flex-col gap-1.5">
                                                                            <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Admin Notes / Remarks</label>
                                                                            <textarea
                                                                                placeholder="Enter approval/rejection remarks..."
                                                                                value={leaveRemarks[leave.id] || ""}
                                                                                onChange={(e) => setLeaveRemarks(prev => ({ ...prev, [leave.id]: e.target.value }))}
                                                                                rows={2}
                                                                                className="w-full bg-[#111111] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 rounded-none resize-none"
                                                                            />
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-3">
                                                                            <button
                                                                                onClick={() => handleReviewLeave(leave.id, "approved", leaveRemarks[leave.id] || "")}
                                                                                className="py-2 bg-green-500 hover:bg-green-600 text-black text-xs font-black uppercase tracking-wider transition-colors duration-200 rounded-none cursor-pointer text-center"
                                                                            >
                                                                                Approve
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleReviewLeave(leave.id, "rejected", leaveRemarks[leave.id] || "")}
                                                                                className="py-2 bg-[#E61E32] hover:bg-[#C81428] text-white text-xs font-black uppercase tracking-wider transition-colors duration-200 rounded-none cursor-pointer text-center"
                                                                            >
                                                                                Reject
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="md:col-span-2 py-20 text-center border border-dashed border-white/5">
                                                        <p className="text-white/20 text-sm">No leave requests found matching filters.</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()
                                )}
                            </div>
                        )}

                        {/* ===== SETTINGS TAB ===== */}
                        {activeTab === "settings" && (
                            <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500 overflow-y-auto pr-2 pb-6">
                                <div className="bg-white/5 border border-white/5 p-6 space-y-6">
                                    <div className="border-b border-white/5 pb-4">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                            <Settings className="w-5 h-5 text-[#E61E32]" />
                                            System Administration Controls
                                        </h3>
                                        <p className="text-xs text-white/40 mt-1">Configure global server limits, dashboard settings, and perform system actions.</p>
                                    </div>

                                    {/* Danger Zone */}
                                    <div className="border border-[#E61E32]/30 bg-[#E61E32]/5 p-6 space-y-4">
                                        <div className="flex items-center gap-2 text-[#E61E32]">
                                            <AlertCircle className="w-5 h-5 shrink-0" />
                                            <h4 className="font-extrabold uppercase text-xs tracking-wider">Danger Zone — Permanent Action</h4>
                                        </div>
                                        <p className="text-xs text-white/70 max-w-2xl leading-relaxed">
                                            Factory Reset will completely purge all data from your dashboard. This includes deleting all registered Employees, Tasks, Payouts, Documents, Support Tickets, Clients, and Meetings permanently. There is no way to recover this data.
                                        </p>
                                        
                                        <form onSubmit={handleMasterReset} className="space-y-4 max-w-md pt-2">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                                    Type <span className="text-[#E61E32] select-all font-mono">RESET</span> to confirm *
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Type RESET"
                                                    value={resetInput}
                                                    onChange={e => setResetInput(e.target.value)}
                                                    className="w-full bg-[#111111] border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E61E32] transition-colors rounded-none"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={resetInput !== "RESET" || resetLoading}
                                                className="w-full py-3 bg-[#E61E32] hover:bg-[#ff1f34] disabled:bg-white/5 disabled:text-white/20 disabled:border-transparent text-white text-xs font-bold uppercase tracking-widest transition-all rounded-none cursor-pointer flex items-center justify-center gap-2"
                                            >
                                                {resetLoading ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" /> Purging Database...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Trash2 className="w-4 h-4" /> Factory Reset Database
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ─────────────── ALERT SENDER ─────────────── */}
                        {activeTab === "alerts" && (() => {
                            const ALERT_TYPES = [
                                { id: "dashboard_access_pending", label: "Dashboard Access Pending", desc: "Notify employees who haven't accessed their portal yet", icon: <ShieldAlert className="w-5 h-5" />, target: "employees" },
                                { id: "profile_pending", label: "Profile Completion Pending", desc: "Remind employees to fill out their full profile", icon: <UserCheck className="w-5 h-5" />, target: "employees" },
                                { id: "terms_update", label: "Terms & Conditions Update", desc: "Inform clients that T&C have been updated", icon: <FileSignature className="w-5 h-5" />, target: "clients_multi" },
                                { id: "client_info_update", label: "Client Info Update Request", desc: "Ask a specific client to update their project info", icon: <Edit2 className="w-5 h-5" />, target: "client_single" },
                                { id: "new_client_welcome", label: "New Client Welcome", desc: "Send a welcome onboarding email to a new client", icon: <UserPlus className="w-5 h-5" />, target: "client_single" },
                                { id: "custom", label: "Custom Alert", desc: "Write your own subject & message to any recipient(s)", icon: <PenLine className="w-5 h-5" />, target: "custom" },
                            ] as const;

                            const currentType = ALERT_TYPES.find(a => a.id === alertType)!;

                            const handleSendAlert = async (e: React.FormEvent) => {
                                e.preventDefault();
                                setAlertSendStatus('sending');
                                setAlertSendMessage('');
                                try {
                                    let payload: Record<string, unknown> = { alertType, customMessage: alertCustomMessage || undefined };
                                    if (alertType === 'dashboard_access_pending' || alertType === 'profile_pending') {
                                        payload.employeeIds = alertSelectedEmployeeIds;
                                    } else if (alertType === 'terms_update') {
                                        payload.clientIds = alertSelectAllClients ? [] : alertSelectedClientIds;
                                        if (alertEffectiveDate) payload.effectiveDate = alertEffectiveDate;
                                    } else if (alertType === 'client_info_update' || alertType === 'new_client_welcome') {
                                        payload.clientId = alertSingleClientId;
                                    } else if (alertType === 'custom') {
                                        payload.recipients = alertCustomRecipients.split(',').map(e => e.trim()).filter(Boolean);
                                        payload.customSubject = alertCustomSubject;
                                        payload.customBody = alertCustomBody;
                                    }
                                    const res = await fetch('/api/admin/alerts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                                    const data = await res.json();
                                    if (data.success) {
                                        setAlertSendStatus('success');
                                        setAlertSendMessage(data.message);
                                    } else {
                                        setAlertSendStatus('error');
                                        setAlertSendMessage(data.message || 'Failed to send alert');
                                    }
                                } catch {
                                    setAlertSendStatus('error');
                                    setAlertSendMessage('Network error. Please try again.');
                                }
                            };

                            const toggleEmployee = (id: number) => setAlertSelectedEmployeeIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
                            const toggleClient = (id: number) => setAlertSelectedClientIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

                            // Live preview subject
                            const previewSubject = (() => {
                                if (alertType === 'dashboard_access_pending') return 'Action Required: Your Redlix Dashboard Access is Pending';
                                if (alertType === 'profile_pending') return 'Reminder: Complete Your Redlix Employee Profile';
                                if (alertType === 'terms_update') return 'Important: Redlix Studio Terms & Conditions Have Been Updated';
                                if (alertType === 'client_info_update') {
                                    const c = clients.find(x => x.id === alertSingleClientId);
                                    return `Action Required: Please Update Your Client Information — ${c?.companyName || '[Company]'}`;
                                }
                                if (alertType === 'new_client_welcome') {
                                    const c = clients.find(x => x.id === alertSingleClientId);
                                    return `Welcome to Redlix Studio — ${c?.companyName || '[Company]'} is Officially Onboarded!`;
                                }
                                return alertCustomSubject || '[Custom Subject]';
                            })();

                            return (
                                <div className="h-full overflow-y-auto pr-2 pb-6 space-y-6">
                                    {/* Header */}
                                    <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                                        <div className="w-10 h-10 bg-[#E61E32]/10 border border-[#E61E32]/20 flex items-center justify-center text-[#E61E32]">
                                            <Bell className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold">Alert Sender</h2>
                                            <p className="text-xs text-white/40 mt-0.5">Send predefined or custom alert emails via SMTP</p>
                                        </div>
                                    </div>

                                    {/* Alert Type Selector */}
                                    <div>
                                        <p className="text-xs font-semibold text-white/40 mb-3">Select alert type</p>
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                            {ALERT_TYPES.map(type => (
                                                <button
                                                    key={type.id}
                                                    onClick={() => { setAlertType(type.id as typeof alertType); setAlertSendStatus('idle'); setAlertSendMessage(''); setAlertSelectedEmployeeIds([]); setAlertSelectedClientIds([]); setAlertSingleClientId(''); setAlertCustomMessage(''); setAlertCustomSubject(''); setAlertCustomBody(''); setAlertEffectiveDate(''); setAlertSelectAllClients(false); }}
                                                    className={`relative p-4 border text-left transition-all duration-200 group ${
                                                        alertType === type.id
                                                            ? 'border-[#E61E32] bg-[#E61E32]/10 text-white'
                                                            : 'border-white/10 bg-white/[0.02] text-white/50 hover:border-white/20 hover:text-white hover:bg-white/5'
                                                    }`}
                                                >
                                                    {alertType === type.id && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E61E32] animate-pulse" />}
                                                    <div className={`mb-2 ${alertType === type.id ? 'text-[#E61E32]' : 'text-white/40 group-hover:text-white/70'}`}>{type.icon}</div>
                                                    <p className="text-xs font-semibold leading-tight">{type.label}</p>
                                                    <p className="text-[10px] text-white/30 mt-1 leading-relaxed">{type.desc}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Form + Preview */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Form */}
                                        <form onSubmit={handleSendAlert} className="bg-white/5 border border-white/10 p-6 space-y-5">
                                            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                                                <div className="text-[#E61E32]">{currentType.icon}</div>
                                                <div>
                                                    <h3 className="text-sm font-semibold">{currentType.label}</h3>
                                                    <p className="text-[10px] text-white/30 mt-0.5">{currentType.desc}</p>
                                                </div>
                                            </div>

                                            {/* Employee multi-select */}
                                            {(alertType === 'dashboard_access_pending' || alertType === 'profile_pending') && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-xs font-medium text-white/50">Select employees *</label>
                                                        <button type="button" onClick={() => setAlertSelectedEmployeeIds(alertSelectedEmployeeIds.length === employees.length ? [] : employees.map(e => e.id))} className="text-xs text-[#E61E32] font-medium hover:underline">
                                                            {alertSelectedEmployeeIds.length === employees.length ? 'Deselect all' : 'Select all'}
                                                        </button>
                                                    </div>
                                                    <div className="max-h-48 overflow-y-auto space-y-1 border border-white/10 p-2 bg-black">
                                                        {employees.map(emp => (
                                                            <label key={emp.id} className="flex items-center gap-2.5 px-2 py-1.5 hover:bg-white/5 cursor-pointer rounded-none">
                                                                <input type="checkbox" checked={alertSelectedEmployeeIds.includes(emp.id)} onChange={() => toggleEmployee(emp.id)} className="accent-[#E61E32] w-3.5 h-3.5" />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-xs font-medium text-white/80 truncate">{emp.name}</p>
                                                                    <p className="text-[10px] text-white/30 truncate font-mono">{emp.email}</p>
                                                                </div>
                                                                <span className="text-[9px] text-white/20 bg-white/5 px-1.5 py-0.5 shrink-0">{emp.role}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                    {alertSelectedEmployeeIds.length > 0 && (
                                                        <p className="text-[10px] text-[#E61E32] font-medium">{alertSelectedEmployeeIds.length} employee(s) selected</p>
                                                    )}
                                                </div>
                                            )}

                                            {/* Client multi-select for T&C */}
                                            {alertType === 'terms_update' && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-xs font-medium text-white/50">Recipients</label>
                                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                                            <input type="checkbox" checked={alertSelectAllClients} onChange={e => { setAlertSelectAllClients(e.target.checked); setAlertSelectedClientIds([]); }} className="accent-[#E61E32] w-3.5 h-3.5" />
                                                            <span className="text-xs text-white/50 font-medium">Send to all clients</span>
                                                        </label>
                                                    </div>
                                                    {!alertSelectAllClients && (
                                                        <div className="max-h-40 overflow-y-auto space-y-1 border border-white/10 p-2 bg-black">
                                                            {clients.map(c => (
                                                                <label key={c.id} className="flex items-center gap-2.5 px-2 py-1.5 hover:bg-white/5 cursor-pointer">
                                                                    <input type="checkbox" checked={alertSelectedClientIds.includes(c.id)} onChange={() => toggleClient(c.id)} className="accent-[#E61E32] w-3.5 h-3.5" />
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-xs font-medium text-white/80 truncate">{c.companyName}</p>
                                                                        <p className="text-[10px] text-white/30 truncate font-mono">{c.email}</p>
                                                                    </div>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-medium text-white/50 block">Effective date (optional)</label>
                                                        <input type="date" value={alertEffectiveDate} onChange={e => setAlertEffectiveDate(e.target.value)} className="w-full bg-black border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 text-white" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Single client select */}
                                            {(alertType === 'client_info_update' || alertType === 'new_client_welcome') && (
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-medium text-white/50">Select client *</label>
                                                    <select required value={alertSingleClientId} onChange={e => setAlertSingleClientId(e.target.value === '' ? '' : Number(e.target.value))} className="w-full bg-black border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 text-white">
                                                        <option value="" className="bg-[#0f0f0f]">Choose a client...</option>
                                                        {clients.map(c => (<option key={c.id} value={c.id} className="bg-[#0f0f0f]">{c.companyName} — {c.clientName}</option>))}
                                                    </select>
                                                    {alertSingleClientId !== '' && (() => {
                                                        const c = clients.find(x => x.id === alertSingleClientId);
                                                        if (!c) return null;
                                                        return (
                                                            <div className="p-3 bg-white/[0.02] border border-white/5 space-y-1.5 animate-in fade-in duration-200">
                                                                <p className="text-xs text-[#E61E32] font-semibold">Client details</p>
                                                                <div className="grid grid-cols-2 gap-2 text-[11px]">
                                                                    <div><span className="text-white/30 block">Company</span><span className="text-white/70 font-medium">{c.companyName}</span></div>
                                                                    <div><span className="text-white/30 block">Contact</span><span className="text-white/70 font-medium">{c.clientName}</span></div>
                                                                    <div className="col-span-2"><span className="text-white/30 block">Email</span><span className="text-white/70 font-mono">{c.email}</span></div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            )}

                                            {/* Custom alert fields */}
                                            {alertType === 'custom' && (
                                                <div className="space-y-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-medium text-white/50">Recipients (comma-separated emails) *</label>
                                                        <textarea required rows={2} placeholder="user@example.com, another@email.com" value={alertCustomRecipients} onChange={e => setAlertCustomRecipients(e.target.value)} className="w-full bg-black border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 text-white resize-none" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-medium text-white/50">Subject *</label>
                                                        <input required type="text" placeholder="Email subject line" value={alertCustomSubject} onChange={e => setAlertCustomSubject(e.target.value)} className="w-full bg-black border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 text-white" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-medium text-white/50">Message body *</label>
                                                        <textarea required rows={5} placeholder="Type your alert message here..." value={alertCustomBody} onChange={e => setAlertCustomBody(e.target.value)} className="w-full bg-black border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 text-white resize-none" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Optional additional note for all non-custom types */}
                                            {alertType !== 'custom' && (
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-medium text-white/50">Additional note (optional)</label>
                                                    <textarea rows={3} placeholder="Add a personal note that will appear highlighted in the email..." value={alertCustomMessage} onChange={e => setAlertCustomMessage(e.target.value)} className="w-full bg-black border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 text-white resize-none" />
                                                </div>
                                            )}

                                            {/* Send Button */}
                                            <button
                                                type="submit"
                                                disabled={alertSendStatus === 'sending' ||
                                                    ((alertType === 'dashboard_access_pending' || alertType === 'profile_pending') && alertSelectedEmployeeIds.length === 0) ||
                                                    (alertType === 'terms_update' && !alertSelectAllClients && alertSelectedClientIds.length === 0) ||
                                                    ((alertType === 'client_info_update' || alertType === 'new_client_welcome') && alertSingleClientId === '') ||
                                                    (alertType === 'custom' && (!alertCustomRecipients || !alertCustomSubject || !alertCustomBody))
                                                }
                                                className="w-full flex items-center justify-center gap-2 bg-[#E61E32] hover:bg-[#E61E32]/90 disabled:bg-[#E61E32]/30 disabled:cursor-not-allowed text-white font-semibold py-4 text-sm transition-all"
                                            >
                                                {alertSendStatus === 'sending' ? (
                                                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending alert...</>
                                                ) : (
                                                    <><Send className="w-4 h-4" /> Send alert email</>
                                                )}
                                            </button>

                                            {/* Status */}
                                            {alertSendStatus === 'success' && (
                                                <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium text-center">
                                                    ✓ {alertSendMessage}
                                                </div>
                                            )}
                                            {alertSendStatus === 'error' && (
                                                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center flex items-center justify-center gap-2">
                                                    <AlertCircle className="w-4 h-4" /> {alertSendMessage}
                                                </div>
                                            )}
                                        </form>

                                        {/* Live Preview */}
                                        <div className="bg-white/5 border border-white/5 p-5 flex flex-col space-y-4">
                                            <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                                                </div>
                                                <span className="text-xs text-white/30 font-mono">Live email preview</span>
                                            </div>
                                            <div className="flex-grow bg-white text-black p-4 overflow-y-auto max-h-[620px] text-left text-[13px] font-sans">
                                                {/* Email header meta */}
                                                <div style={{borderBottom:'1px solid #e5e7eb',paddingBottom:'10px',marginBottom:'16px',fontSize:'11px',color:'#6b7280'}}>
                                                    <div><strong style={{color:'#111'}}>From:</strong> Redlix Admin &lt;{process.env.SMTP_EMAIL || 'admin@redlix.co.in'}&gt;</div>
                                                    <div style={{marginTop:'3px'}}><strong style={{color:'#111'}}>To:</strong> {alertType === 'custom' ? (alertCustomRecipients || '[Recipients]') : alertType === 'terms_update' ? (alertSelectAllClients ? 'All Clients' : alertSelectedClientIds.length > 0 ? `${alertSelectedClientIds.length} client(s)` : '[Select Clients]') : alertType === 'new_client_welcome' || alertType === 'client_info_update' ? (clients.find(c => c.id === alertSingleClientId)?.email || '[Client Email]') : alertSelectedEmployeeIds.length > 0 ? `${alertSelectedEmployeeIds.length} employee(s)` : '[Select Employees]'}</div>
                                                    <div style={{marginTop:'3px'}}><strong style={{color:'#111'}}>Subject:</strong> {previewSubject}</div>
                                                </div>
                                                {/* Preview body */}
                                                <div style={{maxWidth:'560px',margin:'0 auto',border:'1px solid #e0e0e0',backgroundColor:'#fff'}}>
                                                    <div style={{backgroundColor:'#0a0a0a',padding:'18px 28px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                                                        <img src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1776288139/Screenshot_2026-04-16_at_02.51.43-removebg-preview_ytpg09.png" alt="Redlix" style={{height:'24px',filter:'brightness(0) invert(1)'}} />
                                                        <span style={{fontSize:'8px',fontWeight:700,letterSpacing:'0.2em',color:'#E61E32',textTransform:'uppercase'}}>
                                                            {alertType === 'dashboard_access_pending' ? 'Portal Alert' : alertType === 'profile_pending' ? 'Profile Reminder' : alertType === 'terms_update' ? 'Terms Update' : alertType === 'client_info_update' ? 'Info Update' : alertType === 'new_client_welcome' ? 'Welcome' : 'Admin Alert'}
                                                        </span>
                                                    </div>
                                                    <div style={{padding:'28px'}}>
                                                        <h2 style={{fontSize:'16px',fontWeight:800,color:'#0a0a0a',margin:'0 0 6px 0'}}>
                                                            {alertType === 'dashboard_access_pending' && 'Dashboard Access — Pending'}
                                                            {alertType === 'profile_pending' && 'Profile Incomplete — Action Needed'}
                                                            {alertType === 'terms_update' && 'Terms & Conditions Updated'}
                                                            {alertType === 'client_info_update' && 'Client Information Update Request'}
                                                            {alertType === 'new_client_welcome' && 'Welcome to Redlix Studio!'}
                                                            {alertType === 'custom' && (alertCustomSubject || '[Your Subject]')}
                                                        </h2>
                                                        <div style={{width:'30px',height:'3px',backgroundColor:'#E61E32',marginBottom:'20px'}} />
                                                        <p style={{fontSize:'13px',lineHeight:1.7,color:'#444',marginBottom:'16px'}}>
                                                            {alertType === 'dashboard_access_pending' && 'Your Redlix Employee Dashboard access is still pending. Please complete the setup steps to activate your account.'}
                                                            {alertType === 'profile_pending' && 'Your employee profile on the Redlix Portal is incomplete. Please log in and update your missing details.'}
                                                            {alertType === 'terms_update' && `Redlix Studio has updated its Terms & Conditions${alertEffectiveDate ? `, effective ${new Date(alertEffectiveDate).toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'})}` : ''}. Please review the changes.`}
                                                            {alertType === 'client_info_update' && (() => { const c = clients.find(x => x.id === alertSingleClientId); return c ? `Dear ${c.clientName}, we require you to review and update your project information for ${c.companyName}.` : 'Select a client to see the preview.'; })()}
                                                            {alertType === 'new_client_welcome' && (() => { const c = clients.find(x => x.id === alertSingleClientId); return c ? `Welcome ${c.clientName}! We are thrilled to have ${c.companyName} as our newest client.` : 'Select a client to see the preview.'; })()}
                                                            {alertType === 'custom' && (alertCustomBody || 'Your message will appear here...')}
                                                        </p>
                                                        {alertCustomMessage && alertType !== 'custom' && (
                                                            <div style={{borderLeft:'3px solid #E61E32',padding:'10px 14px',backgroundColor:'#fef2f2',marginBottom:'16px',fontSize:'12px',color:'#555'}}>
                                                                <strong>Note from Admin:</strong> {alertCustomMessage}
                                                            </div>
                                                        )}
                                                        <div style={{marginTop:'24px',paddingTop:'16px',borderTop:'1px solid #eee'}}>
                                                            <p style={{margin:0,fontSize:'10px',fontWeight:700,color:'#E61E32',textTransform:'uppercase',letterSpacing:'0.1em'}}>
                                                                {alertType === 'profile_pending' ? 'Redlix HR Team' : alertType === 'terms_update' ? 'Redlix Legal & Compliance' : alertType === 'client_info_update' ? 'Redlix Client Relations' : alertType === 'new_client_welcome' ? 'Redlix Client Success' : 'Redlix Admin Team'}
                                                            </p>
                                                            <p style={{margin:'4px 0 0',fontSize:'11px',color:'#666'}}>Redlix Studio</p>
                                                        </div>
                                                    </div>
                                                    <div style={{backgroundColor:'#fafafa',padding:'16px 28px',borderTop:'1px solid #eee'}}>
                                                        <p style={{margin:0,fontSize:'10px',color:'#999',lineHeight:1.8}}>© 2026 Redlix Studio · www.redlix.co.in<br/>This is an automated notification.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                    </div>
                </div>
            </div>
        </main>
    );
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

function InfoBlock({ label, value }: { label: string, value?: string }) {
    if (!value) return null;
    return (
        <div className="space-y-0.5">
            <p className="text-[11px] font-medium text-white/20">{label}</p>
            <p className="text-sm text-white/80 whitespace-pre-wrap">{renderTextWithLinks(value)}</p>
        </div>
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

interface SharpLineChartProps {
    data: number[];
    labels: string[];
    color: string;
    gradientId: string;
}

function SharpLineChart({ data, labels, color, gradientId }: SharpLineChartProps) {
    const width = 500;
    const height = 180;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 30;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const max = Math.max(...data, 1);
    const min = 0;

    const points = data.map((val, idx) => {
        const x = paddingLeft + (idx / Math.max(data.length - 1, 1)) * chartWidth;
        const y = paddingTop + chartHeight - ((val - min) / (max - min)) * chartHeight;
        return { x, y, val, label: labels[idx] };
    });

    const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const areaPath = points.length > 0
        ? `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
        : "";

    return (
        <div className="relative w-full">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.15" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.0" />
                    </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                    const y = paddingTop + chartHeight * ratio;
                    const val = max - (max - min) * ratio;
                    return (
                        <g key={i}>
                            <line
                                x1={paddingLeft}
                                y1={y}
                                x2={width - paddingRight}
                                y2={y}
                                stroke="rgba(255,255,255,0.05)"
                                strokeDasharray="3,3"
                            />
                            <text
                                x={paddingLeft - 8}
                                y={y + 4}
                                fill="rgba(255,255,255,0.3)"
                                fontSize="9"
                                textAnchor="end"
                                className="font-mono"
                            >
                                {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : Math.round(val)}
                            </text>
                        </g>
                    );
                })}

                {/* X Axis Labels */}
                {points.map((p, i) => (
                    <text
                        key={i}
                        x={p.x}
                        y={height - 10}
                        fill="rgba(255,255,255,0.3)"
                        fontSize="9"
                        textAnchor="middle"
                        className="font-mono"
                    >
                        {p.label}
                    </text>
                ))}

                {/* Area fill */}
                {areaPath && (
                    <path
                        d={areaPath}
                        fill={`url(#${gradientId})`}
                    />
                )}

                {/* Sharp line */}
                {linePath && (
                    <path
                        d={linePath}
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                    />
                )}

                {/* Dots */}
                {points.map((p, i) => (
                    <g key={i} className="group cursor-pointer">
                        <circle
                            cx={p.x}
                            cy={p.y}
                            r="3.5"
                            fill={color}
                            stroke="#0a0a0a"
                            strokeWidth="1.5"
                        />
                        <circle
                            cx={p.x}
                            cy={p.y}
                            r="10"
                            fill="transparent"
                            className="hover:fill-white/10 transition-colors"
                        />
                        <title>{`${p.label}: ${p.val.toLocaleString()}`}</title>
                    </g>
                ))}
            </svg>
        </div>
    );
}
