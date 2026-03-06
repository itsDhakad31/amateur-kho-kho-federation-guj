import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Users, 
  Calendar, 
  Newspaper, 
  Download, 
  Phone, 
  Mail, 
  MapPin, 
  ChevronRight, 
  Menu, 
  X,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Info,
  LogIn,
  LogOut,
  User as UserIcon,
  Plus,
  Trash2,
  FileText
} from 'lucide-react';
import { NewsItem, EventItem, RegistrationData, User } from './types';

// --- Components ---

const DbStatusBanner = () => {
  return null;
};

const ViewRegistrationModal = ({ reg, onClose }: { reg: RegistrationData | null, onClose: () => void }) => {
  if (!reg) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="bg-akkfg-blue p-6 text-white flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold">{reg.name}</h2>
            <p className="text-white/70 text-sm font-mono">{reg.unique_id || 'ID Pending'}</p>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white p-2 bg-white/10 rounded-full">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-8 space-y-8">
          {/* Personal Info */}
          <section>
            <h3 className="text-lg font-bold text-akkfg-orange mb-4 border-b border-slate-100 pb-2">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Role</label>
                <p className="font-medium">{reg.role}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
                <p className="font-medium">{reg.email}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Mobile</label>
                <p className="font-medium">{reg.mobile}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Date of Birth</label>
                <p className="font-medium">{reg.dob}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Gender</label>
                <p className="font-medium">{reg.gender}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Experience</label>
                <p className="font-medium">{reg.experience} Years</p>
              </div>
              <div className="md:col-span-3">
                <label className="text-xs font-bold text-slate-400 uppercase">Address</label>
                <p className="font-medium">{reg.address_city}, {reg.address_country}</p>
              </div>
            </div>
          </section>

          {/* Additional Info */}
          <section>
            <h3 className="text-lg font-bold text-akkfg-orange mb-4 border-b border-slate-100 pb-2">Qualifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reg.role === 'Student' ? (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Level of Passing</label>
                    <p className="font-medium">{reg.level_passing || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Year of Passing</label>
                    <p className="font-medium">{reg.year_passing || 'N/A'}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Coaching Certification</label>
                    <p className="font-medium">{reg.coaching_cert || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Referee Certification</label>
                    <p className="font-medium">{reg.referee_cert || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Education</label>
                    <p className="font-medium">{reg.edu_qualification || 'N/A'}</p>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Documents */}
          <section>
            <h3 className="text-lg font-bold text-akkfg-orange mb-4 border-b border-slate-100 pb-2">Documents</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Photo', url: reg.doc_photo },
                { label: 'Aadhar Card', url: reg.doc_aadhar },
                { label: 'PAN Card', url: reg.doc_pan },
                { label: 'Birth Certificate', url: reg.doc_birth }
              ].map((doc, i) => (
                <div key={i} className="border border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors relative group">
                  <div className="bg-slate-100 w-full h-32 rounded-lg flex items-center justify-center mx-auto mb-3 text-slate-400 overflow-hidden">
                    {doc.url && doc.url.startsWith('data:image') ? (
                      <img src={doc.url} alt={doc.label} className="w-full h-full object-cover" />
                    ) : (
                      <FileText size={32} />
                    )}
                  </div>
                  <p className="text-sm font-bold text-slate-600 mb-2">{doc.label}</p>
                  {doc.url ? (
                    <a 
                      href={doc.url} 
                      download={`${reg.name}_${doc.label}`}
                      className="text-xs w-full py-2 bg-akkfg-blue text-white rounded-lg font-bold hover:bg-akkfg-blue/90 transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <Download size={12} /> Download
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Not Uploaded</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

const LoginModal = ({ isOpen, onClose, onLogin }: { isOpen: boolean, onClose: () => void, onLogin: (user: User, token: string) => void }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const body = isRegister ? { name, email, password } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.user, data.token);
        onClose();
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="bg-akkfg-blue p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-white/70 text-sm">{isRegister ? 'Join the AKKFG community' : 'Sign in to access your dashboard'}</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100">{error}</div>}
          
          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
              <input 
                required
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-akkfg-orange"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
            <input 
              required
              type="email" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-akkfg-orange"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
            <input 
              required
              type="password" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-akkfg-orange"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-akkfg-orange text-white py-4 rounded-xl font-bold shadow-lg hover:bg-akkfg-orange/90 transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isRegister ? 'Register' : 'Login')}
          </button>

          <div className="text-center pt-4">
            <button 
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-sm text-slate-500 hover:text-akkfg-blue font-medium"
            >
              {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
            </button>
          </div>
        </form>
        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white">
          <X size={24} />
        </button>
      </motion.div>
    </div>
  );
};

const Navbar = ({ activeTab, setActiveTab, user, onLogout, onOpenLogin }: { 
  activeTab: string, 
  setActiveTab: (tab: string) => void,
  user: User | null,
  onLogout: () => void,
  onOpenLogin: () => void
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'events', label: 'Events' },
    { id: 'register', label: 'Registrations' },
    { id: 'downloads', label: 'Downloads' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-12 h-12 bg-akkfg-orange rounded-full flex items-center justify-center text-white shadow-lg">
              <Trophy size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-akkfg-blue leading-tight">AKKFG</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Gujarat Kho-Kho</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-link relative py-2 ${activeTab === item.id ? 'text-akkfg-orange' : ''}`}
              >
                {item.label}
                {activeTab === item.id && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-akkfg-orange"
                  />
                )}
              </button>
            ))}
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-sm font-bold text-akkfg-blue hover:bg-slate-200 transition-colors"
                >
                  <UserIcon size={16} />
                  {user.name}
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-50">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm font-bold text-akkfg-blue truncate">{user.email}</p>
                      </div>
                      <button 
                        onClick={() => {
                          setActiveTab('dashboard');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <ShieldCheck size={16} /> Dashboard
                      </button>
                      {user.role === 'Admin' && (
                        <button 
                          onClick={() => {
                            setActiveTab('admin');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-akkfg-orange hover:bg-akkfg-orange/5 flex items-center gap-2 font-bold"
                        >
                          <ShieldCheck size={16} /> Admin Panel
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          onLogout();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={onOpenLogin}
                className="bg-akkfg-blue text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-akkfg-blue/90 transition-all shadow-md flex items-center gap-2"
              >
                <LogIn size={16} />
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  {item.label}
                </button>
              ))}
              {user ? (
                <button 
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="w-full mt-4 bg-red-50 text-red-600 px-5 py-3 rounded-lg text-center font-semibold flex items-center justify-center gap-2"
                >
                  <LogOut size={18} /> Logout
                </button>
              ) : (
                <button 
                  onClick={() => {
                    onOpenLogin();
                    setIsOpen(false);
                  }}
                  className="w-full mt-4 bg-akkfg-blue text-white px-5 py-3 rounded-lg text-center font-semibold flex items-center justify-center gap-2"
                >
                  <LogIn size={18} /> Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-akkfg-dark text-slate-300 pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-akkfg-orange rounded-full flex items-center justify-center text-white">
              <Trophy size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">AKKFG</h2>
          </div>
          <p className="text-sm leading-relaxed">
            Amateur Kho-Kho Federation Gujarat is the governing body for Kho-Kho in the state of Gujarat, dedicated to promoting and developing the sport at all levels.
          </p>
        </div>
        <div>
          <h3 className="text-white font-bold mb-6">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-akkfg-orange transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-akkfg-orange transition-colors">Upcoming Events</a></li>
            <li><a href="#" className="hover:text-akkfg-orange transition-colors">Player Registration</a></li>
            <li><a href="#" className="hover:text-akkfg-orange transition-colors">Rules & Regulations</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-6">Contact Us</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-akkfg-orange shrink-0" />
              <span>Sports Complex, Stadium Road, Ahmedabad, Gujarat 380009</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-akkfg-orange shrink-0" />
              <span>+91 79 1234 5678</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-akkfg-orange shrink-0" />
              <span>info@akkfgujarat.in</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-6">Newsletter</h3>
          <p className="text-sm mb-4">Stay updated with the latest news and events.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Your email" 
              className="bg-slate-800 border-none rounded-lg px-4 py-2 text-sm w-full focus:ring-1 focus:ring-akkfg-orange"
            />
            <button className="bg-akkfg-orange text-white p-2 rounded-lg hover:bg-akkfg-orange/90">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <p>© 2026 Amateur Kho-Kho Federation Gujarat. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
          <a href="#" className="hover:text-white">Sitemap</a>
        </div>
      </div>
    </div>
  </footer>
);

// --- Pages ---

const Home = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.ok ? res.json() : [])
      .then(data => Array.isArray(data) ? setNews(data) : setNews([]))
      .catch(() => setNews([]));
      
    fetch('/api/events')
      .then(res => res.ok ? res.json() : [])
      .then(data => Array.isArray(data) ? setEvents(data) : setEvents([]))
      .catch(() => setEvents([]));
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-akkfg-blue">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/khokho-hero/1920/1080?blur=2" 
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-akkfg-blue via-akkfg-blue/80 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1.5 bg-akkfg-orange/20 text-akkfg-orange text-xs font-bold rounded-full mb-6 tracking-widest uppercase">
              Official State Federation
            </span>
            <h1 className="text-5xl md:text-7xl text-white mb-6 leading-tight">
              Reviving the Spirit of <span className="text-akkfg-orange">Kho-Kho</span> in Gujarat
            </h1>
            <p className="text-lg text-slate-300 mb-10 leading-relaxed">
              Empowering athletes, fostering sportsmanship, and building a world-class ecosystem for the traditional sport of Kho-Kho across every district of Gujarat.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setActiveTab('register')}
                className="bg-akkfg-orange text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl flex items-center gap-2"
              >
                Register as Player <ChevronRight size={20} />
              </button>
              <button 
                onClick={() => setActiveTab('events')}
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all"
              >
                View Tournaments
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Registered Players', value: '12,450+', icon: Users },
            { label: 'Active Coaches', value: '450+', icon: ShieldCheck },
            { label: 'Districts Covered', value: '33', icon: MapPin },
            { label: 'Annual Events', value: '80+', icon: Calendar },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 rounded-2xl text-center"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-akkfg-blue">
                <stat.icon size={24} />
              </div>
              <h3 className="text-2xl font-bold text-akkfg-blue mb-1">{stat.value}</h3>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* News & Updates */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl text-akkfg-blue mb-2">Latest News & Updates</h2>
            <p className="text-slate-500">Stay informed with the latest happenings in Gujarat Kho-Kho.</p>
          </div>
          <button className="text-akkfg-orange font-bold flex items-center gap-1 hover:gap-2 transition-all">
            View All News <ChevronRight size={18} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.isArray(news) && news.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={item.image} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-akkfg-orange text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  Announcement
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-3">
                  <Calendar size={14} />
                  {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <h3 className="text-xl mb-3 group-hover:text-akkfg-orange transition-colors leading-snug">{item.title}</h3>
                <p className="text-slate-600 text-sm line-clamp-2 mb-6">{item.summary}</p>
                <button className="text-akkfg-blue font-bold text-sm flex items-center gap-1">
                  Read More <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-akkfg-blue mb-4">Upcoming Tournaments</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Check out the upcoming state and district level competitions. Register your team today!</p>
          </div>
          
          <div className="space-y-4">
            {Array.isArray(events) && events.map((event, i) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-akkfg-orange/30 transition-colors"
              >
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="bg-slate-50 p-4 rounded-xl text-center min-w-[80px]">
                    <span className="block text-2xl font-bold text-akkfg-orange">{new Date(event.date).getDate()}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  <div>
                    <h3 className="text-xl text-akkfg-blue mb-1">{event.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5"><MapPin size={14} /> {event.location}</span>
                      <span className="flex items-center gap-1.5"><Trophy size={14} /> {event.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                    {event.status}
                  </span>
                  <button className="bg-akkfg-blue text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-akkfg-blue/90 transition-all whitespace-nowrap">
                    Register Team
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-akkfg-orange rounded-3xl p-10 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-3xl mb-4">Player Registration</h3>
              <p className="text-white/80 mb-8 max-w-md">Join the official database of Gujarat Kho-Kho players. Get your digital ID and eligibility for state tournaments.</p>
              <button 
                onClick={() => setActiveTab('register')}
                className="bg-white text-akkfg-orange px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
              >
                Start Registration
              </button>
            </div>
            <Users size={200} className="absolute -bottom-10 -right-10 text-white/10 group-hover:scale-110 transition-transform duration-700" />
          </div>
          
          <div className="bg-akkfg-blue rounded-3xl p-10 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-3xl mb-4">Download Center</h3>
              <p className="text-white/80 mb-8 max-w-md">Access official forms, circulars, rulebooks, and tournament guidelines directly from the federation.</p>
              <button 
                onClick={() => setActiveTab('downloads')}
                className="bg-white text-akkfg-blue px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
              >
                Browse Documents
              </button>
            </div>
            <Download size={200} className="absolute -bottom-10 -right-10 text-white/10 group-hover:scale-110 transition-transform duration-700" />
          </div>
        </div>
      </section>
    </div>
  );
};

const About = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">
    <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h2 className="text-4xl text-akkfg-blue mb-6">Our Mission & Vision</h2>
        <div className="space-y-8">
          <div className="flex gap-6">
            <div className="w-14 h-14 bg-akkfg-orange/10 rounded-2xl flex items-center justify-center text-akkfg-orange shrink-0">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h3 className="text-xl mb-2">Mission</h3>
              <p className="text-slate-600 leading-relaxed">To identify, nurture and promote Kho-Kho talent across Gujarat by providing professional training, infrastructure, and competitive platforms at district and state levels.</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="w-14 h-14 bg-akkfg-blue/10 rounded-2xl flex items-center justify-center text-akkfg-blue shrink-0">
              <Trophy size={28} />
            </div>
            <div>
              <h3 className="text-xl mb-2">Vision</h3>
              <p className="text-slate-600 leading-relaxed">To make Gujarat a powerhouse of Kho-Kho in India and ensure the sport is played with modern standards while preserving its traditional roots.</p>
            </div>
          </div>
        </div>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-3xl overflow-hidden shadow-2xl"
      >
        <img src="https://picsum.photos/seed/about-khokho/800/600" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      </motion.div>
    </section>

    <section>
      <h2 className="text-3xl text-akkfg-blue text-center mb-12">Office Bearers</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { name: 'Shri Rajesh Patel', role: 'President', image: 'https://i.pravatar.cc/150?u=1' },
          { name: 'Shri Amit Shah', role: 'General Secretary', image: 'https://i.pravatar.cc/150?u=2' },
          { name: 'Smt. Meena Desai', role: 'Treasurer', image: 'https://i.pravatar.cc/150?u=3' },
          { name: 'Shri Vijay Rathod', role: 'Vice President', image: 'https://i.pravatar.cc/150?u=4' },
        ].map((person, i) => (
          <div key={i} className="text-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white shadow-lg">
              <img src={person.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <h4 className="text-lg font-bold text-akkfg-blue">{person.name}</h4>
            <p className="text-sm text-akkfg-orange font-semibold">{person.role}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

const IDCard = ({ data }: { data: RegistrationData }) => (
  <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-akkfg-blue relative">
    <div className="bg-akkfg-blue p-4 text-white text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-akkfg-orange rotate-45 translate-x-10 -translate-y-10" />
      <h3 className="text-lg font-bold">AKKFG</h3>
      <p className="text-[10px] uppercase tracking-widest opacity-80">Gujarat Kho-Kho Federation</p>
    </div>
    
    <div className="p-6 flex flex-col items-center">
      <div className="w-32 h-32 bg-slate-100 rounded-xl border-4 border-white shadow-md overflow-hidden mb-4">
        <img 
          src={data.doc_photo || `https://i.pravatar.cc/150?u=${data.name}`} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="text-center space-y-1 mb-6">
        <h4 className="text-xl font-bold text-akkfg-blue uppercase">{data.name}</h4>
        <p className="text-akkfg-orange font-bold text-sm tracking-widest uppercase">{data.role === 'Student' ? 'Player' : data.role}</p>
        <p className="text-xs font-mono bg-slate-100 px-3 py-1 rounded-full text-slate-600">{data.unique_id}</p>
      </div>
      
      <div className="w-full grid grid-cols-2 gap-4 text-[10px] border-t border-slate-100 pt-4">
        <div>
          <p className="text-slate-400 uppercase font-bold">DOB</p>
          <p className="font-bold text-slate-700">{data.dob}</p>
        </div>
        <div>
          <p className="text-slate-400 uppercase font-bold">Gender</p>
          <p className="font-bold text-slate-700">{data.gender}</p>
        </div>
        <div className="col-span-2">
          <p className="text-slate-400 uppercase font-bold">Address</p>
          <p className="font-bold text-slate-700">{data.address_city}, {data.address_country}</p>
        </div>
      </div>
    </div>
    
    <div className="bg-slate-50 p-3 text-center border-t border-slate-100">
      <p className="text-[8px] text-slate-400 uppercase font-bold tracking-tighter">Authorized by Amateur Kho-Kho Federation Gujarat</p>
    </div>
  </div>
);

const Registration = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    dob: '',
    address_city: '',
    address_country: 'India',
    gender: 'Male',
    email: '',
    mobile: '',
    experience: '',
    role: 'Student',
    doc_photo: '',
    doc_aadhar: '',
    doc_pan: '',
    doc_birth: '',
    level_passing: '',
    year_passing: '',
    coaching_cert: '',
    edu_qualification: '',
    referee_cert: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<RegistrationData | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      // Limit to 2MB (Base64 adds ~33% overhead, so 4 files * 2MB * 1.33 = ~10.6MB < 16MB limit)
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      alert("Please accept the terms and conditions");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const data = await res.json();
        setResult({ ...formData, unique_id: data.unique_id });
        setSubmitted(true);
      } else {
        const errData = await res.json();
        alert(errData.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      alert("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-3xl text-akkfg-blue mb-4">Registration Submitted!</h2>
          <p className="text-slate-600 mb-8">Your application has been successfully submitted to the Amateur Kho-Kho Federation Gujarat. Our administrators will review your documents and details.</p>
          
          <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100 max-w-2xl mx-auto mb-12">
            <h3 className="text-xl font-bold text-amber-800 mb-2">What happens next?</h3>
            <ul className="text-left text-amber-700 space-y-3 text-sm">
              <li className="flex gap-2"><span>1.</span> <span>Admin will verify your uploaded documents (Aadhar, PAN, etc.).</span></li>
              <li className="flex gap-2"><span>2.</span> <span>Once approved, your unique Federation ID will be generated.</span></li>
              <li className="flex gap-2"><span>3.</span> <span>You can then log in to your dashboard to download your official ID card.</span></li>
            </ul>
          </div>

          <button 
            onClick={() => {
              setSubmitted(false);
              setActiveTab('home');
            }}
            className="bg-akkfg-blue text-white px-12 py-4 rounded-full font-bold shadow-lg hover:bg-akkfg-blue/90 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-20 px-4">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-akkfg-blue p-8 text-white">
          <h2 className="text-3xl mb-2">Federation Registration</h2>
          <p className="text-white/70">Official registration for Coaches and Students of AKKFG.</p>
        </div>
        
        <div className="flex border-b border-slate-100">
          {['Student', 'Coach'].map(role => (
            <button
              key={role}
              onClick={() => setFormData({...formData, role: role as any})}
              className={`flex-1 py-6 font-bold text-lg transition-all ${formData.role === role ? 'text-akkfg-orange bg-akkfg-orange/5 border-b-2 border-akkfg-orange' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {role === 'Student' ? 'Player' : role} Registration
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-12">
          {/* Basic Info */}
          <div className="space-y-6">
            <h3 className="text-xl text-akkfg-blue font-bold border-l-4 border-akkfg-orange pl-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Full Name</label>
                <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-akkfg-orange" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Date of Birth</label>
                <input required type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-akkfg-orange" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Gender</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-akkfg-orange" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Mobile Number</label>
                <input required type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-akkfg-orange" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email Address</label>
                <input required type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-akkfg-orange" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">City</label>
                <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-akkfg-orange" value={formData.address_city} onChange={e => setFormData({...formData, address_city: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Country</label>
                <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-akkfg-orange" value={formData.address_country} onChange={e => setFormData({...formData, address_country: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Years of Experience</label>
                <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-akkfg-orange" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Professional Info for Students */}
          {formData.role === 'Student' && (
            <div className="space-y-6">
              <h3 className="text-xl text-akkfg-blue font-bold border-l-4 border-akkfg-orange pl-4">Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Level of Passing (Kho-Kho Site)</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-akkfg-orange" value={formData.level_passing} onChange={e => setFormData({...formData, level_passing: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Year of Passing</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-akkfg-orange" value={formData.year_passing} onChange={e => setFormData({...formData, year_passing: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Coaching Certificate Details</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-akkfg-orange" value={formData.coaching_cert} onChange={e => setFormData({...formData, coaching_cert: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Education Qualification</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-akkfg-orange" value={formData.edu_qualification} onChange={e => setFormData({...formData, edu_qualification: e.target.value})} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">All India Referee Exam Passing Certificate Details</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-akkfg-orange" value={formData.referee_cert} onChange={e => setFormData({...formData, referee_cert: e.target.value})} />
                </div>
              </div>
            </div>
          )}

          {/* Documents */}
          <div className="space-y-6">
            <h3 className="text-xl text-akkfg-blue font-bold border-l-4 border-akkfg-orange pl-4">Documents Upload</h3>
            <p className="text-xs text-slate-400 italic">Please upload clear images/PDFs (Max 4MB each).</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Photograph</label>
                <input required type="file" accept="image/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-akkfg-orange/10 file:text-akkfg-orange hover:file:bg-akkfg-orange/20" onChange={e => handleFileChange(e, 'doc_photo')} />
                {formData.doc_photo && <p className="text-xs text-emerald-600 font-bold">File Selected</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Aadhar Card</label>
                <input required type="file" accept="image/*,application/pdf" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-akkfg-orange/10 file:text-akkfg-orange hover:file:bg-akkfg-orange/20" onChange={e => handleFileChange(e, 'doc_aadhar')} />
                {formData.doc_aadhar && <p className="text-xs text-emerald-600 font-bold">File Selected</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">PAN Card</label>
                <input required type="file" accept="image/*,application/pdf" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-akkfg-orange/10 file:text-akkfg-orange hover:file:bg-akkfg-orange/20" onChange={e => handleFileChange(e, 'doc_pan')} />
                {formData.doc_pan && <p className="text-xs text-emerald-600 font-bold">File Selected</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Birth Certificate</label>
                <input required type="file" accept="image/*,application/pdf" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-akkfg-orange/10 file:text-akkfg-orange hover:file:bg-akkfg-orange/20" onChange={e => handleFileChange(e, 'doc_birth')} />
                {formData.doc_birth && <p className="text-xs text-emerald-600 font-bold">File Selected</p>}
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="flex items-start gap-4">
              <input 
                type="checkbox" 
                id="terms" 
                className="mt-1 w-5 h-5 rounded border-slate-300 text-akkfg-orange focus:ring-akkfg-orange"
                checked={acceptedTerms}
                onChange={e => setAcceptedTerms(e.target.checked)}
              />
              <label htmlFor="terms" className="text-sm text-slate-600 leading-relaxed">
                I hereby declare that all the information provided above is true to the best of my knowledge. I agree to abide by the rules and regulations of the Amateur Kho-Kho Federation Gujarat (AKKFG). I understand that any false information may lead to the cancellation of my registration.
              </label>
            </div>
          </div>

          <button type="submit" className="w-full bg-akkfg-orange text-white py-5 rounded-2xl font-bold text-xl shadow-xl hover:bg-akkfg-orange/90 transition-all">
            Submit Registration
          </button>
        </form>
      </div>
    </div>
  );
};

const Events = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  useEffect(() => {
    fetch('/api/events')
      .then(res => res.ok ? res.json() : [])
      .then(data => Array.isArray(data) ? setEvents(data) : setEvents([]))
      .catch(() => setEvents([]));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-12">
        <h2 className="text-4xl text-akkfg-blue mb-4">Tournament Calendar</h2>
        <p className="text-slate-500">Explore and participate in upcoming Kho-Kho events across Gujarat.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {Array.isArray(events) && events.map((event) => (
          <div key={event.id} className="bg-white p-8 rounded-3xl border border-slate-200 flex flex-col md:flex-row gap-8 items-center">
            <div className="bg-akkfg-blue text-white p-6 rounded-2xl text-center min-w-[120px]">
              <span className="block text-4xl font-bold">{new Date(event.date).getDate()}</span>
              <span className="block text-sm uppercase font-bold tracking-widest">{new Date(event.date).toLocaleString('default', { month: 'long' })}</span>
              <span className="block text-xs mt-1 opacity-60">{new Date(event.date).getFullYear()}</span>
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-akkfg-orange/10 text-akkfg-orange text-[10px] font-bold rounded-full uppercase tracking-widest">
                  {event.category}
                </span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-widest">
                  {event.status}
                </span>
              </div>
              <h3 className="text-2xl text-akkfg-blue">{event.title}</h3>
              <div className="flex flex-wrap gap-6 text-slate-500">
                <span className="flex items-center gap-2"><MapPin size={18} /> {event.location}</span>
                <span className="flex items-center gap-2"><Users size={18} /> Open for Registration</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <button className="bg-akkfg-blue text-white px-8 py-3 rounded-full font-bold hover:bg-akkfg-blue/90 transition-all">
                Register Now
              </button>
              <button className="text-akkfg-blue font-bold text-sm hover:underline">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Downloads = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <h2 className="text-4xl text-akkfg-blue mb-12">Download Center</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[
        { title: 'Registration Forms', items: ['Player Registration Form', 'Coach Certification Form', 'District Association Form'] },
        { title: 'Rules & Regulations', items: ['Official Kho-Kho Rulebook 2026', 'Tournament Guidelines', 'Anti-Doping Policy'] },
        { title: 'Circulars & Notices', items: ['Annual General Meeting Notice', 'State Championship Circular', 'Election Notification'] },
        { title: 'Results & Archives', items: ['State Championship 2025 Results', 'Annual Report 2024-25', 'Hall of Fame'] },
      ].map((section, i) => (
        <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200">
          <h3 className="text-xl text-akkfg-blue mb-6 border-b border-slate-100 pb-4">{section.title}</h3>
          <ul className="space-y-4">
            {section.items.map((item, j) => (
              <li key={j} className="flex items-center justify-between group cursor-pointer">
                <span className="text-slate-600 group-hover:text-akkfg-orange transition-colors">{item}</span>
                <Download size={18} className="text-slate-400 group-hover:text-akkfg-orange transition-colors" />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

const Contact = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
      <div>
        <h2 className="text-4xl text-akkfg-blue mb-6">Get in Touch</h2>
        <p className="text-slate-500 mb-10">Have questions about registrations or upcoming events? Our team is here to help you.</p>
        
        <div className="space-y-8">
          <div className="flex gap-6">
            <div className="w-12 h-12 bg-akkfg-orange/10 rounded-xl flex items-center justify-center text-akkfg-orange shrink-0">
              <MapPin size={24} />
            </div>
            <div>
              <h4 className="font-bold text-akkfg-blue mb-1">Office Address</h4>
              <p className="text-slate-600">Sports Complex, Stadium Road, Ahmedabad, Gujarat 380009</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="w-12 h-12 bg-akkfg-blue/10 rounded-xl flex items-center justify-center text-akkfg-blue shrink-0">
              <Phone size={24} />
            </div>
            <div>
              <h4 className="font-bold text-akkfg-blue mb-1">Phone Number</h4>
              <p className="text-slate-600">+91 79 1234 5678</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
              <Mail size={24} />
            </div>
            <div>
              <h4 className="font-bold text-akkfg-blue mb-1">Email Address</h4>
              <p className="text-slate-600">info@akkfgujarat.in</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-200">
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">First Name</label>
              <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-akkfg-orange" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Last Name</label>
              <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-akkfg-orange" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Email Address</label>
            <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-akkfg-orange" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Message</label>
            <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-akkfg-orange resize-none"></textarea>
          </div>
          <button className="w-full bg-akkfg-blue text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-akkfg-blue/90 transition-all">
            Send Message
          </button>
        </form>
      </div>
    </div>
  </div>
);

const Dashboard = ({ user, onCompleteRegistration }: { user: User, onCompleteRegistration: () => void }) => {
  const [registration, setRegistration] = useState<RegistrationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user.role === 'Admin') {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem('akkfg_token');
    fetch('/api/registrations/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setRegistration(data);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-12">
        <h2 className="text-4xl text-akkfg-blue mb-2">User Dashboard</h2>
        <p className="text-slate-500">Manage your profile and view your federation status.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-akkfg-blue mb-6">Profile Overview</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Name</p>
                <p className="font-bold text-slate-700">{user.name}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</p>
                <p className="font-bold text-slate-700">{user.email}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Role</p>
                <p className="font-bold text-akkfg-orange">{user.role}</p>
              </div>
            </div>
          </div>

          {user.role !== 'Admin' && (
            loading ? (
              <div className="text-center py-20">
                <div className="animate-spin w-10 h-10 border-4 border-akkfg-orange border-t-transparent rounded-full mx-auto" />
              </div>
            ) : registration ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-akkfg-blue">Federation Status</h3>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${registration.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {registration.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Unique ID</p>
                    <p className="font-mono font-bold text-akkfg-blue">{registration.unique_id}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Registered Role</p>
                    <p className="font-bold text-akkfg-blue">{registration.role === 'Student' ? 'Player' : registration.role}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100 text-center">
                <Info className="mx-auto text-amber-500 mb-4" size={40} />
                <h3 className="text-xl font-bold text-amber-800 mb-2">Not Registered with Federation</h3>
                <p className="text-amber-700 mb-6">You haven't completed your federation registration yet. Register now to get your unique ID and ID card.</p>
                <button 
                  onClick={onCompleteRegistration}
                  className="bg-amber-600 text-white px-8 py-3 rounded-full font-bold hover:bg-amber-700 transition-colors"
                >
                  Complete Registration
                </button>
              </div>
            )
          )}
        </div>

        {user.role !== 'Admin' && (
          <div>
            <h3 className="text-xl font-bold text-akkfg-blue mb-6">Your ID Card</h3>
            {registration && registration.status === 'Approved' ? (
              <IDCard data={registration} />
            ) : (
              <div className="aspect-[3/4] bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-center p-8">
                <p>Your official ID card will be generated once your registration is approved by the federation.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
const AdminPanel = () => {
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTournamentForm, setShowTournamentForm] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [newTournament, setNewTournament] = useState({
    title: '',
    date: '',
    location: '',
    category: 'Senior',
    status: 'Upcoming'
  });

  const fetchData = async () => {
    console.log("AdminPanel: Fetching fresh data...");
    try {
      const token = localStorage.getItem('akkfg_token');
      const timestamp = Date.now();
      const [regsRes, statsRes, eventsRes] = await Promise.all([
        fetch(`/api/admin/registrations?t=${timestamp}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`/api/admin/stats?t=${timestamp}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`/api/events?t=${timestamp}`)
      ]);
      
      if (!regsRes.ok || !statsRes.ok || !eventsRes.ok) {
        throw new Error(`Fetch failed: Regs:${regsRes.status} Stats:${statsRes.status} Events:${eventsRes.status}`);
      }

      const regsData = await regsRes.json();
      const statsData = await statsRes.json();
      const eventsData = await eventsRes.json();
      
      console.log("AdminPanel: Data fetched successfully");
      
      setRegistrations(Array.isArray(regsData) ? regsData : []);
      setStats(statsData);
      setEvents(Array.isArray(eventsData) ? eventsData : []);
    } catch (err) {
      console.error("AdminPanel: Fetch data error:", err);
      alert("Failed to refresh data. Please check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    const token = localStorage.getItem('akkfg_token');
    await fetch(`/api/admin/registrations/${id}/status`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  const handleDeletePlayer = async (id: number) => {
    if (!window.confirm('Are you sure you want to remove this player registration? This action cannot be undone.')) return;
    
    try {
      const token = localStorage.getItem('akkfg_token');
      const response = await fetch(`/api/admin/registrations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        alert("Player registration removed successfully!");
        fetchData();
      } else {
        const result = await response.json();
        alert(`Error: ${result.error || 'Failed to remove player'}`);
      }
    } catch (err) {
      console.error("Delete player error:", err);
      alert("Failed to remove player. Please check your connection.");
    }
  };

  const handleCreateTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('akkfg_token');
    await fetch('/api/admin/events', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTournament)
    });
    setNewTournament({ title: '', date: '', location: '', category: 'Senior', status: 'Upcoming' });
    setShowTournamentForm(false);
    fetchData();
  };

  const handleDeleteTournament = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this tournament?')) return;
    
    try {
      console.log(`Attempting to delete tournament with ID: ${id}`);
      const token = localStorage.getItem('akkfg_token');
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const result = await response.json();
      console.log('Delete response:', result);

      if (response.ok) {
        alert("Tournament deleted successfully!");
        fetchData();
      } else {
        alert(`Error: ${result.error || 'Failed to delete tournament'}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete tournament. Please check your connection.");
    }
  };

  if (loading) return <div className="p-20 text-center">Loading Admin Panel...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl text-akkfg-blue mb-2">Admin Panel</h2>
          <p className="text-slate-500">Manage federation registrations and view system statistics.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowTournamentForm(true)}
            className="bg-akkfg-orange text-white px-6 py-3 rounded-2xl font-bold hover:bg-akkfg-orange/90 transition-all flex items-center gap-2"
          >
            <Plus size={18} /> Create Tournament
          </button>
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400">Total Users</p>
            <p className="text-xl font-bold text-akkfg-blue">{stats?.users}</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400">Total Regs</p>
            <p className="text-xl font-bold text-akkfg-blue">{stats?.registrations}</p>
          </div>
          <div className="bg-akkfg-orange/10 px-6 py-3 rounded-2xl border border-akkfg-orange/20 text-center">
            <p className="text-[10px] uppercase font-bold text-akkfg-orange">Pending</p>
            <p className="text-xl font-bold text-akkfg-orange">{stats?.pending}</p>
          </div>
        </div>
      </div>

      {showTournamentForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-akkfg-blue">Create Tournament</h3>
              <button onClick={() => setShowTournamentForm(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateTournament} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Tournament Title</label>
                <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-akkfg-orange" value={newTournament.title} onChange={e => setNewTournament({...newTournament, title: e.target.value})} placeholder="e.g. Gujarat State Senior Championship" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                  <input required type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-akkfg-orange" value={newTournament.date} onChange={e => setNewTournament({...newTournament, date: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Location</label>
                  <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-akkfg-orange" value={newTournament.location} onChange={e => setNewTournament({...newTournament, location: e.target.value})} placeholder="City" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-akkfg-orange" value={newTournament.category} onChange={e => setNewTournament({...newTournament, category: e.target.value})}>
                    <option>Senior</option>
                    <option>U-17</option>
                    <option>U-14</option>
                    <option>Open</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-akkfg-orange" value={newTournament.status} onChange={e => setNewTournament({...newTournament, status: e.target.value})}>
                    <option>Upcoming</option>
                    <option>Ongoing</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-akkfg-blue text-white py-4 rounded-xl font-bold shadow-lg hover:bg-akkfg-blue/90 transition-all mt-4">
                Create Event
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {selectedPlayer && (
        <ViewRegistrationModal 
          reg={selectedPlayer} 
          onClose={() => setSelectedPlayer(null)} 
        />
      )}

      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-2xl font-bold text-akkfg-blue">Federation Registrations</h3>
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{Array.isArray(registrations) ? registrations.length : 0}</span>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">ID / Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Role</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">District</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {Array.isArray(registrations) && registrations.map((reg: any) => (
                    <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-akkfg-blue">{reg.name}</p>
                        <p className="text-[10px] font-mono text-slate-400">{reg.unique_id}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${reg.role === 'Coach' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {reg.role === 'Student' ? 'Player' : reg.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{reg.address_city}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${reg.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : reg.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                          {reg.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button 
                          onClick={() => setSelectedPlayer(reg)}
                          className="text-xs font-bold text-akkfg-blue hover:underline"
                        >
                          View
                        </button>
                        {reg.status === 'Pending' && (
                          <>
                            <button 
                              onClick={() => updateStatus(reg.id, 'Approved')}
                              className="text-xs font-bold text-emerald-600 hover:underline"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => updateStatus(reg.id, 'Rejected')}
                              className="text-xs font-bold text-red-600 hover:underline"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleDeletePlayer(reg.id)}
                          className="text-xs font-bold text-slate-400 hover:text-red-600 transition-colors"
                          title="Remove Registration"
                        >
                          <Trash2 size={14} className="inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-2xl font-bold text-akkfg-blue">Manage Tournaments</h3>
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{Array.isArray(events) ? events.length : 0}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(events) && events.map((event: any) => (
              <div key={event.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${event.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : event.status === 'Ongoing' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                    {event.status}
                  </span>
                  <button 
                    onClick={() => handleDeleteTournament(event.id)}
                    className="p-2 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="Delete Tournament"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <h4 className="text-xl font-bold text-akkfg-blue mb-2 group-hover:text-akkfg-orange transition-colors">{event.title}</h4>
                <div className="space-y-2 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-akkfg-orange" />
                    <span>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-akkfg-orange" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy size={14} className="text-akkfg-orange" />
                    <span>{event.category} Category</span>
                  </div>
                </div>
              </div>
            ))}
            {Array.isArray(events) && events.length === 0 && (
              <div className="col-span-full py-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
                No tournaments created yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};


// --- Main App ---

const LoadingScreen = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <div className="w-24 h-24 mb-8 relative">
        <motion.div
          className="absolute inset-0 border-4 border-slate-200 rounded-full"
        />
        <motion.div
          className="absolute inset-0 border-4 border-akkfg-orange rounded-full border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Trophy className="text-akkfg-blue" size={32} />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-akkfg-blue mb-2">AKKFG</h2>
      <p className="text-slate-500 font-medium animate-pulse">Connecting to server...</p>
    </motion.div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isServerReady, setIsServerReady] = useState(false);

  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const data = await res.json();
          if (data.db === 'connected') {
            setIsServerReady(true);
            return true;
          }
        }
      } catch (e) {
        console.error("Server health check failed", e);
      }
      return false;
    };

    const initApp = async () => {
      // Initial check
      const ready = await checkServerHealth();
      if (ready) {
        // If ready, check auth
        checkAuth();
      } else {
        // If not ready, poll every 2 seconds
        const interval = setInterval(async () => {
          const isReady = await checkServerHealth();
          if (isReady) {
            clearInterval(interval);
            checkAuth();
          }
        }, 2000);
        return () => clearInterval(interval);
      }
    };

    initApp();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('akkfg_token');
    if (token) {
      fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.ok ? res.json() : null)
      .then(userData => {
        if (userData) setUser(userData);
        else localStorage.removeItem('akkfg_token');
      })
      .catch(() => localStorage.removeItem('akkfg_token'));
    }
  };

  const handleLogin = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('akkfg_token', token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('akkfg_token');
    setActiveTab('home');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  if (!isServerReady) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DbStatusBanner />
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user}
        onLogout={handleLogout}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'home' && <Home setActiveTab={setActiveTab} />}
            {activeTab === 'about' && <About />}
            {activeTab === 'events' && <Events />}
            {activeTab === 'register' && <Registration setActiveTab={setActiveTab} />}
            {activeTab === 'downloads' && <Downloads />}
            {activeTab === 'contact' && <Contact />}
            {activeTab === 'dashboard' && user && (
              <Dashboard 
                user={user} 
                onCompleteRegistration={() => setActiveTab('register')} 
              />
            )}
            {activeTab === 'admin' && user?.role === 'Admin' && (
              <>
                <AdminPanel />
                {/* ViewRegistrationModal is handled inside AdminPanel state, but we need to lift state up or pass props if we want it global. 
                    However, AdminPanel has its own state for selectedPlayer. 
                    Wait, AdminPanel is a component. I should add the modal INSIDE AdminPanel or pass it down.
                    Let's check AdminPanel definition again.
                */}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={handleLogin}
      />

      <Footer />
    </div>
  );
}
