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
    Hourglass,
    Eye,
    Printer,
    Menu,
    ChevronRight,
    Paperclip
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
    division?: string;
    pinkSlipAllocatedAt?: string | null;
    pinkSlipRequest?: string | null;
    pinkSlipRequestAt?: string | null;
    pinkSlipRevoked?: boolean;
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
    const [activeTab, setActiveTab] = useState<"overview" | "inquiries" | "employees" | "attendance" | "tasks" | "support" | "intern-support" | "clients" | "payment-due-sender" | "payment-received-sender" | "meetings" | "documents" | "payrolls" | "leaves" | "alerts" | "settings" | "declarations" | "receipt-generator" | "submissions">("overview");

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
    const [previewFile, setPreviewFile] = useState<{ name: string; type: string; data: string } | null>(null);

    // Admin Work Submissions states
    interface AdminWorkSubmission {
        id: number;
        employeeId: number;
        employee: {
            id: number;
            name: string;
            email: string;
            role: string;
            avatar?: string | null;
        };
        clientId: number;
        client: {
            id: number;
            companyName: string;
            clientName: string;
            appName?: string | null;
        };
        websiteLink: string;
        gitRepoLink: string;
        createdAt: string;
    }
    const [adminSubmissions, setAdminSubmissions] = useState<AdminWorkSubmission[]>([]);
    const [submissionsLoading, setSubmissionsLoading] = useState(false);

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
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [attendanceSubView, setAttendanceSubView] = useState<"logs" | "today">("logs");

    // Pink Slip state
    const [pinkSlipModalEmployeeId, setPinkSlipModalEmployeeId] = useState<number | null>(null);
    const [isPinkSlipAllocating, setIsPinkSlipAllocating] = useState(false);
    const [showPinkSlipModal, setShowPinkSlipModal] = useState(false);

    // Employee Form State
    const [showAddForm, setShowAddForm] = useState(false);
    const [showOnboardForm, setShowOnboardForm] = useState(false);
    const [newEmployee, setNewEmployee] = useState({ name: "", email: "", role: "", password: "", offerLetterLink: "", isDeptAdmin: false, division: "" });
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
    
    const [alertType, setAlertType] = useState<"dashboard_access_pending" | "profile_pending" | "terms_update" | "client_info_update" | "new_client_welcome" | "custom" | "push_notification">("dashboard_access_pending");
    const [alertPushTitle, setAlertPushTitle] = useState("");
    const [alertPushBody, setAlertPushBody] = useState("");
    const [alertFcmCount, setAlertFcmCount] = useState<number>(0);
    const [alertFcmSubscribers, setAlertFcmSubscribers] = useState<any[]>([]);
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

    // Selective Table Purge States
    const [selectedPurgeTable, setSelectedPurgeTable] = useState<string>("");
    const [purgeConfirmInput, setPurgeConfirmInput] = useState<string>("");
    const [isPurgingTable, setIsPurgingTable] = useState<boolean>(false);

    const handlePurgeTable = async (e: React.FormEvent) => {
        e.preventDefault();
        if (purgeConfirmInput !== "CONFIRM") {
            alert("Please type CONFIRM to proceed");
            return;
        }
        if (!selectedPurgeTable) {
            alert("Please select a table to purge");
            return;
        }

        const confirmFinal = window.confirm(`Are you absolutely sure you want to permanently clear all data from "${selectedPurgeTable}"? This action is irreversible.`);
        if (!confirmFinal) return;

        setIsPurgingTable(true);
        try {
            const res = await fetch("/api/admin/reset/table", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ table: selectedPurgeTable })
            });
            const data = await res.json();
            if (data.success) {
                alert(data.message || `Table ${selectedPurgeTable} cleared successfully!`);
                setPurgeConfirmInput("");
                setSelectedPurgeTable("");
            } else {
                alert(data.message || `Failed to clear data from ${selectedPurgeTable}`);
            }
        } catch (error) {
            console.error("Purge table error:", error);
            alert("A connection error occurred. Please try again.");
        } finally {
            setIsPurgingTable(false);
        }
    };

    // Pricing slots states
    const [slotsStatus, setSlotsStatus] = useState<"available" | "booked">("available");
    const [slotsCount, setSlotsCount] = useState<number>(3);
    const [currentMonthOverride, setCurrentMonthOverride] = useState<string>("");
    const [nextMonthOverride, setNextMonthOverride] = useState<string>("");
    const [isSavingSlots, setIsSavingSlots] = useState(false);
    const [slotsLoading, setSlotsLoading] = useState(false);

    // Receipt Generator states
    interface ReceiptItem {
        id: string;
        category: string;
        description: string;
        quantity: number;
        rate: number;
    }
    const [receiptClientId, setReceiptClientId] = useState<number | "">("");
    const [receiptCompanyAddress, setReceiptCompanyAddress] = useState(
        "Redlix Studio\nSoftware & IT Solutions\nHyderabad, Telangana, India\nsupport@redlix.co.in | www.redlix.co.in"
    );
    const [receiptBillToCompany, setReceiptBillToCompany] = useState("");
    const [receiptBillToName, setReceiptBillToName] = useState("");
    const [receiptBillToEmail, setReceiptBillToEmail] = useState("");
    const [receiptBillToPhone, setReceiptBillToPhone] = useState("");

    const [receiptInvoiceNumber, setReceiptInvoiceNumber] = useState("");
    const [receiptInvoiceDate, setReceiptInvoiceDate] = useState("");
    const [receiptDueDate, setReceiptDueDate] = useState("");
    const [receiptCurrency, setReceiptCurrency] = useState("₹");
    const [receiptItems, setReceiptItems] = useState<ReceiptItem[]>([
        { id: "1", category: "Web Development", description: "Development of custom web application", quantity: 1, rate: 0 }
    ]);
    const [receiptMemo, setReceiptMemo] = useState(
        "Memo:\nFor Singapore: GST is applied\nFor other countries: Prices are Net\nReverse charge: Customer to account for VAT/GST to their relevant authority"
    );
    const [receiptSendStatus, setReceiptSendStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [receiptErrorMessage, setReceiptErrorMessage] = useState("");

    useEffect(() => {
        if (receiptClientId !== "") {
            const client = clients.find(c => c.id === receiptClientId);
            if (client) {
                setReceiptBillToCompany(client.companyName || "");
                setReceiptBillToName(client.clientName || "");
                setReceiptBillToEmail(client.email || "");
                setReceiptBillToPhone(client.phone || "");
            }
        } else {
            setReceiptBillToCompany("");
            setReceiptBillToName("");
            setReceiptBillToEmail("");
            setReceiptBillToPhone("");
        }
    }, [receiptClientId, clients]);

    useEffect(() => {
        setSidebarOpen(false);
    }, [activeTab]);

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setReceiptInvoiceDate(today);
        setReceiptDueDate(today);
        
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        setReceiptInvoiceNumber(`RED-${new Date().getFullYear()}-${randomNum}`);
    }, []);

    const handleAddReceiptItem = () => {
        const newId = (receiptItems.length + 1).toString();
        setReceiptItems([
            ...receiptItems,
            { id: newId, category: "", description: "", quantity: 1, rate: 0 }
        ]);
    };

    const handleRemoveReceiptItem = (id: string) => {
        if (receiptItems.length <= 1) return;
        setReceiptItems(receiptItems.filter(item => item.id !== id));
    };

    const handleUpdateReceiptItem = (id: string, field: keyof ReceiptItem, value: any) => {
        setReceiptItems(
            receiptItems.map(item => {
                if (item.id === id) {
                    return { ...item, [field]: value };
                }
                return item;
            })
        );
    };

    const handleSendGeneratedReceiptEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!receiptBillToEmail || !receiptItems.length) {
            alert("Missing required email field or invoice items");
            return;
        }

        if (!receiptClientId) {
            alert("Email confirmation is only supported for registered database clients. Please select a registered client first, or use the Print/Save PDF button.");
            return;
        }

        setReceiptSendStatus('sending');
        setReceiptErrorMessage("");

        const subtotal = receiptItems.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
        const displayAmount = `${receiptCurrency}${subtotal.toLocaleString()}`;

        try {
            const res = await fetch("/api/admin/clients/send-receipt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clientId: Number(receiptClientId),
                    amount: displayAmount,
                    paymentDate: receiptInvoiceDate,
                    transactionId: receiptInvoiceNumber,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setReceiptSendStatus('success');
                setTimeout(() => setReceiptSendStatus('idle'), 4000);
            } else {
                setReceiptSendStatus('error');
                setReceiptErrorMessage(data.message || "Failed to send receipt confirmation email.");
            }
        } catch (error) {
            console.error("Failed to send receipt email:", error);
            setReceiptSendStatus('error');
            setReceiptErrorMessage("An error occurred. Please try again.");
        }
    };

    const fetchPricingSlots = async () => {
        setSlotsLoading(true);
        try {
            const res = await fetch("/api/admin/pricing-slots");
            const data = await res.json();
            if (data.success && data.data) {
                setSlotsStatus(data.data.status || "available");
                setSlotsCount(data.data.slots ?? 3);
                setCurrentMonthOverride(data.data.currentMonth || "");
                setNextMonthOverride(data.data.nextMonth || "");
            }
        } catch (error) {
            console.error("Error fetching pricing slots:", error);
        } finally {
            setSlotsLoading(false);
        }
    };

    const handleSaveSlots = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingSlots(true);
        try {
            const res = await fetch("/api/admin/pricing-slots", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: slotsStatus,
                    slots: slotsCount,
                    currentMonth: currentMonthOverride,
                    nextMonth: nextMonthOverride
                })
            });
            const data = await res.json();
            if (data.success) {
                alert("Pricing slot configuration saved successfully!");
            } else {
                alert(data.message || "Failed to save pricing slot configuration");
            }
        } catch (error) {
            console.error("Save slots error:", error);
            alert("A connection error occurred. Please try again.");
        } finally {
            setIsSavingSlots(false);
        }
    };

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
    const [payrollSubView, setPayrollSubView] = useState<"payouts" | "amount-generated">("payouts");
    const [newPayroll, setNewPayroll] = useState({
        employeeId: "",
        month: "",
        amount: "",
        status: "pending"
    });

    interface ClientRevenue {
        id: number;
        clientId?: number | null;
        clientName: string;
        month: string;
        amount: number;
        notes?: string | null;
        receivedAt?: string | null;
        createdAt: string;
        client?: {
            id: number;
            companyName: string;
            clientName: string;
            email?: string;
        } | null;
    }
    const [clientRevenues, setClientRevenues] = useState<ClientRevenue[]>([]);
    const [clientRevenuesLoading, setClientRevenuesLoading] = useState(false);
    const [showAddRevenueForm, setShowAddRevenueForm] = useState(false);
    const [newRevenue, setNewRevenue] = useState({
        clientId: "",
        clientName: "",
        month: "",
        amount: "",
        notes: "",
        receivedAt: "",
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

    // Real-time badge indicators for admin sidebar
    const unreadInquiriesCount = inquiries.filter(i => !i.isRead).length;
    const pendingTicketsCount = tickets.filter(t => t.status === "pending").length;
    const pendingInternTicketsCount = internTickets.filter(t => t.status === "pending").length;
    const employeesCount = employees.length;
    const pendingTasksCount = tasks.filter(t => t.status !== "completed").length;
    const clientsCount = clients.length;
    const upcomingMeetingsCount = meetings.filter(m => new Date(m.scheduledAt) > new Date()).length;
    const documentsCount = documents.length;
    const pendingDeclarationsCount = adminDeclarations.filter(d => d.status === "pending").length;
    const pendingPayrollsCount = payrolls.filter(p => p.status === "pending").length;
    const pendingLeavesCount = leaves.filter(l => l.status === "pending").length;

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
            return clientRevenues.filter(r => {
                const monthDate = new Date(`${r.month} 1`);
                if (!isNaN(monthDate.getTime())) {
                    return monthDate.getFullYear() === m.year && monthDate.getMonth() === m.monthVal;
                }
                const rDate = r.receivedAt ? new Date(r.receivedAt) : (r.createdAt ? new Date(r.createdAt) : null);
                if (!rDate || isNaN(rDate.getTime())) return false;
                return rDate.getFullYear() === m.year && rDate.getMonth() === m.monthVal;
            }).reduce((sum, r) => sum + (r.amount || 0), 0);
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
        } else if (activeTab === "submissions") {
            fetchAdminSubmissions();
        } else if (activeTab === "attendance") {
            fetchGlobalAttendance();
            fetchEmployees();
        } else if (activeTab === "payrolls") {
            fetchPayrolls();
            fetchClientRevenues();
            fetchEmployees();
            fetchClients();
        } else if (activeTab === "leaves") {
            fetchLeaves();
        } else if (activeTab === "alerts") {
            fetchEmployees();
            fetchClients();
            fetchFcmSubscribers();
        } else if (activeTab === "settings") {
            fetchPricingSlots();
        } else {
            fetchClients();
        }
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === "payment-due-sender" || activeTab === "payment-received-sender" || activeTab === "payrolls" || activeTab === "receipt-generator") {
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
                fetchAdminDeclarations(),
                fetchGlobalAttendance(),
                fetchPayrolls(),
                fetchClientRevenues(),
                fetchLeaves(),
                fetchFcmSubscribers()
            ]);
        } catch (error) {
            console.error("Failed to fetch all data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFcmSubscribers = async () => {
        try {
            const res = await fetch("/api/admin/notifications/subscribers");
            const data = await res.json();
            if (data.success) {
                setAlertFcmCount(data.count);
                setAlertFcmSubscribers(data.subscribers || []);
            }
        } catch (error) {
            console.error("Failed to fetch FCM subscribers:", error);
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

    const fetchAdminSubmissions = async () => {
        setSubmissionsLoading(true);
        try {
            const res = await fetch("/api/admin/submissions");
            const data = await res.json();
            if (data.success) setAdminSubmissions(data.data);
        } catch (error) {
            console.error("Failed to fetch admin submissions:", error);
        } finally {
            setSubmissionsLoading(false);
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

    const fetchClientRevenues = async () => {
        setClientRevenuesLoading(true);
        try {
            const res = await fetch("/api/admin/client-revenue");
            const data = await res.json();
            if (data.success) setClientRevenues(data.data);
        } catch (error) {
            console.error("Failed to fetch client revenue:", error);
        } finally {
            setClientRevenuesLoading(false);
        }
    };

    const handleAddClientRevenue = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/admin/client-revenue", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newRevenue),
            });
            const data = await res.json();
            if (data.success) {
                setClientRevenues([data.data, ...clientRevenues]);
                setShowAddRevenueForm(false);
                setNewRevenue({ clientId: "", clientName: "", month: "", amount: "", notes: "", receivedAt: "" });
            } else {
                alert(data.message || "Failed to save amount generated");
            }
        } catch (error) {
            console.error("Failed to add client revenue:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClientRevenue = async (id: number) => {
        if (!confirm("Delete this revenue record?")) return;
        try {
            const res = await fetch(`/api/admin/client-revenue/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                setClientRevenues(clientRevenues.filter(r => r.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete client revenue:", error);
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
                setNewEmployee({ name: "", email: "", role: "", password: "", offerLetterLink: "", isDeptAdmin: false, division: "" });
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

    const handleAllocatePinkSlip = async (employeeId: number) => {
        setIsPinkSlipAllocating(true);
        try {
            const res = await fetch(`/api/admin/employees/${employeeId}/pink-slip`, { method: "POST" });
            const data = await res.json();
            if (data.success) {
                // Update local employee state to reflect the pink slip
                setEmployees(prev => prev.map(emp =>
                    emp.id === employeeId
                        ? { ...emp, pinkSlipAllocatedAt: new Date().toISOString(), pinkSlipRevoked: false }
                        : emp
                ));
                if (selectedEmployee?.id === employeeId) {
                    setSelectedEmployee(prev => prev ? { ...prev, pinkSlipAllocatedAt: new Date().toISOString(), pinkSlipRevoked: false } : prev);
                }
                setShowPinkSlipModal(false);
                alert(`Pink slip allocated successfully. Notification email sent to the employee.`);
            } else {
                alert(data.message || "Failed to allocate pink slip");
            }
        } catch (error) {
            console.error("Failed to allocate pink slip:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsPinkSlipAllocating(false);
        }
    };

    const handleRevokePinkSlip = async (employeeId: number) => {
        if (!confirm("Are you sure you want to REVOKE the pink slip for this employee? This will restore their full access.")) return;
        try {
            const res = await fetch(`/api/admin/employees/${employeeId}/pink-slip`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                setEmployees(prev => prev.map(emp =>
                    emp.id === employeeId
                        ? { ...emp, pinkSlipAllocatedAt: null, pinkSlipRevoked: true }
                        : emp
                ));
                if (selectedEmployee?.id === employeeId) {
                    setSelectedEmployee(prev => prev ? { ...prev, pinkSlipAllocatedAt: null, pinkSlipRevoked: true } : prev);
                }
                alert("Pink slip revoked. Employee access has been restored.");
            } else {
                alert(data.message || "Failed to revoke pink slip");
            }
        } catch (error) {
            console.error("Failed to revoke pink slip:", error);
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

    const filteredSubmissions = adminSubmissions.filter(sub =>
        sub.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.client.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.websiteLink.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.gitRepoLink.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const analyticsData = activeTab === "overview" ? getAnalyticsData() : null;
    const taskStats = {
        pending: tasks.filter((t) => t.status === "pending").length,
        inProgress: tasks.filter((t) => t.status === "in_progress").length,
        completed: tasks.filter((t) => t.status === "completed").length,
        total: tasks.length,
    };

    return (
        <main className="h-screen bg-[#0a0a0a] text-white flex font-sans overflow-hidden">
            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            {/* Sidebar */}
            <aside className={`no-print fixed lg:static inset-y-0 left-0 z-50 w-64 max-w-[85vw] border-r border-white/5 bg-[#0f0f0f] flex flex-col p-4 md:p-6 space-y-6 shrink-0 h-full overflow-y-auto transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
                <div className="px-2 md:px-4 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                        <img
                            src="https://ik.imagekit.io/dypkhqxip/logo__1_?updatedAt=1781048454786"
                            alt="Redlix Logo"
                            className="h-[42px] w-auto brightness-0 invert opacity-95 object-contain"
                        />
                        <span className="bg-[#E61E32]/10 text-[#E61E32] text-xs font-bold px-1.5 py-0.5 rounded-lg border border-[#E61E32]/20 shrink-0">
                            Admin
                        </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-1.5 text-white/50 hover:text-white border border-white/10"
                            aria-label="Close menu"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-white/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span>Online</span>
                    </div>
                </div>

                <nav className="flex-grow space-y-1">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg ${activeTab ==='overview'?'bg-[#E61E32]/10 text-[#E61E32]':'text-white/50 hover:text-white hover:bg-white/5'}`}
                    >
                        <Globe className="w-4 h-4" />
                        Overview
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <div className="space-y-1">
                        <button
                            onClick={() => setIsSupportOpen(!isSupportOpen)}
                            className={`w-full flex items-center justify-between text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg ${(activeTab ==='inquiries'|| activeTab ==='support'|| activeTab ==='intern-support') ?'text-[#E61E32] bg-[#E61E32]/10':'text-white/50 hover:text-white hover:bg-white/5'}`}
                        >
                            <div className="flex items-center gap-3">
                                <MessageSquare className="w-4 h-4" />
                                <span>Support</span>
                            </div>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isSupportOpen ?'rotate-180':''}`} />
                        </button>
                        {isSupportOpen && (
                            <div className="pl-4 space-y-1 mt-1 animate-in slide-in-from-top-1 duration-150">
                                <button
                                    onClick={() => setActiveTab("inquiries")}
                                    className={`w-full flex items-center justify-between text-left gap-3 px-4 py-2 text-xs font-medium transition-all duration-200 rounded-lg ${activeTab ==='inquiries'?'bg-[#E61E32]/10 text-[#E61E32]':'text-white/40 hover:text-white hover:bg-white/5'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-1 h-1 rounded-full bg-current animate-pulse" />
                                        <span>Inquiries</span>
                                    </div>
                                    {unreadInquiriesCount > 0 && (
                                        <span className="text-xs font-bold px-1.5 py-0.5 bg-[#E61E32]/10 border border-[#E61E32]/25 text-[#E61E32] rounded-full shrink-0">
                                            {unreadInquiriesCount}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab("intern-support")}
                                    className={`w-full flex items-center justify-between text-left gap-3 px-4 py-2 text-xs font-medium transition-all duration-200 rounded-lg ${activeTab ==='intern-support'?'bg-[#E61E32]/10 text-[#E61E32]':'text-white/40 hover:text-white hover:bg-white/5'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-1 h-1 rounded-full bg-current animate-pulse" />
                                        <span>Intern Support</span>
                                    </div>
                                    {pendingInternTicketsCount > 0 && (
                                        <span className="text-xs font-bold px-1.5 py-0.5 bg-yellow-500/10 border border-yellow-500/25 text-yellow-500 rounded-full shrink-0">
                                            {pendingInternTicketsCount}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab("support")}
                                    className={`w-full flex items-center justify-between text-left gap-3 px-4 py-2 text-xs font-medium transition-all duration-200 rounded-lg ${activeTab ==='support'?'bg-[#E61E32]/10 text-[#E61E32]':'text-white/40 hover:text-white hover:bg-white/5'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-1 h-1 rounded-full bg-current animate-pulse" />
                                        <span>Support Tickets</span>
                                    </div>
                                    {pendingTicketsCount > 0 && (
                                        <span className="text-xs font-bold px-1.5 py-0.5 bg-[#E61E32]/10 border border-[#E61E32]/25 text-[#E61E32] rounded-full shrink-0">
                                            {pendingTicketsCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("employees")}
                        className={`w-full flex items-center justify-between text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg ${activeTab ==='employees'?'bg-[#E61E32]/10 text-[#E61E32]':'text-white/50 hover:text-white hover:bg-white/5'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Users className="w-4 h-4" />
                            <span>Employees</span>
                        </div>
                        {employeesCount > 0 && (
                            <span className="text-xs font-bold px-1.5 py-0.5 bg-white/5 border border-white/10 text-white/40 rounded-full shrink-0">
                                {employeesCount}
                            </span>
                        )}
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("attendance")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg ${activeTab ==='attendance'?'bg-[#E61E32]/10 text-[#E61E32]':'text-white/50 hover:text-white hover:bg-white/5'}`}
                    >
                        <Clock className="w-4 h-4" />
                        Attendance
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("tasks")}
                        className={`w-full flex items-center justify-between text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg ${activeTab ==='tasks'?'bg-[#E61E32]/10 text-[#E61E32]':'text-white/50 hover:text-white hover:bg-white/5'}`}
                    >
                        <div className="flex items-center gap-3">
                            <ListTodo className="w-4 h-4" />
                            <span>Tasks</span>
                        </div>
                        {pendingTasksCount > 0 && (
                            <span className="text-xs font-bold px-1.5 py-0.5 bg-[#E61E32]/10 border border-[#E61E32]/25 text-[#E61E32] rounded-full shrink-0">
                                {pendingTasksCount}
                            </span>
                        )}
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("clients")}
                        className={`w-full flex items-center justify-between text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg ${activeTab ==='clients'?'bg-[#E61E32]/10 text-[#E61E32]':'text-white/50 hover:text-white hover:bg-white/5'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Briefcase className="w-4 h-4" />
                            <span>Clients</span>
                        </div>
                        {clientsCount > 0 && (
                            <span className="text-xs font-bold px-1.5 py-0.5 bg-white/5 border border-white/10 text-white/40 rounded-full shrink-0">
                                {clientsCount}
                            </span>
                        )}
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("meetings")}
                        className={`w-full flex items-center justify-between text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg ${activeTab ==='meetings'?'bg-[#E61E32]/10 text-[#E61E32]':'text-white/50 hover:text-white hover:bg-white/5'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Video className="w-4 h-4" />
                            <span>Meetings</span>
                        </div>
                        {upcomingMeetingsCount > 0 && (
                            <span className="text-xs font-bold px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 rounded-full shrink-0">
                                {upcomingMeetingsCount}
                            </span>
                        )}
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("documents")}
                        className={`w-full flex items-center justify-between text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg ${activeTab ==='documents'?'bg-[#E61E32]/10 text-[#E61E32]':'text-white/50 hover:text-white hover:bg-white/5'}`}
                    >
                        <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4" />
                            <span>Documents</span>
                        </div>
                        {documentsCount > 0 && (
                            <span className="text-xs font-bold px-1.5 py-0.5 bg-white/5 border border-white/10 text-white/40 rounded-full shrink-0">
                                {documentsCount}
                            </span>
                        )}
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("declarations")}
                        className={`w-full flex items-center justify-between text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg ${activeTab ==='declarations'?'bg-[#E61E32]/10 text-[#E61E32]':'text-white/50 hover:text-white hover:bg-white/5'}`}
                    >
                        <div className="flex items-center gap-3">
                            <FolderUp className="w-4 h-4" />
                            <span>Declarations</span>
                        </div>
                        {pendingDeclarationsCount > 0 && (
                            <span className="text-xs font-bold px-1.5 py-0.5 bg-[#E61E32]/10 border border-[#E61E32]/25 text-[#E61E32] rounded-full shrink-0">
                                {pendingDeclarationsCount}
                            </span>
                        )}
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("submissions")}
                        className={`w-full flex items-center justify-between text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg ${activeTab ==='submissions'?'bg-[#E61E32]/10 text-[#E61E32]':'text-white/50 hover:text-white hover:bg-white/5'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Send className="w-4 h-4" />
                            <span>Work Submissions</span>
                        </div>
                        {adminSubmissions.length > 0 && (
                            <span className="text-xs font-bold px-1.5 py-0.5 bg-[#E61E32]/10 border border-[#E61E32]/25 text-[#E61E32] rounded-full shrink-0">
                                {adminSubmissions.length}
                            </span>
                        )}
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("leaves")}
                        className={`w-full flex items-center justify-between text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg ${activeTab ==='leaves'?'bg-[#E61E32]/10 text-[#E61E32]':'text-white/50 hover:text-white hover:bg-white/5'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4" />
                            <span>Leaves</span>
                        </div>
                        {pendingLeavesCount > 0 && (
                            <span className="text-xs font-bold px-1.5 py-0.5 bg-yellow-500/10 border border-yellow-500/25 text-yellow-500 rounded-full shrink-0">
                                {pendingLeavesCount}
                            </span>
                        )}
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <div className="space-y-1">
                        <button
                            onClick={() => setIsPaymentsOpen(!isPaymentsOpen)}
                            className={`w-full flex items-center justify-between text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg ${(activeTab ==='payment-due-sender'|| activeTab ==='payment-received-sender'|| activeTab ==='receipt-generator'|| activeTab ==='payrolls') ?'text-[#E61E32] bg-[#E61E32]/10':'text-white/50 hover:text-white hover:bg-white/5'}`}
                        >
                            <div className="flex items-center gap-3">
                                <CreditCard className="w-4 h-4" />
                                <span>Payments</span>
                            </div>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isPaymentsOpen ?'rotate-180':''}`} />
                        </button>
                        {isPaymentsOpen && (
                            <div className="pl-4 space-y-1 mt-1 animate-in slide-in-from-top-1 duration-150">
                                <button
                                    onClick={() => setActiveTab("payment-due-sender")}
                                    className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2 text-xs font-medium transition-all duration-200 rounded-lg ${activeTab ==='payment-due-sender'?'bg-[#E61E32]/10 text-[#E61E32]':'text-white/40 hover:text-white hover:bg-white/5'}`}
                                >
                                    <div className="w-1 h-1 rounded-full bg-current animate-pulse" />
                                    Due Mail Sender
                                </button>
                                <button
                                    onClick={() => setActiveTab("payment-received-sender")}
                                    className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2 text-xs font-medium transition-all duration-200 rounded-lg ${activeTab ==='payment-received-sender'?'bg-[#E61E32]/10 text-[#E61E32]':'text-white/40 hover:text-white hover:bg-white/5'}`}
                                >
                                    <div className="w-1 h-1 rounded-full bg-current animate-pulse" />
                                    Payment Received Sender
                                </button>
                                <button
                                    onClick={() => setActiveTab("receipt-generator")}
                                    className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2 text-xs font-medium transition-all duration-200 rounded-lg ${activeTab ==='receipt-generator'?'bg-[#E61E32]/10 text-[#E61E32]':'text-white/40 hover:text-white hover:bg-white/5'}`}
                                >
                                    <div className="w-1 h-1 rounded-full bg-current animate-pulse" />
                                    Receipt Generator
                                </button>
                                <button
                                    onClick={() => setActiveTab("payrolls")}
                                    className={`w-full flex items-center justify-between text-left gap-3 px-4 py-2 text-xs font-medium transition-all duration-200 rounded-lg ${activeTab ==='payrolls'?'bg-[#E61E32]/10 text-[#E61E32]':'text-white/40 hover:text-white hover:bg-white/5'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-1 h-1 rounded-full bg-current animate-pulse" />
                                        <span>Payrolls</span>
                                    </div>
                                    {pendingPayrollsCount > 0 && (
                                        <span className="text-xs font-bold px-1.5 py-0.5 bg-[#E61E32]/10 border border-[#E61E32]/25 text-[#E61E32] rounded-full shrink-0">
                                            {pendingPayrollsCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("alerts")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg ${activeTab ==='alerts'?'bg-[#E61E32]/10 text-[#E61E32]':'text-white/50 hover:text-white hover:bg-white/5'}`}
                    >
                        <Bell className="w-4 h-4" />
                        Alert Sender
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("settings")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg ${activeTab ==='settings'?'bg-[#E61E32]/10 text-[#E61E32]':'text-white/50 hover:text-white hover:bg-white/5'}`}
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </button>
                </nav>

                <div className="h-[1px] bg-white/5" />

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 bg-[#E61E32] hover:bg-[#E61E32]/90 text-white transition-all text-sm font-semibold shadow-lg shadow-[#E61E32]/10 rounded-lg"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <div className="flex-grow p-4 md:p-6 lg:p-8 overflow-y-auto h-full min-w-0">
                <div className={`${activeTab ==='attendance'?'max-w-none':'max-w-7xl'} mx-auto space-y-4 md:space-y-8 h-full flex flex-col w-full min-w-0`}>
                    {/* Mobile nav toggle */}
                    <div className="no-print lg:hidden flex items-center justify-between shrink-0">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white/80 border border-white/10 hover:bg-white/5 transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                            Menu
                        </button>
                        <span className="text-sm font-medium text-white/50">Admin</span>
                    </div>
                    {/* Header */}
                    <div className="no-print flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white/[0.02] p-4 md:p-6 border border-white/5 shrink-0 min-w-0 rounded-xl">
                        <div>
                            <div className="flex items-center gap-1.5 text-sm font-medium text-white/50 mb-1.5">
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
                                                                                activeTab === "submissions" ? "Work Submissions" :
                                                                                    activeTab === "payrolls" ? "Payrolls" :
                                                                                        activeTab === "leaves" ? "Leaves" :
                                                                                            activeTab === "settings" ? "Settings" :
                                                                                                activeTab === "payment-due-sender" ? "Due Mail Sender" :
                                                                                                    activeTab === "receipt-generator" ? "Receipt Generator" : "Received Mail Sender"}
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
                                                                        activeTab === "declarations" ? "Declarations" :
                                                                            activeTab === "submissions" ? "Employee Work Submissions" :
                                                                                activeTab === "payrolls" ? (payrollSubView === "amount-generated" ? "Amount Generated" : "Employee Payouts") :
                                                                                    activeTab === "leaves" ? "Leave Requests" :
                                                                                        activeTab === "settings" ? "System Settings" :
                                                                                            activeTab === "payment-due-sender" ? "Payment Due Sender" :
                                                                                                activeTab === "receipt-generator" ? "Payment Receipt Generator" : "Payment Received Sender"}
                            </h2>
                            <p className="text-sm text-white/50 mt-0.5 break-words">
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
                                                                            activeTab === "submissions" ? "review website and repository links submitted by employees" :
                                                                                activeTab === "payrolls" ? (payrollSubView === "amount-generated" ? "Record revenue collected from clients" : "Send and track employee monthly payouts") :
                                                                                    activeTab === "leaves" ? "review, approve or reject employee leave submissions" :
                                                                                        activeTab === "settings" ? "manage system controls and master settings" :
                                                                                            activeTab === "payment-due-sender" ? "send billing notices to registered clients" :
                                                                                                activeTab === "receipt-generator" ? "generate high-fidelity printable payment receipts" : "send payment receipts to registered clients"}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto min-w-0">
                            {activeTab === "employees" && (
                                <>
                                    <button
                                        onClick={() => { setShowAddForm(!showAddForm); setShowOnboardForm(false); }}
                                        className="flex items-center gap-2 bg-[#E61E32] hover:bg-[#E61E32]/80 text-white px-4 py-2 text-xs font-semibold transition-colors rounded-lg"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Employee
                                    </button>
                                    <button
                                        onClick={() => { setShowOnboardForm(!showOnboardForm); setShowAddForm(false); }}
                                        className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 text-xs font-semibold transition-colors rounded-lg"
                                    >
                                        <Users className="w-4 h-4" />
                                        Onboard Employee
                                    </button>
                                </>
                            )}
                            {activeTab === "tasks" && (
                                <button
                                    onClick={() => { setShowAddTaskForm(!showAddTaskForm); setIsEditingTask(false); setSelectedTask(null); }}
                                    className="flex items-center gap-2 bg-[#E61E32] hover:bg-[#E61E32]/80 text-white px-4 py-2 text-xs font-semibold transition-colors rounded-lg"
                                >
                                    <Plus className="w-4 h-4" />
                                    Assign Task
                                </button>
                            )}
                            {activeTab === "meetings" && (
                                <button
                                    onClick={() => setShowAddMeetingForm(!showAddMeetingForm)}
                                    className="flex items-center gap-2 bg-[#E61E32] hover:bg-[#E61E32]/80 text-white px-4 py-2 text-xs font-semibold transition-colors rounded-lg"
                                >
                                    <Plus className="w-4 h-4" />
                                    Schedule Meeting
                                </button>
                            )}
                            {activeTab === "documents" && (
                                <button
                                    onClick={() => setShowAddDocForm(!showAddDocForm)}
                                    className="flex items-center gap-2 bg-[#E61E32] hover:bg-[#E61E32]/80 text-white px-4 py-2 text-xs font-semibold transition-colors rounded-lg"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Document
                                </button>
                            )}
                            {activeTab === "clients" && (
                                <button
                                    onClick={() => setShowAddClientForm(!showAddClientForm)}
                                    className="flex items-center gap-2 bg-[#E61E32] hover:bg-[#E61E32]/80 text-white px-4 py-2 text-xs font-semibold transition-colors rounded-lg"
                                >
                                    <Plus className="w-4 h-4" />
                                    Register client
                                </button>
                            )}
                            {activeTab === "payrolls" && payrollSubView === "payouts" && (
                                <button
                                    onClick={() => { setShowAddPayrollForm(!showAddPayrollForm); setShowAddRevenueForm(false); }}
                                    className="flex items-center gap-2 bg-[#E61E32] hover:bg-[#E61E32]/80 text-white px-4 py-2 text-xs font-semibold transition-colors rounded-lg"
                                >
                                    <Plus className="w-4 h-4" />
                                    Allocate Payroll
                                </button>
                            )}
                            {activeTab === "payrolls" && payrollSubView === "amount-generated" && (
                                <button
                                    onClick={() => { setShowAddRevenueForm(!showAddRevenueForm); setShowAddPayrollForm(false); }}
                                    className="flex items-center gap-2 bg-[#E61E32] hover:bg-[#E61E32]/80 text-white px-4 py-2 text-xs font-semibold transition-colors rounded-lg"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Amount Generated
                                </button>
                            )}
                            <div className="relative w-full sm:w-72 min-w-0">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                                <input
                                    type="text"
                                    placeholder={activeTab === "documents" ? "Search documents..." : activeTab === "attendance" ? "Search attendance..." : activeTab === "settings" ? "Search settings..." : "Search..."}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 px-10 py-2.5 text-sm focus:outline-none focus:border-[#E61E32] rounded-lg text-white placeholder-white/40"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Conditional Rendering of Tabs */}
                    <div className="flex-grow overflow-hidden">
                        {activeTab === "overview" && analyticsData && (
                            <div className="h-full space-y-8 animate-in fade-in duration-500 overflow-y-auto pr-2">
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
                                    <div className="col-span-2 md:col-span-1 lg:col-span-1">
                                        <StatCard
                                            icon={<MessageSquare className="w-5 h-5" />}
                                            label="Support Tickets"
                                            value={tickets.length}
                                            sublabel={`${tickets.filter(t => t.status === 'pending').length} open tickets`}
                                            color="text-[#E61E32]"
                                        />
                                    </div>
                                </div>

                                {/* All Analytics Section */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-[#E61E32]">
                                        all analytics
                                    </h3>
                                    
                                    <CombinedSharpLineChart 
                                        labels={analyticsData.labels}
                                        datasets={[
                                            {
                                                name: "Employees",
                                                data: analyticsData.employees,
                                                color: "#3b82f6",
                                                gradientId: "empGrad",
                                                unit: " members"
                                            },
                                            {
                                                name: "Amount Generated",
                                                data: analyticsData.amount,
                                                color: "#10b981",
                                                gradientId: "amtGrad",
                                                unit: "₹"
                                            },
                                            {
                                                name: "Work Hours",
                                                data: analyticsData.hours,
                                                color: "#ef4444",
                                                gradientId: "hrsGrad",
                                                unit: "h"
                                            }
                                        ]}
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === "inquiries" && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                                {/* Inquiry List */}
                                <div className="overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                                    {loading ? (
                                        <p className="text-white/50 text-center py-10">Loading inquiries...</p>
                                    ) : filteredInquiries.length > 0 ? (
                                        filteredInquiries.map((inv) => (
                                            <div
                                                key={inv.id}
                                                onClick={() => {
                                                    setSelectedInquiry(inv);
                                                    if (!inv.isRead) markAsRead(inv.id);
                                                }}
                                                className={`p-5 border transition-all cursor-pointer ${selectedInquiry?.id === inv.id ?'bg-white/5 border-white/20':'bg-transparent border-white/5 hover:border-white/10'}`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-white flex items-center gap-2">
                                                        {inv.name}
                                                        {!inv.isRead && <span className="w-1.5 h-1.5 bg-[#E61E32] rounded-full" />}
                                                    </h3>
                                                    <span className="text-xs text-white/50 tracking-tighter">
                                                        {new Date(inv.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-white/40 truncate">{inv.message}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-20 text-center border border-dashed border-white/5">
                                            <p className="text-white/50 text-sm">No inquiries found.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Inquiry Details */}
                                <div className={`bg-white/5 border border-white/5 rounded-xl p-4 md:p-6 lg:p-8 overflow-y-auto overflow-x-hidden break-words min-w-0 ${selectedEmployee ?'block':'hidden lg:block'}`}>
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

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <InfoBlock label="Company" value={selectedInquiry.company} />
                                                <InfoBlock label="Service" value={selectedInquiry.service} />
                                            </div>

                                            <div className="space-y-3 pt-6 border-t border-white/5">
                                                <h4 className="text-xs font-bold text-white/40">Message</h4>
                                                <p className="text-sm leading-relaxed text-white/70 whitespace-pre-wrap">
                                                    {selectedInquiry.message}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-center opacity-20">
                                            <p className="text-sm font-medium">Select An Inquiry To View Details</p>
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
                                        <p className="text-white/50 text-center py-10">Loading tickets...</p>
                                    ) : filteredTickets.length > 0 ? (
                                        filteredTickets.map((t) => (
                                            <div
                                                key={t.id}
                                                onClick={() => setSelectedTicket(t)}
                                                className={`p-5 border transition-all cursor-pointer ${selectedTicket?.id === t.id ?'bg-white/5 border-white/20':'bg-transparent border-white/5 hover:border-white/10'}`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-white flex items-center gap-2">
                                                        {t.subject}
                                                        <span className={`px-1.5 py-0.5 text-xs font-black ${t.status ==='pending'?'bg-[#E61E32]/10 text-[#E61E32]':'bg-green-500/10 text-green-500'}`}>
                                                            {t.status}
                                                        </span>
                                                    </h3>
                                                    <span className="text-xs text-white/50 tracking-tighter">
                                                        {new Date(t.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-white/30 font-bold mb-1">{t.name}</p>
                                                <p className="text-xs text-white/40 truncate">{t.message}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-20 text-center border border-dashed border-white/5">
                                            <p className="text-white/50 text-sm">No support tickets found.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Ticket Details */}
                                <div className={`bg-white/5 border border-white/5 rounded-xl p-4 md:p-6 lg:p-8 overflow-y-auto overflow-x-hidden break-words min-w-0 ${selectedEmployee ?'block':'hidden lg:block'}`}>
                                    {selectedTicket ? (
                                        <div className="space-y-8 animate-in fade-in duration-300">
                                            <div className="space-y-4 pb-6 border-b border-white/5">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-xl font-bold">{selectedTicket.subject}</h3>
                                                    <div className="flex gap-2">
                                                        {selectedTicket.status === 'pending' && (
                                                            <button
                                                                onClick={() => handleUpdateTicketStatus(selectedTicket.id, 'resolved')}
                                                                className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20 hover:bg-green-500 hover:text-white transition-all"
                                                            >
                                                                Mark Resolved
                                                            </button>
                                                        )}
                                                        <button className="px-3 py-1 bg-white/5 text-white/40 text-xs font-bold border border-white/10 hover:bg-white/10 hover:text-white transition-all">
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
                                                <h4 className="text-xs font-bold text-white/40">Query Details</h4>
                                                <div className="bg-white/[0.02] border border-white/5 p-6">
                                                    <p className="text-sm leading-relaxed text-white/80 whitespace-pre-wrap">
                                                        {selectedTicket.message}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="pt-6">
                                                <button className="w-full flex items-center justify-center gap-2 bg-[#E61E32] text-white font-bold py-4 text-xs hover:bg-white hover:text-black transition-all">
                                                    <Send className="w-4 h-4" />
                                                    Reply via Email
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-center opacity-20">
                                            <p className="text-sm font-medium">Select A Ticket To View Details</p>
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
                                        <p className="text-white/50 text-center py-10">Loading tickets...</p>
                                    ) : internTickets.length > 0 ? (
                                        internTickets.map((t) => (
                                            <div
                                                key={t.id}
                                                onClick={() => setSelectedInternTicket(t)}
                                                className={`p-5 border transition-all cursor-pointer ${selectedInternTicket?.id === t.id ?'bg-white/5 border-white/20':'bg-transparent border-white/5 hover:border-white/10'}`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-white flex items-center gap-2">
                                                        {t.name}
                                                        <span className={`px-1.5 py-0.5 text-xs font-black ${t.status ==='pending'?'bg-[#E61E32]/10 text-[#E61E32]':'bg-green-500/10 text-green-500'}`}>
                                                            {t.status}
                                                        </span>
                                                    </h3>
                                                    <span className="text-xs text-white/50 tracking-tighter">
                                                        {new Date(t.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-white/30 font-bold mb-1">{t.batchNumber} | {t.college}</p>
                                                <p className="text-xs text-white/40 truncate">{t.description}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-20 text-center border border-dashed border-white/5">
                                            <p className="text-white/50 text-sm">No intern support tickets found.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Intern Ticket Details */}
                                <div className={`bg-white/5 border border-white/5 rounded-xl p-4 md:p-6 lg:p-8 overflow-y-auto overflow-x-hidden break-words min-w-0 ${selectedEmployee ?'block':'hidden lg:block'}`}>
                                    {selectedInternTicket ? (
                                        <div className="space-y-8 animate-in fade-in duration-300">
                                            <div className="space-y-4 pb-6 border-b border-white/5">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-xl font-bold">{selectedInternTicket.name}</h3>
                                                    <span className={`px-2 py-1 text-xs font-black ${selectedInternTicket.status ==='pending'?'bg-[#E61E32]/10 text-[#E61E32]':'bg-green-500/10 text-green-500'}`}>
                                                        {selectedInternTicket.status}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-white/30 font-medium">
                                                    <span className="flex items-center gap-1.5 font-bold text-white/60"><Building className="w-3.5 h-3.5" /> {selectedInternTicket.college}</span>
                                                    <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {selectedInternTicket.email}</span>
                                                    <span className="flex items-center gap-1.5 text-[#E61E32] font-black tracking-tighter"><Search className="w-3.5 h-3.5" /> {selectedInternTicket.batchNumber}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="space-y-1">
                                                    <h4 className="text-xs font-bold text-white/50">Problem Page</h4>
                                                    <div className="text-sm font-mono bg-white/5 p-2 rounded border border-white/5 flex items-center gap-2">
                                                        <ExternalLink className="w-3.5 h-3.5 text-white/40" />
                                                        {selectedInternTicket.problemPage}
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <h4 className="text-xs font-bold text-white/50">Issue Description</h4>
                                                    <div className="bg-white/[0.02] border border-white/5 p-6">
                                                        <p className="text-sm leading-relaxed text-white/80 whitespace-pre-wrap">
                                                            {selectedInternTicket.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-6">
                                                <button className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-4 text-xs hover:bg-[#E61E32] hover:text-white transition-all">
                                                    <Send className="w-4 h-4" />
                                                    Contact Intern
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-center opacity-20">
                                            <p className="text-sm font-medium">Select An Intern Ticket To View Details</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "tasks" && (
                            <div className="flex flex-col gap-5 h-full min-w-0 overflow-hidden">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
                                    <StatCard
                                        icon={<ListTodo className="w-5 h-5" />}
                                        label="Total Tasks"
                                        value={taskStats.total}
                                        sublabel="All assignments"
                                        color="text-blue-500"
                                    />
                                    <StatCard
                                        icon={<Hourglass className="w-5 h-5" />}
                                        label="Pending"
                                        value={taskStats.pending}
                                        sublabel="Awaiting start"
                                        color="text-yellow-500"
                                    />
                                    <StatCard
                                        icon={<Clock className="w-5 h-5" />}
                                        label="In Progress"
                                        value={taskStats.inProgress}
                                        sublabel="Currently active"
                                        color="text-orange-500"
                                    />
                                    <StatCard
                                        icon={<CheckCheck className="w-5 h-5" />}
                                        label="Completed"
                                        value={taskStats.completed}
                                        sublabel="Finished tasks"
                                        color="text-green-500"
                                    />
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 flex-grow min-h-0 overflow-hidden">
                                    <div className={`xl:col-span-4 flex flex-col gap-4 min-h-0 overflow-hidden ${selectedTask ? "hidden xl:flex" : "flex"}`}>
                                        {showAddTaskForm ? (
                                            <div className="bg-white/[0.02] rounded-xl p-5 md:p-6 animate-in slide-in-from-top-4 duration-300 overflow-y-auto">
                                                <div className="flex justify-between items-start gap-3 mb-5">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="w-10 h-10 rounded-xl bg-[#E61E32]/15 border border-[#E61E32]/30 flex items-center justify-center shrink-0">
                                                            <ListTodo className="w-5 h-5 text-[#E61E32]" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h3 className="text-base font-semibold text-white">Assign New Task</h3>
                                                            <p className="text-xs text-white/50">Create and assign work</p>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => setShowAddTaskForm(false)} className="text-white/50 hover:text-white text-sm px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 shrink-0">Cancel</button>
                                                </div>
                                                <form onSubmit={handleAddTask} className="space-y-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-sm font-medium text-white/60">Task Title</label>
                                                        <input required type="text" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="w-full bg-[#111111] border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E61E32] rounded-lg" placeholder="Enter task title" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-sm font-medium text-white/60">Description</label>
                                                        <textarea rows={3} value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} className="w-full bg-[#111111] border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E61E32] rounded-lg resize-none font-sans" placeholder="Describe requirements" />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-sm font-medium text-white/60">Assign To Employee</label>
                                                            <select required value={newTask.employeeId} onChange={(e) => setNewTask({ ...newTask, employeeId: e.target.value })} className="w-full bg-[#111111] border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E61E32] rounded-lg text-white">
                                                                <option value="" disabled>Select employee</option>
                                                                {employees.map((emp) => (<option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>))}
                                                            </select>
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-sm font-medium text-white/60">Deadline</label>
                                                            <input type="date" value={newTask.deadline} onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })} className="w-full bg-[#111111] border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E61E32] rounded-lg" />
                                                        </div>
                                                    </div>
                                                    <button disabled={isSubmitting} type="submit" className="w-full bg-[#E61E32] text-white font-semibold py-3 text-sm hover:bg-[#C81428] transition-all disabled:opacity-50 rounded-lg cursor-pointer flex items-center justify-center gap-2">
                                                        {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Assigning...</> : <><Send className="w-4 h-4" /> Assign Task</>}
                                                    </button>
                                                </form>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex flex-wrap gap-2 shrink-0">
                                                    {(["all", "pending", "in_progress", "completed"] as const).map((filter) => (
                                                        <button key={filter} onClick={() => setTaskFilter(filter)} className={`px-3 py-1.5 text-xs font-semibold transition-all rounded-full cursor-pointer ${taskFilter === filter ? "bg-[#E61E32]/15 text-[#E61E32]" : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10"}`}>
                                                            {formatLabel(filter === "all" ? "all tasks" : filter)}
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="overflow-y-auto space-y-2.5 pr-1 scrollbar-thin flex-grow min-h-0">
                                                    {loading ? (
                                                        <div className="rounded-xl bg-white/[0.02] py-12 text-center">
                                                            <Loader2 className="w-6 h-6 text-white/40 animate-spin mx-auto mb-2" />
                                                            <p className="text-white/50 text-sm">Loading Tasks...</p>
                                                        </div>
                                                    ) : filteredTasks.length > 0 ? (
                                                        filteredTasks.map((t) => {
                                                            const statusStyles = getTaskStatusStyles(t.status);
                                                            return (
                                                                <button key={t.id} type="button" onClick={() => { setSelectedTask(t); setIsEditingTask(false); }} className={`w-full text-left p-4 rounded-xl transition-all min-w-0 ${selectedTask?.id === t.id ? "bg-white/[0.06]" : "bg-white/[0.02] hover:bg-white/[0.04]"}`}>
                                                                    <div className="flex items-start justify-between gap-2 mb-1.5">
                                                                        <p className="font-semibold text-white text-sm line-clamp-2 break-words flex-1">{t.title}</p>
                                                                        <span className={`px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full shrink-0 ${statusStyles.badge}`}>{formatLabel(t.status)}</span>
                                                                    </div>
                                                                    <p className="text-xs text-white/50 truncate">{t.employee?.name || "Unassigned"}</p>
                                                                    {t.deadline && (
                                                                        <p className="text-[11px] text-white/40 mt-2 flex items-center gap-1"><Calendar className="w-3 h-3" /> Due {new Date(t.deadline).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</p>
                                                                    )}
                                                                </button>
                                                            );
                                                        })
                                                    ) : (
                                                        <div className="py-14 text-center rounded-xl bg-white/[0.02]">
                                                            <ListTodo className="w-8 h-8 text-white/20 mx-auto mb-3" />
                                                            <p className="text-white/60 text-sm font-medium">No Tasks Found</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className={`xl:col-span-8 bg-white/[0.02] rounded-xl p-4 md:p-6 overflow-y-auto overflow-x-hidden break-words min-w-0 min-h-0 ${selectedTask ? "flex flex-col" : "hidden xl:flex xl:items-center xl:justify-center"}`}>
                                        {selectedTask ? (
                                            <div className="space-y-5 animate-in fade-in duration-300 w-full">
                                                <div className="flex items-start justify-between gap-3 pb-4 border-b border-white/5">
                                                    <div className="min-w-0 flex-1">
                                                        <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full mb-2 ${getTaskStatusStyles(selectedTask.status).badge}`}>{formatLabel(selectedTask.status)}</span>
                                                        <h3 className="text-lg sm:text-xl font-semibold text-white break-words">{selectedTask.title}</h3>
                                                        <p className="text-sm text-white/50 mt-2 flex items-center gap-1.5 flex-wrap"><User className="w-3.5 h-3.5 shrink-0" />{selectedTask.employee?.name} · {selectedTask.employee?.role}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <button onClick={() => setIsEditingTask(!isEditingTask)} className={`p-2 rounded-lg border transition-colors ${isEditingTask ? "text-[#E61E32] border-[#E61E32]/30 bg-[#E61E32]/10" : "text-white/50 border-white/10 hover:text-white hover:bg-white/5"}`} title="Edit Task"><Edit2 className="w-4 h-4" /></button>
                                                        <button onClick={() => handleDeleteTask(selectedTask.id)} className="p-2 rounded-lg border border-white/10 text-white/50 hover:text-[#E61E32] hover:border-[#E61E32]/30 hover:bg-[#E61E32]/10" title="Delete Task"><Trash2 className="w-4 h-4" /></button>
                                                        <button onClick={() => { setSelectedTask(null); setIsEditingTask(false); }} className="xl:hidden p-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:bg-white/5" aria-label="Back to list"><X className="w-4 h-4" /></button>
                                                    </div>
                                                </div>
                                                {isEditingTask ? (
                                                    <form onSubmit={handleUpdateTask} className="space-y-4 bg-white/[0.02] p-4 sm:p-5 rounded-xl">
                                                        <div className="space-y-1.5"><label className="text-sm font-medium text-white/60">Task Title</label><input required type="text" value={selectedTask.title} onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })} className="w-full bg-[#111111] border border-white/10 px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-[#E61E32]" /></div>
                                                        <div className="space-y-1.5"><label className="text-sm font-medium text-white/60">Description</label><textarea rows={4} value={selectedTask.description || ""} onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })} className="w-full bg-[#111111] border border-white/10 px-4 py-2.5 text-sm rounded-lg resize-none focus:outline-none focus:border-[#E61E32]" /></div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <div className="space-y-1.5"><label className="text-sm font-medium text-white/60">Status</label><select value={selectedTask.status} onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value })} className="w-full bg-[#111111] border border-white/10 px-4 py-2.5 text-sm rounded-lg text-white focus:outline-none focus:border-[#E61E32]"><option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="completed">Completed</option></select></div>
                                                            <div className="space-y-1.5"><label className="text-sm font-medium text-white/60">Deadline</label><input type="date" value={selectedTask.deadline ? new Date(selectedTask.deadline).toISOString().split("T")[0] : ""} onChange={(e) => setSelectedTask({ ...selectedTask, deadline: e.target.value })} className="w-full bg-[#111111] border border-white/10 px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-[#E61E32]" /></div>
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row gap-3">
                                                            <button type="submit" disabled={isSubmitting} className="flex-1 bg-[#E61E32] text-white font-semibold py-3 text-sm rounded-lg disabled:opacity-50">{isSubmitting ? "Updating..." : "Save Changes"}</button>
                                                            <button type="button" onClick={() => setIsEditingTask(false)} className="px-6 py-3 text-sm font-semibold rounded-lg border border-white/10 text-white/70 hover:bg-white/5">Cancel</button>
                                                        </div>
                                                    </form>
                                                ) : (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="md:col-span-2 p-4 sm:p-5 bg-white/[0.02] rounded-xl">
                                                            <InfoBlock label="Description" value={selectedTask.description || "No description provided."} />
                                                        </div>
                                                        <div className="p-4 sm:p-5 bg-white/[0.02] rounded-xl">
                                                            <InfoBlock label="Deadline" value={selectedTask.deadline ? new Date(selectedTask.deadline).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }) : "No deadline set"} />
                                                        </div>
                                                        <div className="p-4 sm:p-5 bg-white/[0.02] rounded-xl">
                                                            <p className="text-sm font-medium text-white/60 mb-2">Update Status</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {(["pending", "in_progress", "completed"] as const).map((status) => (
                                                                    <button key={status} type="button" onClick={() => handleUpdateTaskStatus(selectedTask.id, status)} className={`px-3 py-1.5 text-xs font-semibold rounded-full ${selectedTask.status === status ? getTaskStatusStyles(status).badge : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10"}`}>{formatLabel(status)}</button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center px-4 py-12">
                                                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4"><ListTodo className="w-8 h-8 text-white/25" /></div>
                                                <p className="text-sm font-medium text-white/50">Select A Task To View Details</p>
                                                <p className="text-xs text-white/35 mt-1 max-w-xs mx-auto">Pick a task from the list or use Assign Task in the header.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "employees" && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                                {/* Employee List or Add Form */}
                                <div className={`space-y-4 h-full flex flex-col overflow-hidden ${selectedEmployee ?'hidden lg:flex':'flex'}`}>
                                    {showAddForm ? (
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 animate-in slide-in-from-top-4 duration-300">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-lg font-bold tracking-tight">Add New Employee</h3>
                                                <button onClick={() => setShowAddForm(false)} className="text-white/40 hover:text-white text-xs">Cancel</button>
                                            </div>
                                            <form onSubmit={handleAddEmployee} className="space-y-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-white/40">Full Name</label>
                                                        <input
                                                            required
                                                            type="text"
                                                            value={newEmployee.name}
                                                            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-white/40">Email Address</label>
                                                        <input
                                                            required
                                                            type="email"
                                                            value={newEmployee.email}
                                                            onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-white/40">Job Role</label>
                                                        <input
                                                            required
                                                            type="text"
                                                            value={newEmployee.role}
                                                            onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-white/40">Password</label>
                                                        <input
                                                            type="text"
                                                            value={newEmployee.password}
                                                            onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                                                            placeholder="Default: redlix_emp_2026"
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-white/40">Division</label>
                                                        <input
                                                            type="text"
                                                            value={newEmployee.division}
                                                            onChange={(e) => setNewEmployee({ ...newEmployee, division: e.target.value })}
                                                            placeholder="e.g. Division A"
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-white/40">Offer Letter Link</label>
                                                        <input
                                                            type="url"
                                                            value={newEmployee.offerLetterLink}
                                                            onChange={(e) => setNewEmployee({ ...newEmployee, offerLetterLink: e.target.value })}
                                                            placeholder="https://..."
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 bg-white/5 border border-white/5 p-4">
                                                    <input
                                                        type="checkbox"
                                                        id="newEmpIsDeptAdmin"
                                                        checked={newEmployee.isDeptAdmin}
                                                        onChange={(e) => setNewEmployee({ ...newEmployee, isDeptAdmin: e.target.checked })}
                                                        className="w-4 h-4 rounded bg-black border-white/10 text-[#E61E32] focus:ring-0 focus:ring-offset-0"
                                                    />
                                                    <label htmlFor="newEmpIsDeptAdmin" className="text-xs font-bold text-white cursor-pointer select-none">
                                                        Department Admin Login (Enable for Department Lead access)
                                                    </label>
                                                </div>
                                                <button
                                                    disabled={isSubmitting}
                                                    type="submit"
                                                    className="w-full bg-white text-black font-bold py-3 text-xs hover:bg-white/90 transition-colors disabled:opacity-50"
                                                >
                                                    {isSubmitting ? "Creating..." : "Save Employee"}
                                                </button>
                                            </form>
                                        </div>
                                    ) : showOnboardForm ? (
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 animate-in slide-in-from-top-4 duration-300">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-lg font-bold tracking-tight">Onboard New Employee</h3>
                                                <button onClick={() => setShowOnboardForm(false)} className="text-white/40 hover:text-white text-xs">Cancel</button>
                                            </div>
                                            <form onSubmit={handleOnboardEmployee} className="space-y-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-white/40">Full Name</label>
                                                        <input
                                                            required
                                                            type="text"
                                                            value={newOnboardEmployee.name}
                                                            onChange={(e) => setNewOnboardEmployee({ ...newOnboardEmployee, name: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-white/40">Email Address</label>
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
                                                    <label className="text-xs font-bold text-white/40">Job Role</label>
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
                                                    <label htmlFor="onboardEmpIsDeptAdmin" className="text-xs font-bold text-white cursor-pointer select-none">
                                                        Department Admin Login (Enable for Department Lead access)
                                                    </label>
                                                </div>
                                                <button
                                                    disabled={isSubmitting}
                                                    type="submit"
                                                    className="w-full bg-white text-black font-bold py-3 text-xs hover:bg-white/90 transition-colors disabled:opacity-50"
                                                >
                                                    {isSubmitting ? "Onboarding..." : "Onboard Employee"}
                                                </button>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="overflow-y-auto space-y-3 pr-2 scrollbar-thin flex-grow">
                                            {loading ? (
                                                <p className="text-white/50 text-center py-10">Loading employees...</p>
                                            ) : filteredEmployees.length > 0 ? (
                                                filteredEmployees.map((emp) => (
                                                    <div
                                                        key={emp.id}
                                                        onClick={() => {
                                                            setSelectedEmployee(emp);
                                                            setIsEditingEmployee(false);
                                                        }}
                                                        className={`p-5 border transition-all cursor-pointer ${selectedEmployee?.id === emp.id ?'bg-white/5 border-white/20':'bg-transparent border-white/5 hover:border-white/10'}`}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <h3 className="font-bold text-white truncate min-w-0 flex-1">{emp.name}</h3>
                                                                    {emp.pinkSlipAllocatedAt && !emp.pinkSlipRevoked && (
                                                                        <span className="text-xs font-black bg-[#E61E32]/15 border border-[#E61E32]/40 text-[#E61E32] px-1.5 py-0.5 flex-shrink-0">Pink slip</span>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-[#E61E32] font-bold">{emp.role}</p>
                                                            </div>
                                                            <div className="flex flex-col items-end">
                                                                <span className="text-xs text-white/50 tracking-tighter">
                                                                    Joined {new Date(emp.joinedAt).toLocaleDateString()}
                                                                </span>
                                                                <div className="mt-2 flex gap-2">
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            sendOfferLetter(emp.id);
                                                                        }}
                                                                        disabled={sendEmailStatus?.id === emp.id && sendEmailStatus.status === 'sending'}
                                                                        className={`flex items-center gap-1.5 px-2 py-1 text-xs font-bold tracking-tight border transition-colors ${sendEmailStatus?.id === emp.id && sendEmailStatus.action ==='offer'&& sendEmailStatus.status ==='success'?'bg-green-500/10 border-green-500/50 text-green-500':'bg-white/5 border-white/10 hover:bg-white/10 text-white/60 hover:text-white'}`}
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
                                                                        className={`flex items-center gap-1.5 px-2 py-1 text-xs font-bold tracking-tight border transition-colors ${sendEmailStatus?.id === emp.id && sendEmailStatus.action ==='onboarding'&& sendEmailStatus.status ==='success'?'bg-green-500/10 border-green-500/50 text-green-500':'bg-white/5 border-white/10 hover:bg-white/10 text-white/60 hover:text-white'}`}
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
                                                    <p className="text-white/50 text-sm">No employees found.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Employee Details */}
                                <div className={`bg-white/5 border border-white/5 rounded-xl p-4 md:p-6 lg:p-8 overflow-y-auto overflow-x-hidden break-words min-w-0 ${selectedEmployee ?'block':'hidden lg:block'}`}>
                                    {selectedEmployee ? (
                                        <div className="space-y-8 animate-in fade-in duration-300">
                                            {/* Mobile Back Button */}
                                            <button
                                                onClick={() => setSelectedEmployee(null)}
                                                className="flex items-center gap-2 text-xs text-[#E61E32] hover:text-[#ff1f34] transition-colors lg:hidden font-medium mb-4"
                                            >
                                                &larr; Back to Employee List
                                            </button>
                                            <div className="flex items-center justify-between pb-6 border-b border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-white/10 flex items-center justify-center border border-white/10">
                                                        <User className="w-6 h-6 text-white/40" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold">{selectedEmployee.name}</h3>
                                                        <p className="text-sm text-[#E61E32] font-bold">{selectedEmployee.role}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    {/* Pink Slip Button */}
                                                    {selectedEmployee.pinkSlipAllocatedAt && !selectedEmployee.pinkSlipRevoked ? (
                                                        <button
                                                            onClick={() => handleRevokePinkSlip(selectedEmployee.id)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all"
                                                            title="Revoke Pink Slip"
                                                        >
                                                            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Revoke Pink Slip
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => { setPinkSlipModalEmployeeId(selectedEmployee.id); setShowPinkSlipModal(true); }}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E61E32]/10 hover:bg-[#E61E32]/20 text-[#E61E32] border border-[#E61E32]/30 text-xs font-bold transition-all"
                                                            title="Allocate Pink Slip"
                                                        >
                                                            <ShieldAlert className="w-3.5 h-3.5 text-[#E61E32]" /> Pink Slip
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => setIsEditingEmployee(!isEditingEmployee)}
                                                        className={`p-2 transition-colors ${isEditingEmployee ?'text-[#E61E32]':'text-white/50 hover:text-white'}`}
                                                        title="Edit Employee"
                                                    >
                                                        <Edit2 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteEmployee(selectedEmployee.id)}
                                                        className="p-2 text-white/50 hover:text-[#E61E32] transition-colors"
                                                        title="Delete Employee"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>

                                            {isEditingEmployee ? (
                                                <form onSubmit={handleUpdateEmployee} className="space-y-6 bg-white/[0.02] p-6 border border-white/5 animate-in slide-in-from-top-4 duration-300">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-xs font-bold text-white/40">Full Name</label>
                                                            <input
                                                                required
                                                                type="text"
                                                                value={selectedEmployee.name}
                                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, name: e.target.value })}
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30 rounded-lg"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-xs font-bold text-white/40">Email Address</label>
                                                            <input
                                                                required
                                                                type="email"
                                                                value={selectedEmployee.email}
                                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, email: e.target.value })}
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30 rounded-lg"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-xs font-bold text-white/40">Job Role</label>
                                                            <input
                                                                required
                                                                type="text"
                                                                value={selectedEmployee.role}
                                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, role: e.target.value })}
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30 rounded-lg"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-xs font-bold text-white/40">Password</label>
                                                            <input
                                                                type="text"
                                                                value={selectedEmployee.password || ""}
                                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, password: e.target.value })}
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30 rounded-lg"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-xs font-bold text-white/40">Phone Number</label>
                                                            <input
                                                                type="tel"
                                                                value={selectedEmployee.phone || ""}
                                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, phone: e.target.value })}
                                                                placeholder="+91 XXXXX XXXXX"
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30 rounded-lg"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-xs font-bold text-white/40">UPI ID (For Payrolls)</label>
                                                            <input
                                                                type="text"
                                                                value={selectedEmployee.upiId || ""}
                                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, upiId: e.target.value })}
                                                                placeholder="username@upi"
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30 rounded-lg"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-xs font-bold text-white/40">Father's Name</label>
                                                            <input
                                                                type="text"
                                                                value={selectedEmployee.fatherName || ""}
                                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, fatherName: e.target.value })}
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30 rounded-lg"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-xs font-bold text-white/40">Emergency Mobile</label>
                                                            <input
                                                                type="tel"
                                                                value={selectedEmployee.mobile || ""}
                                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, mobile: e.target.value })}
                                                                placeholder="XXXXXXXXXX"
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30 rounded-lg"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-xs font-bold text-white/40">Alternative Email</label>
                                                            <input
                                                                type="email"
                                                                value={selectedEmployee.altEmail || ""}
                                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, altEmail: e.target.value })}
                                                                placeholder="name@personal.com"
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30 rounded-lg"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-white/40">Postal Address (For Goodies/Deliveries)</label>
                                                        <textarea
                                                            rows={2}
                                                            value={selectedEmployee.address || ""}
                                                            onChange={(e) => setSelectedEmployee({ ...selectedEmployee, address: e.target.value })}
                                                            placeholder="House No, Street Name, Area, City, State, Pincode"
                                                            className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30 rounded-lg resize-none font-sans"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-xs font-bold text-white/40">Joined Date</label>
                                                            <input
                                                                type="date"
                                                                value={selectedEmployee.joinedAt ? new Date(selectedEmployee.joinedAt).toISOString().split('T')[0] : ""}
                                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, joinedAt: e.target.value ? new Date(e.target.value).toISOString() : new Date().toISOString() })}
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30 rounded-lg"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-xs font-bold text-white/40">Division</label>
                                                            <input
                                                                type="text"
                                                                value={selectedEmployee.division || ""}
                                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, division: e.target.value })}
                                                                placeholder="e.g. Division A"
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30 rounded-lg"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-xs font-bold text-white/40">Offer Letter Link</label>
                                                            <input
                                                                type="url"
                                                                value={selectedEmployee.offerLetterLink || ""}
                                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, offerLetterLink: e.target.value })}
                                                                placeholder="https://..."
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30 rounded-lg"
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
                                                        <label htmlFor="editEmpIsDeptAdmin" className="text-xs font-bold text-white cursor-pointer select-none">
                                                            Department Admin Login (Enable to grant Department Lead access)
                                                        </label>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <button
                                                            type="submit"
                                                            disabled={isSubmitting}
                                                            className="flex-grow bg-[#E61E32] text-white font-bold py-3 text-xs hover:bg-white hover:text-black transition-all disabled:opacity-50 rounded-lg"
                                                        >
                                                            {isSubmitting ? "Updating..." : "Save Changes"}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsEditingEmployee(false)}
                                                            className="px-6 bg-white/5 text-white/60 font-bold py-3 text-xs hover:bg-white/10 hover:text-white transition-all border border-white/10 rounded-lg"
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
                                                                <p className="text-xs font-bold text-white/50">Employment & Contact</p>
                                                                <InfoBlock label="Email Address" value={selectedEmployee.email} />
                                                                <InfoBlock label="Phone Number" value={selectedEmployee.phone || "Not Provided"} />
                                                                <InfoBlock label="Alternative Email" value={selectedEmployee.altEmail || "Not Provided"} />
                                                                <InfoBlock label="Joined Date" value={new Date(selectedEmployee.joinedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} />
                                                                <InfoBlock label="Division" value={selectedEmployee.division || "Not Assigned"} />
                                                                <InfoBlock label="Department Admin Access" value={selectedEmployee.isDeptAdmin ? "Yes (Authorized to login to Dept Portal)" : "No"} />
                                                            </div>

                                                            <div className="p-4 bg-white/[0.02] border border-white/5">
                                                                <p className="text-xs font-bold text-white/50 mb-3">Offer letter</p>
                                                                {selectedEmployee.offerLetterLink ? (
                                                                    <a
                                                                        href={selectedEmployee.offerLetterLink}
                                                                        target="_blank"
                                                                        className="flex items-center justify-between group bg-white/5 hover:bg-white/10 border border-white/10 p-3 transition-colors rounded-lg"
                                                                    >
                                                                        <span className="text-xs font-medium text-white/60 group-hover:text-white truncate pr-4">{selectedEmployee.offerLetterLink}</span>
                                                                        <ExternalLink className="w-3.5 h-3.5 text-white/50 group-hover:text-white/60" />
                                                                    </a>
                                                                ) : (
                                                                    <p className="text-xs text-white/30 italic">No link provided</p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Column 2: Payroll & Personal/Goodies */}
                                                        <div className="space-y-6">
                                                            <div className="p-4 bg-white/[0.02] border border-white/5 space-y-4">
                                                                <p className="text-xs font-bold text-white/50">Payroll Info</p>
                                                                <InfoBlock label="UPI ID" value={selectedEmployee.upiId || "Not Provided"} />
                                                            </div>

                                                            <div className="p-4 bg-white/[0.02] border border-white/5 space-y-4">
                                                                <p className="text-xs font-bold text-white/50">Personal & Goodies</p>
                                                                <InfoBlock label="Father's Name" value={selectedEmployee.fatherName || "Not Provided"} />
                                                                <InfoBlock label="Emergency Mobile" value={selectedEmployee.mobile || "Not Provided"} />
                                                                <InfoBlock label="Postal Address" value={selectedEmployee.address || "Not Provided"} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Attendance History Block */}
                                                    <div className="p-4 bg-white/[0.02] border border-white/5 space-y-4">
                                                        <p className="text-xs font-bold text-white/50">Attendance Logs</p>
                                                        {loadingAttendance ? (
                                                            <p className="text-xs text-white/30 animate-pulse py-2">Loading attendance logs...</p>
                                                        ) : selectedEmployeeAttendance.length > 0 ? (
                                                            <div className="max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                                                                <table className="w-full text-left text-xs">
                                                                    <thead>
                                                                        <tr className="border-b border-white/10 text-white/30 text-xs font-bold">
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
                                                                                    <td className={`py-2 text-right font-medium ${pOut ?'text-white/60':'text-[#E61E32] animate-pulse'}`}>{durationStr}</td>
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
                                                            className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-4 text-xs hover:bg-[#E61E32] hover:text-white transition-all disabled:opacity-50"
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
                                                            className="w-full flex items-center justify-center gap-2 bg-white/5 text-white/80 font-bold py-4 text-xs border border-white/10 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
                                                        >
                                                            {sendEmailStatus?.id === selectedEmployee.id && sendEmailStatus.action === 'onboarding' && sendEmailStatus.status === 'sending' ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <Send className="w-4 h-4" />
                                                            )}
                                                            Send Onboarding Email
                                                        </button>
                                                        {sendEmailStatus?.id === selectedEmployee.id && sendEmailStatus.status === 'error' && (
                                                            <p className="text-xs text-[#E61E32] text-center mt-2 font-bold">Error sending email. Check logs.</p>
                                                        )}
                                                        {sendEmailStatus?.id === selectedEmployee.id && sendEmailStatus.action === 'offer' && sendEmailStatus.status === 'success' && (
                                                            <p className="text-xs text-green-500 text-center mt-2 font-bold">Offer letter sent successfully!</p>
                                                        )}
                                                        {sendEmailStatus?.id === selectedEmployee.id && sendEmailStatus.action === 'onboarding' && sendEmailStatus.status === 'success' && (
                                                            <p className="text-xs text-green-500 text-center mt-2 font-bold">Onboarding email sent successfully!</p>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-center opacity-20">
                                            <p className="text-sm font-medium text-center">
                                                Select an employee to<br />view profile and history
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "attendance" && (
                            <div className="bg-white/5 border border-white/5 rounded-xl p-6 flex flex-col overflow-hidden h-full animate-in fade-in duration-500">
                                {/* Sub Tabs toggle */}
                                <div className="flex border-b border-white/10 mb-6 shrink-0">
                                    <button
                                        onClick={() => setAttendanceSubView("logs")}
                                        className={`px-5 py-3 text-xs font-bold border-b-2 transition-all ${attendanceSubView ==='logs'?'border-[#E61E32] text-white':'border-transparent text-white/40 hover:text-white'}`}
                                    >
                                        Logs Timeline
                                    </button>
                                    <button
                                        onClick={() => setAttendanceSubView("today")}
                                        className={`px-5 py-3 text-xs font-bold border-b-2 transition-all ${attendanceSubView ==='today'?'border-[#E61E32] text-white':'border-transparent text-white/40 hover:text-white'}`}
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
                                                        <tr className="border-b border-white/10 text-white/30 text-xs font-bold">
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
                                                                        <p className="text-xs text-white/30">{log.employee?.email}</p>
                                                                    </td>
                                                                    <td className="py-3.5 text-white/50">{log.employee?.role || "-"}</td>
                                                                    <td className="py-3.5">
                                                                        {isActive ? (
                                                                            <span className="text-green-400 text-xs font-extrabold border border-green-500/20 bg-green-500/5 px-2.5 py-0.5 rounded-lg animate-pulse">
                                                                                Active
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-white/40 text-xs font-semibold border border-white/10 bg-white/5 px-2.5 py-0.5 rounded-lg">
                                                                                Inactive
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                    <td className="py-3.5 text-white/80 font-mono text-sm">
                                                                        {new Date(log.punchIn).toLocaleString("en-IN", {
                                                                            timeZone: "Asia/Kolkata",
                                                                            dateStyle: "medium",
                                                                            timeStyle: "short"
                                                                        })}
                                                                    </td>
                                                                    <td className="py-3.5 font-mono text-sm">
                                                                        {log.punchOut ? (
                                                                            <span className="text-white/85">
                                                                                {new Date(log.punchOut).toLocaleString("en-IN", {
                                                                                    timeZone: "Asia/Kolkata",
                                                                                    dateStyle: "medium",
                                                                                    timeStyle: "short"
                                                                                })}
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-yellow-400/80 text-xs font-extrabold border border-yellow-400/20 bg-yellow-400/5 px-2 py-0.5">Punch In</span>
                                                                        )}
                                                                    </td>
                                                                    <td className="py-3.5 text-right font-semibold text-white/60">
                                                                        {isActive ? (
                                                                            <span className="text-green-400 font-extrabold tracking-wide text-xs animate-pulse">In Office</span>
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
                                                <p className="text-white/50 text-xs">No attendance logs found matching filters.</p>
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
                                                <div className="bg-white/[0.02] border border-white/5 p-6 flex flex-col rounded-lg">
                                                    <h3 className="text-xs font-bold text-white mb-4 flex items-center justify-between pb-3 border-b border-white/5 shrink-0">
                                                        <span className="flex items-center gap-2">
                                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                                            Present Today
                                                        </span>
                                                        <span className="bg-green-500/10 text-green-500 px-2 py-0.5 text-xs font-mono">{filteredPresent.length}</span>
                                                    </h3>
                                                    <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1 scrollbar-thin">
                                                        {filteredPresent.length > 0 ? (
                                                            filteredPresent.map(emp => (
                                                                <div key={emp.id} className="p-4 bg-white/5 border border-white/5 flex justify-between items-center hover:border-white/10 transition-colors">
                                                                    <div>
                                                                        <p className="font-semibold text-xs text-white">{emp.name}</p>
                                                                        <p className="text-xs text-white/30">{emp.email} • {emp.role}</p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        {emp.isCurrentlyActive ? (
                                                                            <span className="text-xs font-extrabold bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-0.5 rounded-lg animate-pulse">Active</span>
                                                                        ) : (
                                                                            <span className="text-xs font-semibold bg-white/5 border border-white/10 text-white/40 px-2 py-0.5 rounded-lg">Checked Out</span>
                                                                        )}
                                                                        {emp.latestLog && (
                                                                            <p className="text-xs text-white/30 mt-1.5 font-mono">
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
                                                                <p className="text-white/50 text-xs">No employees present matching filters today.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Absent Today Column */}
                                                <div className="bg-white/[0.02] border border-white/5 p-6 flex flex-col rounded-lg">
                                                    <h3 className="text-xs font-bold text-white mb-4 flex items-center justify-between pb-3 border-b border-white/5 shrink-0">
                                                        <span className="flex items-center gap-2">
                                                            <span className="w-2.5 h-2.5 bg-[#E61E32] rounded-full" />
                                                            Absent Today
                                                        </span>
                                                        <span className="bg-[#E61E32]/10 text-[#E61E32] px-2 py-0.5 text-xs font-mono">{filteredAbsent.length}</span>
                                                    </h3>
                                                    <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1 scrollbar-thin">
                                                        {filteredAbsent.length > 0 ? (
                                                            filteredAbsent.map(emp => (
                                                                <div key={emp.id} className="p-4 bg-white/5 border border-white/5 flex justify-between items-center hover:border-white/10 transition-colors">
                                                                    <div>
                                                                        <p className="font-semibold text-xs text-white">{emp.name}</p>
                                                                        <p className="text-xs text-white/30">{emp.email} • {emp.role}</p>
                                                                    </div>
                                                                    <span className="text-xs font-bold bg-[#E61E32]/10 border border-[#E61E32]/20 text-[#E61E32] px-2 py-0.5 rounded-lg">Absent</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="py-10 text-center border border-dashed border-white/5">
                                                                <p className="text-white/50 text-xs">No absent employees matching filters today.</p>
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
                                <div className={`space-y-4 h-full flex flex-col overflow-hidden ${selectedEmployee ?'hidden lg:flex':'flex'}`}>
                                    {showAddClientForm ? (
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 animate-in slide-in-from-top-4 duration-300">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-lg font-bold tracking-tight">Register New Client</h3>
                                                <button onClick={() => setShowAddClientForm(false)} className="text-white/40 hover:text-white text-xs">Cancel</button>
                                            </div>
                                            <form onSubmit={handleAddClient} className="space-y-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-white/40">Company Name</label>
                                                        <input
                                                            required
                                                            type="text"
                                                            value={newClient.companyName}
                                                            onChange={(e) => setNewClient({ ...newClient, companyName: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-white/40">App / Website Name</label>
                                                        <input
                                                            type="text"
                                                            value={newClient.appName}
                                                            onChange={(e) => setNewClient({ ...newClient, appName: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-white/40">Client Contact Name</label>
                                                        <input
                                                            required
                                                            type="text"
                                                            value={newClient.clientName}
                                                            onChange={(e) => setNewClient({ ...newClient, clientName: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-white/40">Email Address</label>
                                                        <input
                                                            required
                                                            type="email"
                                                            value={newClient.email}
                                                            onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-white/40">Phone Number</label>
                                                        <input
                                                            type="tel"
                                                            value={newClient.phone}
                                                            onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-white/40">Meeting Template</label>
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
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-white/40">Developer Name (For Dev Meet)</label>
                                                        <input
                                                            type="text"
                                                            value={newClient.developerName}
                                                            onChange={(e) => setNewClient({ ...newClient, developerName: e.target.value })}
                                                            placeholder="Lead Engineer Name"
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-white/40">Meeting Link (Custom)</label>
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
                                                    <label className="text-xs font-bold text-white/40">Preferred Meeting Time</label>
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
                                                    className="w-full bg-white text-black font-bold py-3 text-xs hover:bg-[#E61E32] hover:text-white transition-all disabled:opacity-50"
                                                >
                                                    {isSubmitting ? "Registering..." : "Register Client"}
                                                </button>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="overflow-y-auto space-y-3 pr-2 scrollbar-thin flex-grow">
                                            {loading ? (
                                                <p className="text-white/50 text-center py-10">Loading clients...</p>
                                            ) : filteredClients.length > 0 ? (
                                                filteredClients.map((client) => (
                                                    <div
                                                        key={client.id}
                                                        onClick={() => setSelectedClient(client)}
                                                        className={`p-5 border transition-all cursor-pointer ${selectedClient?.id === client.id ?'bg-white/5 border-white/20':'bg-transparent border-white/5 hover:border-white/10'}`}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h3 className="font-bold text-white truncate min-w-0 flex-1 tracking-tight">{client.companyName}</h3>
                                                                <p className="text-xs text-[#E61E32] font-bold">{client.appName || "No App Specified"}</p>
                                                            </div>
                                                            <div className="flex flex-col items-end">
                                                                <span className="text-xs text-white/50 tracking-tighter">
                                                                    Registered {new Date(client.createdAt).toLocaleDateString()}
                                                                </span>
                                                                {client.meetingTime && (
                                                                    <div className="mt-2 flex items-center gap-1 text-xs text-green-500 font-bold">
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
                                                                    className="mt-2 text-xs text-white/40 hover:text-[#E61E32] font-bold transition-colors"
                                                                >
                                                                    Reschedule
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-20 text-center border border-dashed border-white/5">
                                                    <p className="text-white/50 text-sm">No clients found.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Client Details */}
                                <div className={`bg-white/5 border border-white/5 rounded-xl p-4 md:p-6 lg:p-8 overflow-y-auto overflow-x-hidden break-words min-w-0 ${selectedEmployee ?'block':'hidden lg:block'}`}>
                                    {selectedClient ? (
                                        <div className="space-y-8 animate-in fade-in duration-300">
                                            <div className="space-y-2 pb-6 border-b border-white/5">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-white/10 flex items-center justify-center border border-white/10 text-white/40">
                                                            <Building className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-bold">{selectedClient.companyName}</h3>
                                                            <p className="text-sm text-[#E61E32] font-bold">{selectedClient.appName || "Web Project"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            onClick={() => setIsEditingClient(!isEditingClient)}
                                                            className={`p-2 transition-colors ${isEditingClient ?'text-[#E61E32]':'text-white/50 hover:text-white'}`}
                                                            title="Edit Client"
                                                        >
                                                            <Edit2 className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClient(selectedClient.id)}
                                                            className="p-2 text-white/50 hover:text-[#E61E32] transition-colors"
                                                            title="Delete Client"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {isEditingClient ? (
                                                <form onSubmit={handleUpdateClient} className="space-y-6 bg-white/[0.02] p-6 border border-white/5 animate-in slide-in-from-top-4 duration-300">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-xs font-bold text-white/40">Meeting Template</label>
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
                                                            <label className="text-xs font-bold text-white/40">Meeting Time</label>
                                                            <input
                                                                type="datetime-local"
                                                                value={selectedClient.meetingTime ? new Date(selectedClient.meetingTime).toISOString().slice(0, 16) : ""}
                                                                onChange={(e) => setSelectedClient({ ...selectedClient, meetingTime: e.target.value })}
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-xs font-bold text-white/40">Developer Assigned</label>
                                                            <input
                                                                type="text"
                                                                value={selectedClient.developerName || ""}
                                                                onChange={(e) => setSelectedClient({ ...selectedClient, developerName: e.target.value })}
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-xs font-bold text-white/40">Meeting Link</label>
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
                                                            className="flex-grow bg-[#E61E32] text-white font-bold py-3 text-xs hover:bg-white hover:text-black transition-all disabled:opacity-50"
                                                        >
                                                            {isSubmitting ? "Updating..." : "Save Changes"}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsEditingClient(false)}
                                                            className="px-6 bg-white/5 text-white/60 font-bold py-3 text-xs hover:bg-white/10 hover:text-white transition-all border border-white/10"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <>
                                                    <div className="grid grid-cols-1 gap-6">
                                                        <div className="p-6 bg-white/[0.02] border border-white/5 space-y-6">
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                <InfoBlock label="Client Name" value={selectedClient.clientName} />
                                                                <InfoBlock label="Email Address" value={selectedClient.email} />
                                                            </div>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                <InfoBlock label="Phone Number" value={selectedClient.phone || "N/A"} />
                                                                <InfoBlock label="Registered On" value={new Date(selectedClient.createdAt).toLocaleDateString()} />
                                                            </div>
                                                        </div>

                                                        <div className="p-6 bg-[#E61E32]/10 border border-[#E61E32]/10 space-y-4">
                                                            <h4 className="text-xs font-bold text-[#E61E32] flex items-center gap-2">
                                                                <Calendar className="w-3 h-3" />
                                                                Meeting & Schedule
                                                            </h4>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                <InfoBlock label="Template Type" value={selectedClient.meetingTemplate || "Standard Call"} />
                                                                <InfoBlock
                                                                    label="Scheduled Time"
                                                                    value={selectedClient.meetingTime ? new Date(selectedClient.meetingTime).toLocaleString() : "Not Scheduled"}
                                                                />
                                                            </div>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                <InfoBlock label="Developer Assigned" value={selectedClient.developerName || "N/A"} />
                                                                <div className="space-y-1">
                                                                    <p className="text-xs font-bold text-white/50">Meeting Link</p>
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
                                                            className="flex-grow flex items-center justify-center gap-2 bg-white text-black font-bold py-4 text-xs hover:bg-[#E61E32] hover:text-white transition-all disabled:opacity-50"
                                                        >
                                                            {sendEmailStatus?.id === selectedClient.id && sendEmailStatus.status === 'sending' ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <Mail className="w-4 h-4" />
                                                            )}
                                                            {sendEmailStatus?.id === selectedClient.id && sendEmailStatus.status === 'success' ? "Details Sent" : "Send Meeting Details"}
                                                        </button>
                                                        <button className="flex-grow flex items-center justify-center gap-2 bg-white/5 text-white/60 font-bold py-4 text-xs hover:bg-white/10 hover:text-white transition-all border border-white/10">
                                                            <Globe className="w-4 h-4" />
                                                            Open Dashboard
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                            {sendEmailStatus?.id === selectedClient.id && sendEmailStatus.status === 'error' && (
                                                <p className="text-xs text-[#E61E32] text-center mt-2 font-bold">Error sending meeting details. Check logs.</p>
                                            )}
                                            {!selectedClient.meetingTime && (
                                                <p className="text-xs text-white/50 text-center mt-2 font-bold">Schedule a meeting to send details</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-center opacity-20">
                                            <p className="text-sm font-medium text-center">
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
                                        <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
                                            <CreditCard className="w-5 h-5 text-[#E61E32]" />
                                            Send Payment Pending Notice
                                        </h3>
                                        <p className="text-xs text-white/40 mt-1">Select a client and enter outstanding invoice details.</p>
                                    </div>

                                    <form onSubmit={handleSendPaymentDue} className="space-y-6">
                                        {/* Client Dropdown */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-white/40">Select Registered Client *</label>
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
                                                        <p className="text-xs font-bold text-[#E61E32]">Selected Client Details</p>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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
                                                <label className="text-xs font-bold text-white/40">Amount Due *</label>
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
                                                <label className="text-xs font-bold text-white/40">Due Date *</label>
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
                                            <label className="text-xs font-bold text-white/40 block">Upload Invoice PDF (Optional)</label>
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
                                                            className="text-xs text-white/40 hover:text-red-500 font-bold"
                                                        >
                                                            Remove File
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <p className="text-xs font-medium text-white/60">Click to upload or drag & drop</p>
                                                        <p className="text-xs text-white/50 mt-0.5">Only PDF files are supported</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            disabled={paymentSendStatus === 'sending' || !paymentClientId || !paymentAmount || !paymentDueDate}
                                            type="submit"
                                            className="w-full flex items-center justify-center gap-2 bg-[#E61E32] hover:bg-[#E61E32]/90 disabled:bg-[#E61E32]/100 text-white font-bold py-4 text-xs transition-all disabled:cursor-not-allowed"
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
                                            <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-semibold text-center flex items-center justify-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                                Payment reminder email sent successfully!
                                            </div>
                                        )}
                                        {paymentSendStatus === 'error' && (
                                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold text-center flex flex-col items-center gap-1">
                                                <div className="flex items-center gap-1.5">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span>Failed to send email</span>
                                                </div>
                                                {paymentErrorMessage && (
                                                    <p className="text-xs text-red-400/80 mt-1 font-mono normal-case">{paymentErrorMessage}</p>
                                                )}
                                            </div>
                                        )}
                                    </form>
                                </div>

                                {/* Dynamic Live Email Preview */}
                                <div className="bg-white/5 border border-white/5 rounded-xl p-6 flex flex-col h-full space-y-4">
                                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                                        </div>
                                        <span className="text-xs text-white/30 font-mono">Live Email Preview</span>
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
                                                            <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#E61E32', margin: '0 0 10px 0' }}>Billing Details</h3>
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
                                                                    <Paperclip className="w-4 h-4 text-white/60 shrink-0" />
                                                                    <span><strong>Invoice Attached:</strong> {paymentInvoiceFile.name} (PDF)</span>
                                                                </div>
                                                            )}

                                                            <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', fontStyle: 'italic', margin: '20px 0 0 0' }}>
                                                                If you have already processed the payment, please disregard this message or share the receipt with us.
                                                            </p>
                                                        </div>

                                                        {/* Footer */}
                                                        <div style={{ backgroundColor: '#f9fafb', padding: '30px', borderTop: '1px solid #eee', fontSize: '12px' }}>
                                                            <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#E61E32', fontSize: '12px' }}>Billing Lead</p>
                                                            <p style={{ margin: '0', fontSize: '15px', fontWeight: 'bold', color: '#111' }}>Shiva Krishna Manthena</p>
                                                            <p style={{ margin: '2px 0 20px 0', color: '#4b5563' }}>Redlix Studio | Accounts Department</p>

                                                            <div style={{ fontSize: '13px', color: '#9ca3af', lineHeight: '1.6' }}>
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
                                            <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
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
                                            <label className="text-xs font-bold text-white/40">Select Registered Client *</label>
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
                                                        <p className="text-xs font-bold text-[#10B981]">Selected Client Details</p>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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
                                                <label className="text-xs font-bold text-white/40">Amount Received *</label>
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
                                                <label className="text-xs font-bold text-white/40">Payment Date *</label>
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
                                            <label className="text-xs font-bold text-white/40">Transaction ID (Optional)</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. TXN123456789 or UTR / UPI Ref No."
                                                value={receivedTransactionId}
                                                onChange={(e) => setReceivedTransactionId(e.target.value)}
                                                className="w-full bg-black border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 text-white font-mono"
                                            />
                                            <p className="text-xs text-white/50">Will appear as a reference on the payment receipt email.</p>
                                        </div>

                                        {/* Receipt PDF Upload */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-white/40 block">Upload Receipt / Invoice PDF (Optional)</label>
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
                                                            className="text-xs text-white/40 hover:text-red-500 font-bold"
                                                        >
                                                            Remove File
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <p className="text-xs font-medium text-white/60">Click to upload or drag & drop</p>
                                                        <p className="text-xs text-white/50 mt-0.5">Only PDF files are supported</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            disabled={receivedSendStatus === 'sending' || !receivedClientId || !receivedAmount || !receivedDate}
                                            type="submit"
                                            className="w-full flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#10B981]/90 disabled:bg-[#10B981]/50 text-white font-bold py-4 text-xs transition-all disabled:cursor-not-allowed"
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
                                            <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-semibold text-center animate-in fade-in duration-200 flex items-center justify-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                                Payment confirmation email sent successfully!
                                            </div>
                                        )}
                                        {receivedSendStatus === 'error' && (
                                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold text-center flex flex-col items-center gap-1 animate-in fade-in duration-200">
                                                <div className="flex items-center gap-1.5">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span>Failed to send email</span>
                                                </div>
                                                {receivedErrorMessage && (
                                                    <p className="text-xs text-red-400/80 mt-1 font-mono normal-case">{receivedErrorMessage}</p>
                                                )}
                                            </div>
                                        )}
                                    </form>
                                </div>

                                {/* Dynamic Live Email Preview */}
                                <div className="bg-white/5 border border-white/5 rounded-xl p-6 flex flex-col h-full space-y-4">
                                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                                        </div>
                                        <span className="text-xs text-white/30 font-mono">Live Email Preview</span>
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
                                                            <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#10B981', margin: '0 0 10px 0' }}>Receipt Details</h3>
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
                                                                    <Paperclip className="w-4 h-4 text-white/60 shrink-0" />
                                                                    <span><strong>Receipt Attached:</strong> {receivedReceiptFile.name} (PDF)</span>
                                                                </div>
                                                            )}

                                                            <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', fontStyle: 'italic', margin: '20px 0 0 0' }}>
                                                                If you have any questions regarding this transaction, please reach out to our billing team.
                                                            </p>
                                                        </div>

                                                        {/* Footer */}
                                                        <div style={{ backgroundColor: '#f9fafb', padding: '30px', borderTop: '1px solid #eee', fontSize: '12px' }}>
                                                            <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#E61E32', fontSize: '12px' }}>Billing Lead</p>
                                                            <p style={{ margin: '0', fontSize: '15px', fontWeight: 'bold', color: '#111' }}>Shiva Krishna Manthena</p>
                                                            <p style={{ margin: '2px 0 20px 0', color: '#4b5563' }}>Redlix Studio | Accounts Department</p>

                                                            <div style={{ fontSize: '13px', color: '#9ca3af', lineHeight: '1.6' }}>
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
                                                <h3 className="text-sm font-bold text-white">Schedule New Meeting</h3>
                                                <button type="button" onClick={() => setShowAddMeetingForm(false)}><X className="w-4 h-4 text-white/40 hover:text-white" /></button>
                                            </div>
                                            <input required placeholder="Meeting title *" value={newMeeting.title} onChange={e => setNewMeeting(p => ({ ...p, title: e.target.value }))} className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30" />
                                            <textarea placeholder="Description (optional)" value={newMeeting.description} onChange={e => setNewMeeting(p => ({ ...p, description: e.target.value }))} rows={2} className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 resize-none" />
                                            <input required placeholder="Meeting lead name *" value={newMeeting.meetingLead} onChange={e => setNewMeeting(p => ({ ...p, meetingLead: e.target.value }))} className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30" />
                                            <input placeholder="Meeting link (Google Meet / Zoom)" value={newMeeting.meetingLink} onChange={e => setNewMeeting(p => ({ ...p, meetingLink: e.target.value }))} className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30" />
                                            <div>
                                                <label className="text-xs text-white/30 mb-1 block">Scheduled Date & Time *</label>
                                                <input required type="datetime-local" value={newMeeting.scheduledAt} onChange={e => setNewMeeting(p => ({ ...p, scheduledAt: e.target.value }))} className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-white/30 mb-2 block">Select Attendees</label>
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
                                            <button type="submit" disabled={isSubmitting} className="w-full py-2.5 bg-[#E61E32] hover:bg-[#E61E32]/80 text-white text-xs font-bold transition-all flex items-center justify-center gap-2">
                                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Video className="w-4 h-4" /> Schedule Meeting</>}
                                            </button>
                                        </form>
                                    )}

                                    {meetingsLoading ? (
                                        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-white/50" /></div>
                                    ) : meetings.length === 0 ? (
                                        <div className="text-center py-12 text-white/50 text-sm">No meetings scheduled yet.</div>
                                    ) : (
                                        meetings.map(meeting => (
                                            <div
                                                key={meeting.id}
                                                onClick={() => setSelectedMeeting(meeting)}
                                                className={`p-4 border cursor-pointer transition-all space-y-2 ${ selectedMeeting?.id === meeting.id ?'border-[#E61E32]/40 bg-[#E61E32]/10':'border-white/5 bg-white/[0.02] hover:border-white/15'}`}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <p className="text-sm font-semibold text-white">{meeting.title}</p>
                                                        <p className="text-xs text-white/40 mt-0.5">Lead: {meeting.meetingLead}</p>
                                                    </div>
                                                    <span className={`text-xs font-bold px-2 py-0.5 ${ new Date(meeting.scheduledAt) > new Date() ?'bg-green-500/10 text-green-400 border border-green-500/20':'bg-white/5 text-white/30 border border-white/10'}`}>
                                                        {new Date(meeting.scheduledAt) > new Date() ? 'Upcoming' : 'Completed'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-white/30">
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

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="bg-white/[0.03] border border-white/5 p-4 space-y-1">
                                                <p className="text-xs text-white/30">Meeting Lead</p>
                                                <p className="text-sm font-semibold text-white">{selectedMeeting.meetingLead}</p>
                                            </div>
                                            <div className="bg-white/[0.03] border border-white/5 p-4 space-y-1">
                                                <p className="text-xs text-white/30">Scheduled At</p>
                                                <p className="text-sm font-semibold text-white">{new Date(selectedMeeting.scheduledAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' })}</p>
                                            </div>
                                        </div>

                                        {selectedMeeting.meetingLink && (
                                            <div className="bg-white/[0.03] border border-white/5 p-4">
                                                <p className="text-xs text-white/30 mb-2">Meeting Link</p>
                                                <a href={selectedMeeting.meetingLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#E61E32] text-sm hover:underline">
                                                    <LinkIcon className="w-4 h-4" />{selectedMeeting.meetingLink}
                                                </a>
                                            </div>
                                        )}

                                        <div>
                                            <p className="text-xs text-white/30 mb-3">Attendees ({selectedMeeting.attendees.length})</p>
                                            <div className="space-y-2">
                                                {selectedMeeting.attendees.map(att => (
                                                    <div key={att.id} className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/5">
                                                        <div className="w-7 h-7 rounded-full bg-[#E61E32]/10 border border-[#E61E32]/20 flex items-center justify-center">
                                                            <User className="w-3.5 h-3.5 text-[#E61E32]" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-white">{att.employee.name}</p>
                                                            <p className="text-xs text-white/30">{att.employee.role} &middot; {att.employee.email}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {selectedMeeting.attendees.length === 0 && (
                                                    <p className="text-sm text-white/50">No attendees assigned.</p>
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
                                    <form onSubmit={handleAddDocument} className="bg-white/[0.02] border border-white/10 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="col-span-2 flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-white">Add New Document</h3>
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
                                        <button type="submit" disabled={isSubmitting} className="col-span-2 py-2.5 bg-[#E61E32] hover:bg-[#E61E32]/80 text-white text-xs font-bold transition-all flex items-center justify-center gap-2">
                                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><FileText className="w-4 h-4" /> Add Document</>}
                                        </button>
                                    </form>
                                )}

                                {documentsLoading ? (
                                    <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-white/50" /></div>
                                ) : documents.length === 0 ? (
                                    <div className="text-center py-16 text-white/50 text-sm">No documents uploaded yet. Click &ldquo;Add Document&rdquo; to get started.</div>
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
                                                                <p className="text-xs text-white/30">{doc.fileName}</p>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => handleDeleteDocument(doc.id)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-[#E61E32]/10 text-white/30 hover:text-[#E61E32] transition-all">
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                    {doc.description && <p className="text-xs text-white/40 line-clamp-2">{doc.description}</p>}
                                                    <div className="flex items-center justify-between">
                                                        <span className={`text-xs font-bold px-2 py-0.5 border ${categoryColors[doc.category] || categoryColors.other}`}>
                                                            {doc.category}
                                                        </span>
                                                        <span className="text-xs text-white/50">{new Date(doc.createdAt).toLocaleDateString()}</span>
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
                                <div className="flex flex-wrap items-center gap-3 shrink-0">
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-lg">
                                        <Hourglass className="w-3 h-3" />
                                        {adminDeclarations.filter(d => d.status === "pending").length} Pending
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg">
                                        <CheckCheck className="w-3 h-3" />
                                        {adminDeclarations.filter(d => d.status === "reviewed").length} Reviewed
                                    </span>
                                </div>

                                {declarationsLoading ? (
                                    <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-white/50" /></div>
                                ) : adminDeclarations.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                                        <FolderUp className="w-12 h-12 text-white/10" />
                                        <p className="text-sm text-white/50">No declarations submitted by employees yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {adminDeclarations.map(decl => (
                                            <div key={decl.id} className="bg-white/[0.02] border border-white/8 rounded-lg p-5 flex flex-col md:flex-row md:items-center gap-4 hover:border-white/15 transition-all group">
                                                {/* File icon + info */}
                                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                                    <div className="w-10 h-10 rounded-lg bg-[#E61E32]/10 border border-[#E61E32]/20 flex items-center justify-center shrink-0">
                                                        <FileText className="w-5 h-5 text-[#E61E32]" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <p className="text-sm font-semibold text-white truncate">{decl.fileName}</p>
                                                            <span className="text-xs font-bold bg-white/5 border border-white/10 text-white/40 px-2 py-0.5 rounded-lg">
                                                                {decl.fileType.split('/')[1]?.toUpperCase() || decl.fileType}
                                                            </span>
                                                            <span className="text-xs text-white/30">{(decl.fileSize / 1024).toFixed(1)} KB</span>
                                                        </div>
                                                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                                            <span className="flex items-center gap-1 text-xs text-white/50">
                                                                <User className="w-3 h-3" />
                                                                {decl.employee.name}
                                                            </span>
                                                            <span className="text-xs text-white/30 bg-white/5 px-1.5 py-0.5 rounded-lg">{decl.employee.role}</span>
                                                            {decl.clientName && (
                                                                <span className="text-xs text-white/50">Client: <span className="text-white/70 font-medium">{decl.clientName}</span></span>
                                                            )}
                                                            {decl.notes && (
                                                                <span className="text-xs text-white/40 italic truncate min-w-0 flex-1">{decl.notes}</span>
                                                            )}
                                                            <span className="text-xs text-white/25">{new Date(decl.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2 self-start md:self-auto mt-2 md:mt-0 flex-wrap shrink-0">
                                                    {/* Status Badge + Toggle */}
                                                    <button
                                                        onClick={() => handleReviewDeclaration(decl.id, decl.status === "reviewed" ? "pending" : "reviewed")}
                                                        className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${ decl.status ==="reviewed"?"text-green-400 bg-green-500/10 border-green-500/20 hover:bg-green-500/20":"text-yellow-400 bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/20"}`}
                                                        title={decl.status === "reviewed" ? "Mark as pending" : "Mark as reviewed"}
                                                    >
                                                        {decl.status === "reviewed" ? (
                                                            <><CheckCheck className="w-3 h-3" /> Reviewed</>
                                                        ) : (
                                                            <><Hourglass className="w-3 h-3" /> Pending</>
                                                        )}
                                                    </button>

                                                    {/* Preview */}
                                                    <button
                                                        onClick={() => setPreviewFile({ name: decl.fileName, type: decl.fileType, data: decl.fileData })}
                                                        className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border text-white/50 bg-white/5 border-white/10 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                                                        title="Preview document"
                                                    >
                                                        <Eye className="w-3 h-3" /> Preview
                                                    </button>

                                                    {/* Download */}
                                                    <a
                                                        href={decl.fileData}
                                                        download={decl.fileName}
                                                        className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border text-white/50 bg-white/5 border-white/10 hover:bg-white/10 hover:text-white transition-all"
                                                        title="Download file"
                                                    >
                                                        <Download className="w-3 h-3" /> Download
                                                    </a>

                                                    {/* Delete */}
                                                    <button
                                                        onClick={() => handleDeleteDeclaration(decl.id)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#E61E32]/10 border border-[#E61E32]/10 text-[#E61E32]/50 hover:bg-[#E61E32]/15 hover:text-[#E61E32] hover:border-[#E61E32]/30 transition-all"
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

                        {/* ===== WORK SUBMISSIONS TAB ===== */}
                        {activeTab === "submissions" && (
                            <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500 overflow-y-auto pr-2 pb-6">
                                <div className="flex flex-wrap items-center gap-3 shrink-0">
                                    <div className="flex items-center gap-2 text-xs text-white/30 bg-white/5 border border-white/10 px-3 py-2 rounded-lg self-start sm:self-auto shrink-0">
                                        <Send className="w-3.5 h-3.5" />
                                        <span className="font-semibold">{filteredSubmissions.length} Submissions</span>
                                    </div>
                                </div>

                                {submissionsLoading ? (
                                    <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-white/50" /></div>
                                ) : filteredSubmissions.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-3 border border-dashed border-white/5">
                                        <Send className="w-12 h-12 text-white/10" />
                                        <p className="text-sm text-white/50">No work submissions found.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {filteredSubmissions.map(sub => (
                                            <div key={sub.id} className="bg-white/[0.02] border border-white/8 rounded-lg p-5 flex flex-col justify-between gap-4 hover:border-white/15 transition-all group">
                                                <div className="space-y-4">
                                                    {/* Header with Employee and Client Details */}
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                                                                {sub.employee?.avatar ? (
                                                                    <img src={sub.employee.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <User className="w-5 h-5 text-white/30" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-white leading-tight">{sub.employee?.name}</p>
                                                                <span className="text-xs text-white/40">{sub.employee?.role}</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-xs font-bold bg-white/5 border border-white/10 text-white/40 px-2 py-0.5 rounded-lg">
                                                                Client
                                                            </span>
                                                            <p className="text-xs font-semibold text-white/80 mt-1">{sub.client?.companyName}</p>
                                                            <span className="text-xs text-white/40">({sub.client?.clientName})</span>
                                                        </div>
                                                    </div>

                                                    <div className="h-[1px] bg-white/5" />

                                                    {/* Website and Git Repo Links */}
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between gap-2 p-2.5 bg-white/[0.01] border border-white/5 rounded-lg hover:bg-white/[0.03] transition-all">
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                <Globe className="w-4 h-4 text-white/40 shrink-0" />
                                                                <div className="min-w-0">
                                                                    <p className="text-xs text-white/30 font-semibold">Website Link</p>
                                                                    <p className="text-xs text-blue-400 font-medium truncate min-w-0" title={sub.websiteLink}>{sub.websiteLink}</p>
                                                                </div>
                                                            </div>
                                                            <a
                                                                href={sub.websiteLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-all shrink-0"
                                                                title="Open Website"
                                                            >
                                                                <ExternalLink className="w-3.5 h-3.5" />
                                                            </a>
                                                        </div>

                                                        <div className="flex items-center justify-between gap-2 p-2.5 bg-white/[0.01] border border-white/5 rounded-lg hover:bg-white/[0.03] transition-all">
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                <Building className="w-4 h-4 text-white/40 shrink-0" />
                                                                <div className="min-w-0">
                                                                    <p className="text-xs text-white/30 font-semibold">Git Repository</p>
                                                                    <p className="text-xs text-blue-400 font-medium truncate min-w-0" title={sub.gitRepoLink}>{sub.gitRepoLink}</p>
                                                                </div>
                                                            </div>
                                                            <a
                                                                href={sub.gitRepoLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-all shrink-0"
                                                                title="Open Repository"
                                                            >
                                                                <ExternalLink className="w-3.5 h-3.5" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Date submitted */}
                                                <div className="text-xs text-white/50 text-right mt-1">
                                                    Submitted on {new Date(sub.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
                                <div className="flex flex-wrap gap-2 shrink-0 border-b border-white/5 pb-4">
                                    <button
                                        type="button"
                                        onClick={() => { setPayrollSubView("payouts"); setShowAddRevenueForm(false); }}
                                        className={`px-4 py-2 text-xs font-semibold transition-all rounded-lg ${payrollSubView === "payouts" ? "bg-[#E61E32]/10 text-[#E61E32]" : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10"}`}
                                    >
                                        Employee Payouts
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setPayrollSubView("amount-generated"); setShowAddPayrollForm(false); }}
                                        className={`px-4 py-2 text-xs font-semibold transition-all rounded-lg ${payrollSubView === "amount-generated" ? "bg-[#E61E32]/10 text-[#E61E32]" : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10"}`}
                                    >
                                        Amount Generated
                                    </button>
                                </div>

                                {payrollSubView === "payouts" && (
                                <>
                                {showAddPayrollForm && (
                                    <form onSubmit={handleAllocatePayroll} className="bg-white/[0.02] border border-white/10 p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
                                        <div className="md:col-span-2 lg:col-span-4 flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-white">Allocate Employee Payout</h3>
                                            <button type="button" onClick={() => setShowAddPayrollForm(false)}><X className="w-4 h-4 text-white/40 hover:text-white" /></button>
                                        </div>
                                        
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-bold text-white/40">Select Employee *</label>
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
                                            <label className="text-xs font-bold text-white/40">Month (e.g. May 2026) *</label>
                                            <input 
                                                required 
                                                placeholder="e.g. May 2026" 
                                                value={newPayroll.month} 
                                                onChange={e => setNewPayroll(p => ({ ...p, month: e.target.value }))} 
                                                className="bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30" 
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-bold text-white/40">Amount (INR) *</label>
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
                                            <label className="text-xs font-bold text-white/40">Status *</label>
                                            <select 
                                                value={newPayroll.status} 
                                                onChange={e => setNewPayroll(p => ({ ...p, status: e.target.value }))} 
                                                className="bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
                                            >
                                                <option value="pending" className="bg-[#111]">Pending</option>
                                                <option value="paid" className="bg-[#111]">Paid</option>
                                            </select>
                                        </div>

                                        <button type="submit" disabled={isSubmitting} className="md:col-span-2 lg:col-span-4 py-2.5 bg-[#E61E32] hover:bg-[#E61E32]/80 text-white text-xs font-bold transition-all flex items-center justify-center gap-2">
                                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CreditCard className="w-4 h-4" /> Allocate Payroll</>}
                                        </button>
                                    </form>
                                )}

                                {payrollsLoading ? (
                                    <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-white/50" /></div>
                                ) : (
                                    (() => {
                                        const filtered = payrolls.filter(p =>
                                            p.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            p.month.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            p.employee.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            (p.upiId && p.upiId.toLowerCase().includes(searchQuery.toLowerCase()))
                                        );

                                        return (
                                            <div className="bg-white/5 border border-white/5 rounded-xl p-6 flex flex-col overflow-hidden">
                                                <div className="overflow-x-auto">
                                                    {filtered.length > 0 ? (
                                                        <table className="w-full text-left text-xs">
                                                            <thead>
                                                                <tr className="border-b border-white/10 text-white/30 text-xs font-bold">
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
                                                                            <p className="text-xs text-white/40">{p.employee.role}</p>
                                                                        </td>
                                                                        <td className="py-3 font-medium text-white/90">{p.month}</td>
                                                                        <td className="py-3 text-white font-semibold">₹{p.amount.toLocaleString('en-IN')}</td>
                                                                        <td className="py-3 font-mono text-white/40">{p.upiId || p.employee.upiId || "Not provided"}</td>
                                                                        <td className="py-3">
                                                                            <span className={`px-2 py-0.5 text-xs font-black border ${ p.status ==='paid'?'bg-green-500/10 text-green-400 border-green-500/20':'bg-[#E61E32]/10 text-[#E61E32] border-[#E61E32]/20'}`}>
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
                                                                                        className="px-2.5 py-1 bg-green-500 hover:bg-green-600 text-black text-xs font-extrabold transition-all rounded-lg cursor-pointer"
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
                                                        <div className="py-16 text-center text-white/50 text-sm">
                                                            No payroll records found. Click &ldquo;Allocate Payroll&rdquo; to add a new record.
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })()
                                )}
                                </>
                                )}

                                {payrollSubView === "amount-generated" && (
                                    <>
                                        {showAddRevenueForm && (
                                            <form onSubmit={handleAddClientRevenue} className="bg-white/[0.02] border border-white/10 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 shrink-0">
                                                <div className="md:col-span-2 lg:col-span-3 flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-sm font-bold text-white">Record Amount From Client</h3>
                                                        <p className="text-xs text-white/50 mt-1">Track revenue collected from clients (separate from employee payouts)</p>
                                                    </div>
                                                    <button type="button" onClick={() => setShowAddRevenueForm(false)}><X className="w-4 h-4 text-white/40 hover:text-white" /></button>
                                                </div>

                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-xs font-medium text-white/60">Registered Client</label>
                                                    <select
                                                        value={newRevenue.clientId}
                                                        onChange={e => {
                                                            const id = e.target.value;
                                                            const client = clients.find(c => String(c.id) === id);
                                                            setNewRevenue(p => ({
                                                                ...p,
                                                                clientId: id,
                                                                clientName: client ? (client.companyName || client.clientName) : p.clientName,
                                                            }));
                                                        }}
                                                        className="bg-white/5 border border-white/10 px-3 py-2 text-sm text-white rounded-lg focus:outline-none focus:border-[#E61E32]"
                                                    >
                                                        <option value="" className="bg-[#111]">Select client (optional)</option>
                                                        {clients.map(c => (
                                                            <option key={c.id} value={c.id} className="bg-[#111]">{c.companyName} — {c.clientName}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-xs font-medium text-white/60">Client / Company Name *</label>
                                                    <input
                                                        required
                                                        placeholder="e.g. Acme Corp"
                                                        value={newRevenue.clientName}
                                                        onChange={e => setNewRevenue(p => ({ ...p, clientName: e.target.value }))}
                                                        className="bg-white/5 border border-white/10 px-3 py-2 text-sm text-white rounded-lg placeholder-white/30 focus:outline-none focus:border-[#E61E32]"
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-xs font-medium text-white/60">Month *</label>
                                                    <input
                                                        required
                                                        placeholder="e.g. May 2026"
                                                        value={newRevenue.month}
                                                        onChange={e => setNewRevenue(p => ({ ...p, month: e.target.value }))}
                                                        className="bg-white/5 border border-white/10 px-3 py-2 text-sm text-white rounded-lg placeholder-white/30 focus:outline-none focus:border-[#E61E32]"
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-xs font-medium text-white/60">Amount Received (INR) *</label>
                                                    <input
                                                        required
                                                        type="number"
                                                        min="0"
                                                        placeholder="e.g. 150000"
                                                        value={newRevenue.amount}
                                                        onChange={e => setNewRevenue(p => ({ ...p, amount: e.target.value }))}
                                                        className="bg-white/5 border border-white/10 px-3 py-2 text-sm text-white rounded-lg placeholder-white/30 focus:outline-none focus:border-[#E61E32]"
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-xs font-medium text-white/60">Received Date</label>
                                                    <input
                                                        type="date"
                                                        value={newRevenue.receivedAt}
                                                        onChange={e => setNewRevenue(p => ({ ...p, receivedAt: e.target.value }))}
                                                        className="bg-white/5 border border-white/10 px-3 py-2 text-sm text-white rounded-lg focus:outline-none focus:border-[#E61E32]"
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-1.5 md:col-span-2 lg:col-span-3">
                                                    <label className="text-xs font-medium text-white/60">Notes</label>
                                                    <input
                                                        placeholder="Invoice ref, project name, etc."
                                                        value={newRevenue.notes}
                                                        onChange={e => setNewRevenue(p => ({ ...p, notes: e.target.value }))}
                                                        className="bg-white/5 border border-white/10 px-3 py-2 text-sm text-white rounded-lg placeholder-white/30 focus:outline-none focus:border-[#E61E32]"
                                                    />
                                                </div>

                                                <button type="submit" disabled={isSubmitting} className="md:col-span-2 lg:col-span-3 py-2.5 bg-[#E61E32] hover:bg-[#E61E32]/80 text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 rounded-lg">
                                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Briefcase className="w-4 h-4" /> Save Amount Generated</>}
                                                </button>
                                            </form>
                                        )}

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
                                            <StatCard
                                                icon={<Briefcase className="w-5 h-5" />}
                                                label="Total Generated"
                                                value={Math.round(clientRevenues.reduce((s, r) => s + r.amount, 0))}
                                                sublabel="All recorded client revenue"
                                                color="text-green-500"
                                            />
                                            <StatCard
                                                icon={<CreditCard className="w-5 h-5" />}
                                                label="Records"
                                                value={clientRevenues.length}
                                                sublabel="Client payment entries"
                                                color="text-blue-500"
                                            />
                                            <StatCard
                                                icon={<Users className="w-5 h-5" />}
                                                label="Paid Payouts"
                                                value={Math.round(payrolls.filter(p => p.status === "paid").reduce((s, p) => s + p.amount, 0))}
                                                sublabel="Sent to employees (INR)"
                                                color="text-[#E61E32]"
                                            />
                                        </div>

                                        {clientRevenuesLoading ? (
                                            <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-white/50" /></div>
                                        ) : (
                                            (() => {
                                                const filtered = clientRevenues.filter(r =>
                                                    r.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                    r.month.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                    (r.notes && r.notes.toLowerCase().includes(searchQuery.toLowerCase()))
                                                );

                                                return (
                                                    <div className="bg-white/5 border border-white/5 rounded-xl p-6 flex flex-col overflow-hidden">
                                                        <div className="overflow-x-auto">
                                                            {filtered.length > 0 ? (
                                                                <table className="w-full text-left text-xs min-w-[700px]">
                                                                    <thead>
                                                                        <tr className="border-b border-white/10 text-white/50 text-xs font-semibold">
                                                                            <th className="py-3">Client</th>
                                                                            <th className="py-3">Month</th>
                                                                            <th className="py-3">Amount</th>
                                                                            <th className="py-3">Received</th>
                                                                            <th className="py-3">Notes</th>
                                                                            <th className="py-3 text-right">Actions</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {filtered.map(r => (
                                                                            <tr key={r.id} className="border-b border-white/5 text-white/70 hover:bg-white/[0.02]">
                                                                                <td className="py-3">
                                                                                    <p className="font-semibold text-white">{r.clientName}</p>
                                                                                    {r.client && <p className="text-xs text-white/40">{r.client.clientName}</p>}
                                                                                </td>
                                                                                <td className="py-3 font-medium text-white/90">{r.month}</td>
                                                                                <td className="py-3 text-green-400 font-semibold">₹{r.amount.toLocaleString("en-IN")}</td>
                                                                                <td className="py-3 text-white/40">
                                                                                    {r.receivedAt
                                                                                        ? new Date(r.receivedAt).toLocaleDateString("en-IN", { dateStyle: "medium" })
                                                                                        : "-"}
                                                                                </td>
                                                                                <td className="py-3 text-white/50 max-w-[200px] truncate" title={r.notes || ""}>{r.notes || "-"}</td>
                                                                                <td className="py-3 text-right">
                                                                                    <button
                                                                                        onClick={() => handleDeleteClientRevenue(r.id)}
                                                                                        className="p-1 text-white/35 hover:text-[#E61E32] transition-colors"
                                                                                        title="Delete record"
                                                                                    >
                                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                                    </button>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            ) : (
                                                                <div className="py-16 text-center text-white/50 text-sm">
                                                                    No amount generated records yet. Click &ldquo;Add Amount Generated&rdquo; to log client revenue.
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })()
                                        )}
                                    </>
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
                                                className={`px-4 py-2 text-xs font-bold transition-all border rounded-lg ${ isActive ?"bg-[#E61E32]/10 text-[#E61E32] border-[#E61E32]/35":"bg-white/5 text-white/50 border-white/5 hover:text-white hover:bg-white/10"}`}
                                            >
                                                {filter} ({count})
                                            </button>
                                        );
                                    })}
                                </div>

                                {leavesLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="w-6 h-6 animate-spin text-white/50" />
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
                                                            <div key={leave.id} className="bg-white/5 border border-white/5 rounded-xl p-6 flex flex-col justify-between space-y-4 hover:border-white/10 transition-colors">
                                                                <div className="space-y-3">
                                                                    <div className="flex justify-between items-start gap-4">
                                                                        <div>
                                                                            <h4 className="text-sm font-bold text-white">{leave.employee.name}</h4>
                                                                            <p className="text-xs text-white/40 font-semibold mt-0.5">{leave.employee.role} &bull; {leave.employee.email}</p>
                                                                        </div>
                                                                        <span className={`px-2 py-0.5 text-xs font-black border ${ leave.status ==='approved'?'bg-green-500/10 text-green-400 border-green-500/20': leave.status ==='rejected'?'bg-[#E61E32]/10 text-[#E61E32] border-[#E61E32]/20':'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                                                            {leave.status}
                                                                        </span>
                                                                    </div>

                                                                    <div className="h-[1px] bg-white/5" />

                                                                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                                                                        <div>
                                                                            <p className="text-xs text-white/30 font-bold">Leave Duration</p>
                                                                            <p className="font-semibold text-white mt-0.5">
                                                                                {start.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' })}
                                                                                {" - "}
                                                                                {end.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' })}
                                                                            </p>
                                                                            <p className="text-xs text-white/40">{diffDays} {diffDays === 1 ? 'day' : 'days'}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs text-white/30 font-bold text-right">Leave Type</p>
                                                                            <span className="inline-block text-xs font-extrabold px-1.5 py-0.5 bg-white/5 border border-white/10 text-white/70 mt-1">
                                                                                {leave.type}
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="text-xs text-white/70 bg-black/20 p-3 border border-white/[0.02] break-words">
                                                                        <p className="text-xs font-semibold text-white/45 mb-1">Employee Reason</p>
                                                                        {leave.reason}
                                                                    </div>

                                                                    {leave.adminNotes && (
                                                                        <div className="text-xs text-white/70 bg-[#E61E32]/10 p-3 border border-[#E61E32]/10 break-words">
                                                                            <p className="text-xs font-semibold text-[#E61E32] mb-1 font-bold">Admin Remarks</p>
                                                                            {leave.adminNotes}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {leave.status === "pending" && (
                                                                    <div className="space-y-3 pt-2">
                                                                        <div className="flex flex-col gap-1.5">
                                                                            <label className="text-xs font-bold text-white/40">Admin Notes / Remarks</label>
                                                                            <textarea
                                                                                placeholder="Enter approval/rejection remarks..."
                                                                                value={leaveRemarks[leave.id] || ""}
                                                                                onChange={(e) => setLeaveRemarks(prev => ({ ...prev, [leave.id]: e.target.value }))}
                                                                                rows={2}
                                                                                className="w-full bg-[#111111] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 rounded-lg resize-none"
                                                                            />
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-3">
                                                                            <button
                                                                                onClick={() => handleReviewLeave(leave.id, "approved", leaveRemarks[leave.id] || "")}
                                                                                className="py-2 bg-green-500 hover:bg-green-600 text-black text-xs font-black transition-colors duration-200 rounded-lg cursor-pointer text-center"
                                                                            >
                                                                                Approve
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleReviewLeave(leave.id, "rejected", leaveRemarks[leave.id] || "")}
                                                                                className="py-2 bg-[#E61E32] hover:bg-[#C81428] text-white text-xs font-black transition-colors duration-200 rounded-lg cursor-pointer text-center"
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
                                                        <p className="text-white/50 text-sm">No leave requests found matching filters.</p>
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
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <Settings className="w-5 h-5 text-[#E61E32]" />
                                            System Administration Controls
                                        </h3>
                                        <p className="text-xs text-white/40 mt-1">Configure global server limits, dashboard settings, and perform system actions.</p>
                                    </div>

                                    {/* Pricing Cards Slots Configuration */}
                                    <div className="border border-white/10 bg-white/[0.02] p-6 space-y-4">
                                        <div className="flex items-center gap-2 text-white">
                                            <Settings className="w-5 h-5 shrink-0 text-[#E61E32]" />
                                            <h4 className="font-extrabold text-xs">Pricing Card Slots Configuration</h4>
                                        </div>
                                        <p className="text-xs text-white/70 max-w-2xl leading-relaxed">
                                            Control the availability status and number of free slots shown on the public pricing section.
                                        </p>
                                        
                                        {slotsLoading ? (
                                            <div className="flex items-center gap-2 py-4">
                                                <Loader2 className="w-4 h-4 animate-spin text-white/50" />
                                                <span className="text-xs text-white/40">Loading configuration...</span>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleSaveSlots} className="space-y-4 max-w-md pt-2">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="flex flex-col gap-1.5">
                                                        <label className="text-xs font-bold text-white/40">Availability Status</label>
                                                        <select
                                                            value={slotsStatus}
                                                            onChange={e => setSlotsStatus(e.target.value as "available" | "booked")}
                                                            className="w-full bg-[#111111] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E61E32]"
                                                        >
                                                            <option value="available" className="bg-[#111]">Slots Available (Green)</option>
                                                            <option value="booked" className="bg-[#111]">Fully Booked (Red)</option>
                                                        </select>
                                                    </div>
                                                    <div className="flex flex-col gap-1.5">
                                                        <label className="text-xs font-bold text-white/40">Available Slots Count</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            placeholder="e.g. 3"
                                                            value={slotsCount}
                                                            onChange={e => setSlotsCount(parseInt(e.target.value) || 0)}
                                                            className="w-full bg-[#111111] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E61E32] disabled:opacity-40 disabled:cursor-not-allowed"
                                                            disabled={slotsStatus === "booked"}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="flex flex-col gap-1.5">
                                                        <label className="text-xs font-bold text-white/40">Current Month Override (Optional)</label>
                                                        <input
                                                            type="text"
                                                            placeholder="e.g. MAY"
                                                            value={currentMonthOverride}
                                                            onChange={e => setCurrentMonthOverride(e.target.value.toUpperCase())}
                                                            className="w-full bg-[#111111] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E61E32] placeholder-white/20"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-1.5">
                                                        <label className="text-xs font-bold text-white/40">Next Month Override (Optional)</label>
                                                        <input
                                                            type="text"
                                                            placeholder="e.g. JUNE"
                                                            value={nextMonthOverride}
                                                            onChange={e => setNextMonthOverride(e.target.value.toUpperCase())}
                                                            className="w-full bg-[#111111] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E61E32] placeholder-white/20"
                                                        />
                                                    </div>
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={isSavingSlots}
                                                    className="w-full py-3 bg-[#E61E32] hover:bg-[#ff1f34] disabled:bg-white/5 disabled:text-white/50 text-white text-xs font-bold transition-all rounded-lg cursor-pointer flex items-center justify-center gap-2"
                                                >
                                                    {isSavingSlots ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" /> Saving Configuration...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle2 className="w-4 h-4" /> Save Configuration
                                                        </>
                                                    )}
                                                </button>
                                            </form>
                                        )}
                                    </div>

                                    {/* Selective Table Purge Control */}
                                    <div className="border border-yellow-500/30 bg-yellow-500/[0.02] p-6 space-y-4">
                                        <div className="flex items-center gap-2 text-yellow-500">
                                            <AlertCircle className="w-5 h-5 shrink-0" />
                                            <h4 className="font-extrabold text-xs">Selective Table Data Purge</h4>
                                        </div>
                                        <p className="text-xs text-white/70 max-w-2xl leading-relaxed">
                                            Select a specific database table to purge all of its records. Unlike a factory reset, this will only remove the data in the selected table.
                                        </p>
                                        
                                        <form onSubmit={handlePurgeTable} className="space-y-4 max-w-md pt-2">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-white/40">Select Database Table</label>
                                                <select
                                                    value={selectedPurgeTable}
                                                    onChange={e => setSelectedPurgeTable(e.target.value)}
                                                    className="w-full bg-[#111111] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-500"
                                                >
                                                    <option value="" disabled className="bg-[#111]">-- Choose Table --</option>
                                                    <option value="attendance" className="bg-[#111]">Attendance Logs</option>
                                                    <option value="clients" className="bg-[#111]">Clients</option>
                                                    <option value="contact_inquiries" className="bg-[#111]">Contact Inquiries</option>
                                                    <option value="declarations" className="bg-[#111]">Declarations</option>
                                                    <option value="documents" className="bg-[#111]">Uploaded Documents</option>
                                                    <option value="employees" className="bg-[#111]">Employees (Warning: cascades to attendance, tasks, etc.)</option>
                                                    <option value="intern_support" className="bg-[#111]">Intern Support Tickets</option>
                                                    <option value="leave_requests" className="bg-[#111]">Leave Requests</option>
                                                    <option value="meetings" className="bg-[#111]">Meetings & Attendees</option>
                                                    <option value="payrolls" className="bg-[#111]">Payroll Allocations</option>
                                                    <option value="support_tickets" className="bg-[#111]">Support Tickets</option>
                                                    <option value="system_settings" className="bg-[#111]">System Settings (Pricing Slots)</option>
                                                    <option value="tasks" className="bg-[#111]">Tasks</option>
                                                </select>
                                            </div>

                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-white/40">
                                                    Type <span className="text-yellow-500 select-all font-mono">CONFIRM</span> to proceed *
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Type CONFIRM"
                                                    value={purgeConfirmInput}
                                                    onChange={e => setPurgeConfirmInput(e.target.value)}
                                                    className="w-full bg-[#111111] border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={!selectedPurgeTable || purgeConfirmInput !== "CONFIRM" || isPurgingTable}
                                                className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 disabled:bg-white/5 disabled:text-white/50 disabled:border-transparent text-black font-bold text-xs transition-all rounded-lg cursor-pointer flex items-center justify-center gap-2"
                                            >
                                                {isPurgingTable ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" /> Purging Table Data...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Trash2 className="w-4 h-4" /> Purge Table Data
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </div>

                                    {/* Danger Zone */}
                                    <div className="border border-[#E61E32]/30 bg-[#E61E32]/10 p-6 space-y-4">
                                        <div className="flex items-center gap-2 text-[#E61E32]">
                                            <AlertCircle className="w-5 h-5 shrink-0" />
                                            <h4 className="font-extrabold text-xs">Danger Zone — Permanent Action</h4>
                                        </div>
                                        <p className="text-xs text-white/70 max-w-2xl leading-relaxed">
                                            Factory Reset will completely purge all data from your dashboard. This includes deleting all registered Employees, Tasks, Payouts, Documents, Support Tickets, Clients, and Meetings permanently. There is no way to recover this data.
                                        </p>
                                        
                                        <form onSubmit={handleMasterReset} className="space-y-4 max-w-md pt-2">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold text-white/40">
                                                    Type <span className="text-[#E61E32] select-all font-mono">RESET</span> to confirm *
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Type RESET"
                                                    value={resetInput}
                                                    onChange={e => setResetInput(e.target.value)}
                                                    className="w-full bg-[#111111] border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E61E32] transition-colors rounded-lg"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={resetInput !== "RESET" || resetLoading}
                                                className="w-full py-3 bg-[#E61E32] hover:bg-[#ff1f34] disabled:bg-white/5 disabled:text-white/50 disabled:border-transparent text-white text-xs font-bold transition-all rounded-lg cursor-pointer flex items-center justify-center gap-2"
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
                                { id: "push_notification", label: "Push Notification", desc: "Send a push notification to a device registration token", icon: <Bell className="w-5 h-5" />, target: "push" },
                            ] as const;

                            const currentType = ALERT_TYPES.find(a => a.id === alertType)!;

                            const handleSendAlert = async (e: React.FormEvent) => {
                                e.preventDefault();
                                setAlertSendStatus('sending');
                                setAlertSendMessage('');
                                try {
                                    if (alertType === 'push_notification') {
                                        const res = await fetch('/api/admin/send-notification', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                title: alertPushTitle,
                                                body: alertPushBody
                                            })
                                        });
                                        const data = await res.json();
                                        if (data.success) {
                                            setAlertSendStatus('success');
                                            setAlertSendMessage(data.message || 'Push notification sent successfully!');
                                        } else {
                                            setAlertSendStatus('error');
                                            setAlertSendMessage(data.message || data.error || 'Failed to send push notification.');
                                        }
                                        return;
                                    }

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
                                if (alertType === 'push_notification') return alertPushTitle || 'Push Notification Title';
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
                                                    className={`relative p-4 border text-left transition-all duration-200 group ${ alertType === type.id ?'border-[#E61E32] bg-[#E61E32]/10 text-white':'border-white/10 bg-white/[0.02] text-white/50 hover:border-white/20 hover:text-white hover:bg-white/5'}`}
                                                >
                                                    {alertType === type.id && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E61E32] animate-pulse" />}
                                                    <div className={`mb-2 ${alertType === type.id ?'text-[#E61E32]':'text-white/40 group-hover:text-white/70'}`}>{type.icon}</div>
                                                    <p className="text-xs font-semibold leading-tight">{type.label}</p>
                                                    <p className="text-xs text-white/30 mt-1 leading-relaxed">{type.desc}</p>
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
                                                    <p className="text-xs text-white/30 mt-0.5">{currentType.desc}</p>
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
                                                            <label key={emp.id} className="flex items-center gap-2.5 px-2 py-1.5 hover:bg-white/5 cursor-pointer rounded-lg">
                                                                <input type="checkbox" checked={alertSelectedEmployeeIds.includes(emp.id)} onChange={() => toggleEmployee(emp.id)} className="accent-[#E61E32] w-3.5 h-3.5" />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-xs font-medium text-white/80 truncate">{emp.name}</p>
                                                                    <p className="text-xs text-white/30 truncate font-mono">{emp.email}</p>
                                                                </div>
                                                                <span className="text-xs text-white/50 bg-white/5 px-1.5 py-0.5 shrink-0">{emp.role}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                    {alertSelectedEmployeeIds.length > 0 && (
                                                        <p className="text-xs text-[#E61E32] font-medium">{alertSelectedEmployeeIds.length} employee(s) selected</p>
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
                                                                        <p className="text-xs text-white/30 truncate font-mono">{c.email}</p>
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
                                                                <div className="grid grid-cols-2 gap-2 text-sm">
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

                                            {/* Push notification fields */}
                                            {alertType === 'push_notification' && (
                                                <div className="space-y-4">
                                                    {/* Active subscribers indicator card */}
                                                    <div className="p-4 bg-white/[0.02] border border-white/10 rounded-lg space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-2.5 h-2.5 rounded-full ${alertFcmCount > 0 ?'bg-green-500 animate-pulse':'bg-yellow-500'}`} />
                                                                <span className="text-xs font-bold text-white/70">Broadcasting Audience</span>
                                                            </div>
                                                            <span className="text-xs font-mono text-white/40">{alertFcmCount} device(s) registered</span>
                                                        </div>
                                                        
                                                        {alertFcmCount > 0 ? (
                                                            <div className="space-y-1.5">
                                                                <p className="text-xs text-white/30 font-medium">Registered subscribers include:</p>
                                                                <div className="max-h-24 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                                                                    {alertFcmSubscribers.map((sub, index) => (
                                                                        <div key={sub.id || index} className="flex items-center justify-between py-1 border-b border-white/5 last:border-b-0 text-xs">
                                                                            <span className="text-white/80 font-medium truncate max-w-[150px]">
                                                                                {sub.employee?.name || `Anonymous Device ${index + 1}`}
                                                                            </span>
                                                                            <span className="text-white/30 shrink-0 font-mono text-xs bg-white/5 px-1">
                                                                                {sub.employee?.role || "Token: " + sub.token.substring(0, 8) + "..."}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm text-yellow-500/70 leading-relaxed">
                                                                No employees have enabled notifications yet. Buttons will remain disabled until at least one device registers.
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-medium text-white/50">Notification Title *</label>
                                                        <input required type="text" placeholder="Title" value={alertPushTitle} onChange={e => setAlertPushTitle(e.target.value)} className="w-full bg-black border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 text-white" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-medium text-white/50">Notification Message Body *</label>
                                                        <textarea required rows={4} placeholder="Type push message body..." value={alertPushBody} onChange={e => setAlertPushBody(e.target.value)} className="w-full bg-black border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 text-white resize-none" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Optional additional note for all non-custom types */}
                                            {alertType !== 'custom' && alertType !== 'push_notification' && (
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
                                                    (alertType === 'custom' && (!alertCustomRecipients || !alertCustomSubject || !alertCustomBody)) ||
                                                    (alertType === 'push_notification' && (alertFcmCount === 0 || !alertPushTitle || !alertPushBody))
                                                }
                                                className="w-full flex items-center justify-center gap-2 bg-[#E61E32] hover:bg-[#E61E32]/90 disabled:bg-[#E61E32]/30 disabled:cursor-not-allowed text-white font-semibold py-4 text-sm transition-all"
                                            >
                                                {alertSendStatus === 'sending' ? (
                                                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                                                ) : alertType === 'push_notification' ? (
                                                    <><Send className="w-4 h-4" /> Send Push Notification</>
                                                ) : (
                                                    <><Send className="w-4 h-4" /> Send alert email</>
                                                )}
                                            </button>

                                            {/* Status */}
                                            {alertSendStatus === 'success' && (
                                                <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium text-center flex items-center justify-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                                    {alertSendMessage}
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
                                                <span className="text-xs text-white/30 font-mono">
                                                    {alertType === 'push_notification' ? 'Live push notification preview' : 'Live email preview'}
                                                </span>
                                            </div>
                                            {alertType === 'push_notification' ? (
                                                <div className="flex-grow flex items-center justify-center bg-black/40 p-6 rounded-lg min-h-[400px]">
                                                    {/* Phone frame container */}
                                                    <div className="relative w-[280px] h-[500px] bg-[#1a1a1a] border-4 border-white/10 rounded-[36px] shadow-2xl overflow-hidden flex flex-col items-center">
                                                        {/* Speaker Notch */}
                                                        <div className="absolute top-2.5 w-24 h-4 bg-black rounded-full z-20 flex items-center justify-center">
                                                            <div className="w-8 h-1 bg-white/10 rounded-full" />
                                                        </div>
                                                        {/* Phone Screen Background */}
                                                        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0f24] via-[#1c122c] to-[#090b11] z-0" />
                                                        
                                                        {/* System clock/date info */}
                                                        <div className="relative w-full px-6 pt-9 z-10 flex flex-col items-center justify-center text-center">
                                                            <span className="text-xs text-white/60 font-mono">Tuesday, June 9</span>
                                                            <span className="text-4xl font-extralight text-white mt-1 select-none tracking-tight">23:17</span>
                                                        </div>

                                                        {/* Lock Screen Push Notification Card */}
                                                        <div className="relative w-full px-3 mt-12 z-10 space-y-3">
                                                            <div className="w-full bg-white/[0.08] backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-lg flex gap-3">
                                                                {/* Notification Icon */}
                                                                <div className="w-8 h-8 rounded-lg bg-[#E61E32] flex items-center justify-center shrink-0">
                                                                    <Bell className="w-4 h-4 text-white" />
                                                                </div>
                                                                {/* Notification Content */}
                                                                <div className="flex-1 min-w-0 text-left">
                                                                    <div className="flex justify-between items-center mb-0.5">
                                                                        <span className="text-xs font-bold text-white/50 font-sans">REDLIX EMS</span>
                                                                        <span className="text-xs text-white/30">now</span>
                                                                    </div>
                                                                    <h4 className="text-xs font-bold text-white truncate font-sans">
                                                                        {alertPushTitle || 'Push Notification Title'}
                                                                    </h4>
                                                                    <p className="text-sm text-white/70 mt-0.5 leading-snug break-words font-sans">
                                                                        {alertPushBody || 'Type a title and body message in the form to see it live here.'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Phone Bottom bar swipe indicator */}
                                                        <div className="absolute bottom-2.5 w-24 h-1 bg-white/30 rounded-full z-20" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex-grow bg-white text-black p-4 overflow-y-auto max-h-[620px] text-left text-[13px] font-sans">
                                                    {/* Email header meta */}
                                                    <div style={{borderBottom:'1px solid #e5e7eb',paddingBottom:'10px',marginBottom:'16px',fontSize: '13px',color:'#6b7280'}}>
                                                        <div><strong style={{color:'#111'}}>From:</strong> Redlix Admin &lt;{process.env.SMTP_EMAIL || 'admin@redlix.co.in'}&gt;</div>
                                                        <div style={{marginTop:'3px'}}><strong style={{color:'#111'}}>To:</strong> {alertType === 'custom' ? (alertCustomRecipients || '[Recipients]') : alertType === 'terms_update' ? (alertSelectAllClients ? 'All Clients' : alertSelectedClientIds.length > 0 ? `${alertSelectedClientIds.length} client(s)` : '[Select Clients]') : alertType === 'new_client_welcome' || alertType === 'client_info_update' ? (clients.find(c => c.id === alertSingleClientId)?.email || '[Client Email]') : alertSelectedEmployeeIds.length > 0 ? `${alertSelectedEmployeeIds.length} employee(s)` : '[Select Employees]'}</div>
                                                        <div style={{marginTop:'3px'}}><strong style={{color:'#111'}}>Subject:</strong> {previewSubject}</div>
                                                    </div>
                                                    {/* Preview body */}
                                                    <div style={{maxWidth:'560px',margin:'0 auto',border:'1px solid #e0e0e0',backgroundColor:'#fff'}}>
                                                        <div style={{backgroundColor:'#0a0a0a',padding:'18px 28px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                                                            <img src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1776288139/Screenshot_2026-04-16_at_02.51.43-removebg-preview_ytpg09.png" alt="Redlix" style={{height:'24px',filter:'brightness(0) invert(1)'}} />
                                                            <span style={{fontSize: '12px',fontWeight:700,color:'#E61E32'}}>
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
                                                                <p style={{margin:0,fontSize: '12px',fontWeight:700,color:'#E61E32'}}>
                                                                    {alertType === 'profile_pending' ? 'Redlix HR Team' : alertType === 'terms_update' ? 'Redlix Legal & Compliance' : alertType === 'client_info_update' ? 'Redlix Client Relations' : alertType === 'new_client_welcome' ? 'Redlix Client Success' : 'Redlix Admin Team'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div style={{backgroundColor:'#fafafa',padding:'16px 28px',borderTop:'1px solid #eee'}}>
                                                            <p style={{margin:0,fontSize: '12px',color:'#999',lineHeight:1.8}}>© 2026 Redlix Studio · www.redlix.co.in<br/>This is an automated notification.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {activeTab === "receipt-generator" && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full overflow-y-auto pr-2 pb-6">
                                <style dangerouslySetInnerHTML={{ __html: `
                                    @media print {
                                        body, html, main {
                                            background: white !important;
                                            color: black !important;
                                            height: auto !important;
                                            overflow: visible !important;
                                        }
                                        aside, .no-print, header, .flex-grow.p-8 > div > div:first-child {
                                            display: none !important;
                                        }
                                        .flex-grow.p-8 {
                                            padding: 0 !important;
                                            margin: 0 !important;
                                            background: white !important;
                                            height: auto !important;
                                            overflow: visible !important;
                                        }
                                        .printable-receipt {
                                            position: absolute !important;
                                            left: 0 !important;
                                            top: 0 !important;
                                            width: 100% !important;
                                            max-width: 100% !important;
                                            box-shadow: none !important;
                                            border: none !important;
                                            margin: 0 !important;
                                            padding: 15mm !important;
                                            background: white !important;
                                            color: black !important;
                                        }
                                    }
                                ` }} />

                                {/* Control Panel (Left column - 5 grid cols) */}
                                <div className="no-print lg:col-span-5 bg-white/5 border border-white/10 p-6 space-y-6 flex flex-col h-fit">
                                    <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                                        <Printer className="w-5 h-5 text-[#E61E32]" />
                                        <div>
                                            <h3 className="text-md font-bold tracking-tight text-white">Receipt Control Form</h3>
                                            <p className="text-xs text-white/40">Select client and configure receipt parameters.</p>
                                        </div>
                                    </div>

                                    {/* Client Dropdown selector */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-white/40 block">Select Registered Client</label>
                                        <select
                                            value={receiptClientId}
                                            onChange={(e) => setReceiptClientId(e.target.value === "" ? "" : Number(e.target.value))}
                                            className="w-full bg-black border border-white/10 px-3 py-2 text-xs focus:outline-none focus:border-white/30 text-white"
                                        >
                                            <option value="" className="bg-[#0f0f0f]">Choose a client...</option>
                                            {clients.map((c) => (
                                                <option key={c.id} value={c.id} className="bg-[#0f0f0f]">
                                                    {c.companyName} ({c.clientName})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Bill-To Details Fields */}
                                    <div className="space-y-4 pt-2 border-t border-white/5">
                                        <h4 className="text-xs font-bold text-[#E61E32]">Bill-To Recipient Details</h4>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-white/40 font-semibold">Company Name</label>
                                                <input
                                                    type="text"
                                                    value={receiptBillToCompany}
                                                    onChange={(e) => setReceiptBillToCompany(e.target.value)}
                                                    className="w-full bg-black border border-white/10 px-3 py-2 text-xs focus:outline-none focus:border-white/30 text-white"
                                                    placeholder="Client company"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-white/40 font-semibold">Contact Name</label>
                                                <input
                                                    type="text"
                                                    value={receiptBillToName}
                                                    onChange={(e) => setReceiptBillToName(e.target.value)}
                                                    className="w-full bg-black border border-white/10 px-3 py-2 text-xs focus:outline-none focus:border-white/30 text-white"
                                                    placeholder="Contact person"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-white/40 font-semibold">Email Address</label>
                                                <input
                                                    type="email"
                                                    value={receiptBillToEmail}
                                                    onChange={(e) => setReceiptBillToEmail(e.target.value)}
                                                    className="w-full bg-black border border-white/10 px-3 py-2 text-xs focus:outline-none focus:border-white/30 text-white font-mono"
                                                    placeholder="client@email.com"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-white/40 font-semibold">Phone (Optional)</label>
                                                <input
                                                    type="text"
                                                    value={receiptBillToPhone}
                                                    onChange={(e) => setReceiptBillToPhone(e.target.value)}
                                                    className="w-full bg-black border border-white/10 px-3 py-2 text-xs focus:outline-none focus:border-white/30 text-white"
                                                    placeholder="Phone number"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Invoice Metadata Fields */}
                                    <div className="space-y-4 pt-2 border-t border-white/5">
                                        <h4 className="text-xs font-bold text-[#E61E32]">Invoice / Receipt Meta</h4>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-white/40 font-semibold">Invoice Number</label>
                                                <input
                                                    type="text"
                                                    value={receiptInvoiceNumber}
                                                    onChange={(e) => setReceiptInvoiceNumber(e.target.value)}
                                                    className="w-full bg-black border border-white/10 px-3 py-2 text-xs focus:outline-none focus:border-white/30 text-white font-mono"
                                                    placeholder="RED-2026-XXXXX"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-white/40 font-semibold">Currency Symbol</label>
                                                <input
                                                    type="text"
                                                    value={receiptCurrency}
                                                    onChange={(e) => setReceiptCurrency(e.target.value)}
                                                    className="w-full bg-black border border-white/10 px-3 py-2 text-xs focus:outline-none focus:border-white/30 text-white"
                                                    placeholder="e.g. $ or ₹"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-white/40 font-semibold">Invoice Date</label>
                                                <input
                                                    type="date"
                                                    value={receiptInvoiceDate}
                                                    onChange={(e) => setReceiptInvoiceDate(e.target.value)}
                                                    className="w-full bg-black border border-white/10 px-3 py-2 text-xs focus:outline-none focus:border-white/30 text-white"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-white/40 font-semibold">Due Date</label>
                                                <input
                                                    type="date"
                                                    value={receiptDueDate}
                                                    onChange={(e) => setReceiptDueDate(e.target.value)}
                                                    className="w-full bg-black border border-white/10 px-3 py-2 text-xs focus:outline-none focus:border-white/30 text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dynamic Items Builder */}
                                    <div className="space-y-4 pt-2 border-t border-white/5">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xs font-bold text-[#E61E32]">Line Items (Charges)</h4>
                                            <button
                                                type="button"
                                                onClick={handleAddReceiptItem}
                                                className="text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 hover:bg-green-500/20"
                                            >
                                                + Add Line
                                            </button>
                                        </div>

                                        <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                                            {receiptItems.map((item, index) => (
                                                <div key={item.id} className="p-3 bg-white/[0.02] border border-white/5 space-y-2.5 relative">
                                                    {receiptItems.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveReceiptItem(item.id)}
                                                            className="absolute top-1 right-1 text-xs font-bold text-red-500 hover:text-red-400 px-1"
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                    <div className="text-xs font-bold text-white/30">Item #{index + 1}</div>
                                                    
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-bold text-white/40 block">Category (e.g. Service type) *</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            placeholder="e.g. Web Development or Hosting"
                                                            value={item.category}
                                                            onChange={(e) => handleUpdateReceiptItem(item.id, "category", e.target.value)}
                                                            className="w-full bg-black border border-white/10 px-2 py-1.5 text-xs focus:outline-none focus:border-white/30 text-white"
                                                        />
                                                    </div>

                                                    <div className="space-y-1">
                                                        <label className="text-xs font-bold text-white/40 block">Description Details</label>
                                                        <input
                                                            type="text"
                                                            placeholder="e.g. Apr 29 - May 28, 2026 support"
                                                            value={item.description}
                                                            onChange={(e) => handleUpdateReceiptItem(item.id, "description", e.target.value)}
                                                            className="w-full bg-black border border-white/10 px-2 py-1.5 text-sm focus:outline-none focus:border-white/30 text-white/80"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <label className="text-xs font-bold text-white/40 block">Quantity</label>
                                                            <input
                                                                type="number"
                                                                min="0.0001"
                                                                step="any"
                                                                value={item.quantity}
                                                                onChange={(e) => handleUpdateReceiptItem(item.id, "quantity", Number(e.target.value) || 0)}
                                                                className="w-full bg-black border border-white/10 px-2 py-1.5 text-xs focus:outline-none focus:border-white/30 text-white"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-xs font-bold text-white/40 block">Rate per unit</label>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="any"
                                                                value={item.rate}
                                                                onChange={(e) => handleUpdateReceiptItem(item.id, "rate", Number(e.target.value) || 0)}
                                                                className="w-full bg-black border border-white/10 px-2 py-1.5 text-xs focus:outline-none focus:border-white/30 text-white font-mono"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Company Address and Memo Config */}
                                    <div className="grid grid-cols-1 gap-4 pt-2 border-t border-white/5">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-white/40 block">Sender Office Address</label>
                                            <textarea
                                                rows={3}
                                                value={receiptCompanyAddress}
                                                onChange={(e) => setReceiptCompanyAddress(e.target.value)}
                                                className="w-full bg-black border border-white/10 px-3 py-2 text-xs focus:outline-none focus:border-white/30 text-white resize-none"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-white/40 block">Invoice Memo & Terms</label>
                                            <textarea
                                                rows={3}
                                                value={receiptMemo}
                                                onChange={(e) => setReceiptMemo(e.target.value)}
                                                className="w-full bg-black border border-white/10 px-3 py-2 text-xs focus:outline-none focus:border-white/30 text-white resize-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-3 pt-4 border-t border-white/10 flex flex-col w-full">
                                        <button
                                            type="button"
                                            onClick={() => window.print()}
                                            className="w-full flex items-center justify-center gap-2 bg-[#E61E32] hover:bg-[#ff1f34] text-white py-3 text-xs font-bold transition-colors cursor-pointer"
                                        >
                                            <Printer className="w-4 h-4" />
                                            Print / Save as PDF
                                        </button>

                                        {receiptClientId && (
                                            <button
                                                type="button"
                                                onClick={handleSendGeneratedReceiptEmail}
                                                disabled={receiptSendStatus === 'sending'}
                                                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 disabled:bg-green-700/50 text-white py-3 text-xs font-bold transition-colors cursor-pointer disabled:cursor-not-allowed"
                                            >
                                                {receiptSendStatus === 'sending' ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Sending Receipt...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-4 h-4" />
                                                        Send Email Receipt
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        {receiptSendStatus === 'success' && (
                                            <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-semibold text-center animate-in fade-in duration-150 flex items-center justify-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                                Payment confirmation email dispatched successfully!
                                            </div>
                                        )}
                                        {receiptSendStatus === 'error' && (
                                            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold text-center flex flex-col items-center gap-1 animate-in fade-in duration-150">
                                                <div className="flex items-center gap-1">
                                                    <AlertCircle className="w-3.5 h-3.5" />
                                                    <span>Failed to send email</span>
                                                </div>
                                                {receiptErrorMessage && (
                                                    <p className="text-xs text-red-400/80 mt-1 font-mono normal-case">{receiptErrorMessage}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Printable / Live preview Sheet (Right column - 7 grid cols) */}
                                <div className="lg:col-span-7 flex justify-center bg-black/25 p-4 border border-white/5 min-h-[800px] overflow-y-auto">
                                    <div className="printable-receipt relative bg-white text-black p-12 w-full max-w-[210mm] min-h-[297mm] shadow-2xl flex flex-col justify-between font-sans leading-relaxed text-sm antialiased select-none">
                                        {/* Top Red Branding Bar */}
                                        <div className="absolute top-0 left-0 w-full h-2.5 bg-[#E61E32]" />
                                        {/* Bottom Red Branding Bar */}
                                        <div className="absolute bottom-0 left-0 w-full h-2.5 bg-[#E61E32]" />

                                        <div className="space-y-12">
                                            {/* Top Row: Logo & Title Header */}
                                            <div className="flex justify-between items-start border-b border-gray-100 pb-8">
                                                <div className="space-y-4">
                                                    {/* Premium Redlix Branding Logo */}
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                            src="https://ik.imagekit.io/dypkhqxip/logo.png"
                                                            alt="Redlix Logo"
                                                            className="h-[28px] w-auto brightness-0"
                                                        />
                                                        <span className="text-black text-[20px] font-black tracking-tighter">
                                                            Redlix
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Sender Details */}
                                                    <div className="text-sm text-gray-500 leading-relaxed font-normal whitespace-pre-line text-left">
                                                        {receiptCompanyAddress}
                                                    </div>
                                                </div>

                                                <h1 className="text-3xl font-light text-gray-800 text-right">
                                                    Invoice
                                                </h1>
                                            </div>

                                            {/* Info Column Section */}
                                            <div className="grid grid-cols-2 gap-12 text-xs">
                                                {/* Bill To */}
                                                <div className="space-y-2 text-left">
                                                    <div className="text-xs font-bold text-gray-400">Bill to:</div>
                                                    <div className="space-y-1">
                                                        <div className="font-bold text-gray-900 text-sm">{receiptBillToCompany || "[Client Company Org]"}</div>
                                                        {receiptBillToName && <div className="text-gray-700">{receiptBillToName}</div>}
                                                        <div className="text-gray-500 font-mono">{receiptBillToEmail || "client@company.com"}</div>
                                                        {receiptBillToPhone && <div className="text-gray-500">{receiptBillToPhone}</div>}
                                                    </div>
                                                </div>

                                                {/* Meta details */}
                                                <div className="flex justify-end">
                                                    <table className="w-fit text-left">
                                                        <tbody>
                                                            <tr className="border-b border-gray-50">
                                                                <td className="pr-8 py-2 text-xs font-bold text-gray-400 text-left">Invoice number</td>
                                                                <td className="py-2 font-mono text-gray-800 font-semibold">{receiptInvoiceNumber || "RED-2026-00000"}</td>
                                                            </tr>
                                                            <tr className="border-b border-gray-50">
                                                                <td className="pr-8 py-2 text-xs font-bold text-gray-400 text-left">Invoice date</td>
                                                                <td className="py-2 text-gray-700">
                                                                    {receiptInvoiceDate 
                                                                        ? new Date(receiptInvoiceDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
                                                                        : "[Invoice Date]"
                                                                    }
                                                                </td>
                                                            </tr>
                                                            <tr className="border-b border-gray-50">
                                                                <td className="pr-8 py-2 text-xs font-bold text-gray-400 text-left">Due date</td>
                                                                <td className="py-2 text-gray-700">
                                                                    {receiptDueDate 
                                                                        ? new Date(receiptDueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
                                                                        : "[Due Date]"
                                                                    }
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="pr-8 py-2 text-xs font-bold text-gray-400 text-left">Amount due</td>
                                                                <td className="py-2 font-bold text-gray-900 text-[15px]">
                                                                    {receiptCurrency}
                                                                    {receiptItems.reduce((acc, item) => acc + (item.quantity * item.rate), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            {/* Line Items Table */}
                                            <div className="pt-4">
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr className="border-b border-gray-200 text-xs font-bold text-gray-400">
                                                            <th className="pb-3 font-bold">Description</th>
                                                            <th className="pb-3 text-right font-bold w-24">Quantity</th>
                                                            <th className="pb-3 text-right font-bold w-28">Rate</th>
                                                            <th className="pb-3 text-right font-bold w-28">Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100 text-xs">
                                                        {receiptItems.map((item) => (
                                                            <tr key={item.id} className="align-top">
                                                                <td className="py-4 pr-4">
                                                                    <div className="font-bold text-gray-900 text-left">{item.category || "[Category]"}</div>
                                                                    {item.description && (
                                                                        <div className="text-gray-500 text-sm mt-0.5 font-normal leading-relaxed text-left">{item.description}</div>
                                                                    )}
                                                                </td>
                                                                <td className="py-4 text-right font-mono text-gray-700">
                                                                    {item.quantity.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                                                                </td>
                                                                <td className="py-4 text-right font-mono text-gray-700">
                                                                    {receiptCurrency}{item.rate.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                                </td>
                                                                <td className="py-4 text-right font-mono font-semibold text-gray-900">
                                                                    {receiptCurrency}{(item.quantity * item.rate).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Subtotal & Totals Summary */}
                                            <div className="flex justify-end pt-4 border-t border-gray-100">
                                                <table className="w-64 text-right text-xs">
                                                    <tbody>
                                                        <tr>
                                                            <td className="py-2 text-gray-500 font-medium">Subtotal</td>
                                                            <td className="py-2 font-mono font-semibold text-gray-800">
                                                                {receiptCurrency}
                                                                {receiptItems.reduce((acc, item) => acc + (item.quantity * item.rate), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                            </td>
                                                        </tr>
                                                        <tr className="border-t border-gray-200 text-sm font-bold">
                                                            <td className="py-3 text-gray-900 font-extrabold tracking-wide text-right">Amount due</td>
                                                            <td className="py-3 font-mono font-black text-gray-900 text-[16px]">
                                                                {receiptCurrency}
                                                                {receiptItems.reduce((acc, item) => acc + (item.quantity * item.rate), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Bottom Memo & Footer Details */}
                                        <div className="pt-12 border-t border-gray-100 flex justify-between items-end text-xs text-gray-400">
                                            <div className="max-w-md font-normal leading-relaxed whitespace-pre-line text-left">
                                                {receiptMemo}
                                            </div>
                                            <div className="font-mono shrink-0 text-right">
                                                Page 1 of 1
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
            {/* Document Preview Modal */}
            {previewFile && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-4xl h-[85vh] flex flex-col rounded-lg overflow-hidden shadow-2xl">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                            <div className="min-w-0">
                                <h3 className="font-bold text-sm text-white truncate max-w-md sm:max-w-lg" title={previewFile.name}>{previewFile.name}</h3>
                                <p className="text-xs text-white/30 mt-0.5">{previewFile.type}</p>
                            </div>
                            <button
                                onClick={() => setPreviewFile(null)}
                                className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        
                        {/* Content Area */}
                        <div className="flex-1 bg-[#070707] p-4 sm:p-6 flex items-center justify-center overflow-hidden">
                            {previewFile.type.startsWith("image/") ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <img 
                                        src={previewFile.data} 
                                        alt={previewFile.name} 
                                        className="max-w-full max-h-full object-contain rounded-lg"
                                    />
                                </div>
                            ) : previewFile.type.includes("pdf") ? (
                                <iframe 
                                    src={previewFile.data} 
                                    className="w-full h-full rounded-lg border border-white/5 bg-white"
                                    title={previewFile.name}
                                />
                            ) : (
                                <div className="text-center space-y-4">
                                    <FileText className="w-16 h-16 text-[#E61E32] mx-auto opacity-40 animate-pulse" />
                                    <p className="text-sm text-white/40">Preview not available for this file type.</p>
                                    <a
                                        href={previewFile.data}
                                        download={previewFile.name}
                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E61E32] hover:bg-[#C81428] text-white text-xs font-bold rounded-lg transition-colors"
                                    >
                                        <Download className="w-3.5 h-3.5" /> Download File
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Pink slip confirmation modal */}
            {showPinkSlipModal && pinkSlipModalEmployeeId && (() => {
                const emp = employees.find(e => e.id === pinkSlipModalEmployeeId);
                if (!emp) return null;
                const deadline = new Date(Date.now() + 32 * 60 * 60 * 1000);
                return (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
                        <div className="relative w-full max-w-lg bg-[#0d0d0d] border border-[#E61E32]/40 shadow-2xl animate-in zoom-in-95 duration-200">
                            {/* Red top bar */}
                            <div className="h-1 w-full bg-[#E61E32]" />

                            <div className="p-5 sm:p-8">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <p className="text-xs font-semibold text-[#E61E32] mb-1">HR — Confidential Action</p>
                                        <h2 className="text-xl sm:text-2xl font-bold text-white">Allocate Pink Slip</h2>
                                    </div>
                                    <button
                                        onClick={() => setShowPinkSlipModal(false)}
                                        className="p-1.5 text-white/30 hover:text-white transition-colors"
                                        aria-label="Close"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Employee Info */}
                                <div className="bg-white/[0.03] border border-white/5 p-4 mb-6 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#E61E32]/20 border border-[#E61E32]/30 flex items-center justify-center text-[#E61E32] font-black text-sm flex-shrink-0">
                                        {emp.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-sm">{emp.name}</p>
                                        <p className="text-sm text-white/40">{emp.role} · {emp.email}</p>
                                    </div>
                                </div>

                                {/* Warning content */}
                                <div className="bg-[#E61E32]/10 border border-[#E61E32]/20 p-5 mb-6 space-y-3">
                                    <p className="text-xs font-semibold text-[#E61E32]"><AlertCircle className="w-3.5 h-3.5 inline mr-1 text-[#E61E32]" /> This action will immediately:</p>
                                    <ul className="space-y-2 text-sm text-white/70">
                                        <li className="flex items-start gap-2"><ChevronRight className="w-3.5 h-3.5 text-[#E61E32] mt-0.5 flex-shrink-0" />Send a formal employment review notice to <strong className="text-white">{emp.email}</strong></li>
                                        <li className="flex items-start gap-2"><ChevronRight className="w-3.5 h-3.5 text-[#E61E32] mt-0.5 flex-shrink-0" />Freeze the employee portal with only the appeal window visible</li>
                                        <li className="flex items-start gap-2"><ChevronRight className="w-3.5 h-3.5 text-[#E61E32] mt-0.5 flex-shrink-0" />Start a <strong className="text-white">32-hour countdown</strong> for the employee to submit an appeal</li>
                                        <li className="flex items-start gap-2"><ChevronRight className="w-3.5 h-3.5 text-[#E61E32] mt-0.5 flex-shrink-0" />Automatically <strong className="text-white">delete the account</strong> if no appeal is submitted by <strong className="text-white">{deadline.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} IST</strong></li>
                                    </ul>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowPinkSlipModal(false)}
                                        className="flex-1 py-3 text-sm font-bold text-white/50 border border-white/10 hover:border-white/20 hover:text-white/70 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleAllocatePinkSlip(pinkSlipModalEmployeeId)}
                                        disabled={isPinkSlipAllocating}
                                        className="flex-1 py-3 text-sm font-semibold text-white bg-[#E61E32] hover:bg-[#C81428] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        {isPinkSlipAllocating ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                                                Sending...
                                            </span>
                                        ) : "Confirm & Send Pink Slip"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}

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

function formatLabel(value: string) {
    return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function getTaskStatusStyles(status: string) {
    switch (status) {
        case "completed":
            return {
                badge: "bg-green-500/10 text-green-400",
                accent: "",
                ring: "",
            };
        case "in_progress":
            return {
                badge: "bg-blue-500/10 text-blue-400",
                accent: "",
                ring: "",
            };
        default:
            return {
                badge: "bg-amber-500/10 text-amber-400",
                accent: "",
                ring: "",
            };
    }
}

function InfoBlock({ label, value }: { label: string, value?: string }) {
    if (!value) return null;
    return (
        <div className="space-y-0.5">
            <p className="text-sm font-medium text-white/50">{label}</p>
            <p className="text-sm text-white/80 whitespace-pre-wrap">{renderTextWithLinks(value)}</p>
        </div>
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
                <p className="text-sm font-medium text-white/40">{label}</p>
                <h4 className="text-xl font-semibold mt-0.5">{value}</h4>
                <p className="text-xs text-white/50 mt-0.5">{sublabel}</p>
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

function buildSmoothLinePath(points: { x: number; y: number }[]) {
    if (points.length === 0) return "";
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] ?? points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] ?? p2;
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
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

    const linePath = buildSmoothLinePath(points);
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

                {/* Smooth line */}
                {linePath && (
                    <path
                        d={linePath}
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
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

interface CombinedDataset {
    name: string;
    data: number[];
    color: string;
    gradientId: string;
    unit?: string;
}

interface CombinedSharpLineChartProps {
    datasets: CombinedDataset[];
    labels: string[];
}

function CombinedSharpLineChart({ datasets, labels }: CombinedSharpLineChartProps) {
    const width = 800;
    const height = 300;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 30;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    return (
        <div className="relative w-full bg-white/[0.01] border border-white/5 p-6 rounded-lg space-y-4">
            {/* Legend */}
            <div className="flex flex-wrap gap-6 justify-center text-xs font-bold border-b border-white/5 pb-4">
                {datasets.map((dataset, dIdx) => {
                    const lastVal = dataset.data[dataset.data.length - 1];
                    const formattedVal = dataset.unit === "₹" ? `₹${lastVal.toLocaleString()}` : `${lastVal}${dataset.unit || ""}`;
                    return (
                        <div key={dIdx} className="flex items-center gap-2">
                            <span className="w-2 h-2" style={{ backgroundColor: dataset.color }} />
                            <span className="text-white/40">{dataset.name}:</span>
                            <span className="text-white font-mono">{formattedVal}</span>
                        </div>
                    );
                })}
            </div>

            <div className="w-full">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">


                    {/* Grid Lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                        const y = paddingTop + chartHeight * ratio;
                        return (
                            <line
                                key={i}
                                x1={paddingLeft}
                                y1={y}
                                x2={width - paddingRight}
                                y2={y}
                                stroke="rgba(255,255,255,0.03)"
                                strokeDasharray="3,3"
                            />
                        );
                    })}

                    {/* X Axis Labels */}
                    {labels.map((label, idx) => {
                        const x = paddingLeft + (idx / Math.max(labels.length - 1, 1)) * chartWidth;
                        return (
                            <text
                                key={idx}
                                x={x}
                                y={height - 10}
                                fill="rgba(255,255,255,0.3)"
                                fontSize="9"
                                textAnchor="middle"
                                className="font-mono"
                            >
                                {label}
                            </text>
                        );
                    })}

                    {/* Render each dataset */}
                    {datasets.map((dataset, dIdx) => {
                        const max = Math.max(...dataset.data, 1);
                        const min = 0;

                        const points = dataset.data.map((val, idx) => {
                            const x = paddingLeft + (idx / Math.max(dataset.data.length - 1, 1)) * chartWidth;
                            const y = paddingTop + chartHeight - ((val - min) / (max - min)) * chartHeight;
                            return { x, y, val };
                        });

                        const linePath = buildSmoothLinePath(points);

                        return (
                            <g key={dIdx}>
                                {/* Smooth line */}
                                {linePath && (
                                    <path
                                        d={linePath}
                                        fill="none"
                                        stroke={dataset.color}
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                )}

                                {/* Dots */}
                                {points.map((p, i) => (
                                    <g key={i} className="group cursor-pointer">
                                        <circle
                                            cx={p.x}
                                            cy={p.y}
                                            r="3.5"
                                            fill={dataset.color}
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
                                        <title>{`${dataset.name} (${labels[i]}): ${dataset.unit === "₹" ? `₹${p.val.toLocaleString()}` : `${p.val}${dataset.unit || ""}`}`}</title>
                                    </g>
                                ))}
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
