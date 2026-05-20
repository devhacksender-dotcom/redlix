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
    AlertCircle
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

export default function AdminPortal() {
    const router = useRouter();
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
    const [searchQuery, setSearchQuery] = useState("");
    
    // Employee Form State
    const [showAddForm, setShowAddForm] = useState(false);
    const [showOnboardForm, setShowOnboardForm] = useState(false);
    const [newEmployee, setNewEmployee] = useState({ name: "", email: "", role: "", offerLetterLink: "" });
    const [newOnboardEmployee, setNewOnboardEmployee] = useState({ name: "", email: "", role: "" });
    
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

    useEffect(() => {
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
                setNewEmployee({ name: "", email: "", role: "", offerLetterLink: "" });
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
                setNewOnboardEmployee({ name: "", email: "", role: "" });
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

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white flex font-sans">
            {/* Simple Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-[#0f0f0f] flex flex-col p-6 space-y-8">
                <div>
                    <h1 className="text-lg font-semibold text-white tracking-tight">Admin</h1>
                    <p className="text-[11px] text-white/30 mt-0.5">Status: online</p>
                </div>

                <nav className="flex-grow space-y-1">
                    <button 
                        onClick={() => setActiveTab("overview")}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-[#E61E32]/10 text-[#E61E32]' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                    >
                        <Globe className="w-4 h-4" />
                        Overview
                    </button>
                    <button 
                        onClick={() => setActiveTab("inquiries")}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === 'inquiries' ? 'bg-[#E61E32]/10 text-[#E61E32]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                    >
                        <Inbox className="w-4 h-4" />
                        Inquiries
                    </button>
                    <button 
                        onClick={() => setActiveTab("support")}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === 'support' ? 'bg-[#E61E32]/10 text-[#E61E32]' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                    >
                        <MessageSquare className="w-4 h-4" />
                        Support tickets
                    </button>
                    <button 
                        onClick={() => setActiveTab("intern-support")}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === 'intern-support' ? 'bg-[#E61E32]/10 text-[#E61E32]' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                    >
                        <Users className="w-4 h-4" />
                        Intern support
                    </button>
                    <button 
                        onClick={() => setActiveTab("employees")}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === 'employees' ? 'bg-[#E61E32]/10 text-[#E61E32]' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                    >
                        <Users className="w-4 h-4" />
                        Employees
                    </button>
                    <button 
                        onClick={() => setActiveTab("clients")}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === 'clients' ? 'bg-[#E61E32]/10 text-[#E61E32]' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                    >
                        <Briefcase className="w-4 h-4" />
                        Clients
                    </button>
                    <button 
                        onClick={() => setActiveTab("payment-due-sender")}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === 'payment-due-sender' ? 'bg-[#E61E32]/10 text-[#E61E32]' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                    >
                        <CreditCard className="w-4 h-4" />
                        Payment Due Sender
                    </button>
                    <button 
                        onClick={() => setActiveTab("payment-received-sender")}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === 'payment-received-sender' ? 'bg-[#E61E32]/10 text-[#E61E32]' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        Payment Received Sender
                    </button>
                </nav>

                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 bg-[#E61E32] hover:bg-[#E61E32]/90 text-white transition-all text-sm font-semibold shadow-lg shadow-[#E61E32]/10"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <div className="flex-grow p-8 overflow-hidden">
                <div className="max-w-6xl mx-auto space-y-8 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-center bg-white/[0.02] p-6 border border-white/5 shrink-0">
                        <div>
                            <h2 className="text-xl font-semibold text-white tracking-tight">
                                {activeTab === "overview" ? "Dashboard overview" : 
                                 activeTab === "inquiries" ? "Inquiry management" : 
                                 activeTab === "employees" ? "Employee portal" : 
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
                                 activeTab === "employees" ? "manage organization structure" : 
                                 activeTab === "clients" ? "monitor client projects and meetings" : 
                                 activeTab === "payment-due-sender" ? "send billing notices to registered clients" : "send payment receipts to registered clients"}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            {activeTab === "employees" && (
                                <>
                                    <button 
                                        onClick={() => { setShowAddForm(!showAddForm); setShowOnboardForm(false); }}
                                        className="flex items-center gap-2 bg-[#E61E32] hover:bg-[#E61E32]/80 text-white px-4 py-2 text-xs font-semibold transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add employee
                                    </button>
                                    <button 
                                        onClick={() => { setShowOnboardForm(!showOnboardForm); setShowAddForm(false); }}
                                        className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 text-xs font-semibold transition-colors"
                                    >
                                        <Users className="w-4 h-4" />
                                        Onboard employee
                                    </button>
                                </>
                            )}
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
                                        label="Active employees" 
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
                                            {clients.filter(c => c.meetingTime).sort((a,b) => new Date(a.meetingTime!).getTime() - new Date(b.meetingTime!).getTime()).slice(0, 5).map(client => (
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
                                                            onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Email Address</label>
                                                        <input 
                                                            required
                                                            type="email"
                                                            value={newEmployee.email}
                                                            onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
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
                                                            onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Offer Letter Link</label>
                                                        <input 
                                                            type="url"
                                                            value={newEmployee.offerLetterLink}
                                                            onChange={(e) => setNewEmployee({...newEmployee, offerLetterLink: e.target.value})}
                                                            placeholder="https://..."
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
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
                                                            onChange={(e) => setNewOnboardEmployee({...newOnboardEmployee, name: e.target.value})}
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Email Address</label>
                                                        <input 
                                                            required
                                                            type="email"
                                                            value={newOnboardEmployee.email}
                                                            onChange={(e) => setNewOnboardEmployee({...newOnboardEmployee, email: e.target.value})}
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
                                                        onChange={(e) => setNewOnboardEmployee({...newOnboardEmployee, role: e.target.value})}
                                                        className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                    />
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
                                                        onClick={() => setSelectedEmployee(emp)}
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
                                                                        className={`flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-tight border transition-colors ${
                                                                            sendEmailStatus?.id === emp.id && sendEmailStatus.action === 'offer' && sendEmailStatus.status === 'success' 
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
                                                                        className={`flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-tight border transition-colors ${
                                                                            sendEmailStatus?.id === emp.id && sendEmailStatus.action === 'onboarding' && sendEmailStatus.status === 'success' 
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
                                            <div className="space-y-2 pb-6 border-b border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-white/10 flex items-center justify-center border border-white/10">
                                                        <User className="w-6 h-6 text-white/40" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold">{selectedEmployee.name}</h3>
                                                        <p className="text-sm text-[#E61E32] font-bold uppercase tracking-widest">{selectedEmployee.role}</p>
                                                    </div>
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
                                                            className="flex items-center justify-between group bg-white/5 hover:bg-white/10 border border-white/10 p-3 transition-colors"
                                                        >
                                                            <span className="text-xs font-medium text-white/60 group-hover:text-white truncate pr-4">{selectedEmployee.offerLetterLink}</span>
                                                            <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60" />
                                                        </a>
                                                    ) : (
                                                        <p className="text-xs text-white/30 italic">No link provided</p>
                                                    )}
                                                </div>
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
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-center opacity-20">
                                            <p className="text-sm uppercase tracking-widest font-medium text-center">
                                                Select an employee to<br/>view profile and history
                                            </p>
                                        </div>
                                    )}
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
                                                            onChange={(e) => setNewClient({...newClient, companyName: e.target.value})}
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">App / Website Name</label>
                                                        <input 
                                                            type="text"
                                                            value={newClient.appName}
                                                            onChange={(e) => setNewClient({...newClient, appName: e.target.value})}
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
                                                            onChange={(e) => setNewClient({...newClient, clientName: e.target.value})}
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Email Address</label>
                                                        <input 
                                                            required
                                                            type="email"
                                                            value={newClient.email}
                                                            onChange={(e) => setNewClient({...newClient, email: e.target.value})}
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
                                                            onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Meeting Template</label>
                                                        <select 
                                                            value={newClient.meetingTemplate}
                                                            onChange={(e) => setNewClient({...newClient, meetingTemplate: e.target.value})}
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
                                                            onChange={(e) => setNewClient({...newClient, developerName: e.target.value})}
                                                            placeholder="Lead Engineer Name"
                                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Meeting Link (Custom)</label>
                                                        <input 
                                                            type="url"
                                                            value={newClient.meetingLink}
                                                            onChange={(e) => setNewClient({...newClient, meetingLink: e.target.value})}
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
                                                        onChange={(e) => setNewClient({...newClient, meetingTime: e.target.value})}
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
                                                                onChange={(e) => setSelectedClient({...selectedClient, meetingTemplate: e.target.value})}
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
                                                                onChange={(e) => setSelectedClient({...selectedClient, meetingTime: e.target.value})}
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
                                                                onChange={(e) => setSelectedClient({...selectedClient, developerName: e.target.value})}
                                                                className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/30"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Meeting Link</label>
                                                            <input 
                                                                type="url"
                                                                value={selectedClient.meetingLink || ""}
                                                                onChange={(e) => setSelectedClient({...selectedClient, meetingLink: e.target.value})}
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
                                                Select a client to<br/>view full details and projects
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

                                        {/* Amount and Payment Date Row */}
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
                    </div>
                </div>
            </div>
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
