import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import './Dashboard.css'

function TrainerDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const [theme, setTheme] = useState('light')
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [quizModalOpen, setQuizModalOpen] = useState(false)
  const [quizStep, setQuizStep] = useState(1)
  const [sectionCounts, setSectionCounts] = useState({
    Communication: 10,
    Programming: 15,
    Reasoning: 20,
    Professionalism: 10,
    'Interview Readiness': 15
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.getElementById('loader')?.classList.add('hidden')
  }, [theme])

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light')
  const toggleSidebar = () => setSidebarOpen(prev => !prev)

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
    { id: 'students', label: 'Students', icon: '👥' },
    { id: 'quizzes', label: 'Quizzes', icon: '📝' },
    { id: 'workshops', label: 'Workshops', icon: '🎓' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ]

  const stats = [
    { label: 'Active Students', value: '156', change: '+12', icon: '👥', color: 'teal' },
    { label: 'Quizzes Created', value: '24', change: '+3', icon: '📝', color: 'blue' },
    { label: 'Workshops Conducted', value: '18', change: '+2', icon: '🎓', color: 'amber' },
    { label: 'Avg Score', value: '72%', change: '+5%', icon: '📈', color: 'rose' }
  ]

  const studentProgress = [
    { name: 'Priya Sharma', roll: 'CS2024001', comm: 85, tech: 78, overall: 82 },
    { name: 'Rahul Verma', roll: 'CS2024002', comm: 72, tech: 88, overall: 80 },
    { name: 'Anita Patel', roll: 'CS2024003', comm: 90, tech: 75, overall: 83 },
    { name: 'Vikram Singh', roll: 'CS2024004', comm: 68, tech: 82, overall: 75 },
    { name: 'Sneha Reddy', roll: 'CS2024005', comm: 88, tech: 90, overall: 89 }
  ]

  const workshops = [
    { title: 'Communication Skills', date: 'Feb 20', seats: 30, enrolled: 28, status: 'Open' },
    { title: 'GD Practice Session', date: 'Feb 22', seats: 25, enrolled: 25, status: 'Full' },
    { title: 'Interview Prep Workshop', date: 'Feb 25', seats: 40, enrolled: 35, status: 'Open' },
    { title: 'Resume Building', date: 'Feb 28', seats: 30, enrolled: 22, status: 'Open' }
  ]

  const sections = ['Communication', 'Programming', 'Reasoning', 'Professionalism', 'Interview Readiness']
  const totalQuestions = Object.values(sectionCounts).reduce((a, b) => a + b, 0)

  const handleStepCount = (section, delta) => {
    setSectionCounts(prev => ({
      ...prev,
      [section]: Math.max(0, (prev[section] || 0) + delta)
    }))
  }

  const publishQuiz = () => {
    setQuizModalOpen(false)
    setQuizStep(1)
    showToast('Quiz published successfully', 'success')
  }

  const renderDashboard = () => (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome, {user?.name?.split(' ')[0] || 'Trainer'}</h1>
          <p className="page-subtitle">Track student progress and manage assessments</p>
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
            <div className="stat-change">{stat.change} this month</div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Student Progress</h3>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Comm.</th>
                  <th>Tech.</th>
                  <th>Overall</th>
                </tr>
              </thead>
              <tbody>
                {studentProgress.map((s, i) => (
                  <tr key={i}>
                    <td>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-soft text-sm">{s.roll}</div>
                    </td>
                    <td>{s.comm}%</td>
                    <td>{s.tech}%</td>
                    <td><span className={`badge badge-${s.overall >= 80 ? 'teal' : s.overall >= 70 ? 'amber' : 'rose'}`}>{s.overall}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Upcoming Workshops</h3>
            <button className="btn btn-xs btn-primary" onClick={() => setActivePage('workshops')}>Manage</button>
          </div>
          <div className="workshops-list">
            {workshops.map((w, i) => (
              <div key={i} className="workshop-item">
                <div className="workshop-info">
                  <span className="workshop-title">{w.title}</span>
                  <span className="workshop-meta">{w.date} · {w.enrolled}/{w.seats} students</span>
                </div>
                <span className={`badge badge-${w.status === 'Full' ? 'rose' : 'teal'}`}>{w.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderStudents = () => (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">View and manage your assigned students</p>
        </div>
      </div>

      <div className="card">
        <div className="filter-bar">
          <input type="text" placeholder="Search students..." className="search-input" />
          <select>
            <option>All Cohorts</option>
            <option>Batch 2024-A</option>
            <option>Batch 2024-B</option>
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Cohort</th>
                <th>Readiness</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {studentProgress.map((s, i) => (
                <tr key={i}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="sidebar-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{s.name[0]}</div>
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-soft text-sm">{s.roll}</div>
                      </div>
                    </div>
                  </td>
                  <td>Batch 2024-A</td>
                  <td>{s.overall}%</td>
                  <td><span className="badge badge-teal">Active</span></td>
                  <td>
                    <button className="btn btn-xs btn-ghost">View</button>
                    <button className="btn btn-xs btn-ghost">Message</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderQuizzes = () => (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quizzes</h1>
          <p className="page-subtitle">Create and manage assessments</p>
        </div>
        <button className="btn btn-primary" onClick={() => setQuizModalOpen(true)}>
          + Create Quiz
        </button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Quiz Name</th>
                <th>Questions</th>
                <th>Duration</th>
                <th>Attempts</th>
                <th>Avg Score</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium">Communication Skills Test</td>
                <td>50</td>
                <td>60 mins</td>
                <td>45</td>
                <td>72%</td>
                <td><span className="badge badge-teal">Published</span></td>
                <td>
                  <button className="btn btn-xs btn-ghost">Edit</button>
                  <button className="btn btn-xs btn-ghost">Results</button>
                </td>
              </tr>
              <tr>
                <td className="font-medium">Technical Aptitude</td>
                <td>75</td>
                <td>90 mins</td>
                <td>38</td>
                <td>68%</td>
                <td><span className="badge badge-teal">Published</span></td>
                <td>
                  <button className="btn btn-xs btn-ghost">Edit</button>
                  <button className="btn btn-xs btn-ghost">Results</button>
                </td>
              </tr>
              <tr>
                <td className="font-medium">Problem Solving Assessment</td>
                <td>40</td>
                <td>45 mins</td>
                <td>0</td>
                <td>-</td>
                <td><span className="badge badge-amber">Draft</span></td>
                <td>
                  <button className="btn btn-xs btn-ghost">Edit</button>
                  <button className="btn btn-xs btn-primary">Publish</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quiz Creation Modal */}
      {quizModalOpen && (
        <div className="modal-overlay active">
          <div className="modal modal-lg">
            <div className="modal-header">
              <h3 className="modal-title">Create New Quiz</h3>
              <button className="modal-close" onClick={() => setQuizModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="quiz-wizard">
                <div className="quiz-steps">
                  <div className={`quiz-step ${quizStep === 1 ? 'active' : ''}`}>1. Details</div>
                  <div className={`quiz-step ${quizStep === 2 ? 'active' : ''}`}>2. Sections</div>
                  <div className={`quiz-step ${quizStep === 3 ? 'active' : ''}`}>3. Questions</div>
                </div>
                <div className="quiz-content">
                  {quizStep === 1 && (
                    <div className="field">
                      <input type="text" placeholder=" " defaultValue="New Quiz" />
                      <label>Quiz Name</label>
                    </div>
                  )}
                  {quizStep === 2 && (
                    <div className="section-counts">
                      {sections.map(section => (
                        <div key={section} className="section-count-row">
                          <span className="sc-label">{section}</span>
                          <div className="stepper-input">
                            <button onClick={() => handleStepCount(section, -1)}>−</button>
                            <input type="number" min="0" value={sectionCounts[section]} readOnly />
                            <button onClick={() => handleStepCount(section, 1)}>+</button>
                          </div>
                        </div>
                      ))}
                      <div className="mt-3 text-center">
                        <span className="font-mono">Total: <strong>{totalQuestions}</strong> questions</span>
                      </div>
                    </div>
                  )}
                  {quizStep === 3 && (
                    <div className="empty-state">
                      <div className="empty-state-icon">📝</div>
                      <p>Configure question distribution on the previous step</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setQuizStep(prev => Math.max(1, prev - 1))} disabled={quizStep === 1}>
                Previous
              </button>
              <button
                className="btn btn-primary"
                onClick={() => quizStep === 3 ? publishQuiz() : setQuizStep(prev => prev + 1)}
              >
                {quizStep === 3 ? 'Publish Quiz' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderWorkshops = () => (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Workshops</h1>
          <p className="page-subtitle">Manage your workshop sessions</p>
        </div>
        <button className="btn btn-primary">+ Schedule Workshop</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Workshop</th>
                <th>Date</th>
                <th>Seats</th>
                <th>Enrolled</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workshops.map((w, i) => (
                <tr key={i}>
                  <td className="font-medium">{w.title}</td>
                  <td>{w.date}</td>
                  <td>{w.seats}</td>
                  <td>{w.enrolled}</td>
                  <td><span className={`badge badge-${w.status === 'Full' ? 'rose' : 'teal'}`}>{w.status}</span></td>
                  <td>
                    <button className="btn btn-xs btn-ghost">Edit</button>
                    <button className="btn btn-xs btn-ghost">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderCalendar = () => (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Calendar</h1>
          <p className="page-subtitle">View your schedule and upcoming events</p>
        </div>
      </div>

      <div className="card">
        <div className="calendar-header">
          <h3>February 2024</h3>
        </div>
        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="cal-dow">{d}</div>
          ))}
          {[...Array(5)].map((_, i) => <div key={`empty-${i}`} className="cal-cell muted"></div>)}
          {[...Array(23)].map((_, i) => {
            const day = i + 1
            const hasEvent = [5, 15, 22, 23, 25, 28, 30].includes(day)
            const isToday = day === 23
            return (
              <div key={day} className={`cal-cell ${isToday ? 'today' : ''}`}>
                <div className="cal-daynum">{day}</div>
                {hasEvent && <div className="cal-evt">●</div>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderProfile = () => (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Manage your trainer profile</p>
        </div>
      </div>
      <div className="card">
        <form className="profile-form">
          <div className="form-row">
            <div className="field">
              <input type="text" placeholder=" " defaultValue={user?.name || 'Trainer Name'} />
              <label>Full Name</label>
            </div>
            <div className="field">
              <input type="email" placeholder=" " defaultValue={user?.email || 'trainer@college.edu'} />
              <label>Email</label>
            </div>
          </div>
          <div className="form-row">
            <div className="field">
              <input type="text" placeholder=" " defaultValue="EMP001" />
              <label>Employee ID</label>
            </div>
            <div className="field">
              <input type="text" placeholder=" " defaultValue="Computer Science" />
              <label>Department</label>
            </div>
          </div>
          <div className="field">
            <textarea placeholder=" " rows={3} defaultValue="Experienced trainer specializing in soft skills and interview preparation."></textarea>
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
      case 'students': return renderStudents()
      case 'quizzes': return renderQuizzes()
      case 'workshops': return renderWorkshops()
      case 'calendar': return renderCalendar()
      case 'profile': return renderProfile()
      default: return renderDashboard()
    }
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-mark">E</div>
          <span>Trainer Portal</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-group-label">Menu</div>
          {navItems.map(item => (
            <div
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => { setActivePage(item.id); setSidebarOpen(false) }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user" onClick={handleLogout}>
            <div className="sidebar-avatar">{user?.name?.[0] || 'T'}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name || 'Trainer'}</div>
              <div className="sidebar-user-role">Sign Out</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="main-wrap">
        <header className="topbar">
          <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
          <div className="topbar-search">
            <input type="text" placeholder="Search..." />
          </div>
          <div className="topbar-actions">
            <button className="btn-icon" onClick={toggleTheme}>🌙</button>
          </div>
        </header>
        <main className="main-content">{renderContent()}</main>
      </div>
    </div>
  )
}

export default TrainerDashboard
