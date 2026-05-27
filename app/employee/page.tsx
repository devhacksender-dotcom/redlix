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
    ChevronDown
} from "lucide-react";
import { useRouter } from "next/navigation";
import Script from "next/script";

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

export default function EmployeePortal() {
    const router = useRouter();
    const [employeeInfo, setEmployeeInfo] = useState<{ id: number, name: string; email: string; role: string } | null>(null);
    const [activeTab, setActiveTab] = useState<"overview" | "inquiries" | "employees" | "support" | "intern-support" | "clients" | "payment-due-sender" | "payment-received-sender">("overview");

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
    const [isPaymentsOpen, setIsPaymentsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

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

    // Load logged in employee info
    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await fetch("/api/employee/me");
                const data = await res.json();
                if (data.success) {
                    setEmployeeInfo(data.data);
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
            fetchAllData();
        } else if (activeTab === "inquiries") {
            fetchInquiries();
        } else if (activeTab === "employees") {
            fetchEmployees();
        } else if (activeTab === "support") {
            fetchTickets();
        } else if (activeTab === "intern-support") {
            fetchInternTickets();
        } else {
            fetchClients();
        }
    }, [activeTab, employeeInfo]);

    useEffect(() => {
        if (activeTab === "payment-due-sender" || activeTab === "payment-received-sender") {
            setIsPaymentsOpen(true);
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
                fetchClients()
            ]);
        } catch (error) {
            console.error("Failed to fetch all data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFetchError = (err: any) => {
        console.error(err);
        if (err.status === 401) {
            router.push("/employee/login");
        }
    };

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/inquiries");
            if (res.status === 401) return router.push("/employee/login");
            const data = await res.json();
            if (data.success) {
                setInquiries(data.data);
            }
        } catch (error) {
            handleFetchError(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/employees");
            if (res.status === 401) return router.push("/employee/login");
            const data = await res.json();
            if (data.success) {
                setEmployees(data.data);
            }
        } catch (error) {
            handleFetchError(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/support");
            if (res.status === 401) return router.push("/employee/login");
            const data = await res.json();
            if (data.success) {
                setTickets(data.data);
            }
        } catch (error) {
            handleFetchError(error);
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
            handleFetchError(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/clients");
            if (res.status === 401) return router.push("/employee/login");
            const data = await res.json();
            if (data.success) {
                setClients(data.data);
            }
        } catch (error) {
            handleFetchError(error);
        } finally {
            setLoading(false);
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
            } else {
                alert(data.message || "Failed to update ticket status");
            }
        } catch (error) {
            console.error("Failed to update status:", error);
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
            } else {
                alert(data.message || "Failed to register client");
            }
        } catch (error) {
            console.error("Failed to add client:", error);
        } finally {
            setIsSubmitting(false);
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
            } else {
                alert(data.message || "Failed to update client");
            }
        } catch (error) {
            console.error("Failed to update client:", error);
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
            } else {
                alert(data.message || "Failed to delete client");
            }
        } catch (error) {
            console.error("Failed to delete client:", error);
        }
    };

    const sendMeetingDetails = async (clientId: number) => {
        setSendEmailStatus({ id: clientId, action: 'meeting', status: 'sending' });
        try {
            const res = await fetch("/api/admin/clients/send-meeting", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ clientId }),
            });
            const data = await res.json();
            if (data.success) {
                setSendEmailStatus({ id: clientId, action: 'meeting', status: 'success' });
            } else {
                setSendEmailStatus({ id: clientId, action: 'meeting', status: 'error' });
            }
        } catch (error) {
            console.error("Failed to send meeting details:", error);
            setSendEmailStatus({ id: clientId, action: 'meeting', status: 'error' });
        }
    };

    // File Conversions
    const convertInvoiceFileToBase64 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setPaymentInvoiceFile({
                name: file.name,
                type: file.type,
                base64: reader.result as string
            });
        };
        reader.readAsDataURL(file);
    };

    const convertReceiptFileToBase64 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setReceivedReceiptFile({
                name: file.name,
                type: file.type,
                base64: reader.result as string
            });
        };
        reader.readAsDataURL(file);
    };

    // Send Due Mail
    const handleSendPaymentDue = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!paymentClientId || !paymentAmount || !paymentDueDate || !paymentInvoiceFile) {
            setPaymentErrorMessage("All fields are required");
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
                    invoiceFile: paymentInvoiceFile
                })
            });
            const data = await res.json();
            if (data.success) {
                setPaymentSendStatus('success');
                setPaymentClientId("");
                setPaymentAmount("");
                setPaymentDueDate("");
                setPaymentInvoiceFile(null);
            } else {
                setPaymentSendStatus('error');
                setPaymentErrorMessage(data.message || "Failed to send invoice email.");
            }
        } catch (error) {
            setPaymentSendStatus('error');
            setPaymentErrorMessage("Connection error. Please check configurations.");
        }
    };

    // Send Receipt Mail
    const handleSendPaymentReceived = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!receivedClientId || !receivedAmount || !receivedDate || !receivedTransactionId || !receivedReceiptFile) {
            setReceivedErrorMessage("All fields are required");
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
                    transactionId: receivedTransactionId,
                    receiptFile: receivedReceiptFile
                })
            });
            const data = await res.json();
            if (data.success) {
                setReceivedSendStatus('success');
                setReceivedClientId("");
                setReceivedAmount("");
                setReceivedDate("");
                setReceivedTransactionId("");
                setReceivedReceiptFile(null);
            } else {
                setReceivedSendStatus('error');
                setReceivedErrorMessage(data.message || "Failed to send receipt email.");
            }
        } catch (error) {
            setReceivedSendStatus('error');
            setReceivedErrorMessage("Connection error. Please check configurations.");
        }
    };

    const handleLogout = async () => {
        await fetch("/api/employee/logout", { method: "POST" });
        router.push("/employee/login");
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
        emp.role.toLowerCase().includes(searchQuery.toLowerCase())
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

    // Helpers for Form display
    const selectedClientObj = clients.find(c => c.id === Number(paymentClientId));
    const displayAmount = paymentAmount ? `INR ${parseFloat(paymentAmount).toLocaleString('en-IN')}` : "INR 0.00";
    const displayDueDate = paymentDueDate ? new Date(paymentDueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : "Not Specified";

    const selectedReceivedClientObj = clients.find(c => c.id === Number(receivedClientId));
    const displayReceivedAmount = receivedAmount ? `INR ${parseFloat(receivedAmount).toLocaleString('en-IN')}` : "INR 0.00";
    const displayReceivedDate = receivedDate ? new Date(receivedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : "Not Specified";

    return (
        <main className="h-screen bg-[#0a0a0a] text-white flex font-sans overflow-hidden">
            {/* Sidebar */}
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
                            Employee
                        </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <div className="text-[13px] font-bold text-white tracking-tight truncate max-w-[200px]" title={employeeInfo?.name}>
                            {employeeInfo?.name || "Loading..."}
                        </div>
                        <div className="text-[10px] text-white/40 uppercase font-semibold tracking-wider truncate max-w-[200px]" title={employeeInfo?.role}>
                            {employeeInfo?.role || "Team Member"}
                        </div>
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
                    <button
                        onClick={() => setActiveTab("inquiries")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'inquiries' ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <Inbox className="w-4 h-4" />
                        Inquiries
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("support")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'support' ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <MessageSquare className="w-4 h-4" />
                        Support tickets
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("intern-support")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'intern-support' ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <Users className="w-4 h-4" />
                        Intern support
                    </button>
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
                        onClick={() => setActiveTab("clients")}
                        className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'clients' ? 'bg-[#E61E32]/10 text-[#E61E32] border-l-2 border-[#E61E32] pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <Briefcase className="w-4 h-4" />
                        Clients
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <div className="space-y-1">
                        <button
                            onClick={() => setIsPaymentsOpen(!isPaymentsOpen)}
                            className={`w-full flex items-center justify-between text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${(activeTab === 'payment-due-sender' || activeTab === 'payment-received-sender')
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
                            </div>
                        )}
                    </div>
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
                <div className="max-w-7xl mx-auto space-y-8 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-center bg-white/[0.02] p-6 border border-white/5 shrink-0">
                        <div>
                            <h2 className="text-xl font-semibold text-white tracking-tight">
                                {activeTab === "overview" ? "Dashboard overview" :
                                    activeTab === "inquiries" ? "Inquiry management" :
                                        activeTab === "employees" ? "Team directory" :
                                            activeTab === "support" ? "Support system" :
                                                activeTab === "intern-support" ? "Intern support system" :
                                                    activeTab === "clients" ? "Client management" :
                                                        activeTab === "payment-due-sender" ? "Payment Due Sender" : "Payment Received Sender"}
                            </h2>
                            <p className="text-xs text-white/30 mt-0.5">
                                {activeTab === "overview" ? "real-time system metrics and activity" :
                                    activeTab === "inquiries" ? "view and respond to incoming messages" :
                                        activeTab === "support" ? "manage and resolve technical issues" :
                                            activeTab === "intern-support" ? "manage intern technical and portal issues" :
                                                activeTab === "employees" ? "view employee list and details" :
                                                    activeTab === "clients" ? "monitor client projects and meetings" :
                                                        activeTab === "payment-due-sender" ? "send billing notices to registered clients" : "send payment receipts to registered clients"}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            {activeTab === "clients" && (
                                <button
                                    onClick={() => setShowAddClientForm(!showAddClientForm)}
                                    className="flex items-center gap-2 bg-[#E61E32] hover:bg-[#E61E32]/80 text-white px-4 py-2 text-xs font-semibold transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Register client
                                </button>
                            )}
                            <div className="relative w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <input
                                    type="text"
                                    placeholder={`Search ${activeTab}...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 px-10 py-2.5 text-sm focus:outline-none focus:border-white/30"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Conditional Rendering of Tabs */}
                    <div className="flex-grow overflow-hidden">
                        {activeTab === "overview" && (
                            <div className="h-full space-y-8 animate-in fade-in duration-500 overflow-y-auto pr-2">
                                {/* Welcome message */}
                                <div className="bg-white/[0.01] border border-white/5 p-6 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold">Welcome back, {employeeInfo?.name}!</h3>
                                        <p className="text-xs text-white/40 mt-1">Here is the latest overview of the studio operations.</p>
                                    </div>
                                    <div className="px-4 py-2 border border-[#E61E32]/25 bg-[#E61E32]/5 text-[#E61E32] text-xs font-bold uppercase tracking-wider">
                                        {employeeInfo?.role}
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                    <StatCard
                                        icon={<Inbox className="w-5 h-5" />}
                                        label="Total inquiries"
                                        value={inquiries.length}
                                        sublabel={`${inquiries.filter(i => !i.isRead).length} unread`}
                                        color="text-blue-500"
                                    />
                                    <StatCard
                                        icon={<MessageSquare className="w-5 h-5" />}
                                        label="Support tickets"
                                        value={tickets.length}
                                        sublabel={`${tickets.filter(t => t.status === 'open').length} open`}
                                        color="text-[#E61E32]"
                                    />
                                    <StatCard
                                        icon={<Users className="w-5 h-5" />}
                                        label="Intern support"
                                        value={internTickets.length}
                                        sublabel={`${internTickets.filter(t => t.status === 'pending').length} pending`}
                                        color="text-orange-500"
                                    />
                                    <StatCard
                                        icon={<Users className="w-5 h-5" />}
                                        label="Active team"
                                        value={employees.length}
                                        sublabel="Across all roles"
                                        color="text-green-500"
                                    />
                                    <StatCard
                                        icon={<Briefcase className="w-5 h-5" />}
                                        label="Registered clients"
                                        value={clients.length}
                                        sublabel={`${clients.filter(c => c.meetingTime).length} scheduled`}
                                        color="text-yellow-500"
                                    />
                                </div>

                                {/* Main Overview Sections */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Recent Activity */}
                                    <div className="bg-white/[0.02] border border-white/5 p-6 space-y-4">
                                        <h3 className="text-[11px] font-medium text-white/30 flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5" />
                                            Recent inquiries
                                        </h3>
                                        <div className="space-y-4">
                                            {inquiries.slice(0, 5).map(inq => (
                                                <div key={inq.id} className="flex justify-between items-center p-3 bg-white/5 border border-white/5">
                                                    <div>
                                                        <p className="text-sm font-semibold">{inq.name}</p>
                                                        <p className="text-[10px] text-white/30">{inq.company || "Individual"}</p>
                                                    </div>
                                                    <span className="text-[10px] text-[#E61E32] font-medium">{new Date(inq.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Upcoming Meetings */}
                                    <div className="bg-white/[0.02] border border-white/5 p-6 space-y-4">
                                        <h3 className="text-[11px] font-medium text-white/30 flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5" />
                                            Upcoming meetings
                                        </h3>
                                        <div className="space-y-4">
                                            {clients.filter(c => c.meetingTime).sort((a, b) => new Date(a.meetingTime!).getTime() - new Date(b.meetingTime!).getTime()).slice(0, 5).map(client => (
                                                <div key={client.id} className="flex justify-between items-center p-3 bg-white/5 border border-white/5">
                                                    <div>
                                                        <p className="text-sm font-semibold">{client.companyName}</p>
                                                        <p className="text-[10px] text-white/30">{client.meetingTemplate}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] text-green-500 font-medium">{new Date(client.meetingTime!).toLocaleDateString()}</p>
                                                        <p className="text-[10px] text-white/20">{new Date(client.meetingTime!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                    </div>
                                                </div>
                                            ))}
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
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">Description</h4>
                                                <p className="text-sm leading-relaxed text-white/70 whitespace-pre-wrap">
                                                    {selectedTicket.message}
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

                        {activeTab === "intern-support" && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                                {/* Ticket List */}
                                <div className="overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                                    {loading ? (
                                        <p className="text-white/20 text-center py-10">Loading tickets...</p>
                                    ) : filteredTickets.length > 0 ? (
                                        internTickets.map((t) => (
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
                                                                className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest border border-green-500/20 hover:bg-green-500 hover:text-white transition-all"
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

                        {activeTab === "employees" && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                                {/* Employee List */}
                                <div className="space-y-4 h-full flex flex-col overflow-hidden">
                                    <div className="overflow-y-auto space-y-3 pr-2 scrollbar-thin flex-grow">
                                        {loading ? (
                                            <p className="text-white/20 text-center py-10">Loading team members...</p>
                                        ) : filteredEmployees.length > 0 ? (
                                            filteredEmployees.map((emp) => (
                                                <div
                                                    key={emp.id}
                                                    onClick={() => setSelectedEmployee(emp)}
                                                    className={`p-5 border transition-all cursor-pointer flex justify-between items-center ${selectedEmployee?.id === emp.id ? 'bg-white/5 border-white/20' : 'bg-transparent border-white/5 hover:border-white/10'}`}
                                                >
                                                    <div>
                                                        <h3 className="font-bold text-white flex items-center gap-2">
                                                            {emp.name}
                                                        </h3>
                                                        <p className="text-[10px] text-[#E61E32] font-bold uppercase tracking-wider mt-0.5">{emp.role}</p>
                                                        <p className="text-[10px] text-white/30 truncate mt-1">{emp.email}</p>
                                                    </div>
                                                    <ChevronDown className="w-4 h-4 text-white/20 -rotate-90" />
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-20 text-center border border-dashed border-white/5">
                                                <p className="text-white/20 text-sm">No employees found.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Employee Details (Read-only Directory View) */}
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
                                                <div className="text-[9px] uppercase font-bold text-white/20 tracking-wider">
                                                    Team Member
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-6">
                                                <div className="p-4 bg-white/[0.02] border border-white/5 space-y-4">
                                                    <InfoBlock label="Email Address" value={selectedEmployee.email} />
                                                    <InfoBlock label="Joined Date" value={new Date(selectedEmployee.joinedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} />
                                                </div>

                                                <div className="p-4 bg-white/[0.02] border border-white/5">
                                                    <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-3">Offer letter</p>
                                                    {selectedEmployee.offerLetterLink ? (
                                                        <a
                                                            href={selectedEmployee.offerLetterLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 text-xs text-white hover:text-[#E61E32] transition-colors font-bold uppercase tracking-widest"
                                                        >
                                                            <ExternalLink className="w-4 h-4" /> View Offer Letter
                                                        </a>
                                                    ) : (
                                                        <p className="text-xs text-white/30 italic">No document links available.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-center opacity-20">
                                            <p className="text-sm uppercase tracking-widest font-medium">Select a team member to view profile</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "clients" && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                                {/* Client List */}
                                <div className="space-y-4 h-full flex flex-col overflow-hidden">
                                    {showAddClientForm ? (
                                        <div className="bg-white/5 border border-white/10 p-8 animate-in slide-in-from-top-4 duration-300">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-lg font-bold uppercase tracking-tight">Register Client</h3>
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
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">App Name</label>
                                                        <input
                                                            type="text"
                                                            value={newClient.appName}
                                                            onChange={(e) => setNewClient({ ...newClient, appName: e.target.value })}
                                                            placeholder="Project / App Name"
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Client Name</label>
                                                        <input
                                                            required
                                                            type="text"
                                                            value={newClient.clientName}
                                                            onChange={(e) => setNewClient({ ...newClient, clientName: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Client Email</label>
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
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Developer Assigned</label>
                                                        <input
                                                            type="text"
                                                            value={newClient.developerName}
                                                            onChange={(e) => setNewClient({ ...newClient, developerName: e.target.value })}
                                                            placeholder="Developer Name"
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Client Phone</label>
                                                        <input
                                                            type="text"
                                                            value={newClient.phone}
                                                            onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    disabled={isSubmitting}
                                                    type="submit"
                                                    className="w-full bg-white text-black font-bold py-3 text-xs uppercase tracking-widest hover:bg-white/90 transition-colors disabled:opacity-50"
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
                                                        onClick={() => { setSelectedClient(client); setIsEditingClient(false); }}
                                                        className={`p-5 border transition-all cursor-pointer flex justify-between items-center ${selectedClient?.id === client.id ? 'bg-white/5 border-white/20' : 'bg-transparent border-white/5 hover:border-white/10'}`}
                                                    >
                                                        <div>
                                                            <h3 className="font-bold text-white">
                                                                {client.companyName}
                                                            </h3>
                                                            <p className="text-[10px] text-[#E61E32] font-bold uppercase tracking-wider mt-0.5">{client.appName || "No App Specified"}</p>
                                                            <p className="text-[10px] text-white/30 mt-1">{client.clientName} • {client.email}</p>
                                                        </div>
                                                        <ChevronDown className="w-4 h-4 text-white/20 -rotate-90" />
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-20 text-center border border-dashed border-white/5">
                                                    <p className="text-white/20 text-sm">No clients registered.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Client Details */}
                                <div className="bg-white/5 border border-white/5 p-8 overflow-y-auto">
                                    {selectedClient ? (
                                        <div className="space-y-8 animate-in fade-in duration-300">
                                            <div className="flex items-center justify-between pb-6 border-b border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-white/10 flex items-center justify-center border border-white/10">
                                                        <Briefcase className="w-6 h-6 text-white/40" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold">{selectedClient.companyName}</h3>
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

                                            {isEditingClient ? (
                                                <form onSubmit={handleUpdateClient} className="space-y-6 bg-white/[0.02] p-6 border border-white/5 animate-in slide-in-from-top-4 duration-300">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Company Name</label>
                                                            <input
                                                                required
                                                                type="text"
                                                                value={selectedClient.companyName}
                                                                onChange={(e) => setSelectedClient({ ...selectedClient, companyName: e.target.value })}
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">App Name</label>
                                                            <input
                                                                type="text"
                                                                value={selectedClient.appName || ""}
                                                                onChange={(e) => setSelectedClient({ ...selectedClient, appName: e.target.value })}
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Client Name</label>
                                                            <input
                                                                required
                                                                type="text"
                                                                value={selectedClient.clientName}
                                                                onChange={(e) => setSelectedClient({ ...selectedClient, clientName: e.target.value })}
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Client Email</label>
                                                            <input
                                                                required
                                                                type="email"
                                                                value={selectedClient.email}
                                                                onChange={(e) => setSelectedClient({ ...selectedClient, email: e.target.value })}
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Assigned Developer</label>
                                                            <input
                                                                type="text"
                                                                value={selectedClient.developerName || ""}
                                                                onChange={(e) => setSelectedClient({ ...selectedClient, developerName: e.target.value })}
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Meeting Type</label>
                                                            <select
                                                                value={selectedClient.meetingTemplate || "Discovery Call"}
                                                                onChange={(e) => setSelectedClient({ ...selectedClient, meetingTemplate: e.target.value })}
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                            >
                                                                <option value="Discovery Call">Discovery Call</option>
                                                                <option value="Project Kickoff">Project Kickoff</option>
                                                                <option value="Design Review">Design Review</option>
                                                                <option value="Weekly Sync">Weekly Sync</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Meeting Link</label>
                                                            <input
                                                                type="url"
                                                                value={selectedClient.meetingLink || ""}
                                                                onChange={(e) => setSelectedClient({ ...selectedClient, meetingLink: e.target.value })}
                                                                placeholder="https://google.meet..."
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Meeting Time</label>
                                                            <input
                                                                type="datetime-local"
                                                                value={selectedClient.meetingTime ? new Date(selectedClient.meetingTime).toISOString().slice(0, 16) : ""}
                                                                onChange={(e) => setSelectedClient({ ...selectedClient, meetingTime: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
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
                                                        <div className="p-4 bg-white/[0.02] border border-white/5 space-y-4">
                                                            <InfoBlock label="Client Representative" value={selectedClient.clientName} />
                                                            <InfoBlock label="Email Address" value={selectedClient.email} />
                                                            {selectedClient.phone && <InfoBlock label="Phone Number" value={selectedClient.phone} />}
                                                            {selectedClient.developerName && <InfoBlock label="Developer Assigned" value={selectedClient.developerName} />}
                                                        </div>

                                                        <div className="p-6 bg-[#E61E32]/5 border border-[#E61E32]/10 space-y-4">
                                                            <h4 className="text-[10px] font-bold text-[#E61E32] uppercase tracking-widest flex items-center gap-2">
                                                                <Calendar className="w-3.5 h-3.5" /> Meeting Schedule
                                                            </h4>
                                                            <InfoBlock label="Meeting Intent" value={selectedClient.meetingTemplate} />
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <InfoBlock label="Meeting Link" value={selectedClient.meetingLink ? "Configured" : "None"} />
                                                                <InfoBlock label="Date & Time" value={selectedClient.meetingTime ? new Date(selectedClient.meetingTime).toLocaleString() : "None Scheduled"} />
                                                            </div>
                                                            {selectedClient.meetingLink && (
                                                                <a href={selectedClient.meetingLink} target="_blank" className="text-sm text-[#E61E32] font-medium hover:underline truncate block max-w-[200px]">
                                                                    {selectedClient.meetingLink}
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="pt-6 border-t border-white/5 flex gap-4">
                                                        <button
                                                            disabled={!selectedClient.meetingLink || !selectedClient.meetingTime || sendEmailStatus?.id === selectedClient.id && sendEmailStatus?.status === 'sending'}
                                                            onClick={() => sendMeetingDetails(selectedClient.id)}
                                                            className="flex-grow flex items-center justify-center gap-2 bg-white text-black font-bold py-4 text-xs uppercase tracking-widest hover:bg-[#E61E32] hover:text-white transition-all disabled:opacity-50"
                                                        >
                                                            <Send className="w-3.5 h-3.5" />
                                                            {sendEmailStatus?.id === selectedClient.id && sendEmailStatus?.status === 'sending' ? "Sending..." :
                                                                sendEmailStatus?.id === selectedClient.id && sendEmailStatus?.status === 'success' ? "Meeting Sent!" : "Send Meeting Mail"}
                                                        </button>
                                                    </div>
                                                    {sendEmailStatus?.id === selectedClient.id && sendEmailStatus?.status === 'error' && (
                                                        <p className="text-[10px] text-[#E61E32] text-center mt-2 font-bold uppercase">Error sending meeting details. Check logs.</p>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-center opacity-20">
                                            <p className="text-sm uppercase tracking-widest font-medium">Select a client to view details</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "payment-due-sender" && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                                {/* Form Section */}
                                <div className="bg-white/5 border border-white/5 p-8 overflow-y-auto">
                                    <h3 className="text-lg font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-[#E61E32]" /> Billing Reminders
                                    </h3>
                                    <form onSubmit={handleSendPaymentDue} className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Select Client</label>
                                            <select
                                                required
                                                value={paymentClientId}
                                                onChange={(e) => setPaymentClientId(e.target.value === "" ? "" : Number(e.target.value))}
                                                className="w-full bg-black border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30"
                                            >
                                                <option value="">Choose a registered client</option>
                                                {clients.map(c => (
                                                    <option key={c.id} value={c.id}>{c.companyName} ({c.clientName})</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Billing Amount (INR)</label>
                                                <input
                                                    required
                                                    type="number"
                                                    placeholder="25000"
                                                    value={paymentAmount}
                                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                                    className="w-full bg-black border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Due Date</label>
                                                <input
                                                    required
                                                    type="date"
                                                    value={paymentDueDate}
                                                    onChange={(e) => setPaymentDueDate(e.target.value)}
                                                    className="w-full bg-black border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Upload Invoice PDF</label>
                                            <input
                                                required
                                                type="file"
                                                accept=".pdf"
                                                onChange={convertInvoiceFileToBase64}
                                                className="w-full bg-black border border-white/10 px-4 py-3 text-xs text-white/60 focus:outline-none focus:border-white/30"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={paymentSendStatus === 'sending'}
                                            className="w-full flex items-center justify-center gap-2 bg-[#E61E32] hover:bg-[#E61E32]/90 disabled:bg-[#E61E32]/50 text-white font-bold py-4 text-xs uppercase tracking-widest transition-all disabled:cursor-not-allowed"
                                        >
                                            {paymentSendStatus === 'sending' ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" /> Sending invoice email...
                                                </>
                                            ) : "Send Billing Notice"}
                                        </button>

                                        {paymentSendStatus === 'success' && (
                                            <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 text-center text-xs font-bold uppercase tracking-wider">
                                                Notice dispatched successfully
                                            </div>
                                        )}
                                        {paymentSendStatus === 'error' && (
                                            <div className="p-3 bg-[#E61E32]/10 border border-[#E61E32]/20 text-[#E61E32] text-center text-xs font-bold uppercase tracking-wider">
                                                {paymentErrorMessage}
                                            </div>
                                        )}
                                    </form>
                                </div>

                                {/* Preview Section */}
                                <div className="bg-white/5 border border-white/5 p-8 flex flex-col items-center justify-center min-h-[500px]">
                                    <div className="w-full max-w-[400px] border border-white/10 bg-white text-black p-6 rounded shadow-inner overflow-y-auto max-h-[600px] text-left border border-white/10 font-sans">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h1 style={{ margin: '0', fontSize: '20px', fontWeight: '800', letterSpacing: '-0.02em', color: '#000000' }}>REDLIX</h1>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999999' }}>STUDIO</p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', color: '#E61E32', backgroundColor: '#E61E3210', padding: '3px 6px', border: '1px solid #E61E3220' }}>Invoice Notice</span>
                                            </div>
                                        </div>
                                        <div style={{ width: '30px', height: '2px', backgroundColor: '#E61E32', marginBottom: '20px' }} />
                                        <p style={{ fontSize: '11px', lineHeight: '1.6', color: '#444444', margin: '0 0 16px 0' }}>
                                            Hi <strong>{selectedClientObj?.clientName || "[Client Name]"}</strong>,
                                        </p>
                                        <p style={{ fontSize: '11px', lineHeight: '1.6', color: '#444444', margin: '0 0 20px 0' }}>
                                            An invoice has been generated for your project at Redlix Studio. Please check the summary and find the detailed PDF attached.
                                        </p>
                                        <div style={{ backgroundColor: '#f9f9f9', border: '1px solid #eeeeee', padding: '16px', marginBottom: '20px' }}>
                                            <h3 style={{ fontSize: '11px', fontWeight: 'bold', color: '#E61E32', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px 0' }}>Billing Details</h3>
                                            <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
                                                <tbody>
                                                    <tr style={{ borderBottom: '1px solid #eeeeee' }}>
                                                        <td style={{ padding: '6px 0', color: '#666666' }}>Company</td>
                                                        <td style={{ padding: '6px 0', fontWeight: '600', textAlign: 'right' }}>{selectedClientObj?.companyName || "[Company Name]"}</td>
                                                    </tr>
                                                    <tr style={{ borderBottom: '1px solid #eeeeee' }}>
                                                        <td style={{ padding: '6px 0', color: '#666666' }}>Amount Due</td>
                                                        <td style={{ padding: '6px 0', fontWeight: '700', color: '#E61E32', textAlign: 'right' }}>{displayAmount}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ padding: '6px 0', color: '#666666' }}>Due Date</td>
                                                        <td style={{ padding: '6px 0', fontWeight: '600', textAlign: 'right' }}>{displayDueDate}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <p style={{ fontSize: '11px', lineHeight: '1.6', color: '#444444', margin: '0 0 20px 0' }}>
                                            Please make the payment before the due date to avoid service disruption.
                                        </p>
                                        <div style={{ borderTop: '1px solid #eeeeee', paddingTop: '16px', fontSize: '9px', color: '#999999' }}>
                                            <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#E61E32', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '10px' }}>Billing Lead</p>
                                            <p style={{ margin: '0' }}>Redlix Studio Accounts Division</p>
                                            <p style={{ margin: '4px 0 0 0', color: '#E61E32', fontWeight: '600' }}>www.redlix.co.in</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-white/20 mt-4 uppercase tracking-widest font-semibold">Email Preview Container</p>
                                </div>
                            </div>
                        )}

                        {activeTab === "payment-received-sender" && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                                {/* Form Section */}
                                <div className="bg-white/5 border border-white/5 p-8 overflow-y-auto">
                                    <h3 className="text-lg font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-green-500" /> Receipt Dispatcher
                                    </h3>
                                    <form onSubmit={handleSendPaymentReceived} className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Select Client</label>
                                            <select
                                                required
                                                value={receivedClientId}
                                                onChange={(e) => setReceivedClientId(e.target.value === "" ? "" : Number(e.target.value))}
                                                className="w-full bg-black border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30"
                                            >
                                                <option value="">Choose a registered client</option>
                                                {clients.map(c => (
                                                    <option key={c.id} value={c.id}>{c.companyName} ({c.clientName})</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Amount Received (INR)</label>
                                                <input
                                                    required
                                                    type="number"
                                                    placeholder="25000"
                                                    value={receivedAmount}
                                                    onChange={(e) => setReceivedAmount(e.target.value)}
                                                    className="w-full bg-black border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Transaction Date</label>
                                                <input
                                                    required
                                                    type="date"
                                                    value={receivedDate}
                                                    onChange={(e) => setReceivedDate(e.target.value)}
                                                    className="w-full bg-black border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Transaction ID</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="TXN123456789"
                                                value={receivedTransactionId}
                                                onChange={(e) => setReceivedTransactionId(e.target.value)}
                                                className="w-full bg-black border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Upload Receipt PDF</label>
                                            <input
                                                required
                                                type="file"
                                                accept=".pdf"
                                                onChange={convertReceiptFileToBase64}
                                                className="w-full bg-black border border-white/10 px-4 py-3 text-xs text-white/60 focus:outline-none focus:border-white/30"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={receivedSendStatus === 'sending'}
                                            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 disabled:bg-green-700 text-white font-bold py-4 text-xs uppercase tracking-widest transition-all disabled:cursor-not-allowed"
                                        >
                                            {receivedSendStatus === 'sending' ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" /> Dispatching receipt...
                                                </>
                                            ) : "Send Payment Receipt"}
                                        </button>

                                        {receivedSendStatus === 'success' && (
                                            <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 text-center text-xs font-bold uppercase tracking-wider">
                                                Receipt dispatched successfully
                                            </div>
                                        )}
                                        {receivedSendStatus === 'error' && (
                                            <div className="p-3 bg-[#E61E32]/10 border border-[#E61E32]/20 text-[#E61E32] text-center text-xs font-bold uppercase tracking-wider">
                                                {receivedErrorMessage}
                                            </div>
                                        )}
                                    </form>
                                </div>

                                {/* Preview Section */}
                                <div className="bg-white/5 border border-white/5 p-8 flex flex-col items-center justify-center min-h-[500px]">
                                    <div className="w-full max-w-[400px] border border-white/10 bg-white text-black p-6 rounded shadow-inner overflow-y-auto max-h-[600px] text-left border border-white/10 font-sans">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h1 style={{ margin: '0', fontSize: '20px', fontWeight: '800', letterSpacing: '-0.02em', color: '#000000' }}>REDLIX</h1>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999999' }}>STUDIO</p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', color: 'green', backgroundColor: '#e6ffe6', padding: '3px 6px', border: '1px solid #ccffcc' }}>Payment Receipt</span>
                                            </div>
                                        </div>
                                        <div style={{ width: '30px', height: '2px', backgroundColor: 'green', marginBottom: '20px' }} />
                                        <p style={{ fontSize: '11px', lineHeight: '1.6', color: '#444444', margin: '0 0 16px 0' }}>
                                            Hi <strong>{selectedReceivedClientObj?.clientName || "[Client Name]"}</strong>,
                                        </p>
                                        <p style={{ fontSize: '11px', lineHeight: '1.6', color: '#444444', margin: '0 0 20px 0' }}>
                                            Thank you for your payment. This email serves as confirmation of receipt. The official payment invoice receipt is attached.
                                        </p>
                                        <div style={{ backgroundColor: '#f9f9f9', border: '1px solid #eeeeee', padding: '16px', marginBottom: '20px' }}>
                                            <h3 style={{ fontSize: '11px', fontWeight: 'bold', color: 'green', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px 0' }}>Receipt Details</h3>
                                            <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
                                                <tbody>
                                                    <tr style={{ borderBottom: '1px solid #eeeeee' }}>
                                                        <td style={{ padding: '6px 0', color: '#666666' }}>Company</td>
                                                        <td style={{ padding: '6px 0', fontWeight: '600', textAlign: 'right' }}>{selectedReceivedClientObj?.companyName || "[Company Name]"}</td>
                                                    </tr>
                                                    <tr style={{ borderBottom: '1px solid #eeeeee' }}>
                                                        <td style={{ padding: '6px 0', color: '#666666' }}>Amount Received</td>
                                                        <td style={{ padding: '6px 0', fontWeight: '700', color: 'green', textAlign: 'right' }}>{displayReceivedAmount}</td>
                                                    </tr>
                                                    <tr style={{ borderBottom: '1px solid #eeeeee' }}>
                                                        <td style={{ padding: '6px 0', color: '#666666' }}>Payment Date</td>
                                                        <td style={{ padding: '6px 0', fontWeight: '600', textAlign: 'right' }}>{displayReceivedDate}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ padding: '6px 0', color: '#666666' }}>Transaction ID</td>
                                                        <td style={{ padding: '6px 0', fontWeight: '500', color: '#333333', textAlign: 'right' }}>{receivedTransactionId || "[Transaction ID]"}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <p style={{ fontSize: '11px', lineHeight: '1.6', color: '#444444', margin: '0 0 20px 0' }}>
                                            Your account status has been updated. We appreciate your partnership!
                                        </p>
                                        <div style={{ borderTop: '1px solid #eeeeee', paddingTop: '16px', fontSize: '9px', color: '#999999' }}>
                                            <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: 'green', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '10px' }}>Billing Lead</p>
                                            <p style={{ margin: '0' }}>Redlix Studio Accounts Division</p>
                                            <p style={{ margin: '4px 0 0 0', color: 'green', fontWeight: '600' }}>www.redlix.co.in</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-white/20 mt-4 uppercase tracking-widest font-semibold">Email Preview Container</p>
                                </div>
                            </div>
                        )}
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

function InfoBlock({ label, value }: { label: string, value?: string }) {
    if (!value) return null;
    return (
        <div className="space-y-0.5">
            <p className="text-[11px] font-medium text-white/20">{label}</p>
            <p className="text-sm text-white/80">{value}</p>
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
