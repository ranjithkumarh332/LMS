import { useState, useEffect, useRef } from 'react'
import { Routes, Route, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import './Dashboard.css'

function StudentDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const [theme, setTheme] = useState('light')
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [activeExam, setActiveExam] = useState(null)
  const [examState, setExamState] = useState({
    answers: {},
    timeLeft: 3600,
    violations: 0,
    submitted: false
  })
  const fileInputRef = useRef(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.getElementById('loader')?.classList.add('hidden')
  }, [theme])

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light')
  const toggleSidebar = () => setSidebarOpen(prev => !prev)
  const toggleNotifications = () => setNotificationsOpen(prev => !prev)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      showToast('Logout failed', 'error')
    }
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'assessments', label: 'Assessments', icon: '📝' },
    { id: 'cohorts', label: 'My Cohorts', icon: '👥' },
    { id: 'workshops', label: 'Workshops', icon: '🎓' },
    { id: 'resume', label: 'Resume', icon: '📄' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ]

  const notifications = [
    { id: 1, type: 'assess', icon: '📝', title: 'New Assessment', desc: 'Communication Skills Test is now available', time: '2 hours ago' },
    { id: 2, type: 'cohort', icon: '👥', title: 'Cohort Assignment', desc: 'You have been added to Batch 2024-A', time: '1 day ago' },
    { id: 3, type: 'workshop', icon: '🎓', title: 'Workshop Reminder', desc: 'Interview Prep Workshop starts tomorrow', time: '2 days ago' }
  ]

  const stats = [
    { label: 'Overall Readiness', value: '78%', change: '+12%', icon: '📊', color: 'teal' },
    { label: 'Assessments Taken', value: '8', change: '+2', icon: '✅', color: 'amber' },
    { label: 'Workshops Attended', value: '5', change: '+1', icon: '🎓', color: 'blue' },
    { label: 'Profile Views', value: '23', change: '+8', icon: '👁', color: 'rose' }
  ]

  const skillBars = [
    { name: 'Communication', score: 85, color: '#1F9E93' },
    { name: 'Technical', score: 72, color: '#E8720C' },
    { name: 'Problem Solving', score: 68, color: '#F2A93B' },
    { name: 'Teamwork', score: 91, color: '#1F9E73' }
  ]

  const upcomingAssessments = [
    { title: 'Technical Aptitude Test', date: '2024-02-15', duration: '90 mins', status: 'Upcoming' },
    { title: 'Group Discussion Round', date: '2024-02-18', duration: '45 mins', status: 'Upcoming' },
    { title: 'Resume Building Workshop', date: '2024-02-20', duration: '60 mins', status: 'Registered' }
  ]

  const cohortData = {
    name: 'Batch 2024 - Computer Science',
    members: 45,
    avgReadiness: 72,
    placementRate: 87
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const okType = /\.(pdf|doc|docx)$/i.test(file.name)
    if (!okType) {
      showToast('Please upload a PDF or DOCX file', 'info')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('File exceeds 5 MB limit', 'info')
      return
    }
    showToast('Resume uploaded successfully', 'success')
  }

  const startExam = (exam) => {
    setActiveExam(exam)
    setExamState({
      answers: {},
      timeLeft: exam.duration * 60,
      violations: 0,
      submitted: false
    })
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen()
    }
  }

  const submitExam = () => {
    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen()
    }
    setActiveExam(null)
    showToast('Assessment submitted successfully', 'success')
  }

  const renderDashboard = () => (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0] || 'Student'}</h1>
          <p className="page-subtitle">Track your progress and prepare for placements</p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: `rgba(var(--${stat.color}), 0.1)` }}>
              {stat.icon}
            </div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            <div className={`stat-change ${stat.change.startsWith('+') ? '' : 'negative'}`}>
              {stat.change} from last month
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Skill Breakdown</h3>
          </div>
          <div className="skill-bars">
            {skillBars.map((skill, i) => (
              <div key={i} className="skill-row">
                <div className="skill-info">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-score">{skill.score}%</span>
                </div>
                <div className="skill-bar">
                  <div className="skill-bar-fill" style={{ width: `${skill.score}%`, background: skill.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Upcoming Assessments</h3>
            <button className="btn btn-xs btn-ghost" onClick={() => setActivePage('assessments')}>View All</button>
          </div>
          <div className="assessment-list">
            {upcomingAssessments.map((a, i) => (
              <div key={i} className="assessment-item">
                <div className="assessment-info">
                  <span className="assessment-title">{a.title}</span>
                  <span className="assessment-meta">{a.date} · {a.duration}</span>
                </div>
                <span className={`badge badge-${a.status === 'Registered' ? 'teal' : 'amber'}`}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">My Cohort</h3>
          </div>
          <div className="cohort-info">
            <div className="cohort-name">{cohortData.name}</div>
            <div className="cohort-stats">
              <div className="cohort-stat">
                <span className="cohort-stat-value">{cohortData.members}</span>
                <span className="cohort-stat-label">Members</span>
              </div>
              <div className="cohort-stat">
                <span className="cohort-stat-value">{cohortData.avgReadiness}%</span>
                <span className="cohort-stat-label">Avg Readiness</span>
              </div>
              <div className="cohort-stat">
                <span className="cohort-stat-value">{cohortData.placementRate}%</span>
                <span className="cohort-stat-label">Placement Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAssessments = () => (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Assessments</h1>
          <p className="page-subtitle">Take assessments and track your performance</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Available Assessments</h3>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Assessment</th>
                <th>Category</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="cell-strong">Communication Skills Test</td>
                <td>Soft Skills</td>
                <td>60 mins</td>
                <td><span className="badge badge-teal">Available</span></td>
                <td>
                  <button className="btn btn-sm btn-primary" onClick={() => startExam({ title: 'Communication Skills Test', duration: 60 })}>
                    Start
                  </button>
                </td>
              </tr>
              <tr>
                <td className="cell-strong">Technical Aptitude</td>
                <td>Technical</td>
                <td>90 mins</td>
                <td><span className="badge badge-amber">Upcoming</span></td>
                <td><button className="btn btn-sm btn-ghost" disabled>Not Available</button></td>
              </tr>
              <tr>
                <td className="cell-strong">Problem Solving Assessment</td>
                <td>Reasoning</td>
                <td>45 mins</td>
                <td><span className="badge badge-teal">Available</span></td>
                <td>
                  <button className="btn btn-sm btn-primary" onClick={() => startExam({ title: 'Problem Solving Assessment', duration: 45 })}>
                    Start
                  </button>
                </td>
              </tr>
              <tr>
                <td className="cell-strong">Mock Interview Round 1</td>
                <td>Interview</td>
                <td>30 mins</td>
                <td><span className="badge badge-ink">Completed</span></td>
                <td><button className="btn btn-sm btn-ghost">Review</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderCohorts = () => (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Cohorts</h1>
          <p className="page-subtitle">View your cohort groups and members</p>
        </div>
      </div>

      <div className="card">
        <div className="cohort-detail">
          <h3>{cohortData.name}</h3>
          <p>You are part of this cohort with {cohortData.members} other students working towards placement readiness.</p>
          <div className="cohort-progress">
            <div className="cohort-progress-label">
              <span>Your Readiness</span>
              <span>78%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: '78%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderWorkshops = () => (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Workshops</h1>
          <p className="page-subtitle">Registered and upcoming workshops</p>
        </div>
      </div>

      <div className="workshops-list">
        <div className="card workshop-card">
          <div className="workshop-date">Feb 20, 2024</div>
          <h3>Resume Building Workshop</h3>
          <p>Learn how to create an impactful resume that stands out to recruiters.</p>
          <div className="workshop-meta">60 mins · Trainer: Mr. Arun Kumar</div>
          <span className="badge badge-teal">Registered</span>
        </div>
        <div className="card workshop-card">
          <div className="workshop-date">Feb 25, 2024</div>
          <h3>Interview Preparation Session</h3>
          <p>Practice common interview questions and get feedback.</p>
          <div className="workshop-meta">90 mins · Trainer: Ms. Priya Nair</div>
          <span className="badge badge-amber">Upcoming</span>
        </div>
      </div>
    </div>
  )

  const renderResume = () => (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Resume</h1>
          <p className="page-subtitle">Upload and manage your resume</p>
        </div>
      </div>

      <div className="card">
        <div
          className="dropzone"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            if (e.dataTransfer.files?.[0]) handleFileUpload({ target: { files: e.dataTransfer.files } })
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
          />
          <div className="dropzone-icon">📄</div>
          <p className="dropzone-text">Drag and drop your resume here, or click to browse</p>
          <p className="dropzone-hint">PDF or DOCX, max 5MB</p>
        </div>

        <div className="resume-status mt-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">resume_final.pdf</div>
              <div className="text-soft text-sm">2.4 MB · Uploaded Jan 15, 2024</div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-sm btn-ghost">View</button>
              <button className="btn btn-sm btn-danger">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderProfile = () => (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Manage your personal information</p>
        </div>
      </div>

      <div className="card">
        <form className="profile-form">
          <div className="form-row">
            <div className="field">
              <input type="text" placeholder=" " defaultValue={user?.name || 'Rahul Sharma'} />
              <label>Full Name</label>
            </div>
            <div className="field">
              <input type="email" placeholder=" " defaultValue={user?.email || 'rahul.sharma@student.edu'} />
              <label>Email</label>
            </div>
          </div>
          <div className="form-row">
            <div className="field">
              <input type="tel" placeholder=" " defaultValue="9876543210" />
              <label>Mobile</label>
            </div>
            <div className="field">
              <input type="text" placeholder=" " defaultValue="CS2024001" />
              <label>Roll Number</label>
            </div>
          </div>
          <div className="field">
            <textarea placeholder=" " rows={3} defaultValue="Passionate about software development and machine learning."></textarea>
            <label>Bio</label>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard': return renderDashboard()
      case 'assessments': return renderAssessments()
      case 'cohorts': return renderCohorts()
      case 'workshops': return renderWorkshops()
      case 'resume': return renderResume()
      case 'profile': return renderProfile()
      default: return renderDashboard()
    }
  }

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-mark">E</div>
          <span>Student Portal</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group-label">Menu</div>
          {navItems.map(item => (
            <div
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => {
                setActivePage(item.id)
                setSidebarOpen(false)
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user" onClick={handleLogout}>
            <div className="sidebar-avatar">{user?.name?.[0] || 'S'}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name || 'Student'}</div>
              <div className="sidebar-user-role">Sign Out</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-wrap">
        <header className="topbar">
          <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
          <div className="topbar-search">
            <input type="text" placeholder="Search assessments, workshops..." />
          </div>
          <div className="topbar-actions">
            <button className="btn-icon" onClick={toggleTheme}>🌙</button>
            <button className="btn-icon notification-btn" onClick={toggleNotifications}>
              🔔
              <span className="notification-dot"></span>
            </button>
          </div>
        </header>

        <main className="main-content">
          {renderContent()}
        </main>
      </div>

      {/* Notifications Panel */}
      <div className={`notification-panel ${notificationsOpen ? 'open' : ''}`}>
        <div className="notification-header">
          <h3>Notifications</h3>
          <button className="btn btn-xs btn-ghost">Mark all read</button>
        </div>
        <div className="notification-list">
          {notifications.map(n => (
            <div key={n.id} className="notification-item">
              <div className="notification-icon">{n.icon}</div>
              <div className="notification-content">
                <div className="notification-title">{n.title}</div>
                <div className="notification-desc">{n.desc}</div>
                <div className="notification-time">{n.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exam Overlay */}
      {activeExam && (
        <div className="exam-overlay active">
          <div className="exam-container">
            <div className="exam-header">
              <h2>{activeExam.title}</h2>
              <div className="exam-timer" id="examTimer">
                {Math.floor(examState.timeLeft / 60)}:{String(examState.timeLeft % 60).padStart(2, '0')}
              </div>
            </div>
            <div className="exam-questions">
              <div className="question">
                <p className="question-text">1. What is the primary purpose of a resume?</p>
                <div className="options">
                  {['To list all your education', 'To market yourself to employers', 'To apply for college', 'To track attendance'].map((opt, i) => (
                    <label key={i} className="option">
                      <input
                        type="radio"
                        name="q1"
                        checked={examState.answers[1] === i}
                        onChange={() => setExamState(prev => ({ ...prev, answers: { ...prev.answers, 1: i } }))}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="exam-footer">
              <button className="btn btn-ghost" onClick={() => setActiveExam(null)}>Exit</button>
              <button className="btn btn-primary" onClick={submitExam}>Submit Assessment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentDashboard
