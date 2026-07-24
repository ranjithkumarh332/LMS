import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import './Dashboard.css'

function SuperAdminDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const [theme, setTheme] = useState('light')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
    { id: 'colleges', label: 'Colleges', icon: '🏫' },
    { id: 'departments', label: 'Departments', icon: '📚' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'templates', label: 'Templates', icon: '📋' },
    { id: 'audit', label: 'Audit Logs', icon: '📜' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ]

  const stats = [
    { label: 'Total Colleges', value: '127', change: '+5', icon: '🏫' },
    { label: 'Active Students', value: '48,250', change: '+2,340', icon: '👥' },
    { label: 'Active Trainers', value: '1,845', change: '+89', icon: '🎓' },
    { label: 'System Health', value: '99.9%', change: 'Stable', icon: '✅' }
  ]

  const colleges = [
    { id: 1, name: 'ABC College of Engineering', code: 'ABC01', location: 'Chennai', students: 1250, status: 'active' },
    { id: 2, name: 'XYZ Institute of Technology', code: 'XYZ02', location: 'Bangalore', students: 980, status: 'active' },
    { id: 3, name: 'PQR College of Arts & Science', code: 'PQR03', location: 'Hyderabad', students: 750, status: 'active' },
    { id: 4, name: 'DEF Engineering College', code: 'DEF04', location: 'Pune', students: 1100, status: 'inactive' }
  ]

  const departments = [
    { id: 1, name: 'Computer Science & Engineering', code: 'CSE', colleges: 89 },
    { id: 2, name: 'Information Technology', code: 'IT', colleges: 76 },
    { id: 3, name: 'Electronics & Communication', code: 'ECE', colleges: 82 },
    { id: 4, name: 'Mechanical Engineering', code: 'ME', colleges: 68 },
    { id: 5, name: 'Civil Engineering', code: 'CE', colleges: 45 }
  ]

  const users = [
    { id: 1, name: 'Admin User', email: 'admin@eip.edu', role: 'superadmin', status: 'active' },
    { id: 2, name: 'College Admin', email: 'admin@abc.edu', role: 'college_admin', status: 'active' },
    { id: 3, name: 'Trainer User', email: 'trainer@abc.edu', role: 'trainer', status: 'active' },
    { id: 4, name: 'Student User', email: 'student@abc.edu', role: 'student', status: 'active' }
  ]

  const auditLogs = [
    { id: 1, action: 'User login', user: 'admin@eip.edu', ip: '192.168.1.1', time: '2 mins ago' },
    { id: 2, action: 'College added', user: 'admin@eip.edu', ip: '192.168.1.1', time: '15 mins ago' },
    { id: 3, action: 'Assessment published', user: 'admin@abc.edu', ip: '192.168.1.2', time: '1 hour ago' },
    { id: 4, action: 'User role changed', user: 'admin@eip.edu', ip: '192.168.1.1', time: '2 hours ago' }
  ]

  const renderDashboard = () => (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Super Admin Dashboard</h1>
          <p className="page-subtitle">Platform-wide overview and management</p>
        </div>
        <button className="btn btn-primary" onClick={() => showToast('Feature coming soon', 'info')}>+ Add College</button>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-change">{s.change}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid mt-3">
        <div className="card">
          <div className="card-header"><h3 className="card-title">Top Performing Colleges</h3></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>College</th><th>Students</th><th>Placement</th></tr></thead>
              <tbody>
                <tr><td>ABC College of Engineering</td><td>1,250</td><td><span className="badge badge-teal">92%</span></td></tr>
                <tr><td>XYZ Institute of Technology</td><td>980</td><td><span className="badge badge-teal">88%</span></td></tr>
                <tr><td>PQR College</td><td>750</td><td><span className="badge badge-amber">85%</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h3 className="card-title">Recent Activity</h3></div>
          <div className="activity-list">
            {auditLogs.slice(0, 4).map(l => (
              <div key={l.id} className="activity-item">
                <span className="activity-text">{l.action}</span>
                <span className="activity-time">{l.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderColleges = () => (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Colleges</h1>
          <p className="page-subtitle">Manage all registered colleges</p>
        </div>
        <button className="btn btn-primary">+ Add College</button>
      </div>

      <div className="card">
        <div className="filter-bar">
          <input type="text" placeholder="Search colleges..." />
          <select><option>All Status</option><option>Active</option><option>Inactive</option></select>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>College</th><th>Code</th><th>Location</th><th>Students</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {colleges.map(c => (
                <tr key={c.id}>
                  <td className="font-medium">{c.name}</td>
                  <td>{c.code}</td>
                  <td>{c.location}</td>
                  <td>{c.students.toLocaleString()}</td>
                  <td><span className={`badge badge-${c.status === 'active' ? 'teal' : 'rose'}`}>{c.status}</span></td>
                  <td>
                    <button className="btn btn-xs btn-ghost">View</button>
                    <button className="btn btn-xs btn-ghost">Edit</button>
                    <button className={`btn btn-xs ${c.status === 'active' ? 'btn-danger' : 'btn-teal'}`}>
                      {c.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderDepartments = () => (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="page-subtitle">Manage platform-wide departments</p>
        </div>
        <button className="btn btn-primary">+ Add Department</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Department</th><th>Code</th><th>Colleges Using</th><th>Actions</th></tr></thead>
            <tbody>
              {departments.map(d => (
                <tr key={d.id}>
                  <td className="font-medium">{d.name}</td>
                  <td>{d.code}</td>
                  <td>{d.colleges}</td>
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

  const renderUsers = () => (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">Manage platform users</p>
        </div>
        <button className="btn btn-primary">+ Add User</button>
      </div>

      <div className="card">
        <div className="filter-bar">
          <input type="text" placeholder="Search users..." />
          <select><option>All Roles</option><option>Super Admin</option><option>College Admin</option><option>Trainer</option><option>Student</option></select>
          <select><option>All Status</option><option>Active</option><option>Suspended</option></select>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td className="font-medium">{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge badge-${u.role === 'superadmin' ? 'amber' : 'teal'}`}>{u.role.replace('_', ' ')}</span></td>
                  <td><span className={`badge badge-${u.status === 'active' ? 'teal' : 'rose'}`}>{u.status}</span></td>
                  <td>
                    <button className="btn btn-xs btn-ghost">View</button>
                    <button className="btn btn-xs btn-ghost">Reset Password</button>
                    {u.role !== 'superadmin' && (
                      <button className={`btn btn-xs ${u.status === 'active' ? 'btn-danger' : 'btn-teal'}`}>
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
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

  const renderTemplates = () => (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Assessment Templates</h1>
          <p className="page-subtitle">Manage reusable assessment templates</p>
        </div>
        <button className="btn btn-primary">+ Create Template</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Template</th><th>Type</th><th>Questions</th><th>Usage</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {[
                { name: 'Communication Assessment', type: 'Soft Skills', q: 50, usage: 89, status: 'published' },
                { name: 'Technical Aptitude', type: 'Technical', q: 75, usage: 76, status: 'published' },
                { name: 'Problem Solving Test', type: 'Reasoning', q: 40, usage: 45, status: 'draft' }
              ].map((t, i) => (
                <tr key={i}>
                  <td className="font-medium">{t.name}</td>
                  <td>{t.type}</td>
                  <td>{t.q}</td>
                  <td>{t.usage} colleges</td>
                  <td><span className={`badge badge-${t.status === 'published' ? 'teal' : 'amber'}`}>{t.status}</span></td>
                  <td>
                    <button className="btn btn-xs btn-ghost">Edit</button>
                    <button className="btn btn-xs btn-ghost">Duplicate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderAudit = () => (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Audit Logs</h1>
          <p className="page-subtitle">Platform activity and security logs</p>
        </div>
        <button className="btn btn-ghost">Export Logs</button>
      </div>

      <div className="card">
        <div className="filter-bar">
          <input type="text" placeholder="Search logs..." />
          <select><option>All Actions</option><option>Login</option><option>Create</option><option>Update</option><option>Delete</option></select>
          <input type="date" />
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Action</th><th>User</th><th>IP Address</th><th>Timestamp</th></tr></thead>
            <tbody>
              {auditLogs.map(l => (
                <tr key={l.id}>
                  <td className="font-medium">{l.action}</td>
                  <td>{l.user}</td>
                  <td className="font-mono text-soft">{l.ip}</td>
                  <td>{l.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">System Settings</h1>
          <p className="page-subtitle">Configure platform-wide settings</p>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-2">General Settings</h3>
        <form className="profile-form">
          <div className="field">
            <input type="text" placeholder=" " defaultValue="Employability Intelligence Platform" />
            <label>Platform Name</label>
          </div>
          <div className="field">
            <input type="email" placeholder=" " defaultValue="support@eip.edu" />
            <label>Support Email</label>
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
      case 'colleges': return renderColleges()
      case 'departments': return renderDepartments()
      case 'users': return renderUsers()
      case 'templates': return renderTemplates()
      case 'audit': return renderAudit()
      case 'settings': return renderSettings()
      default: return renderDashboard()
    }
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} style={{ background: 'var(--ink)', color: '#EEF0F6' }}>
        <div className="sidebar-brand" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="brand-mark">E</div>
          <span style={{ color: '#fff' }}>Super Admin</span>
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
            <div className="sidebar-avatar">{user?.name?.[0] || 'S'}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name || 'Super Admin'}</div>
              <div className="sidebar-user-role">Sign Out</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="main-wrap">
        <header className="topbar">
          <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
          <div className="topbar-search">
            <input type="text" placeholder="Global search..." />
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

export default SuperAdminDashboard
