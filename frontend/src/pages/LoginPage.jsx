import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import './LoginPage.css'

function LoginPage() {
  const navigate = useNavigate()
  const { login, register, forgotPassword, isAuthenticated, user } = useAuth()
  const { showToast } = useToast()
  const [theme, setTheme] = useState('light')
  const [activePanel, setActivePanel] = useState('login')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    mobile: '',
    role: 'student',
    idValue: '',
    otp: '',
    resetToken: ''
  })
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [showForgotForm, setShowForgotForm] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    if (isAuthenticated && user) {
      const routes = {
        student: '/student',
        trainer: '/trainer',
        college_admin: '/college-admin',
        superadmin: '/super-admin'
      }
      navigate(routes[user.role] || '/', { replace: true })
    }
  }, [theme, isAuthenticated, user, navigate])

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))

  const switchPanel = (panel) => {
    setActivePanel(panel)
    setShowForgotForm(false)
    setOtpSent(false)
    setOtpVerified(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === 'password') {
      const score = scorePassword(value)
      setPasswordStrength(score)
    }
  }

  const scorePassword = (pw) => {
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
    if (/\d/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return score
  }

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!validateEmail(formData.email)) {
      showToast('Please enter a valid email address', 'error')
      return
    }
    if (!formData.password) {
      showToast('Please enter your password', 'error')
      return
    }

    setLoading(true)
    try {
      await login(formData.email, formData.password)
      showToast('Welcome back!', 'success')
    } catch (error) {
      showToast(error.response?.data?.message || 'Invalid credentials', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!formData.name) {
      showToast('Please enter your name', 'error')
      return
    }
    if (!validateEmail(formData.email)) {
      showToast('Please enter a valid email address', 'error')
      return
    }
    if (formData.password.length < 8) {
      showToast('Password must be at least 8 characters', 'error')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error')
      return
    }

    setLoading(true)
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        mobile: formData.mobile,
        role: formData.role,
        idValue: formData.idValue
      })
      showToast('Account created successfully!', 'success')
    } catch (error) {
      showToast(error.response?.data?.message || 'Registration failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSendOtp = async (type) => {
    if (!validateEmail(formData.email)) {
      showToast('Please enter a valid email address', 'error')
      return
    }
    setLoading(true)
    try {
      // Simulated OTP send - in production, call API
      setTimeout(() => {
        setOtpSent(true)
        showToast('OTP sent to your email', 'success')
      }, 800)
    } catch (error) {
      showToast('Failed to send OTP', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = () => {
    if (formData.otp.length < 4) {
      showToast('Please enter a valid OTP', 'error')
      return
    }
    setOtpVerified(true)
    showToast('OTP verified successfully', 'success')
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!otpVerified) {
      showToast('Please verify your email first', 'error')
      return
    }
    if (formData.password.length < 8) {
      showToast('Password must be at least 8 characters', 'error')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error')
      return
    }

    setLoading(true)
    try {
      await forgotPassword(formData.email)
      showToast('Password reset successful!', 'success')
      switchPanel('login')
    } catch (error) {
      showToast(error.response?.data?.message || 'Password reset failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const idConfig = {
    student: { label: 'Roll number', placeholder: 'Enter roll number' },
    trainer: { label: 'Employee ID', placeholder: 'Enter employee ID' },
    college_admin: { label: 'TNEA counselling code', placeholder: 'Enter counselling code' }
  }

  const sidePoints = [
    { icon: '📊', text: 'Track competency scores across communication, technical, and professional skills' },
    { icon: '🎯', text: 'Access personalized intervention plans based on your assessment results' },
    { icon: '📈', text: 'Monitor your placement readiness progress with real-time analytics' },
    { icon: '🏆', text: 'Get employer-ready with verified skill credentials' }
  ]

  return (
    <div className="auth-page">
      <div id="loader" className="hidden">
        <div className="loader-mark"></div>
        <div className="loader-text">Loading...</div>
      </div>

      <nav className="auth-nav">
        <a href="/" className="brand">
          <div className="brand-mark">E</div>
          <span>Employability Intelligence Platform</span>
        </a>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </nav>

      <div className="auth-side">
        <div className="auth-side-grid"></div>
        <div className="auth-blob blob-1"></div>
        <div className="auth-blob blob-2"></div>
        <div className="auth-side-content">
          <a href="/" className="brand">
            <div className="brand-mark">E</div>
            <span>EIP</span>
          </a>
          <h1>
            Your path to<br />
            <em>career readiness</em><br />
            starts here
          </h1>
          <p>Join thousands of students building verified skills and landing their dream jobs.</p>
          <div className="side-points">
            {sidePoints.map((point, i) => (
              <div key={i} className="side-point">
                <div className="side-point-mark">{point.icon}</div>
                <span>{point.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-tabs">
          <button
            className={`auth-tab ${activePanel === 'login' ? 'active' : ''}`}
            onClick={() => switchPanel('login')}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${activePanel === 'register' ? 'active' : ''}`}
            onClick={() => switchPanel('register')}
          >
            Create Account
          </button>
        </div>

        {/* Login Panel */}
        <div className={`auth-panel ${activePanel === 'login' ? 'active' : ''}`}>
          <form id="loginForm" onSubmit={handleLogin}>
            <div className="field">
              <input
                type="email"
                id="loginEmail"
                name="email"
                placeholder=" "
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
              />
              <label htmlFor="loginEmail">Email address</label>
              <span className="field-hint" id="loginEmailHint"></span>
            </div>
            <div className="field">
              <input
                type="password"
                id="loginPassword"
                name="password"
                placeholder=" "
                value={formData.password}
                onChange={handleInputChange}
                autoComplete="current-password"
              />
              <label htmlFor="loginPassword">Password</label>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  switchPanel('login')
                  setShowForgotForm(true)
                }}
              >
                Forgot password?
              </button>
            </div>
            <button type="submit" className={`btn btn-primary btn-block ${loading ? 'is-loading' : ''}`}>
              Sign In
            </button>
          </form>
        </div>

        {/* Register Panel */}
        <div className={`auth-panel ${activePanel === 'register' ? 'active' : ''}`}>
          <form id="registerForm" onSubmit={handleRegister}>
            <div className="field">
              <input
                type="text"
                id="regName"
                name="name"
                placeholder=" "
                value={formData.name}
                onChange={handleInputChange}
              />
              <label htmlFor="regName">Full name</label>
            </div>
            <div className="field">
              <input
                type="email"
                id="regEmail"
                name="email"
                placeholder=" "
                value={formData.email}
                onChange={handleInputChange}
              />
              <label htmlFor="regEmail">Email address</label>
              <span className="field-hint" id="regEmailHint"></span>
            </div>
            <div className="field">
              <input
                type="tel"
                id="regMobile"
                name="mobile"
                placeholder=" "
                value={formData.mobile}
                onChange={handleInputChange}
                maxLength={10}
              />
              <label htmlFor="regMobile">Mobile number</label>
              <span className="field-hint" id="mobileHint"></span>
            </div>
            <div className="field select-field">
              <select
                id="regRole"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="student">Student</option>
                <option value="trainer">Trainer</option>
                <option value="college_admin">College Admin</option>
              </select>
              <label>I am a</label>
            </div>
            <div className="field">
              <input
                type="text"
                id="regIdField"
                name="idValue"
                placeholder=" "
                value={formData.idValue}
                onChange={handleInputChange}
              />
              <label id="regIdLabel">{idConfig[formData.role]?.label}</label>
            </div>
            <div className="field">
              <input
                type="password"
                id="regPassword"
                name="password"
                placeholder=" "
                value={formData.password}
                onChange={handleInputChange}
              />
              <label htmlFor="regPassword">Password</label>
            </div>
            <div className="password-strength">
              <div className="strength-meter" data-level={passwordStrength}>
                <div className="strength-bar" style={{ width: `${passwordStrength * 25}%` }}></div>
              </div>
              <span id="strengthLabel" className="strength-label">
                {passwordStrength === 0 ? 'Password strength' : ['Weak', 'Fair', 'Good', 'Strong'][passwordStrength - 1]}
              </span>
            </div>
            <div className="field">
              <input
                type="password"
                id="regConfirm"
                name="confirmPassword"
                placeholder=" "
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              <label htmlFor="regConfirm">Confirm password</label>
              <span className="field-hint" id="matchHint"></span>
            </div>
            <button type="submit" className={`btn btn-primary btn-block ${loading ? 'is-loading' : ''}`}>
              Create Account
            </button>
          </form>
        </div>

        {/* Forgot Password Panel */}
        {showForgotForm && (
          <div className="auth-panel active">
            <div id="forgotFormWrap">
              <form id="forgotForm" onSubmit={handleForgotPassword}>
                <div className="field">
                  <input
                    type="email"
                    name="email"
                    placeholder=" "
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <label>Registered email</label>
                </div>
                <button
                  type="button"
                  id="fpSendOtp"
                  className="btn btn-ghost btn-block"
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  {otpSent ? 'Resend OTP' : 'Send OTP'}
                </button>
                {otpSent && (
                  <div className="field otp-field">
                    <input
                      type="text"
                      id="fpOtp"
                      name="otp"
                      placeholder=" "
                      value={formData.otp}
                      onChange={handleInputChange}
                      maxLength={6}
                    />
                    <label>Enter OTP</label>
                    <button
                      type="button"
                      id="fpVerifyOtp"
                      className="btn btn-xs btn-teal"
                      onClick={handleVerifyOtp}
                    >
                      Verify
                    </button>
                  </div>
                )}
                {otpVerified && (
                  <>
                    <div className="field">
                      <input
                        type="password"
                        id="fpNewPassword"
                        name="password"
                        placeholder=" "
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      <label>New password</label>
                    </div>
                    <div className="field">
                      <input
                        type="password"
                        id="fpConfirmPassword"
                        name="confirmPassword"
                        placeholder=" "
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                      />
                      <label>Confirm new password</label>
                      <span className="field-hint" id="fpMatchHint"></span>
                    </div>
                  </>
                )}
                <button
                  type="submit"
                  id="fpSubmit"
                  className={`btn btn-primary btn-block ${loading ? 'is-loading' : ''}`}
                  disabled={!otpVerified}
                >
                  Reset Password
                </button>
              </form>
            </div>
            <div id="fpSuccess" className="success-message">
              <div className="success-icon">✓</div>
              <h3>Password Reset Complete</h3>
              <p>You can now sign in with your new password.</p>
            </div>
            <button className="link-btn back-link" onClick={() => setShowForgotForm(false)}>
              Back to Sign In
            </button>
          </div>
        )}

        <p className="auth-footer">
          By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
