import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import AlertPanel from '../components/AlertPanel';
import GoalTracker from '../components/GoalTracker';
import {
    AreaChart, Area, LineChart, Line,
    XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Pill, Activity, Footprints, Scale, Moon, Sun, Plus, HeartPulse, ShieldAlert, LineChart as LineChartIcon, TrendingDown } from 'lucide-react';
import './DashboardPage.css';

/* ---------- Mock Data ---------- */
const bpData = [
    { day: 'Mon', systolic: 120, diastolic: 78 },
    { day: 'Tue', systolic: 118, diastolic: 76 },
    { day: 'Wed', systolic: 125, diastolic: 82 },
    { day: 'Thu', systolic: 122, diastolic: 79 },
    { day: 'Fri', systolic: 130, diastolic: 85 },
    { day: 'Sat', systolic: 119, diastolic: 77 },
    { day: 'Sun', systolic: 121, diastolic: 80 },
];

const weightData = [
    { week: 'W1', kg: 72.5 },
    { week: 'W2', kg: 72.1 },
    { week: 'W3', kg: 71.8 },
    { week: 'W4', kg: 71.5 },
    { week: 'W5', kg: 71.9 },
    { week: 'W6', kg: 71.2 },
];

const mockAlerts = [
    { severity: 'red', message: 'Blood pressure reading above normal range (130/85).', time: '2 hours ago' },
    { severity: 'amber', message: 'Blood sugar level slightly elevated at 140 mg/dL.', time: '5 hours ago' },
    { severity: 'green', message: 'Daily step goal achieved! 10,200 steps.', time: 'Yesterday' },
    { severity: 'blue', message: 'Monthly health report is ready to download.', time: '2 days ago' },
];

const mockGoals = [
    { icon: <Pill size={20} />, label: 'Medication', current: 2, target: 3, unit: 'pills', color: 'blue' },
    { icon: <Footprints size={20} />, label: 'Daily Steps', current: 7500, target: 10000, unit: 'steps', color: 'green' },
    { icon: <Scale size={20} />, label: 'Target Weight', current: 71.2, target: 70, unit: 'kg', color: 'amber' },
    { icon: <Moon size={20} />, label: 'Sleep', current: 6.5, target: 8, unit: 'hours', color: 'purple' },
];

/* ---------- Chart Tooltip ---------- */
const ChartTooltip = ({ active, payload, label }) => {
    const { theme } = useTheme();
    if (!active || !payload?.length) return null;

    const bg = theme === 'light' ? '#ffffff' : 'rgba(15,17,23,0.95)';
    const border = theme === 'light' ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.08)';
    const titleColor = theme === 'light' ? '#0f172a' : '#f0f2f5';
    const textColor = theme === 'light' ? '#475569' : '#c4c9d4';

    return (
        <div style={{
            background: bg, border: border,
            borderRadius: 8, padding: '8px 12px', fontSize: '0.78rem', color: textColor,
        }}>
            <div style={{ fontWeight: 600, marginBottom: 4, color: titleColor }}>{label}</div>
            {payload.map((p, i) => (
                <div key={i} style={{ color: p.color }}>{p.name}: {p.value}</div>
            ))}
        </div>
    );
};

/* ---------- Greeting Helper ---------- */
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

function getFormattedDate() {
    return new Date().toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
}

/* ---------- Dashboard Component ---------- */
function DashboardPage() {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [resizing, setResizing] = useState(false);

    const axisColor = theme === 'light' ? '#94a3b8' : '#4b5063';

    const handleSidebarToggle = () => {
        setResizing(true);
        setSidebarCollapsed(!sidebarCollapsed);
        setTimeout(() => setResizing(false), 350);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar collapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />

            <main className={`dashboard-main ${sidebarCollapsed ? 'dashboard-main--collapsed' : ''} ${resizing ? 'resizing' : ''}`}>
                {/* Welcome Header */}
                <div className="dash-header">
                    <div className="dash-greeting">
                        <h1>{getGreeting()}, {user?.first_name || 'there'} 👋</h1>
                        <p>{getFormattedDate()}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <button
                            onClick={toggleTheme}
                            style={{
                                background: 'var(--card-bg)', border: '1px solid var(--border-color)',
                                color: 'var(--text-secondary)', padding: '8px', borderRadius: '8px',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s ease'
                            }}
                            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <button className="dash-action-btn">
                            <Plus size={18} style={{ marginRight: 6 }} /> Log Today's Health
                        </button>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="dash-stats">
                    <StatCard
                        icon={<Activity size={24} />} iconColor="green"
                        label="Health Score" value="78"
                        sub="Out of 100" badge="Good" badgeColor="green"
                    />
                    <StatCard
                        icon={<Scale size={24} />} iconColor="blue"
                        label="BMI" value="22.4"
                        sub="Height: 178cm" badge="Normal" badgeColor="green"
                    />
                    <StatCard
                        icon={<HeartPulse size={24} />} iconColor="rose"
                        label="Heart Rate" value="72"
                        sub="BPM • Resting"
                    />
                    <StatCard
                        icon={<ShieldAlert size={24} />} iconColor="amber"
                        label="Risk Level" value="Low"
                        sub="Diabetes & Heart" badge="No action needed" badgeColor="green"
                    />
                </div>

                {/* Charts Row */}
                <div className="dash-charts">
                    <div className="dash-chart-card">
                        <div className="dash-chart-title">
                            <LineChartIcon size={18} style={{ marginRight: 8, verticalAlign: 'middle', color: '#60a5fa' }} /> Blood Pressure (7 days)
                        </div>
                        <div className="dash-chart-body">
                            <ResponsiveContainer width="99%" height={250}>
                                <AreaChart data={bpData}>
                                    <defs>
                                        <linearGradient id="gradSys" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.3} />
                                            <stop offset="100%" stopColor="#60a5fa" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="gradDia" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#4ade80" stopOpacity={0.2} />
                                            <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="day" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis domain={[60, 140]} stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip content={<ChartTooltip />} />
                                    <Area type="monotone" dataKey="systolic" name="Systolic" stroke="#60a5fa" fill="url(#gradSys)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="diastolic" name="Diastolic" stroke="#4ade80" fill="url(#gradDia)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="dash-chart-card">
                        <div className="dash-chart-title">
                            <TrendingDown size={18} style={{ marginRight: 8, verticalAlign: 'middle', color: '#a78bfa' }} /> Weight Trend (6 weeks)
                        </div>
                        <div className="dash-chart-body">
                            <ResponsiveContainer width="99%" height={250}>
                                <LineChart data={weightData}>
                                    <XAxis dataKey="week" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis domain={[70, 73]} stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip content={<ChartTooltip />} />
                                    <Line type="monotone" dataKey="kg" name="Weight" stroke="#a78bfa" strokeWidth={2.5} dot={{ r: 4, fill: '#a78bfa' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="dash-bottom">
                    <AlertPanel alerts={mockAlerts} />
                    <GoalTracker goals={mockGoals} />
                </div>
            </main>
        </div>
    );
}

export default DashboardPage;
