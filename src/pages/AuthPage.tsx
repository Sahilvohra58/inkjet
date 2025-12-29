import { useState } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
import { Link } from 'react-router-dom';
import { Feather, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import styles from './AuthPage.module.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuthActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn('password', {
        email,
        password,
        name: isLogin ? undefined : name,
        flow: isLogin ? 'signIn' : 'signUp',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <Link to="/" className={styles.backLink}>
          <Feather size={24} />
          <span>Inkjet</span>
        </Link>

        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <h1>{isLogin ? 'Welcome back' : 'Create your account'}</h1>
            <p>
              {isLogin 
                ? 'Sign in to continue writing with your knowledge' 
                : 'Start writing smarter with AI-powered assistance'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.authForm}>
            {!isLogin && (
              <div className={styles.inputGroup}>
                <label htmlFor="name">Full Name</label>
                <div className={styles.inputWrapper}>
                  <User size={18} className={styles.inputIcon} />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required={!isLogin}
                    className="input"
                    style={{ paddingLeft: '2.75rem' }}
                  />
                </div>
              </div>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email Address</label>
              <div className={styles.inputWrapper}>
                <Mail size={18} className={styles.inputIcon} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="input"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <div className={styles.inputWrapper}>
                <Lock size={18} className={styles.inputIcon} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? 'Enter your password' : 'Create a password'}
                  required
                  minLength={6}
                  className="input"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className={`btn btn-primary ${styles.submitBtn}`}
              disabled={loading}
            >
              {loading ? (
                <Loader2 size={18} className={styles.spinner} />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className={styles.authFooter}>
            <p>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className={styles.switchBtn}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        <p className={styles.terms}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>

      <div className={styles.decorative}>
        <div className={styles.decorativeContent}>
          <blockquote>
            "The art of writing is the art of discovering what you believe."
          </blockquote>
          <cite>— Gustave Flaubert</cite>
        </div>
      </div>
    </div>
  );
}

