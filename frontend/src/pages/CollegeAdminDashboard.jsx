import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import './Dashboard.css'

function CollegeAdminDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const [theme, setTheme] = useState('light')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filters, setFilters] = useState({ search: '', status: 'all', department: 'all' })
  const [pageNum, setPageNum] = useState(1)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.getElementById('loader')?.classList.add('hidden')
  }, [theme])

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light')
  const toggleSidebar = () => setSidebarOpen(prev => !prev)

  const handleLogout = async () => {
    try { await logout(); navigate('/login') } catch (e) { showToast('Logout failed', 'error') }
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'students', label: 'Students', icon: '👥' },
    { id: 'trainers', label: 'Trainers', icon: '🎓' },
    { id: 'assessments', label: 'Assessments', icon: '📝' },
    { id: 'reports', label: 'Reports', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ]

  const stats = [
    { label: 'Total Students', value: '1,245', change: '+45', icon: '👥' },
    { label: 'Active Trainers', value: '28', change: '+2', icon: '🎓' },
    { label: 'Assessments Taken', value: '3,892', change: '+156', icon: '✅' },
    { label: 'Placement Rate', value: '87%', change: '+5%', icon: '🏆' }
  ]

  const students = [
    { id: 1, name: 'Rahul Sharma', roll: 'CS2024001', email: 'rahul@student.edu', dept: 'CSE', readiness: 85, status: 'active' },
    { id: 2, name: 'Priya Patel', roll: 'CS2024002', email: 'priya@student.edu', dept: 'CSE', readiness: 78, status: 'active' },
    { id: 3, name: 'Amit Kumar', roll: 'IT2024001', email: 'amit@student.edu', dept: 'IT', readiness: 72, status: 'active' },
    { id: 4, name: 'Sneha Reddy', roll: 'ECE2024001', email: 'sneha@student.edu', dept: 'ECE', readiness: 88, status: 'active' },
    { id: 5, name: 'Vikram Singh', roll: 'ME2024001', email: 'vikram@student.edu', dept: 'ME', readiness: 65, status: 'inactive' }
  ]

  const trainers = [
    { id: 1, name: 'Dr. Arun Kumar', empId: 'EMP001', email: 'arun@college.edu', dept: 'CSE', status: 'approved', students: 45 },
    { id: 2, name: 'Ms. Priya Nair', empId: 'EMP002', email: 'priya@college.edu', dept: 'IT', status: 'approved', students: 38 },
    { id: 3, name: 'Prof. Suresh Rao', empId: 'EMP003', email: 'suresh@college.edu', dept: 'ECE', status: 'pending', students: 0 },
    { id: 4, name: 'Dr. Meera Joshi', empId: 'EMP004', email: 'meera@college.edu', dept: 'ME', status: 'approved', students: 52 }
  ]

  const renderDashboard = () => (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">College Dashboard</h1>
          <p className="page-subtitle">Overview of your college performance</p>
        </div>
        <button className="btn btn-primary">+ Add Student</button>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-change">{s.change} this month</div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid mt-3">
        <div className="card">
          <div className="card-header"><h3 className="card-title">Recent Activity</h3></div>
          <div className="activity-list">
            {[
              { icon: '👤', text: 'New student registered', time: '2 hours ago' },
              { icon: '✅', text: 'Assessment completed by 45 students', time: '4 hours ago' },
              { icon: '🎓', text: 'Workshop scheduled for Feb 25', time: '1 day ago' },
              { icon: '📊', text: 'Monthly report generated', time: '2 days ago' }
            ].map((a, i) => (
              <div key={i} className="activity-item">
                <span className="activity-icon">{a.icon}</span>
                <span className="activity-text">{a.text}</span>
                <span className="activity-time">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h3 className="card-title">Quick Actions</h3></div>
          <div className="quick-actions">
            <button className="btn btn-ghost btn-block" onClick={() => setActiveTab('students')}>Manage Students</button>
            <button className="btn btn-ghost btn-block" onClick={() => setActiveTab('trainers')}>Approve Trainers</button>
            <button className="btn btn-ghost btn-block" onClick={() => setActiveTab('reports')}>Generate Report</button>
            <button className="btn btn-ghost btn-block">Bulk Import</button>
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
          <p className="page-subtitle">Manage student records</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost">Bulk Import</button>
          <button className="btn btn-primary">+ Add Student</button>
        </div>
      </div>

      <div className="card">
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search students..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
          <select value={filters.department} onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}>
            <option value="all">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="ME">ME</option>
          </select>
          <select value={filters.status} onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No</th>
                <th>Department</th>
                <th>Readiness</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="sidebar-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{s.name[0]}</div>
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-soft text-sm">{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{s.roll}</td>
                  <td>{s.dept}</td>
                  <td><span className={`badge badge-${s.readiness >= 80 ? 'teal' : s.readiness >= 70 ? 'amber' : 'rose'}`}>{s.readiness}%</span></td>
                  <td><span className={`badge badge-${s.status === 'active' ? 'teal' : 'ink'}`}>{s.status}</span></td>
                  <td>
                    <button className="btn btn-xs btn-ghost">View</button>
                    <button className="btn btn-xs btn-ghost">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <button disabled>←</button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>→</button>
        </div>
      </div>
    </div>
  )

  const renderTrainers = () => (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Trainers</h1>
          <p className="page-subtitle">Manage trainer accounts</p>
        </div>
        <button className="btn btn-primary">+ Add Trainer</button>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'trainers' ? 'active' : ''}`} onClick={() => setActiveTab('trainers')}>All Trainers</button>
        <button className="tab">Pending Approval</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Trainer</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Students</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainers.map(t => (
                <tr key={t.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="sidebar-avatar" style={{ width: 32, height: 32, fontSize: 12, background: 'linear-gradient(135deg, #1F9E93, #146F67)' }}>{t.name[0]}</div>
                      <div className="font-medium">{t.name}</div>
                    </div>
                  </td>
                  <td>{t.empId}</td>
                  <td>{t.dept}</td>
                  <td>{t.students}</td>
                  <td>
                    <span className={`badge badge-${t.status === 'approved' ? 'teal' : 'amber'}`}>
                      {t.status === 'approved' ? 'Active' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    {t.status === 'pending' ? (
                      <>
                        <button className="btn btn-xs btn-teal">Approve</button>
                        <button className="btn btn-xs btn-danger">Reject</button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-xs btn-ghost">View</button>
                        <button className="btn btn-xs btn-ghost">Edit</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderAssessments = () => (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Assessments</h1>
          <p className="page-subtitle">Manage assessments and question banks</p>
        </div>
        <button className="btn btn-primary">+ Create Assessment</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Assessment</th>
                <th>Type</th>
                <th>Questions</th>
                <th>Attempts</th>
                <th>Avg Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Communication Skills', type: 'Soft Skills', q: 50, attempts: 156, avg: 72 },
                { name: 'Technical Aptitude', type: 'Technical', q: 75, attempts: 142, avg: 68 },
                { name: 'Problem Solving', type: 'Reasoning', q: 40, attempts: 128, avg: 75 }
              ].map((a, i) => (
                <tr key={i}>
                  <td className="font-medium">{a.name}</td>
                  <td>{a.type}</td>
                  <td>{a.q}</td>
                  <td>{a.attempts}</td>
                  <td>{a.avg}%</td>
                  <td>
                    <button className="btn btn-xs btn-ghost">Edit</button>
                    <button className="btn btn-xs btn-ghost">Results</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderReports = () => (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">Generate and export reports</p>
        </div>
      </div>

      <div className="reports-grid">
        {[
          { title: 'Student Performance', desc: 'Individual and cohort performance reports', icon: '📊', format: 'PDF, Excel' },
          { title: 'Placement Statistics', desc: 'Placement rates and recruiter feedback', icon: '🏆', format: 'PDF, Excel' },
          { title: 'Assessment Results', desc: 'Detailed assessment analysis and insights', icon: '📝', format: 'PDF, Excel' },
          { title: 'Trainer Activity', desc: 'Trainer workload and student outcomes', icon: '🎓', format: 'PDF' }
        ].map((r, i) => (
          <div key={i} className="card report-card">
            <span className="report-icon">{r.icon}</span>
            <h3>{r.title}</h3>
            <p>{r.desc}</p>
            <div className="report-actions">
              <button className="btn btn-sm btn-ghost">PDF</button>
              <button className="btn btn-sm btn-ghost">Excel</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Configure college settings</p>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-2">College Information</h3>
        <form className="profile-form">
          <div className="field">
            <input type="text" placeholder=" " defaultValue="ABC College of Engineering" />
            <label>College Name</label>
          </div>
          <div className="form-row">
            <div className="field">
              <input type="text" placeholder=" " defaultValue="TNEA12345" />
              <label>TNEA Code</label>
            </div>
            <div className="field">
              <input type="text" placeholder=" " defaultValue="Chennai" />
              <label>Location</label>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard()
      case 'students': return renderStudents()
      case 'trainers': return renderTrainers()
      case 'assessments': return renderAssessments()
      case 'reports': return renderReports()
      case 'settings': return renderSettings()
      default: return renderDashboard()
    }
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand" style={{ background: 'var(--ink)', color: '#FBF3E7' }}>
          <div className="brand-mark">E</div>
          <span style={{ color: '#FBF3E7' }}>College Admin</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <div
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false) }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user" onClick={handleLogout}>
            <div className="sidebar-avatar">{user?.name?.[0] || 'A'}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name || 'Admin'}</div>
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

export default CollegeAdminDashboard
