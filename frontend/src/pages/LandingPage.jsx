import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './LandingPage.css'

function LandingPage() {
  const navigate = useNavigate()
  const [theme, setTheme] = useState('light')
  const [activeFeature, setActiveFeature] = useState(0)
  const [email, setEmail] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.body.classList.add('js-enabled')

    const handleScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el))

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [theme])

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))

  const scrollProgress = useRef(0)
  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      scrollProgress.current = (scrollTop / docHeight) * 100
      const progressBar = document.getElementById('scrollProgress')
      if (progressBar) progressBar.style.width = scrollProgress.current + '%'
    }
    window.addEventListener('scroll', updateProgress)
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  const features = [
    {
      icon: '📊',
      title: 'Competency Tracking',
      desc: 'Track student readiness across communication, technical, and professional skills with granular metrics.'
    },
    {
      icon: '🎯',
      title: 'Structured Interventions',
      desc: 'Trigger cohort-based workshops, mentoring sessions, and personalized improvement plans automatically.'
    },
    {
      icon: '📈',
      title: 'Placement Analytics',
      desc: 'Prove readiness with comprehensive reports, cohort comparisons, and predictive placement scores.'
    },
    {
      icon: '🔒',
      title: 'Secure Assessment',
      desc: 'AI-proctored tests with tab-switch detection, plagiarism checks, and tamper-proof submissions.'
    },
    {
      icon: '🏫',
      title: 'Multi-College Portal',
      desc: 'Manage multiple institutions, departments, and programs from a single super-admin dashboard.'
    },
    {
      icon: '📱',
      title: 'Mobile Ready',
      desc: 'Responsive interface that works seamlessly across devices for students on-the-go.'
    }
  ]

  const stats = [
    { value: '50K+', label: 'Students Assessed' },
    { value: '120+', label: 'Partner Colleges' },
    { value: '89%', label: 'Placement Success' },
    { value: '4.8★', label: 'Student Rating' }
  ]

  const testimonials = [
    {
      quote: 'EIP transformed how we track student readiness. The data-driven insights helped us improve placement rates by 34% in just two semesters.',
      name: 'Dr. Priya Sharma',
      role: 'Dean of Employability, IIT Delhi'
    },
    {
      quote: 'The assessment tools are incredibly comprehensive. Our students feel more prepared for interviews and recruiters notice the difference.',
      name: 'Prof. Rajesh Kumar',
      role: 'T&P Head, VIT Vellore'
    },
    {
      quote: 'Finally, a platform that bridges the gap between academia and industry expectations. EIP is now integral to our curriculum.',
      name: 'Dr. Anita Desai',
      role: 'Principal, PSG College of Technology'
    }
  ]

  const plans = [
    {
      name: 'Starter',
      price: '₹15/student',
      period: 'per academic year',
      features: ['Up to 500 students', 'Basic assessments', 'Email support', 'Standard reports'],
      current: true
    },
    {
      name: 'Professional',
      price: '₹25/student',
      period: 'per academic year',
      features: ['Unlimited students', 'Advanced assessments', 'Priority support', 'Custom reports', 'API access', 'Integration support'],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact for pricing',
      features: ['Everything in Pro', 'Multi-campus', 'Dedicated support', 'On-premise option', 'Custom development', 'SLA guarantee'],
      current: false
    }
  ]

  return (
    <div className="landing-page">
      <div className="scroll-progress" id="scrollProgress"></div>
      <div className="noise-overlay"></div>

      {/* Navigation */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-inner">
          <a href="/" className="nav-brand">
            <div className="brand-mark">E</div>
            <span>EIP</span>
          </a>

          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it Works</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#pricing">Pricing</a>
          </div>

          <div className="nav-actions">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
            <Link to="/login" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="ring-dot"></span>
              Employability Intelligence Platform
            </div>
            <h1 className="hero-title">
              Measure. Improve.<br />
              <span className="gradient-text">Prove.</span>
            </h1>
            <p className="hero-subtitle">
              A data-driven platform for higher education institutions. Assess competencies,
              run structured interventions, and prove placement readiness with confidence.
            </p>
            <div className="hero-actions">
              <Link to="/login" className="btn btn-primary btn-lg">
                Start Free Trial
                <svg className="icon" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <a href="#features" className="btn btn-ghost btn-lg">
                See How It Works
              </a>
            </div>
            <div className="hero-trust">
              <span>Trusted by 120+ colleges across India</span>
              <div className="trust-logos">
                <span>IIT Delhi</span>
                <span>VIT</span>
                <span>PSG Tech</span>
                <span>SRM</span>
                <span>Anna University</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-dashboard-mock">
              <div className="dash-card">
                <div className="dash-card-header">
                  <span className="dash-label">Overall Readiness</span>
                  <span className="dash-badge">+12%</span>
                </div>
                <div className="dash-ring">
                  <svg viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="80" className="ring-bg" />
                    <circle
                      cx="100" cy="100" r="80"
                      className="ring-fg"
                      data-ring-target="78"
                      strokeDasharray="502"
                      strokeDashoffset="110"
                    />
                  </svg>
                  <div className="ring-value">78%</div>
                </div>
              </div>
              <div className="dash-card">
                <div className="dash-card-header">
                  <span className="dash-label">Skill Breakdown</span>
                </div>
                <div className="bars">
                  <div className="bar-row">
                    <span>Communication</span>
                    <div className="bar-track">
                      <div className="bar-fill" data-bar="85"></div>
                    </div>
                    <span className="bar-pct">85%</span>
                  </div>
                  <div className="bar-row">
                    <span>Technical</span>
                    <div className="bar-track">
                      <div className="bar-fill" data-bar="72"></div>
                    </div>
                    <span className="bar-pct">72%</span>
                  </div>
                  <div className="bar-row">
                    <span>Problem Solving</span>
                    <div className="bar-track">
                      <div className="bar-fill" data-bar="68"></div>
                    </div>
                    <span className="bar-pct">68%</span>
                  </div>
                  <div className="bar-row">
                    <span>Teamwork</span>
                    <div className="bar-track">
                      <div className="bar-fill" data-bar="91"></div>
                    </div>
                    <span className="bar-pct">91%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid-4">
            {stats.map((stat, i) => (
              <div key={i} className="stat-item" data-reveal="fade-up">
                <div className="stat-number" data-count-to={parseInt(stat.value)} data-suffix={stat.value.includes('+') ? '+' : stat.value.includes('★') ? '★' : '%'}>
                  {stat.value}
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header" data-reveal="fade-up">
            <div className="eyebrow">Platform Capabilities</div>
            <h2>Everything you need to build<br />job-ready graduates</h2>
            <p className="section-desc">
              From skill assessment to placement tracking, EIP covers the entire
              student employability lifecycle with powerful, intuitive tools.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`feature-card spotlight ${activeFeature === i ? 'active' : ''}`}
                data-reveal="fade-up"
                onMouseEnter={() => setActiveFeature(i)}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section" id="how-it-works">
        <div className="container">
          <div className="section-header" data-reveal="fade-up">
            <div className="eyebrow">The Process</div>
            <h2>Simple to implement,<br />powerful in practice</h2>
          </div>

          <div className="steps">
            <div className="step" data-reveal="fade-up">
              <div className="step-num">01</div>
              <div className="step-content">
                <h3>Connect Your Roster</h3>
                <p>Upload student data or sync via API. EIP auto-maps competencies to your curriculum framework.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step" data-reveal="fade-up">
              <div className="step-num">02</div>
              <div className="step-content">
                <h3>Run Assessments</h3>
                <p>Deploy AI-proctored tests, peer reviews, and faculty evaluations. Real-time analytics from day one.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step" data-reveal="fade-up">
              <div className="step-num">03</div>
              <div className="step-content">
                <h3>Trigger Interventions</h3>
                <p>Set threshold rules. EIP auto-enrolls students in workshops, assigns mentors, and tracks progress.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step" data-reveal="fade-up">
              <div className="step-num">04</div>
              <div className="step-content">
                <h3>Prove Placement Ready</h3>
                <p>Generate employer-ready reports. Students carry verified competency scores to interviews.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section" id="testimonials">
        <div className="container">
          <div className="section-header" data-reveal="fade-up">
            <div className="eyebrow">Voices from Campus</div>
            <h2>Loved by educators,<br />trusted by institutions</h2>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card" data-reveal="fade-up">
                <div className="testimonial-quote">"{t.quote}"</div>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.name.charAt(0)}</div>
                  <div>
                    <div className="author-name">{t.name}</div>
                    <div className="author-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box" data-reveal="fade-up">
            <div className="cta-content">
              <h2>Ready to transform<br />placement outcomes?</h2>
              <p>Join 120+ colleges already using EIP to build job-ready graduates.</p>
              <div className="cta-form">
                <input
                  type="email"
                  placeholder="Enter your work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="btn btn-primary" onClick={() => navigate('/login')}>
                  Get Started Free
                </button>
              </div>
              <span className="cta-note">14-day free trial • No credit card required</span>
            </div>
            <div className="cta-visual">
              <div className="cta-ring">
                <svg viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="80" className="ring-bg" />
                  <circle cx="100" cy="100" r="80" className="ring-fg" strokeDashoffset="110" />
                </svg>
                <div className="ring-text">
                  <span className="ring-big">89%</span>
                  <span className="ring-small">Avg. Placement Rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing-section" id="pricing">
        <div className="container">
          <div className="section-header" data-reveal="fade-up">
            <div className="eyebrow">Simple Pricing</div>
            <h2>Pay only for what you use</h2>
            <p className="section-desc">
              Volume discounts available for 1000+ students. Custom enterprise plans include dedicated support.
            </p>
          </div>

          <div className="pricing-grid">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`pricing-card ${plan.popular ? 'popular' : ''}`}
                data-reveal="fade-up"
              >
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                <h3>{plan.name}</h3>
                <div className="price">{plan.price}</div>
                <div className="period">{plan.period}</div>
                <ul className="features-list">
                  {plan.features.map((f, j) => (
                    <li key={j}>✓ {f}</li>
                  ))}
                </ul>
                <button
                  className={`btn btn-block ${plan.popular ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => navigate('/login')}
                >
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="nav-brand">
                <div className="brand-mark">E</div>
                <span>Employability Intelligence Platform</span>
              </div>
              <p>Building job-ready graduates through data-driven assessment and intervention.</p>
            </div>
            <div className="footer-links">
              <h4>Platform</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#">Documentation</a>
              <a href="#">API Reference</a>
            </div>
            <div className="footer-links">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
              <a href="#">Blog</a>
            </div>
            <div className="footer-links">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
              <a href="#">GDPR</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 Employability Intelligence Platform. All rights reserved.</p>
            <div className="social-links">
              <a href="#">LinkedIn</a>
              <a href="#">Twitter</a>
              <a href="#">YouTube</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top */}
      <button
        className={`back-to-top ${scrolled ? 'show' : ''}`}
        id="backToTop"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      </button>
    </div>
  )
}

export default LandingPage
