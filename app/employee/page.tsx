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
    Hourglass,
    Eye,
    Flame,
    MapPin,
    Sparkles,
    KeyRound,
    Pencil,
    Plus,
    Target,
    Rocket,
    Camera
} from "lucide-react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import EnableNotifications from "@/components/EnableNotifications";

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

interface TourStep {
    targetId: string;
    title: string;
    description: string;
    placement: "right" | "bottom" | "top" | "center";
}

const TOUR_STEPS: TourStep[] = [
    {
        targetId: "tour-overview-stats",
        title: "Overview Dashboard",
        description: "Welcome to your employee portal! Here you can check your overall attendance stats, current check-in streak, and working metrics.",
        placement: "bottom"
    },
    {
        targetId: "tour-punch-controls",
        title: "Punch In / Out",
        description: "Track your working hours in real-time. Make sure to punch in before 10:00 AM IST to mark yourself present on time!",
        placement: "bottom"
    },
    {
        targetId: "tour-tasks-container",
        title: "Assigned Tasks",
        description: "View individual tasks assigned to you by the administrator. Select any task to see details and update its status.",
        placement: "bottom"
    },
    {
        targetId: "tour-submission-form",
        title: "Work Submissions",
        description: "Submit your completed project website links and Git repository URLs here for review and verification.",
        placement: "right"
    },
    {
        targetId: "tour-community-feed",
        title: "Community Standups",
        description: "Share what you accomplished or learned today with the team. You can also view and react to updates from other colleagues!",
        placement: "bottom"
    },
    {
        targetId: "tour-leaves-form",
        title: "Request Time Off",
        description: "Plan your leaves by submitting time-off requests. Track your request approval status in real-time.",
        placement: "right"
    },
    {
        targetId: "tour-profile-banner",
        title: "Profile & Settings",
        description: "Customize your profile avatar, banner, bio, social links, and update your login credentials here.",
        placement: "bottom"
    },
    {
        targetId: "tour-raise-hand",
        title: "Raise Hand for Help",
        description: "Need urgent assistance from the admin? Click 'Raise Hand' to instantly send a high-priority alert to the administration panel.",
        placement: "bottom"
    }
];

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
        avatar?: string;
        banner?: string;
        bio?: string;
        college?: string;
        division?: string;
        portfolioLink?: string;
        futureGoals?: string;
        socialLinks?: string;
    } | null>(null);
    const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "attendance" | "settings" | "meetings" | "documents" | "payrolls" | "leaves" | "community" | "declarations" | "submissions">("overview");
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
        fileData?: string;
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
    const [previewFile, setPreviewFile] = useState<{ name: string; type: string; data: string } | null>(null);

    // Work submissions states
    interface ClientOption {
        id: number;
        companyName: string;
        appName?: string | null;
        clientName: string;
    }
    interface WorkSubmission {
        id: number;
        clientId: number;
        client: { companyName: string; clientName: string };
        websiteLink: string;
        gitRepoLink: string;
        createdAt: string;
    }
    const [clients, setClients] = useState<ClientOption[]>([]);
    const [submissions, setSubmissions] = useState<WorkSubmission[]>([]);
    const [submitClientId, setSubmitClientId] = useState("");
    const [submitWebsiteLink, setSubmitWebsiteLink] = useState("");
    const [submitGitRepoLink, setSubmitGitRepoLink] = useState("");
    const [isSubmittingWork, setIsSubmittingWork] = useState(false);
    const [submissionError, setSubmissionError] = useState("");
    const [submissionSuccess, setSubmissionSuccess] = useState("");

    // Tour states
    const [tourActive, setTourActive] = useState(false);
    const [tourStep, setTourStep] = useState(0);
    const [tourPosition, setTourPosition] = useState({ x: 0, y: 0 });
    const [highlightClipPath, setHighlightClipPath] = useState("");
    const tourCardRef = React.useRef<HTMLDivElement>(null);

    // Division congratulate modal state
    const [showDivisionModal, setShowDivisionModal] = useState(false);

    const currentTourStepData = TOUR_STEPS[tourStep];

    const handleEndTour = () => {
        setTourActive(false);
        localStorage.setItem("redlix_portal_tour_completed", "true");
    };

    const handleNextTourStep = () => {
        if (tourStep === TOUR_STEPS.length - 1) {
            handleEndTour();
        } else {
            setTourStep(prev => prev + 1);
        }
    };

    const handlePrevTourStep = () => {
        if (tourStep > 0) {
            setTourStep(prev => prev - 1);
        }
    };

    const handleCloseDivisionModal = () => {
        if (employeeInfo) {
            localStorage.setItem(`redlix_division_modal_seen_${employeeInfo.id}`, "true");
            setShowDivisionModal(false);

            // After dismissing congratulations, start the portal tour if not completed
            const completed = localStorage.getItem("redlix_portal_tour_completed");
            if (!completed) {
                setTourStep(0);
                setTourActive(true);
            }
        }
    };

    useEffect(() => {
        if (employeeInfo) {
            if (employeeInfo.division) {
                const seen = localStorage.getItem(`redlix_division_modal_seen_${employeeInfo.id}`);
                if (!seen) {
                    setShowDivisionModal(true);
                    return; // Hold off on tour until congratulations are closed
                }
            }

            const completed = localStorage.getItem("redlix_portal_tour_completed");
            if (!completed) {
                const timer = setTimeout(() => {
                    setTourStep(0);
                    setTourActive(true);
                }, 1500);
                return () => clearTimeout(timer);
            }
        }
    }, [employeeInfo]);

    useEffect(() => {
        if (!tourActive) return;

        let frameId: number;

        const updateTourTarget = () => {
            const step = TOUR_STEPS[tourStep];

            // 1. Automatically switch tabs to show targeted components BEFORE resolving elements
            if (step.targetId === "tour-overview-stats" && activeTab !== "overview") {
                setActiveTab("overview");
                return;
            }
            if (step.targetId === "tour-punch-controls" && activeTab !== "attendance") {
                setActiveTab("attendance");
                return;
            }
            if (step.targetId === "tour-tasks-container" && activeTab !== "tasks") {
                setActiveTab("tasks");
                return;
            }
            if (step.targetId === "tour-submission-form" && activeTab !== "submissions") {
                setActiveTab("submissions");
                return;
            }
            if (step.targetId === "tour-community-feed" && activeTab !== "community") {
                setActiveTab("community");
                return;
            }
            if (step.targetId === "tour-leaves-form" && activeTab !== "leaves") {
                setActiveTab("leaves");
                return;
            }
            if (step.targetId === "tour-profile-banner" && activeTab !== "settings") {
                setActiveTab("settings");
                return;
            }

            // 2. Find target element in DOM
            const element = document.getElementById(step.targetId);

            if (!element) {
                const cardWidth = 320;
                const cardHeight = 200;
                setTourPosition({
                    x: (window.innerWidth - cardWidth) / 2,
                    y: (window.innerHeight - cardHeight) / 2
                });
                setHighlightClipPath("");
                return;
            }

            const rect = element.getBoundingClientRect();

            // If target element is not loaded or has no visible size, show popup at center
            if (rect.width === 0 || rect.height === 0) {
                const cardWidth = 320;
                const cardHeight = 200;
                setTourPosition({
                    x: (window.innerWidth - cardWidth) / 2,
                    y: (window.innerHeight - cardHeight) / 2
                });
                setHighlightClipPath("");
                return;
            }

            const pad = 8;
            const t = Math.max(0, rect.top - pad);
            const b = Math.min(window.innerHeight, rect.bottom + pad);
            const l = Math.max(0, rect.left - pad);
            const r = Math.min(window.innerWidth, rect.right + pad);

            setHighlightClipPath(`polygon(0% 0%, 0% 100%, ${l}px 100%, ${l}px ${t}px, ${r}px ${t}px, ${r}px ${b}px, ${l}px ${b}px, ${l}px 100%, 100% 100%, 100% 0%)`);

            let px = 0;
            let py = 0;
            const cardWidth = 320;
            const cardHeight = 180;

            if (step.placement === "right") {
                px = r + 16;
                py = t + (b - t - cardHeight) / 2;
                if (px + cardWidth > window.innerWidth) {
                    px = l - cardWidth - 16;
                }
            } else if (step.placement === "bottom") {
                px = l + (r - l - cardWidth) / 2;
                py = b + 16;
            } else if (step.placement === "top") {
                px = l + (r - l - cardWidth) / 2;
                py = t - cardHeight - 16;
            } else {
                px = (window.innerWidth - cardWidth) / 2;
                py = (window.innerHeight - cardHeight) / 2;
            }

            px = Math.max(16, Math.min(window.innerWidth - cardWidth - 16, px));
            py = Math.max(16, Math.min(window.innerHeight - cardHeight - 16, py));

            setTourPosition({ x: px, y: py });
        };

        // Scroll the targeted element into view once when step transitions
        const step = TOUR_STEPS[tourStep];
        const element = document.getElementById(step.targetId);
        if (element) {
            element.scrollIntoView({ behavior: "instant", block: "center" });
        }

        const loop = () => {
            updateTourTarget();
            frameId = requestAnimationFrame(loop);
        };

        frameId = requestAnimationFrame(loop);

        window.addEventListener("resize", updateTourTarget);

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener("resize", updateTourTarget);
        };
    }, [tourActive, tourStep, activeTab]);

    // Helper to generate daily attendance logs (e.g. past 30 days) and check 10:00 AM check-in constraint
    const getDailyAttendanceList = (history: AttendanceRecord[], joinedAtStr?: string, customStart?: Date, customEnd?: Date) => {
        const report: {
            dateStr: string;
            punchIn: string;
            punchOut: string;
            status: "Present" | "Absent" | "Pending" | "Future";
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
        let start = joinedAtStr ? new Date(joinedAtStr) : new Date();
        if (customStart) {
            start = new Date(customStart);
        } else if (!joinedAtStr) {
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
        
        const end = customEnd ? new Date(customEnd) : new Date(today);
        if (!customEnd) {
            end.setHours(23, 59, 59, 999);
        } else {
            end.setHours(23, 59, 59, 999);
        }
        
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
                
                // Reset hours to compare dates cleanly
                const checkDate = new Date(curr);
                checkDate.setHours(0, 0, 0, 0);
                const compareToday = new Date(today);
                compareToday.setHours(0, 0, 0, 0);
                
                const isFuture = checkDate.getTime() > compareToday.getTime();
                
                let status: "Present" | "Absent" | "Pending" | "Future" = "Absent";
                let statusReason = "No Check-in recorded";
                
                if (isToday) {
                    if (isBefore10AM) {
                        status = "Pending";
                        statusReason = "Pending Check-in (cutoff 10:00 AM IST)";
                    } else {
                        status = "Absent";
                        statusReason = "Missed 10:00 AM IST cutoff";
                    }
                } else if (isFuture) {
                    status = "Future";
                    statusReason = "Future Date";
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

    const getWorkingDays = () => {
        if (!employeeInfo?.joinedAt) return 30; // fallback
        const joinDate = new Date(employeeInfo.joinedAt);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - joinDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(1, diffDays);
    };

    const getStreak = (report: ReturnType<typeof getDailyAttendanceList>) => {
        let streak = 0;
        const sortedReport = [...report].sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime()); // newest first
        
        if (sortedReport.length === 0) return 0;
        
        let startIndex = 0;
        const todayStr = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
        
        // If today has no check-in yet, skip today for streak calculation
        if (sortedReport[0].dateStr === todayStr && sortedReport[0].punchIn === "-") {
            startIndex = 1;
        }
        
        for (let i = startIndex; i < sortedReport.length; i++) {
            if (sortedReport[i].punchIn !== "-") {
                streak++;
            } else {
                break;
            }
        }
        return streak;
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
    const [settingsAvatar, setSettingsAvatar] = useState("");
    const [settingsBanner, setSettingsBanner] = useState("");
    const [settingsBio, setSettingsBio] = useState("");
    const [settingsCollege, setSettingsCollege] = useState("");
    const [settingsDivision, setSettingsDivision] = useState("");
    const [settingsPortfolioLink, setSettingsPortfolioLink] = useState("");
    const [settingsFutureGoals, setSettingsFutureGoals] = useState("");
    const [settingsSocialLinks, setSettingsSocialLinks] = useState<string[]>([]);
    const [activeProfileTab, setActiveProfileTab] = useState("summary");
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

    // Password change states
    const [changePasswordCurrent, setChangePasswordCurrent] = useState("");
    const [changePasswordNew, setChangePasswordNew] = useState("");
    const [changePasswordConfirm, setChangePasswordConfirm] = useState("");
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [changePasswordSuccess, setChangePasswordSuccess] = useState("");
    const [changePasswordError, setChangePasswordError] = useState("");

    const [isSavingSettings, setIsSavingSettings] = useState(false);
    const [settingsSuccess, setSettingsSuccess] = useState("");
    const [settingsError, setSettingsError] = useState("");

    // Real-time badge indicators
    const activeTasksCount = employeeTasks.filter(t => t.status !== "completed").length;
    const pendingLeavesCount = employeeLeaves.filter(l => l.status === "pending").length;
    const communityCount = communityUpdates.length;
    const upcomingMeetingsCount = employeeMeetings.filter(m => new Date(m.scheduledAt) > new Date()).length;
    const documentsCount = employeeDocuments.length;
    const pendingDeclarationsCount = declarations.filter(d => d.status === "pending").length;

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
                    setSettingsAvatar(data.data.avatar || "");
                    setSettingsBanner(data.data.banner || "");
                    setSettingsBio(data.data.bio || "");
                    setSettingsCollege(data.data.college || "");
                    setSettingsDivision(data.data.division || "");
                    setSettingsPortfolioLink(data.data.portfolioLink || "");
                    setSettingsFutureGoals(data.data.futureGoals || "");
                    let parsedSocialLinks: string[] = [];
                    try {
                        if (data.data.socialLinks) {
                            parsedSocialLinks = JSON.parse(data.data.socialLinks);
                        }
                    } catch (e) {
                        console.error("Failed to parse social links from DB", e);
                    }
                    setSettingsSocialLinks(parsedSocialLinks);
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
        
        // Eagerly preload all metrics and lists for real-time sidebar badges
        fetchEmployeeTasks();
        fetchAttendanceInfo();
        fetchEmployeeMeetings();
        fetchEmployeeDocuments();
        fetchEmployeePayrolls();
        fetchEmployeeLeaves();
        fetchCommunityUpdates();
        fetchDeclarations();
    }, [employeeInfo]);

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
        } else if (activeTab === "submissions") {
            fetchSubmissionsData();
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

    const fetchSubmissionsData = async () => {
        try {
            const clientRes = await fetch("/api/employee/clients");
            const clientJson = await clientRes.json();
            if (clientJson.success) setClients(clientJson.data);

            const subRes = await fetch("/api/employee/submissions");
            const subJson = await subRes.json();
            if (subJson.success) setSubmissions(subJson.data);
        } catch (error) {
            console.error("Error fetching submissions data:", error);
        }
    };

    const handleSubmitWork = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!submitClientId) {
            setSubmissionError("Please select a client.");
            return;
        }
        if (!submitWebsiteLink.trim() || !submitGitRepoLink.trim()) {
            setSubmissionError("Please fill out both the website and repository links.");
            return;
        }

        setIsSubmittingWork(true);
        setSubmissionError("");
        setSubmissionSuccess("");

        try {
            const res = await fetch("/api/employee/submissions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clientId: submitClientId,
                    websiteLink: submitWebsiteLink.trim(),
                    gitRepoLink: submitGitRepoLink.trim()
                })
            });
            const data = await res.json();
            if (data.success) {
                setSubmissionSuccess("Work submitted successfully!");
                setSubmitWebsiteLink("");
                setSubmitGitRepoLink("");
                setSubmitClientId("");
                setSubmissions(prev => [data.data, ...prev]);
                setTimeout(() => setSubmissionSuccess(""), 5000);
            } else {
                setSubmissionError(data.message || "Failed to submit work.");
            }
        } catch (error) {
            console.error("Failed to submit work:", error);
            setSubmissionError("Server error. Please try again later.");
        } finally {
            setIsSubmittingWork(false);
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
                    avatar: settingsAvatar,
                    banner: settingsBanner,
                    bio: settingsBio,
                    college: settingsCollege,
                    division: settingsDivision,
                    portfolioLink: settingsPortfolioLink,
                    futureGoals: settingsFutureGoals,
                    socialLinks: JSON.stringify(settingsSocialLinks),
                })
            });

            const data = await res.json();

            if (data.success) {
                setSettingsSuccess(data.message || "Profile settings saved successfully");
                setEmployeeInfo(prev => prev ? { ...prev, ...data.data } : null);
                setTimeout(() => {
                    setIsEditingProfile(false);
                    setSettingsSuccess("");
                }, 1000);
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

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setChangePasswordError("");
        setChangePasswordSuccess("");

        if (changePasswordNew !== changePasswordConfirm) {
            setChangePasswordError("New passwords do not match");
            return;
        }

        if (changePasswordNew.length < 6) {
            setChangePasswordError("Password must be at least 6 characters long");
            return;
        }

        setIsSavingPassword(true);

        try {
            const res = await fetch("/api/employee/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: changePasswordCurrent,
                    newPassword: changePasswordNew,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setChangePasswordSuccess(data.message || "Password updated successfully");
                setChangePasswordCurrent("");
                setChangePasswordNew("");
                setChangePasswordConfirm("");
                setTimeout(() => {
                    setIsChangePasswordModalOpen(false);
                    setChangePasswordSuccess("");
                }, 1500);
            } else {
                setChangePasswordError(data.message || "Failed to update password");
            }
        } catch (error) {
            setChangePasswordError("Connection error. Please try again.");
            console.error("Change password error:", error);
        } finally {
            setIsSavingPassword(false);
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
                        id="tour-sidebar-tasks"
                        onClick={() => setActiveTab("tasks")}
                        className={`w-full flex items-center justify-between text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'tasks' ? 'bg-white/10 text-white border-l-2 border-white pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <div className="flex items-center gap-3">
                            <ListTodo className="w-4 h-4" />
                            <span>Tasks</span>
                        </div>
                        {activeTasksCount > 0 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#E61E32]/10 border border-[#E61E32]/25 text-[#E61E32] rounded-full shrink-0">
                                {activeTasksCount}
                            </span>
                        )}
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
                        className={`w-full flex items-center justify-between text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'meetings' ? 'bg-white/10 text-white border-l-2 border-white pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Video className="w-4 h-4" />
                            <span>Meetings</span>
                        </div>
                        {upcomingMeetingsCount > 0 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 rounded-full shrink-0">
                                {upcomingMeetingsCount}
                            </span>
                        )}
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("documents")}
                        className={`w-full flex items-center justify-between text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'documents' ? 'bg-white/10 text-white border-l-2 border-white pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4" />
                            <span>Documents</span>
                        </div>
                        {documentsCount > 0 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white/5 border border-white/10 text-white/40 rounded-full shrink-0">
                                {documentsCount}
                            </span>
                        )}
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
                        className={`w-full flex items-center justify-between text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'leaves' ? 'bg-white/10 text-white border-l-2 border-white pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4" />
                            <span>Leaves</span>
                        </div>
                        {pendingLeavesCount > 0 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-yellow-500/10 border border-yellow-500/25 text-yellow-500 rounded-full shrink-0">
                                {pendingLeavesCount}
                            </span>
                        )}
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        id="tour-sidebar-community"
                        onClick={() => setActiveTab("community")}
                        className={`w-full flex items-center justify-between text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'community' ? 'bg-white/10 text-white border-l-2 border-white pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <div className="flex items-center gap-3">
                            <MessageSquare className="w-4 h-4" />
                            <span>Community</span>
                        </div>
                        {communityCount > 0 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white/10 border border-white/15 text-white/60 rounded-full shrink-0">
                                {communityCount}
                            </span>
                        )}
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        onClick={() => setActiveTab("declarations")}
                        className={`w-full flex items-center justify-between text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'declarations' ? 'bg-white/10 text-white border-l-2 border-white pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <div className="flex items-center gap-3">
                            <FolderUp className="w-4 h-4" />
                            <span>Declarations</span>
                        </div>
                        {pendingDeclarationsCount > 0 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#E61E32]/10 border border-[#E61E32]/25 text-[#E61E32] rounded-full shrink-0">
                                {pendingDeclarationsCount}
                            </span>
                        )}
                    </button>
                    <div className="h-[1px] bg-white/5 my-1.5 mx-4" />
                    <button
                        id="tour-sidebar-submissions"
                        onClick={() => setActiveTab("submissions")}
                        className={`w-full flex items-center justify-between text-left gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none ${activeTab === 'submissions' ? 'bg-white/10 text-white border-l-2 border-white pl-[14px]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:pl-5'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Send className="w-4 h-4" />
                            <span>Work Submission</span>
                        </div>
                        {submissions.length > 0 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white/10 border border-white/15 text-white/60 rounded-full shrink-0">
                                {submissions.length}
                            </span>
                        )}
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
                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                                {employeeInfo?.avatar ? (
                                    <img src={employeeInfo.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-4 h-4 text-white/70" />
                                )}
                            </div>
                            <div className="min-w-0">
                                <div className="text-[12px] font-bold text-white tracking-tight truncate" title={employeeInfo?.name}>
                                    {employeeInfo?.name || "Loading..."}
                                </div>
                                <div className="text-[9px] text-white/40 uppercase font-semibold tracking-wider truncate" title={employeeInfo?.role}>
                                    {employeeInfo?.role || "Team Member"}
                                </div>
                                {employeeInfo?.division && (
                                    <div className="text-[9px] text-[#E61E32] uppercase font-bold tracking-wider truncate mt-0.5" title={employeeInfo.division}>
                                        {employeeInfo.division}
                                    </div>
                                )}
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
                                                            activeTab === "declarations" ? "Declarations" :
                                                                activeTab === "submissions" ? "Work Submissions" : "Settings"}
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
                                                            activeTab === "declarations" ? "upload & submit client declaration documents" :
                                                                activeTab === "submissions" ? "submit completed work links for review" : "update personal, payroll and address info"}
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
                                    id="tour-raise-hand"
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
                                    <div className="flex flex-col sm:items-end gap-1.5 shrink-0 w-full sm:w-auto">
                                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                                            <EnableNotifications employeeId={employeeInfo?.id} />
                                            <button
                                                onClick={() => {
                                                    setTourStep(0);
                                                    setTourActive(true);
                                                }}
                                                className="flex items-center gap-1.5 bg-[#E61E32] hover:bg-[#C81428] text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-none transition-all cursor-pointer"
                                            >
                                                Take a Tour
                                            </button>
                                            <div className="self-start sm:self-auto px-4 py-2 border border-[#E61E32]/25 bg-[#E61E32]/5 text-[#E61E32] text-xs font-bold uppercase tracking-wider rounded-md">
                                                {employeeInfo?.role}
                                            </div>
                                        </div>
                                        {employeeInfo?.division && (
                                            <div className="self-start sm:self-auto px-3 py-1 bg-white/5 border border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-wider rounded-md">
                                                Division: {employeeInfo.division}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div id="tour-overview-stats" className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
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
                                    <div className="col-span-2 lg:col-span-1">
                                        <StatCard
                                            icon={<Video className="w-5 h-5" />}
                                            label="Meetings"
                                            value={employeeMeetings.filter(m => new Date(m.scheduledAt) > new Date()).length}
                                            sublabel={`${employeeMeetings.length} total meetings`}
                                            color="text-pink-500"
                                        />
                                    </div>
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
                                                <div className="flex flex-col items-center justify-center py-6 text-center">
                                                    <dotlottie-wc
                                                        src="https://lottie.host/10b6df46-cc4e-4e85-9607-54af123c48b9/nEtCJjLM2m.lottie"
                                                        style={{ width: "280px", height: "280px" }}
                                                        autoplay
                                                        loop
                                                    />
                                                    <p className="text-xs text-white/40 mt-1 font-medium">No active tasks assigned.</p>
                                                </div>
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
                            <div id="tour-tasks-container" className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 h-full">
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
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                                    <h3 className="font-bold text-white flex items-center gap-2 flex-wrap min-w-0">
                                                        {t.title}
                                                        <span className={`px-1.5 py-0.5 text-[8px] uppercase tracking-widest font-black rounded-md ${t.status === 'completed' ? 'bg-green-500/10 text-green-500' : t.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                            {t.status.replace("_", " ")}
                                                        </span>
                                                    </h3>
                                                    {t.deadline && (
                                                        <span className="text-[9px] text-white/20 uppercase tracking-wider shrink-0">
                                                            Due {new Date(t.deadline).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-white/40 truncate">{t.description || "No description provided."}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-12 border border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center text-center">
                                            <dotlottie-wc
                                                src="https://lottie.host/10b6df46-cc4e-4e85-9607-54af123c48b9/nEtCJjLM2m.lottie"
                                                style={{ width: "380px", height: "380px" }}
                                                autoplay
                                                loop
                                            />
                                            <p className="text-white/40 text-sm mt-1 font-medium">No tasks assigned to you.</p>
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
                                                    {renderTextWithLinks(selectedEmployeeTask.description || "No description provided.")}
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
                            <div className="space-y-6 h-auto lg:h-full flex flex-col overflow-visible lg:overflow-y-auto pr-2 pb-6">
                                {/* Attendance Statistics */}
                                {(() => {
                                    const stats = getAttendanceStats(getDailyAttendanceList(attendanceHistory, employeeInfo?.joinedAt));
                                    return (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 shrink-0">
                                            <div className="bg-white/[0.02] border border-white/5 p-3 sm:p-4 space-y-1.5 hover:border-white/10 transition-colors rounded-xl">
                                                <p className="text-[10px] font-normal text-white/30">Present Days</p>
                                                <h4 className="text-xl font-bold text-green-400">{stats.presentDays}</h4>
                                                <p className="text-[9px] text-white/20">Checked in on-time</p>
                                            </div>
                                            <div className="bg-white/[0.02] border border-white/5 p-3 sm:p-4 space-y-1.5 hover:border-white/10 transition-colors rounded-xl">
                                                <p className="text-[10px] font-normal text-[#E61E32]">Absent Days</p>
                                                <h4 className="text-xl font-bold text-[#E61E32]">{stats.absentDays}</h4>
                                                <p className="text-[9px] text-white/20">Missed / Late check-ins</p>
                                            </div>
                                            <div className="bg-white/[0.02] border border-white/5 p-3 sm:p-4 space-y-1.5 hover:border-white/10 transition-colors rounded-xl">
                                                <p className="text-[10px] font-normal text-yellow-500/80">Pending Today</p>
                                                <h4 className="text-xl font-bold text-yellow-500">{stats.pendingDays}</h4>
                                                <p className="text-[9px] text-white/20">Before 10:00 AM today</p>
                                            </div>
                                            <div className="bg-white/[0.02] border border-white/5 p-3 sm:p-4 space-y-1.5 hover:border-white/10 transition-colors rounded-xl">
                                                <p className="text-[10px] font-normal text-white/30">Total Work Time</p>
                                                <h4 className="text-xl font-bold text-white/90">{stats.totalHours} hrs</h4>
                                                <p className="text-[9px] text-white/20">Accrued this period</p>
                                            </div>
                                            <div className="bg-white/[0.02] border border-white/5 p-3 sm:p-4 space-y-1.5 hover:border-white/10 transition-colors rounded-xl">
                                                <p className="text-[10px] font-normal text-white/30">Avg Hours / Day</p>
                                                <h4 className="text-xl font-bold text-white/95">{stats.avgHours} hrs</h4>
                                                <p className="text-[9px] text-white/20">Per present day</p>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Main Attendance Content */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 flex-grow lg:min-h-[400px]">
                                    {/* Punch Actions Card */}
                                    <div id="tour-punch-controls" className="bg-white/5 border border-white/5 p-5 sm:p-8 flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 min-h-[300px] sm:min-h-[350px] rounded-xl">
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
                                    <div className="bg-white/5 border border-white/5 p-4 sm:p-8 flex flex-col lg:overflow-hidden h-auto lg:h-full rounded-xl">
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

                                        <div className="overflow-visible lg:overflow-y-auto pr-1 flex-grow scrollbar-thin">
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
                        )}                        {activeTab === "settings" && (() => {
                            // Local calculations for stats
                            const report = getDailyAttendanceList(attendanceHistory, employeeInfo?.joinedAt);
                            const presentCount = report.filter(r => r.status === "Present").length;
                            const workingCount = getWorkingDays();
                            const attendancePercent = workingCount > 0 ? Math.min(100, Math.round((presentCount / workingCount) * 100)) : 0;
                            
                            const streakCount = getStreak(report);
                            const lateCount = report.filter(r => r.punchIn !== "-" && r.status === "Absent" && r.statusReason.includes("Late")).length;
                            const approvedLeavesCount = employeeLeaves.filter(l => l.status === "approved").length;

                            const uniqueCollaborators = Array.from(
                                new Map(
                                    communityUpdates
                                        .filter(u => u.employee && u.employee.id !== employeeInfo?.id)
                                        .map(u => [u.employee.id, u.employee])
                                ).values()
                            );

                            return (
                                <div className="bg-transparent border-0 shadow-none overflow-y-auto h-full flex flex-col text-left animate-in fade-in duration-300 relative text-white scrollbar-thin pr-1 pb-10">
                                    {/* ── Banner + Identity Header ── */}
                                    <div
                                        id="tour-profile-banner"
                                        className="relative min-h-[16rem] sm:min-h-0 sm:h-52 w-full bg-cover bg-center shrink-0 group/banner overflow-hidden rounded-none border border-white/5 shadow-sm mb-6"
                                        style={{ backgroundImage: `url('${isEditingProfile ? (settingsBanner || "https://i.pinimg.com/originals/aa/2e/41/aa2e4145e7e90eca06eac77d3b42be48.jpg") : (employeeInfo?.banner || "https://i.pinimg.com/originals/aa/2e/41/aa2e4145e7e90eca06eac77d3b42be48.jpg")}')` }}
                                    >


                                        {/* Hover Edit Overlay */}
                                        <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 opacity-0 group-hover/banner:opacity-100 transition-opacity cursor-pointer text-white text-xs font-semibold z-10">
                                            <div className="w-10 h-10 rounded-none bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                                                <Pencil className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="tracking-widest uppercase text-[10px]">{isEditingProfile ? "Upload Custom Banner" : "Edit Profile Banner"}</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        if (file.size > 3 * 1024 * 1024) {
                                                            setSettingsError("File is too large. Please select a banner image smaller than 3MB.");
                                                            return;
                                                        }
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            if (typeof reader.result === "string") {
                                                                setSettingsBanner(reader.result);
                                                                if (!isEditingProfile) setIsEditingProfile(true);
                                                            }
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                        </label>

                                        {/* Action buttons — frosted glass, top-right */}
                                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex flex-wrap justify-end gap-1.5 sm:gap-2 z-20 max-w-[calc(100%-2rem)]">
                                            <button
                                                onClick={() => setIsEditingProfile(true)}
                                                className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/15 text-white font-bold text-[10px] sm:text-[11px] rounded-none transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-lg"
                                            >
                                                <Pencil className="w-3 h-3" /> Edit Profile
                                            </button>
                                            <button
                                                onClick={() => setIsChangePasswordModalOpen(true)}
                                                className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/15 text-white font-bold text-[10px] sm:text-[11px] rounded-none transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-lg"
                                            >
                                                <KeyRound className="w-3 h-3" /> Change Password
                                            </button>
                                        </div>

                                        {/* Name + role overlaid at bottom-left of banner */}
                                        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 sm:px-6 sm:pb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 z-10 pt-16 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                            {/* Avatar with glowing ring */}
                                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-none shrink-0 ring-4 ring-black/60 bg-black overflow-hidden shadow-2xl group">
                                                <img
                                                    src={employeeInfo?.avatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=Oliver"}
                                                    alt="Avatar"
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    onClick={() => setIsEditingProfile(true)}
                                                    className="absolute inset-0 bg-black/55 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white cursor-pointer rounded-none"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            {/* Name + tags */}
                                            <div className="min-w-0">
                                                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-none drop-shadow-md">{employeeInfo?.name}</h2>
                                                <div className="flex items-center gap-2 flex-wrap mt-2">
                                                    {employeeInfo?.role && (
                                                        <span className="bg-[#E61E32]/80 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-2.5 rounded-none tracking-widest uppercase shadow-md">
                                                            {employeeInfo.role}
                                                        </span>
                                                     )}
                                                     {employeeInfo?.division && (
                                                        <span className="bg-white/10 backdrop-blur-sm text-white/80 text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 sm:px-2.5 rounded-none border border-white/20 whitespace-nowrap">
                                                             {employeeInfo.division}
                                                         </span>
                                                     )}
                                                     {employeeInfo?.college && (
                                                         <span className="flex items-center gap-1 text-[9px] sm:text-[10px] text-white/60 font-semibold whitespace-nowrap drop-shadow">
                                                             <Building className="w-3 h-3 text-[#E61E32]" />
                                                             {employeeInfo.college}
                                                         </span>
                                                     )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>




                                    {/* Navigation Sub-Tabs */}
                                    <div className="border border-white/5 bg-white/[0.02] backdrop-blur-md px-4 py-2 flex gap-2 shrink-0 rounded-none mb-4 items-center overflow-x-auto scrollbar-none">
                                        {[
                                            { id: "summary", label: "Summary" },
                                            { id: "stats", label: "Stats" },
                                            { id: "worked-on", label: "Worked on" },
                                            { id: "journey", label: "My Journey" },
                                            { id: "activity", label: "Activity" }
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                onClick={() => {
                                                    setActiveProfileTab(t.id);
                                                    setIsEditingProfile(false);
                                                }}
                                                className={`px-4 py-2 text-xs font-bold rounded-none transition-all cursor-pointer ${
                                                    activeProfileTab === t.id && !isEditingProfile
                                                        ? "bg-[#E61E32] text-white shadow-md shadow-[#E61E32]/10"
                                                        : "text-white/40 hover:text-white hover:bg-white/5"
                                                }`}
                                            >
                                                {t.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Sub-Tab Contents */}
                                    <div className="flex-1">
                                        {isEditingProfile ? (
                                            <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6 text-slate-200">
                                                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 rounded-none bg-[#E61E32]/10 border border-[#E61E32]/25 flex items-center justify-center text-[#E61E32]">
                                                            <User className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-sm font-bold text-white">Edit Profile Details</h3>
                                                            <p className="text-[10px] text-white/40 font-medium mt-0.5">Update your personal and professional profile details inline</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Error and Success Alerts */}
                                                {settingsError && (
                                                    <div className="bg-[#E61E32]/10 border border-[#E61E32]/20 text-[#E61E32] text-xs p-4 rounded-none flex items-center gap-2">
                                                        <AlertTriangle className="w-4 h-4 shrink-0" />
                                                        <span>{settingsError}</span>
                                                    </div>
                                                )}
                                                {settingsSuccess && (
                                                    <div className="bg-green-500/10 border border-green-500/20 text-green-500 text-xs p-4 rounded-none flex items-center gap-2">
                                                        <CheckCheck className="w-4 h-4 shrink-0" />
                                                        <span>{settingsSuccess}</span>
                                                    </div>
                                                )}

                                                <form onSubmit={handleSaveSettings} className="space-y-6 text-left">
                                                    {/* Avatar System */}
                                                    <div className="space-y-3">
                                                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">Profile Avatar Selection</label>
                                                        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-white/[0.02] border border-white/5 rounded-none">
                                                            {/* Large Preview */}
                                                            <div className="relative w-20 h-20 rounded-none border border-white/10 overflow-hidden bg-black flex items-center justify-center shrink-0">
                                                                <img 
                                                                    src={settingsAvatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=Oliver"} 
                                                                    alt="Current Avatar Preview" 
                                                                    className="w-full h-full object-cover" 
                                                                />
                                                            </div>
                                                            <div className="flex-1 space-y-3">
                                                                <div className="grid grid-cols-6 gap-2">
                                                                    {[
                                                                        "https://api.dicebear.com/7.x/adventurer/svg?seed=Oliver",
                                                                        "https://api.dicebear.com/7.x/adventurer/svg?seed=Sam",
                                                                        "https://api.dicebear.com/7.x/adventurer/svg?seed=Jack",
                                                                        "https://api.dicebear.com/7.x/adventurer/svg?seed=Lily",
                                                                        "https://api.dicebear.com/7.x/adventurer/svg?seed=Bella",
                                                                        "https://api.dicebear.com/7.x/adventurer/svg?seed=Coco"
                                                                    ].map((avatarUrl, idx) => (
                                                                        <button
                                                                            key={idx}
                                                                            type="button"
                                                                            onClick={() => setSettingsAvatar(avatarUrl)}
                                                                            className={`w-10 h-10 rounded-none overflow-hidden border bg-white/5 hover:scale-105 transition-all ${
                                                                                settingsAvatar === avatarUrl ? "border-[#E61E32] ring-2 ring-[#E61E32]" : "border-white/10"
                                                                            }`}
                                                                        >
                                                                            <img src={avatarUrl} alt="Avatar option" className="w-full h-full object-cover" />
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <label className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-[10px] font-bold uppercase tracking-wider rounded-none cursor-pointer flex items-center gap-1.5 transition-colors">
                                                                        <Upload className="w-3.5 h-3.5" />
                                                                        Upload Custom Photo
                                                                        <input 
                                                                            type="file" 
                                                                            accept="image/*" 
                                                                            className="hidden" 
                                                                            onChange={(e) => {
                                                                                const file = e.target.files?.[0];
                                                                                if (file) {
                                                                                    if (file.size > 2 * 1024 * 1024) {
                                                                                        setSettingsError("File is too large. Please select an image smaller than 2MB.");
                                                                                        return;
                                                                                    }
                                                                                    const reader = new FileReader();
                                                                                    reader.onloadend = () => {
                                                                                        if (typeof reader.result === "string") {
                                                                                            setSettingsAvatar(reader.result);
                                                                                        }
                                                                                    };
                                                                                    reader.readAsDataURL(file);
                                                                                }
                                                                            }}
                                                                        />
                                                                    </label>
                                                                    <span className="text-[9px] text-white/30">PNG/JPG up to 2MB</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
 
                                                    {/* Profile Banner Image */}
                                                    <div className="space-y-3">
                                                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">Profile Banner Image</label>
                                                        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-white/[0.02] border border-white/5 rounded-none">
                                                            <div className="relative w-full sm:w-48 h-20 rounded-none border border-white/10 overflow-hidden bg-black flex items-center justify-center shrink-0">
                                                                <img 
                                                                    src={settingsBanner || "https://i.pinimg.com/originals/aa/2e/41/aa2e4145e7e90eca06eac77d3b42be48.jpg"} 
                                                                    alt="Current Banner Preview" 
                                                                    className="w-full h-full object-cover" 
                                                                />
                                                            </div>
                                                            <div className="flex-1 space-y-3">
                                                                <div className="flex items-center gap-3">
                                                                    <label className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-[10px] font-bold uppercase tracking-wider rounded-none cursor-pointer flex items-center gap-1.5 transition-colors">
                                                                        <Upload className="w-3.5 h-3.5" />
                                                                        Upload Custom Banner
                                                                        <input 
                                                                            type="file" 
                                                                            accept="image/*" 
                                                                            className="hidden" 
                                                                            onChange={(e) => {
                                                                                const file = e.target.files?.[0];
                                                                                if (file) {
                                                                                    if (file.size > 3 * 1024 * 1024) {
                                                                                        setSettingsError("File is too large. Please select a banner image smaller than 3MB.");
                                                                                        return;
                                                                                    }
                                                                                    const reader = new FileReader();
                                                                                    reader.onloadend = () => {
                                                                                        if (typeof reader.result === "string") {
                                                                                            setSettingsBanner(reader.result);
                                                                                        }
                                                                                    };
                                                                                    reader.readAsDataURL(file);
                                                                                }
                                                                            }}
                                                                        />
                                                                    </label>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setSettingsBanner("")}
                                                                        className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-[10px] font-bold uppercase tracking-wider rounded-none cursor-pointer flex items-center gap-1.5 transition-colors bg-transparent"
                                                                    >
                                                                        Reset Default
                                                                    </button>
                                                                    <span className="text-[9px] text-white/30">PNG/JPG up to 3MB</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Inputs Grid */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {/* Name */}
                                                        <div className="space-y-1.5 text-left">
                                                            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">Full Name</label>
                                                            <input 
                                                                type="text" 
                                                                value={settingsName}
                                                                onChange={(e) => setSettingsName(e.target.value)}
                                                                required
                                                                className="w-full bg-[#121212] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E61E32] transition-colors rounded-none"
                                                                placeholder="John Doe"
                                                            />
                                                        </div>

                                                        {/* Bio */}
                                                        <div className="space-y-1.5 text-left">
                                                            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">Bio / Role Description</label>
                                                            <input 
                                                                type="text" 
                                                                value={settingsBio}
                                                                onChange={(e) => setSettingsBio(e.target.value)}
                                                                className="w-full bg-[#121212] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E61E32] transition-colors rounded-none"
                                                                placeholder="Senior UI Designer & Developer"
                                                            />
                                                        </div>

                                                        {/* College */}
                                                        <div className="space-y-1.5 text-left">
                                                            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">College / Institution</label>
                                                            <input 
                                                                type="text" 
                                                                value={settingsCollege}
                                                                onChange={(e) => setSettingsCollege(e.target.value)}
                                                                className="w-full bg-[#121212] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E61E32] transition-colors rounded-none"
                                                                placeholder="Indian Institute of Technology"
                                                            />
                                                        </div>

                                                        {/* Division (Read-only, given by Admin directly) */}
                                                        <div className="space-y-1.5 text-left">
                                                            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">Division</label>
                                                            <input 
                                                                type="text" 
                                                                value={employeeInfo?.division || ""} 
                                                                disabled
                                                                className="w-full bg-[#121212]/50 border border-white/5 px-3.5 py-2.5 text-xs text-white/40 cursor-not-allowed rounded-none"
                                                                placeholder="Not Assigned"
                                                            />
                                                        </div>

                                                        {/* Phone */}
                                                        <div className="space-y-1.5 text-left">
                                                            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">Phone Number</label>
                                                            <input 
                                                                type="text" 
                                                                value={settingsPhone}
                                                                onChange={(e) => setSettingsPhone(e.target.value)}
                                                                className="w-full bg-[#121212] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E61E32] transition-colors rounded-none"
                                                                placeholder="+91 98765 43210"
                                                            />
                                                        </div>

                                                        {/* Alternate Email */}
                                                        <div className="space-y-1.5 text-left">
                                                            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">Alternate Email</label>
                                                            <input 
                                                                type="email" 
                                                                value={settingsAltEmail}
                                                                onChange={(e) => setSettingsAltEmail(e.target.value)}
                                                                className="w-full bg-[#121212] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E61E32] transition-colors rounded-none"
                                                                placeholder="alt@example.com"
                                                            />
                                                        </div>

                                                        {/* Mobile */}
                                                        <div className="space-y-1.5 text-left">
                                                            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">Emergency Mobile</label>
                                                            <input 
                                                                type="text" 
                                                                value={settingsMobile}
                                                                onChange={(e) => setSettingsMobile(e.target.value)}
                                                                className="w-full bg-[#121212] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E61E32] transition-colors rounded-none"
                                                                placeholder="Emergency contact"
                                                            />
                                                        </div>

                                                        {/* UPI ID */}
                                                        <div className="space-y-1.5 text-left">
                                                            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">UPI ID (for payments)</label>
                                                            <input 
                                                                type="text" 
                                                                value={settingsUpiId}
                                                                onChange={(e) => setSettingsUpiId(e.target.value)}
                                                                className="w-full bg-[#121212] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E61E32] transition-colors rounded-none"
                                                                placeholder="upi@bank"
                                                            />
                                                        </div>

                                                        {/* Father's Name */}
                                                        <div className="space-y-1.5 text-left">
                                                            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">Father&apos;s Name</label>
                                                            <input 
                                                                type="text" 
                                                                value={settingsFatherName}
                                                                onChange={(e) => setSettingsFatherName(e.target.value)}
                                                                className="w-full bg-[#121212] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E61E32] transition-colors rounded-none"
                                                                placeholder="Father's Full Name"
                                                            />
                                                        </div>

                                                        {/* Address */}
                                                        <div className="space-y-1.5 text-left md:col-span-2">
                                                            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">Permanent Address</label>
                                                            <textarea 
                                                                value={settingsAddress}
                                                                onChange={(e) => setSettingsAddress(e.target.value)}
                                                                rows={2}
                                                                className="w-full bg-[#121212] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E61E32] transition-colors rounded-none resize-none leading-relaxed"
                                                                placeholder="123 Studio Street, Creative District, City"
                                                            />
                                                        </div>

                                                        {/* Portfolio Link */}
                                                        <div className="space-y-1.5 text-left md:col-span-2">
                                                            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">Portfolio Link</label>
                                                            <input 
                                                                type="text" 
                                                                value={settingsPortfolioLink}
                                                                onChange={(e) => setSettingsPortfolioLink(e.target.value)}
                                                                className="w-full bg-[#121212] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E61E32] transition-colors rounded-none"
                                                                placeholder="https://myportfolio.com"
                                                            />
                                                        </div>

                                                        {/* 5-Year Vision Statement */}
                                                        <div className="space-y-1.5 text-left md:col-span-2">
                                                            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">Where you want to see yourself in the next 5 years?</label>
                                                            <textarea 
                                                                value={settingsFutureGoals}
                                                                onChange={(e) => setSettingsFutureGoals(e.target.value)}
                                                                rows={3}
                                                                className="w-full bg-[#121212] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E61E32] transition-colors rounded-none resize-none leading-relaxed"
                                                                placeholder="Describe your career goals, next steps, and what you aim to master..."
                                                            />
                                                        </div>

                                                        {/* Social Media Links */}
                                                        <div className="space-y-2 md:col-span-2 text-left">
                                                            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">Social Media Links</label>
                                                            <div className="space-y-2">
                                                                {/* Existing links list */}
                                                                {settingsSocialLinks.map((link, idx) => (
                                                                    <div key={idx} className="flex items-center gap-2 bg-[#121212] border border-white/5 px-3 py-2 rounded-none">
                                                                        <Globe className="w-3.5 h-3.5 text-white/40" />
                                                                        <span className="text-xs text-white/80 flex-1 truncate">{link}</span>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setSettingsSocialLinks(prev => prev.filter((_, i) => i !== idx))}
                                                                            className="p-1 hover:bg-white/5 text-white/40 hover:text-[#E61E32] transition-colors rounded-none bg-transparent border-none cursor-pointer"
                                                                            title="Remove link"
                                                                        >
                                                                            <X className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                                
                                                                {/* Add new link input */}
                                                                <div className="flex gap-2">
                                                                    <input
                                                                        type="text"
                                                                        id="new-social-link-inline"
                                                                        placeholder="Enter social link (e.g. github.com/username)"
                                                                        className="flex-1 bg-[#121212] border border-white/10 px-3.5 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E61E32] transition-colors rounded-none"
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === "Enter") {
                                                                                e.preventDefault();
                                                                                const val = e.currentTarget.value.trim();
                                                                                if (val && !settingsSocialLinks.includes(val)) {
                                                                                    setSettingsSocialLinks(prev => [...prev, val]);
                                                                                    e.currentTarget.value = "";
                                                                                }
                                                                            }
                                                                        }}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const input = document.getElementById("new-social-link-inline") as HTMLInputElement;
                                                                            const val = input?.value.trim();
                                                                            if (val && !settingsSocialLinks.includes(val)) {
                                                                                setSettingsSocialLinks(prev => [...prev, val]);
                                                                                input.value = "";
                                                                            }
                                                                        }}
                                                                        className="px-4 py-2 bg-[#E61E32]/10 border border-[#E61E32]/35 hover:bg-[#E61E32]/20 text-[#E61E32] hover:text-white font-bold text-xs rounded-none transition-all cursor-pointer flex items-center gap-1.5"
                                                                    >
                                                                        <Plus className="w-3.5 h-3.5" /> Add Link
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsEditingProfile(false)}
                                                            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-bold text-xs uppercase tracking-widest rounded-none transition-colors cursor-pointer"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={isSavingSettings}
                                                            className="px-4 py-2.5 bg-[#E61E32] hover:bg-[#E61E32]/90 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-none transition-colors flex items-center gap-2 cursor-pointer"
                                                        >
                                                            {isSavingSettings ? "Saving..." : "Save Changes"}
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        ) : (
                                            <>
                                                {/* SUMMARY TAB */}
                                                {activeProfileTab === "summary" && (() => {
                                                    // Build heatmap data for the complete year 2026
                                                    const heatmapReport = getDailyAttendanceList(
                                                        attendanceHistory,
                                                        employeeInfo?.joinedAt,
                                                        new Date(2026, 0, 1),
                                                        new Date(2026, 11, 31)
                                                    );
                                                    // Sort oldest → newest for left-to-right display
                                                    const sortedReport = [...heatmapReport].sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
                                                    // Group by week (columns)
                                                    const weeks: typeof sortedReport[] = [];
                                                    let week: typeof sortedReport = [];
                                                    sortedReport.forEach((day, i) => {
                                                        const dow = day.rawDate.getDay(); // 0=Sun
                                                        if (i === 0 && dow !== 0) {
                                                            // pad start of first week with nulls
                                                            for (let p = 0; p < dow; p++) week.push(null as unknown as (typeof sortedReport)[0]);
                                                        }
                                                        week.push(day);
                                                        if (day.rawDate.getDay() === 6 || i === sortedReport.length - 1) {
                                                            if (i === sortedReport.length - 1 && day.rawDate.getDay() !== 6) {
                                                                // pad end of last week with nulls
                                                                const remaining = 6 - day.rawDate.getDay();
                                                                for (let p = 0; p < remaining; p++) week.push(null as unknown as (typeof sortedReport)[0]);
                                                            }
                                                            weeks.push(week);
                                                            week = [];
                                                        }
                                                    });
                                                    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                                                    return (
                                                    <div className="bg-white/[0.02] border border-white/5 p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 text-left rounded-none">
                                                        {/* Top Stacked: Bio + Goals */}
                                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                                                            {/* Left: Bio, Portfolio, Social */}
                                                            <div className="space-y-4">
                                                                <div className="space-y-1.5">
                                                                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                                        <User className="w-4 h-4 text-[#E61E32]" />
                                                                        About Me & Professional Bio
                                                                    </h3>
                                                                    <p className="text-xs text-white/60 leading-relaxed bg-white/[0.01] border border-white/5 p-3 rounded-none">
                                                                        {employeeInfo?.bio || "No profile bio has been written yet. Edit your profile to introduce yourself!"}
                                                                    </p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <p className="text-[10px] font-bold text-white/40 tracking-wider">Portfolio Website</p>
                                                                    {employeeInfo?.portfolioLink ? (
                                                                        <a href={employeeInfo.portfolioLink.startsWith("http") ? employeeInfo.portfolioLink : `https://${employeeInfo.portfolioLink}`} target="_blank" rel="noopener noreferrer" className="text-[#E61E32] hover:underline flex items-center gap-1 mt-1 text-xs font-semibold">
                                                                            <Globe className="w-3.5 h-3.5" />{employeeInfo.portfolioLink}<ExternalLink className="w-3 h-3" />
                                                                        </a>
                                                                    ) : <p className="text-xs text-white/30 italic mt-0.5">No portfolio link configured.</p>}
                                                                </div>
                                                                <div className="space-y-1.5">
                                                                    <p className="text-[10px] font-bold text-white/40 tracking-wider">Social Media Networks</p>
                                                                    {(() => {
                                                                        let links: string[] = [];
                                                                        try { if (employeeInfo?.socialLinks) links = JSON.parse(employeeInfo.socialLinks); } catch (e) {}
                                                                        return (
                                                                            <div className="flex flex-wrap gap-2 mt-1">
                                                                                {links.map((link, idx) => (
                                                                                    <a key={idx} href={link.startsWith("http") ? link : `https://${link}`} target="_blank" rel="noopener noreferrer" className="bg-white/5 border border-white/10 hover:border-white/20 px-2.5 py-1 rounded-none text-xs text-white/80 hover:text-white flex items-center gap-1.5 transition-all">
                                                                                        <Globe className="w-3.5 h-3.5 text-white/50" />
                                                                                        <span>{link.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]}</span>
                                                                                        <ExternalLink className="w-3 h-3 text-white/30" />
                                                                                    </a>
                                                                                ))}
                                                                                {links.length === 0 && <p className="text-xs text-white/30 italic mt-0.5">No social links configured.</p>}
                                                                            </div>
                                                                        );
                                                                    })()}
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="h-[1px] bg-white/5 w-full lg:hidden" />

                                                            {/* Right: 5 Year Vision */}
                                                            <div className="space-y-1.5">
                                                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                                    <Rocket className="w-4 h-4 text-[#E61E32]" />
                                                                    Where I Want to See Myself in Next 5 Years
                                                                </h3>
                                                                <div className="bg-white/[0.01] border border-white/5 p-3.5 rounded-none shadow-sm space-y-3">
                                                                    <p className="text-xs text-white/60 leading-relaxed italic">
                                                                        &ldquo;{employeeInfo?.futureGoals || "No vision goals declared yet. Edit your profile details to document your future milestones!"}&rdquo;
                                                                    </p>
                                                                    <div className="border-t border-white/5 pt-2 flex items-center gap-2 text-[9px] text-white/30">
                                                                        <span className="w-1.5 h-1.5 bg-[#E61E32]" />
                                                                        <span>Career Path Vision Statement</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="h-[1px] bg-white/5 w-full" />

                                                        {/* Attendance Heatmap */}
                                                        <div className="space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                                    <BarChart3 className="w-4 h-4 text-[#E61E32]" />
                                                                    Attendance Heatmap — 2026
                                                                </h3>
                                                                <div className="flex items-center gap-3 text-[10px] text-white/40">
                                                                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-none bg-emerald-500/80"></span>Present</span>
                                                                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-none bg-red-500/70"></span>Absent</span>
                                                                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-none bg-yellow-500/60"></span>Pending</span>
                                                                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-none bg-white/5 border border-white/10"></span>No data</span>
                                                                </div>
                                                            </div>
                                                            <div className="bg-white/[0.01] border border-white/5 rounded-none p-3.5 overflow-x-auto">
                                                                {(() => {
                                                                    const CELL = 16;
                                                                    const GAP = 3;
                                                                    const STEP = CELL + GAP;
                                                                    const LABEL_W = 28;
                                                                    const LABEL_H = 18;
                                                                    const svgW = LABEL_W + weeks.length * STEP;
                                                                    const svgH = LABEL_H + 7 * STEP;

                                                                    const cellColor = (status: string) => {
                                                                        if (status === 'Present') return '#22c55e';   // green
                                                                        if (status === 'Absent')  return '#ef4444';   // red
                                                                        if (status === 'Pending') return '#eab308';   // yellow
                                                                        return 'rgba(255,255,255,0.04)';
                                                                    };

                                                                    return (
                                                                        <svg
                                                                            width={svgW}
                                                                            height={svgH}
                                                                            viewBox={`0 0 ${svgW} ${svgH}`}
                                                                            className="overflow-visible"
                                                                            style={{ minWidth: svgW }}
                                                                        >
                                                                            {/* ── Grid lines (horizontal rows) ── */}
                                                                            {Array.from({ length: 8 }).map((_, ri) => (
                                                                                <line
                                                                                    key={`hr-${ri}`}
                                                                                    x1={LABEL_W}
                                                                                    y1={LABEL_H + ri * STEP - 1}
                                                                                    x2={LABEL_W + weeks.length * STEP}
                                                                                    y2={LABEL_H + ri * STEP - 1}
                                                                                    stroke="rgba(255,255,255,0.06)"
                                                                                    strokeWidth="1"
                                                                                />
                                                                            ))}
                                                                            {/* ── Grid lines (vertical columns) ── */}
                                                                            {Array.from({ length: weeks.length + 1 }).map((_, ci) => (
                                                                                <line
                                                                                    key={`vr-${ci}`}
                                                                                    x1={LABEL_W + ci * STEP - 1}
                                                                                    y1={LABEL_H}
                                                                                    x2={LABEL_W + ci * STEP - 1}
                                                                                    y2={LABEL_H + 7 * STEP}
                                                                                    stroke="rgba(255,255,255,0.06)"
                                                                                    strokeWidth="1"
                                                                                />
                                                                            ))}

                                                                            {/* ── Day labels (left column) ── */}
                                                                            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d, di) => (
                                                                                di % 2 !== 0 && (
                                                                                    <text
                                                                                        key={d}
                                                                                        x={LABEL_W - 4}
                                                                                        y={LABEL_H + di * STEP + CELL * 0.78}
                                                                                        textAnchor="end"
                                                                                        fontSize="9"
                                                                                        fill="rgba(255,255,255,0.25)"
                                                                                        fontFamily="monospace"
                                                                                    >{d}</text>
                                                                                )
                                                                            ))}

                                                                            {/* ── Week columns: month label + cells ── */}
                                                                            {weeks.map((wk, wi) => {
                                                                                const firstReal = wk.find(d => d != null);
                                                                                const monthLabel = wk.find(d => d && d.rawDate.getDate() === 1);
                                                                                const showLabel = wi === 0 ? firstReal : monthLabel;
                                                                                const labelDate = wi === 0 ? firstReal : monthLabel;
                                                                                return (
                                                                                    <g key={wi}>
                                                                                        {/* Month label */}
                                                                                        {showLabel && labelDate && (
                                                                                            <text
                                                                                                x={LABEL_W + wi * STEP}
                                                                                                y={LABEL_H - 4}
                                                                                                fontSize="9"
                                                                                                fill="rgba(255,255,255,0.25)"
                                                                                                fontFamily="monospace"
                                                                                            >
                                                                                                {labelDate.rawDate.toLocaleString('default', { month: 'short' })}
                                                                                            </text>
                                                                                        )}
                                                                                        {/* 7 day cells */}
                                                                                        {Array.from({ length: 7 }).map((_, di) => {
                                                                                            const cell = wk[di];
                                                                                            const x = LABEL_W + wi * STEP;
                                                                                            const y = LABEL_H + di * STEP;
                                                                                            const fill = cell ? cellColor(cell.status) : 'rgba(255,255,255,0.04)';
                                                                                            const opacity = cell?.status === 'Present' ? 0.85 : cell?.status === 'Absent' ? 0.75 : cell?.status === 'Pending' ? 0.7 : 1;
                                                                                            return (
                                                                                                <rect
                                                                                                    key={di}
                                                                                                    x={x}
                                                                                                    y={y}
                                                                                                    width={CELL}
                                                                                                    height={CELL}
                                                                                                    rx="2"
                                                                                                    fill={fill}
                                                                                                    opacity={opacity}
                                                                                                    className="cursor-default transition-opacity hover:opacity-100"
                                                                                                >
                                                                                                    {cell && (
                                                                                                        <title>{cell.dateStr} — {cell.status}{cell.punchIn !== '-' ? ` · In: ${cell.punchIn}` : ''}</title>
                                                                                                    )}
                                                                                                </rect>
                                                                                            );
                                                                                        })}
                                                                                    </g>
                                                                                );
                                                                            })}
                                                                        </svg>
                                                                    );
                                                                })()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    );
                                                })()}

                                                {/* STATS TAB */}
                                                {activeProfileTab === "stats" && (
                                                    <div className="p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
                                                        {/* Left Circular Progress Card */}
                                                        <div className="lg:col-span-1 flex flex-col items-center justify-start">
                                                            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-none w-full max-w-[240px] mx-auto lg:mx-0 flex flex-col items-center justify-center shadow-sm">
                                                                <div className="relative flex items-center justify-center">
                                                                    <svg height="110" width="110" className="transform -rotate-90">
                                                                        <circle stroke="rgba(255,255,255,0.05)" fill="transparent" strokeWidth="8" r="44" cx="55" cy="55" />
                                                                        <circle
                                                                            stroke="#E61E32"
                                                                            fill="transparent"
                                                                            strokeWidth="8"
                                                                            strokeDasharray={`${2 * Math.PI * 44}`}
                                                                            style={{
                                                                                strokeDashoffset: `${2 * Math.PI * 44 - (attendancePercent / 100) * 2 * Math.PI * 44}`,
                                                                                transition: 'stroke-dashoffset 0.35s'
                                                                            }}
                                                                            strokeLinecap="round"
                                                                            r="44"
                                                                            cx="55"
                                                                            cy="55"
                                                                        />
                                                                    </svg>
                                                                    <div className="absolute text-2xl font-bold text-white">{attendancePercent}%</div>
                                                                </div>
                                                                <div className="text-center mt-4 space-y-0.5">
                                                                    <p className="text-[10px] font-bold text-white/40 tracking-wider">Attendance</p>
                                                                    <p className="text-xs font-semibold text-white/70">My progress</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Right Stats Grid */}
                                                        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            {/* Streak */}
                                                            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-none space-y-3 shadow-sm hover:border-white/10 transition-colors">
                                                                <div className="w-8 h-8 rounded-none bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-400">
                                                                    <Flame className="w-4 h-4 fill-current" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-white/40 tracking-wider">Current Streak</p>
                                                                    <h4 className="text-2xl font-bold text-white mt-1">{streakCount} days</h4>
                                                                    <p className="text-[10px] text-white/30 font-medium mt-0.5">Consecutive login</p>
                                                                </div>
                                                            </div>
                                                            {/* Working Days */}
                                                            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-none space-y-3 shadow-sm hover:border-white/10 transition-colors">
                                                                <div className="w-8 h-8 rounded-none bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
                                                                    <Calendar className="w-4 h-4" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-white/40 tracking-wider">Working Days</p>
                                                                    <h4 className="text-2xl font-bold text-white mt-1">{workingCount}</h4>
                                                                    <p className="text-[10px] text-white/30 font-medium mt-0.5">Tracked days</p>
                                                                </div>
                                                            </div>
                                                            {/* Days Present */}
                                                            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-none space-y-3 shadow-sm hover:border-white/10 transition-colors">
                                                                <div className="w-8 h-8 rounded-none bg-green-500/10 flex items-center justify-center border border-green-500/20 text-green-400">
                                                                    <CheckCircle2 className="w-4 h-4" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-white/40 tracking-wider">Days Present</p>
                                                                    <h4 className="text-2xl font-bold text-white mt-1">{presentCount}</h4>
                                                                    <p className="text-[10px] text-white/30 font-medium mt-0.5">Present days</p>
                                                                </div>
                                                            </div>
                                                            {/* Leaves */}
                                                            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-none space-y-3 shadow-sm hover:border-white/10 transition-colors">
                                                                <div className="w-8 h-8 rounded-none bg-pink-500/10 flex items-center justify-center border border-pink-500/20 text-pink-400">
                                                                    <Clock className="w-4 h-4" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-white/40 tracking-wider">Leaves</p>
                                                                    <h4 className="text-2xl font-bold text-white mt-1">{approvedLeavesCount}</h4>
                                                                    <p className="text-[10px] text-white/30 font-medium mt-0.5">Official leaves</p>
                                                                </div>
                                                            </div>
                                                            {/* Late Arrivals */}
                                                            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-none space-y-3 shadow-sm hover:border-white/10 transition-colors">
                                                                <div className="w-8 h-8 rounded-none bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 text-yellow-400">
                                                                    <Clock className="w-4 h-4" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-white/40 tracking-wider">Late Arrivals</p>
                                                                    <h4 className="text-2xl font-bold text-white mt-1">{lateCount}</h4>
                                                                    <p className="text-[10px] text-white/30 font-medium mt-0.5">Late days</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                        {/* WORKED ON TAB */}
                                        {activeProfileTab === "worked-on" && (
                                            <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
                                                <div>
                                                    <div className="flex justify-between items-center mb-4">
                                                        <div>
                                                            <h3 className="text-base font-bold text-white">Worked on</h3>
                                                            <p className="text-xs text-white/40 mt-0.5">Others will only see what they can access.</p>
                                                        </div>
                                                        <button 
                                                            onClick={() => setActiveTab("tasks")} 
                                                            className="text-xs font-bold text-[#E61E32] hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none"
                                                        >
                                                            View all <ExternalLink className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    
                                                    <div className="bg-white/[0.01] border border-white/5 rounded-none overflow-hidden shadow-sm">
                                                        <div className="divide-y divide-white/5">
                                                            {employeeTasks.slice(0, 5).map((task) => (
                                                                <div key={task.id} className="p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                                                                    <div className="w-9 h-9 rounded-none bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400 shrink-0">
                                                                        <FileText className="w-4.5 h-4.5" />
                                                                    </div>
                                                                    <div className="min-w-0 flex-1 text-left">
                                                                        <p className="text-xs font-bold text-white/90 truncate">{task.title}</p>
                                                                        <p className="text-[10px] text-white/35 font-semibold mt-0.5">
                                                                            {task.status.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())} • {task.deadline ? `Due ${new Date(task.deadline).toLocaleDateString()}` : "No deadline"}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {employeeTasks.length === 0 && (
                                                                <div className="p-8 text-center text-white/40 text-xs font-medium">No assigned tasks found.</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <h3 className="text-base font-bold text-white mb-4">Places you work in</h3>
                                                        <div className="bg-white/[0.02] border border-white/5 p-5 rounded-none shadow-sm flex items-center gap-4 hover:border-white/10 transition-all">
                                                            <div className="w-10 h-10 rounded-none bg-[#E61E32]/10 border border-[#E61E32]/20 flex items-center justify-center text-[#E61E32] font-black text-xs shrink-0">
                                                                RX
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="text-[10px] text-white/40 font-bold tracking-wider">Workspace</p>
                                                                <p className="text-xs font-bold text-white/90 mt-0.5">Redlix Studio Portal</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div>
                                                        <h3 className="text-base font-bold text-white mb-4">Works with</h3>
                                                        <div className="flex flex-wrap gap-2.5">
                                                            {uniqueCollaborators.slice(0, 8).map((collab) => (
                                                                <div
                                                                    key={collab.id}
                                                                    className="bg-white/[0.02] border border-white/5 pl-2.5 pr-3 py-1.5 rounded-none flex items-center gap-2 text-xs font-bold text-white/70 shadow-sm"
                                                                    title={collab.role}
                                                                >
                                                                    <div className="w-5.5 h-5.5 rounded-none bg-[#E61E32]/10 border border-[#E61E32]/25 flex items-center justify-center text-[#E61E32] text-[9px] font-black shrink-0">
                                                                        {collab.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                                                                    </div>
                                                                    <span>{collab.name}</span>
                                                                </div>
                                                            ))}
                                                            {uniqueCollaborators.length === 0 && (
                                                                <div className="bg-white/[0.02] border border-white/5 px-4 py-2.5 rounded-none text-xs text-white/40 font-semibold w-full text-center">
                                                                    No team collaborators found.
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* MY JOURNEY TAB */}
                                        {activeProfileTab === "journey" && (
                                            <div className="p-4 sm:p-8 text-left max-w-xl mx-auto">
                                                <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
                                                    <Sparkles className="w-4.5 h-4.5 text-[#E61E32]" />
                                                    My Journey at Redlix Studio
                                                </h3>
                                                
                                                <div className="relative border-l-2 border-white/5 pl-6 space-y-8 ml-3">
                                                    <div className="relative">
                                                        <div className="absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-none bg-[#0b0b0b] border-4 border-[#E61E32] shadow-sm flex items-center justify-center" />
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-bold text-white/40 tracking-wider">
                                                                {employeeInfo?.joinedAt ? new Date(employeeInfo.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : "June 2026"}
                                                            </p>
                                                            <p className="text-xs font-bold text-white/90">Joined Redlix Studio</p>
                                                            <p className="text-xs text-white/50">Began career journey as a {employeeInfo?.role || "Team Member"}.</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="relative">
                                                        <div className="absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-none bg-[#0b0b0b] border-4 border-white/10 shadow-sm flex items-center justify-center" />
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-bold text-white/40 tracking-wider">Onboarding Milestone</p>
                                                            <p className="text-xs font-bold text-white/90">Onboarding & Setup Complete</p>
                                                            <p className="text-xs text-white/50">Completed portal registration, set up profile details, and verified credentials.</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="relative">
                                                        <div className="absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-none bg-[#0b0b0b] border-4 border-white/10 shadow-sm flex items-center justify-center" />
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-bold text-white/40 tracking-wider">Active Contributions</p>
                                                            <p className="text-xs font-bold text-white/90">Assigned Gigs Progress</p>
                                                            <p className="text-xs text-white/50">Successfully contributed to active projects and closed {employeeTasks.filter(t => t.status === 'completed').length} client deliverables.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* ACTIVITY TAB */}
                                        {activeProfileTab === "activity" && (
                                            <div className="p-4 sm:p-8 text-left max-w-xl mx-auto space-y-6">
                                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                                    <Clock className="w-4.5 h-4.5 text-[#E61E32]" />
                                                    Recent Activity Logs
                                                </h3>
                                                
                                                <div className="space-y-4">
                                                    {report.slice(0, 10).map((att, idx) => (
                                                        <div key={idx} className="flex gap-4 items-start p-4 bg-white/[0.02] border border-white/5 rounded-none shadow-sm">
                                                            <div className={`w-8 h-8 rounded-none flex items-center justify-center shrink-0 border ${
                                                                att.status === "Present" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"
                                                            }`}>
                                                                <Clock className="w-4 h-4" />
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-xs font-bold text-white/90">{att.dateStr}</p>
                                                                <p className="text-[10px] text-white/50 mt-0.5">
                                                                    Status: <span className="font-bold">{att.status}</span> ({att.statusReason})
                                                                </p>
                                                                <p className="text-[10px] text-white/35 font-semibold">
                                                                    Logged check-in: {att.punchIn} | check-out: {att.punchOut}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {report.length === 0 && (
                                                        <div className="py-8 text-center text-white/40 text-xs font-medium">No recent activities recorded.</div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                                    </div>
                                </div>
                            );
                        })()}

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
                                    <div id="tour-leaves-form" className="bg-white/5 border border-white/5 p-6 rounded-xl">
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
                            <div className="space-y-6 h-full flex flex-col overflow-y-auto pr-2 pb-6 animate-in fade-in duration-500 relative w-full">
                                {/* Top Header Bar */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 w-full">
                                    <div>
                                        <h2 className="text-lg font-bold text-white">Community Standups</h2>
                                        <p className="text-xs text-white/40 mt-1">See what you and others completed today</p>
                                    </div>
                                    <button
                                        onClick={() => setIsStandupModalOpen(true)}
                                        className="bg-[#E61E32] hover:bg-[#C81428] text-white px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-colors duration-200 rounded-none flex items-center justify-center gap-2 self-start sm:self-auto shadow-md"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                        + Write Daily Standup
                                    </button>
                                </div>

                                {/* Feed of Cards */}
                                <div id="tour-community-feed" className="bg-white/5 border border-white/5 p-6 flex flex-col rounded-none max-w-2xl mx-auto w-full">
                                    <div className="mb-4 shrink-0 flex justify-between items-center">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-white/40">Today&apos;s Standups</h3>
                                        <span className="text-[10px] text-white/30 bg-white/5 px-2 py-0.5 border border-white/5 rounded-none">{communityUpdates.length} updates</span>
                                    </div>

                                    <div className="space-y-4">
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

                                                return (
                                                    <div key={update.id} className="bg-[#0c0c0c]/85 border border-white/10 p-5 rounded-none flex flex-col gap-4 hover:bg-[#0c0c0c] transition-all duration-200 group text-left relative w-full">
                                                        {/* Top row: profile & handles & X Logo */}
                                                        <div className="flex justify-between items-start gap-4">
                                                            <div className="flex gap-3 min-w-0">
                                                                <div className="w-10 h-10 rounded-none bg-[#E61E32]/10 border border-[#E61E32]/25 flex items-center justify-center text-[#E61E32] font-black text-sm uppercase shrink-0">
                                                                    {initials}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                                        <span className="font-bold text-white text-xs hover:underline cursor-pointer flex items-center gap-1">
                                                                            {update.employee?.name}
                                                                            <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-green-500 text-white select-none">
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
                                                            <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                                                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-white/35 hover:text-white transition-colors shrink-0">
                                                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                                </svg>
                                                            </a>
                                                        </div>

                                                        {/* Standup Content Area */}
                                                        <div className="space-y-3.5 text-xs">
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
                                                                    className="block border border-white/10 rounded-none overflow-hidden hover:border-[#E61E32]/35 transition-all bg-white/[0.01] hover:bg-white/[0.03] max-w-md cursor-pointer"
                                                                >
                                                                    <div className="p-3 flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-none bg-white/5 border border-white/5 flex items-center justify-center text-[#E61E32] shrink-0">
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
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="py-20 text-center border border-dashed border-white/5 rounded-none">
                                                <p className="text-white/20 text-xs">No standups shared today yet.</p>
                                                <p className="text-white/10 text-[10px] mt-1">Be the first to share your progress!</p>
                                            </div>
                                        )}
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
                                        <div className="relative bg-[#0b0b0b] border border-white/10 w-full max-w-lg p-6 rounded-none shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 z-10 text-left">
                                            <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-none bg-[#E61E32]/10 border border-[#E61E32]/25 flex items-center justify-center text-[#E61E32]">
                                                        <Send className="w-3.5 h-3.5" />
                                                    </div>
                                                    <h3 className="text-xs font-bold uppercase tracking-widest text-white">Create Standup Update</h3>
                                                </div>
                                                <button 
                                                    onClick={() => setIsStandupModalOpen(false)} 
                                                    className="text-white/40 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-none"
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
                                                        className="w-full bg-[#121212] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E61E32] transition-colors rounded-none resize-none leading-relaxed"
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
                                                        className="w-full bg-[#121212] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E61E32] transition-colors rounded-none resize-none leading-relaxed"
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
                                                        className="w-full bg-[#121212] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E61E32] transition-colors rounded-none resize-none leading-relaxed"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">Document/Resource Link (Optional)</label>
                                                    <input
                                                        type="text"
                                                        value={docLink}
                                                        onChange={(e) => setDocLink(e.target.value)}
                                                        placeholder="e.g., github.com/pulls or Figma link..."
                                                        className="w-full bg-[#121212] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E61E32] transition-colors rounded-none"
                                                    />
                                                </div>
                                                <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsStandupModalOpen(false)}
                                                        className="px-4 py-2 text-xs font-semibold text-white/60 hover:text-white bg-white/5 border border-white/5 hover:bg-white/10 transition-colors rounded-none"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={submittingCommunityUpdate || !tasksDone.trim() || !learnt.trim() || !gained.trim()}
                                                        className="px-5 py-2 bg-[#E61E32] hover:bg-[#C81428] text-white text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50 rounded-none flex items-center gap-1.5"
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
                            <div className="space-y-6 h-auto lg:h-full animate-in fade-in duration-500 overflow-visible lg:overflow-y-auto pr-2">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-white">Client Declarations</h2>
                                        <p className="text-xs text-white/40 mt-1">Upload client declaration documents — PDFs, images, or Word files. Admin will review them.</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-white/30 bg-white/5 border border-white/10 px-3 py-2 rounded-lg self-start sm:self-auto shrink-0">
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
                                        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center transition-all duration-200 cursor-pointer group ${
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
                                                <div key={decl.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 bg-white/[0.02] border border-white/8 rounded-xl hover:border-white/15 transition-all">
                                                    <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                                                        <div className="w-9 h-9 rounded-xl bg-[#E61E32]/10 border border-[#E61E32]/20 flex items-center justify-center shrink-0">
                                                            <FileText className="w-4 h-4 text-[#E61E32]" />
                                                        </div>
                                                        <div className="min-w-0 flex-grow">
                                                            <p className="text-sm font-semibold text-white truncate">{decl.fileName}</p>
                                                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                                {decl.clientName && (
                                                                    <span className="text-[10px] text-white/40">Client: {decl.clientName}</span>
                                                                )}
                                                                {decl.notes && (
                                                                    <span className="text-[10px] text-white/30 truncate max-w-[140px] sm:max-w-[200px]" title={decl.notes}>{decl.notes}</span>
                                                                )}
                                                                <span className="text-[10px] text-white/20">{(decl.fileSize / 1024).toFixed(1)} KB</span>
                                                                <span className="text-[10px] text-white/20">{new Date(decl.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 mt-1 sm:mt-0 flex-wrap">
                                                        {decl.fileData && (
                                                            <button
                                                                onClick={() => setPreviewFile({ name: decl.fileName, type: decl.fileType, data: decl.fileData! })}
                                                                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-full border text-white/50 bg-white/5 border-white/10 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                                                                title="Preview document"
                                                            >
                                                                <Eye className="w-3 h-3" /> Preview
                                                            </button>
                                                        )}
                                                        {decl.fileData && (
                                                            <a
                                                                href={decl.fileData}
                                                                download={decl.fileName}
                                                                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-full border text-white/50 bg-white/5 border-white/10 hover:bg-white/10 hover:text-white transition-all"
                                                                title="Download file"
                                                            >
                                                                <Download className="w-3 h-3" /> Download
                                                            </a>
                                                        )}
                                                        {decl.status === "reviewed" ? (
                                                            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1.5 rounded-full">
                                                                <CheckCheck className="w-3 h-3" /> Reviewed
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1.5 rounded-full">
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

                        {/* ─── WORK SUBMISSIONS TAB ─────────────────────────────── */}
                        {activeTab === "submissions" && (
                            <div className="space-y-6 h-auto lg:h-full animate-in fade-in duration-500 overflow-visible lg:overflow-y-auto pr-2 pb-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-white">Work Submissions</h2>
                                        <p className="text-xs text-white/40 mt-1">Submit completed website links and git repository URLs for review.</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-white/30 bg-white/5 border border-white/10 px-3 py-2 rounded-lg self-start sm:self-auto shrink-0">
                                        <Send className="w-3.5 h-3.5" />
                                        <span className="uppercase tracking-wider font-semibold">{submissions.length} Total Submissions</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                                    {/* Submission Form */}
                                    <div id="tour-submission-form" className="lg:col-span-1 bg-white/[0.02] border border-white/8 rounded-2xl p-6 space-y-4">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">New Submission</h3>
                                        <form onSubmit={handleSubmitWork} className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-white/60">Select Client</label>
                                                <select
                                                    value={submitClientId}
                                                    onChange={(e) => setSubmitClientId(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 px-3 py-2 text-xs focus:outline-none focus:border-[#E61E32] rounded-xl text-white appearance-none"
                                                >
                                                    <option value="" className="bg-[#111] text-white/40">Select a client...</option>
                                                    {clients.map((c) => (
                                                        <option key={c.id} value={c.id} className="bg-[#111] text-white">
                                                            {c.companyName} ({c.clientName})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-white/60">Website Link</label>
                                                <div className="relative">
                                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                                    <input
                                                        type="url"
                                                        placeholder="https://example.com"
                                                        value={submitWebsiteLink}
                                                        onChange={(e) => setSubmitWebsiteLink(e.target.value)}
                                                        className="w-full bg-white/5 border border-white/10 pl-10 pr-3 py-2 text-xs focus:outline-none focus:border-[#E61E32] rounded-xl text-white placeholder-white/20"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-white/60">Git Repository Link</label>
                                                <div className="relative">
                                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                                    <input
                                                        type="url"
                                                        placeholder="https://github.com/username/repo"
                                                        value={submitGitRepoLink}
                                                        onChange={(e) => setSubmitGitRepoLink(e.target.value)}
                                                        className="w-full bg-white/5 border border-white/10 pl-10 pr-3 py-2 text-xs focus:outline-none focus:border-[#E61E32] rounded-xl text-white placeholder-white/20"
                                                    />
                                                </div>
                                            </div>

                                            {submissionError && (
                                                <div className="flex items-center gap-2 text-xs text-[#E61E32] bg-[#E61E32]/10 border border-[#E61E32]/20 p-3 rounded-xl">
                                                    <AlertTriangle className="w-4 h-4 shrink-0" />
                                                    <span>{submissionError}</span>
                                                </div>
                                            )}

                                            {submissionSuccess && (
                                                <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 border border-green-500/20 p-3 rounded-xl">
                                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                                    <span>{submissionSuccess}</span>
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={isSubmittingWork}
                                                className="w-full flex items-center justify-center gap-2 bg-[#E61E32] hover:bg-[#E61E32]/90 text-white font-bold py-2 px-4 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                                            >
                                                {isSubmittingWork ? (
                                                    <>
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-3.5 h-3.5" />
                                                        Submit Work
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </div>

                                    {/* History List */}
                                    <div className="lg:col-span-2 bg-white/[0.02] border border-white/8 rounded-2xl p-6 space-y-4">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-white/50 flex items-center gap-2">
                                            <Briefcase className="w-4 h-4" />
                                            Submission History
                                            <span className="ml-auto text-white/20 font-normal normal-case tracking-normal">{submissions.length} total</span>
                                        </h3>

                                        {submissions.length === 0 ? (
                                            <div className="text-center py-12 space-y-2">
                                                <Send className="w-10 h-10 text-white/10 mx-auto" />
                                                <p className="text-sm text-white/20">No work submitted yet.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                                                {submissions.map((sub) => (
                                                    <div key={sub.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 bg-white/[0.02] border border-white/8 rounded-xl hover:border-white/15 transition-all">
                                                        <div className="min-w-0 flex-grow space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-sm font-semibold text-white truncate">{sub.client?.companyName}</p>
                                                                <span className="text-[10px] text-white/40">({sub.client?.clientName})</span>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-2 text-xs min-w-0">
                                                                    <span className="text-white/40 w-16 shrink-0">Website:</span>
                                                                    <a
                                                                        href={sub.websiteLink}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-400 hover:underline flex items-center gap-1 min-w-0 flex-1 overflow-hidden"
                                                                    >
                                                                        <Globe className="w-3.5 h-3.5 shrink-0" />
                                                                        <span className="truncate flex-1">{sub.websiteLink}</span>
                                                                        <ExternalLink className="w-3 h-3 shrink-0 text-white/30" />
                                                                    </a>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-xs min-w-0">
                                                                    <span className="text-white/40 w-16 shrink-0">Repository:</span>
                                                                    <a
                                                                        href={sub.gitRepoLink}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-400 hover:underline flex items-center gap-1 min-w-0 flex-1 overflow-hidden"
                                                                    >
                                                                        <Building className="w-3.5 h-3.5 shrink-0" />
                                                                        <span className="truncate flex-1">{sub.gitRepoLink}</span>
                                                                        <ExternalLink className="w-3 h-3 shrink-0 text-white/30" />
                                                                    </a>
                                                                </div>
                                                            </div>
                                                            <div className="text-[10px] text-white/20">
                                                                Submitted on {new Date(sub.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
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
                    className={`flex flex-col items-center justify-center gap-1 text-center transition-colors relative ${
                        activeTab === "tasks" && !isMobileMenuOpen ? "text-[#E61E32]" : "text-white/40 hover:text-white"
                    }`}
                >
                    <div className="relative">
                        <ListTodo className="w-5 h-5" />
                        {activeTasksCount > 0 && (
                            <span className="absolute -top-1.5 -right-2 text-[8px] px-1 bg-[#E61E32] text-white rounded-full font-bold scale-90">
                                {activeTasksCount}
                            </span>
                        )}
                    </div>
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
                    className={`flex flex-col items-center justify-center gap-1 text-center transition-colors relative ${
                        activeTab === "meetings" && !isMobileMenuOpen ? "text-[#E61E32]" : "text-white/40 hover:text-white"
                    }`}
                >
                    <div className="relative">
                        <Video className="w-5 h-5" />
                        {upcomingMeetingsCount > 0 && (
                            <span className="absolute -top-1.5 -right-2 text-[8px] px-1 bg-emerald-500 text-white rounded-full font-bold scale-90">
                                {upcomingMeetingsCount}
                            </span>
                        )}
                    </div>
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
                                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                        activeTab === "documents"
                                            ? "bg-[#E61E32]/10 border-[#E61E32]/20 text-[#E61E32]"
                                            : "bg-white/[0.02] border-white/5 text-white/70 hover:border-white/10"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-4 h-4" />
                                        <span className="text-xs font-semibold">Documents</span>
                                    </div>
                                    {documentsCount > 0 && (
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-white/5 border border-white/10 text-white/40 rounded-full shrink-0">
                                            {documentsCount}
                                        </span>
                                    )}
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
                                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                        activeTab === "leaves"
                                            ? "bg-[#E61E32]/10 border-[#E61E32]/20 text-[#E61E32]"
                                            : "bg-white/[0.02] border-white/5 text-white/70 hover:border-white/10"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-xs font-semibold">Leaves</span>
                                    </div>
                                    {pendingLeavesCount > 0 && (
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-yellow-500/10 border border-yellow-500/25 text-yellow-500 rounded-full shrink-0">
                                            {pendingLeavesCount}
                                        </span>
                                    )}
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
                                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                        activeTab === "community"
                                            ? "bg-[#E61E32]/10 border-[#E61E32]/20 text-[#E61E32]"
                                            : "bg-white/[0.02] border-white/5 text-white/70 hover:border-white/10"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <MessageSquare className="w-4 h-4" />
                                        <span className="text-xs font-semibold">Community</span>
                                    </div>
                                    {communityCount > 0 && (
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-white/10 border border-white/15 text-white/60 rounded-full shrink-0">
                                            {communityCount}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveTab("declarations");
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                        activeTab === "declarations"
                                            ? "bg-[#E61E32]/10 border-[#E61E32]/20 text-[#E61E32]"
                                            : "bg-white/[0.02] border-white/5 text-white/70 hover:border-white/10"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <FolderUp className="w-4 h-4" />
                                        <span className="text-xs font-semibold">Declarations</span>
                                    </div>
                                    {pendingDeclarationsCount > 0 && (
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#E61E32]/10 border border-[#E61E32]/25 text-[#E61E32] rounded-full shrink-0">
                                            {pendingDeclarationsCount}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveTab("submissions");
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                        activeTab === "submissions"
                                            ? "bg-[#E61E32]/10 border-[#E61E32]/20 text-[#E61E32]"
                                            : "bg-white/[0.02] border-white/5 text-white/70 hover:border-white/10"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Send className="w-4 h-4" />
                                        <span className="text-xs font-semibold">Work Submission</span>
                                    </div>
                                    {submissions.length > 0 && (
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-white/10 border border-white/15 text-white/60 rounded-full shrink-0">
                                            {submissions.length}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* User Profile Summary */}
                        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-full bg-[#E61E32]/15 border border-[#E61E32]/25 overflow-hidden flex items-center justify-center shrink-0">
                                    {employeeInfo?.avatar ? (
                                        <img src={employeeInfo.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-4.5 h-4.5 text-[#E61E32]" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-white truncate">{employeeInfo?.name}</p>
                                    <p className="text-[10px] text-white/40 uppercase tracking-wider truncate mt-0.5">{employeeInfo?.role || "Team Member"}</p>
                                    {employeeInfo?.division && (
                                        <p className="text-[9px] text-[#E61E32] font-semibold uppercase tracking-wider truncate mt-0.5">{employeeInfo.division}</p>
                                    )}
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
            {showDivisionModal && employeeInfo?.division && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/85 transition-opacity" 
                        onClick={handleCloseDivisionModal} 
                    />
                    
                    {/* Modal Body */}
                    <div className="relative bg-[#0b0b0b] border border-white/10 w-full max-w-sm p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 z-10 rounded-none">
                        {/* Lottie Animation at Top */}
                        <div className="flex justify-center -mt-8">
                            <dotlottie-wc
                                src="https://lottie.host/3075f240-62a5-46db-8d64-5dda79afd538/4FE24H0UXC.lottie"
                                style={{ width: "200px", height: "200px" }}
                                autoplay
                                loop
                            />
                        </div>

                        {/* Congratulations Header */}
                        <div className="space-y-1">
                            <h2 className="text-xl font-black text-[#E61E32] tracking-wide">Congratulations!</h2>
                            <p className="text-[10px] text-white/40 font-bold tracking-wide">New division assignment</p>
                        </div>

                        {/* Allotted Division Info */}
                        <div className="border border-white/10 bg-white/[0.02] p-4 text-center rounded-none">
                            <p className="text-[9px] font-bold text-white/30 tracking-wide">Your allotted division</p>
                            <h3 className="text-base font-black text-white tracking-wide mt-1">{employeeInfo.division}</h3>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-white/50 leading-relaxed font-medium">
                            The respective division lead will be assigned and let you know the things of this division.
                        </p>

                        {/* Action Button */}
                        <button
                            onClick={handleCloseDivisionModal}
                            className="w-full bg-[#E61E32] hover:bg-[#C81428] text-white py-2.5 text-xs font-black tracking-wide transition-colors rounded-none cursor-pointer"
                        >
                            Acknowledge & Continue
                        </button>
                    </div>
                </div>
            )}

            {/* Document Preview Modal */}
            {previewFile && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-4xl h-[85vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                            <div className="min-w-0">
                                <h3 className="font-bold text-sm text-white truncate max-w-md sm:max-w-lg" title={previewFile.name}>{previewFile.name}</h3>
                                <p className="text-[10px] text-white/30 mt-0.5">{previewFile.type}</p>
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
                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E61E32] hover:bg-[#C81428] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                                    >
                                        <Download className="w-3.5 h-3.5" /> Download File
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}



            {/* CHANGE PASSWORD MODAL */}
            {isChangePasswordModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 text-slate-200">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
                        onClick={() => setIsChangePasswordModalOpen(false)} 
                    />
                    
                    {/* Modal Body */}
                    <div className="relative bg-[#0b0b0b] border border-white/10 w-full max-w-md p-6 rounded-none shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 z-10 text-left">
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-none bg-[#E61E32]/10 border border-[#E61E32]/25 flex items-center justify-center text-[#E61E32]">
                                    <KeyRound className="w-3.5 h-3.5" />
                                </div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-white">Change Account Password</h3>
                            </div>
                            <button 
                                onClick={() => setIsChangePasswordModalOpen(false)} 
                                className="text-white/40 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-none"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Error and Success Alerts */}
                        {changePasswordError && (
                            <div className="bg-[#E61E32]/10 border border-[#E61E32]/20 text-[#E61E32] text-xs p-3 rounded-none flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                <span>{changePasswordError}</span>
                            </div>
                        )}
                        {changePasswordSuccess && (
                            <div className="bg-green-500/10 border border-green-500/20 text-green-500 text-xs p-3 rounded-none flex items-center gap-2">
                                <CheckCheck className="w-4 h-4 shrink-0" />
                                <span>{changePasswordSuccess}</span>
                            </div>
                        )}

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            {/* Current Password */}
                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">Current Password</label>
                                <input 
                                    type="password" 
                                    value={changePasswordCurrent}
                                    onChange={(e) => setChangePasswordCurrent(e.target.value)}
                                    required
                                    className="w-full bg-[#121212] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E61E32] transition-colors rounded-none"
                                    placeholder="••••••••"
                                
                                />
                            </div>

                            {/* New Password */}
                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">New Password</label>
                                <input 
                                    type="password" 
                                    value={changePasswordNew}
                                    onChange={(e) => setChangePasswordNew(e.target.value)}
                                    required
                                    className="w-full bg-[#121212] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E61E32] transition-colors rounded-none"
                                    placeholder="•••••••• (Min 6 chars)"
                                />
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">Confirm New Password</label>
                                <input 
                                    type="password" 
                                    value={changePasswordConfirm}
                                    onChange={(e) => setChangePasswordConfirm(e.target.value)}
                                    required
                                    className="w-full bg-[#121212] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E61E32] transition-colors rounded-none"
                                    placeholder="••••••••"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setIsChangePasswordModalOpen(false)}
                                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-bold text-xs uppercase tracking-widest rounded-none transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSavingPassword}
                                    className="px-4 py-2.5 bg-[#E61E32] hover:bg-[#E61E32]/90 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-none transition-colors flex items-center gap-2 cursor-pointer"
                                >
                                    {isSavingPassword ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Updating...
                                        </>
                                    ) : (
                                        "Change Password"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tour Overlay */}
            {tourActive && currentTourStepData && (
                <div className="fixed inset-0 z-50 pointer-events-none">
                    {/* Backdrop focusing on targeted element */}
                    <div 
                        className="absolute inset-0 bg-black/75 pointer-events-auto transition-all duration-300"
                        style={{
                            clipPath: highlightClipPath
                        }}
                    />

                    {/* Popover Card */}
                    <div 
                        ref={tourCardRef}
                        className="absolute bg-[#0f0f0f] border border-white/10 w-72 sm:w-80 p-5 rounded-none shadow-2xl space-y-4 pointer-events-auto text-left transition-all duration-300 z-50 select-none animate-in zoom-in-95 duration-200"
                        style={{
                            left: `${tourPosition.x}px`,
                            top: `${tourPosition.y}px`
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#E61E32] bg-[#E61E32]/10 border border-[#E61E32]/25 px-2 py-0.5 rounded-none">
                                Guide: Step {tourStep + 1} of {TOUR_STEPS.length}
                            </span>
                            <button
                                onClick={handleEndTour}
                                className="text-white/40 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1 rounded-none cursor-pointer"
                                title="Skip Tour"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <div className="space-y-1.5">
                            <h4 className="text-sm font-bold text-white tracking-tight">{currentTourStepData.title}</h4>
                            <p className="text-xs text-white/50 leading-relaxed font-normal">{currentTourStepData.description}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                            <button
                                onClick={handleEndTour}
                                className="text-white/40 hover:text-white text-[10px] uppercase font-bold tracking-wider hover:underline cursor-pointer"
                            >
                                Skip
                            </button>
                            <div className="flex items-center gap-2">
                                {tourStep > 0 && (
                                    <button
                                        onClick={handlePrevTourStep}
                                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white font-bold text-[10px] uppercase tracking-wider rounded-none transition-colors border border-white/10 cursor-pointer"
                                    >
                                        Back
                                    </button>
                                )}
                                <button
                                    onClick={handleNextTourStep}
                                    className="px-3 py-1.5 bg-[#E61E32] hover:bg-[#E61E32]/90 text-white font-bold text-[10px] uppercase tracking-wider rounded-none transition-colors cursor-pointer flex items-center gap-1"
                                >
                                    {tourStep === TOUR_STEPS.length - 1 ? "Finish" : "Next"}
                                </button>
                            </div>
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
