import { Link } from 'react-router-dom';
import { Feather, BookOpen, Sparkles, FileText } from 'lucide-react';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  return (
    <div className={styles.landing}>
      {/* Hero Section */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <Feather className={styles.logoIcon} />
            <span className={styles.logoText}>Inkjet</span>
          </div>
          <nav className={styles.nav}>
            <Link to="/auth" className="btn btn-ghost">Sign In</Link>
            <Link to="/auth" className="btn btn-primary">Get Started</Link>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Write with <em>intelligence</em>,<br />
              powered by your knowledge
            </h1>
            <p className={styles.heroSubtitle}>
              A beautiful document editor that understands your references. 
              Add knowledge, let AI assist your writing, and craft documents 
              that draw from everything you know.
            </p>
            <div className={styles.heroCta}>
              <Link to="/auth" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
                Start Writing Free
              </Link>
              <span className={styles.heroNote}>No credit card required</span>
            </div>
          </div>
          
          <div className={styles.heroVisual}>
            <div className={styles.mockupWindow}>
              <div className={styles.mockupHeader}>
                <div className={styles.mockupDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className={styles.mockupTitle}>My Research Paper</span>
              </div>
              <div className={styles.mockupContent}>
                <div className={styles.mockupSidebar}>
                  <div className={styles.mockupKnowledge}>
                    <span>📚 Research Notes</span>
                    <span>📄 Source Material</span>
                    <span>🔗 References</span>
                  </div>
                </div>
                <div className={styles.mockupEditor}>
                  <div className={styles.mockupLine} style={{ width: '90%' }}></div>
                  <div className={styles.mockupLine} style={{ width: '75%' }}></div>
                  <div className={styles.mockupLine} style={{ width: '85%' }}></div>
                  <div className={styles.mockupLine} style={{ width: '60%' }}></div>
                  <div className={styles.mockupLine} style={{ width: '80%', marginTop: '1.5rem' }}></div>
                  <div className={styles.mockupLine} style={{ width: '70%' }}></div>
                  <div className={styles.mockupLine} style={{ width: '90%' }}></div>
                </div>
                <div className={styles.mockupAi}>
                  <Sparkles size={16} />
                  <span>AI Assistant</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.features}>
          <h2 className={styles.featuresTitle}>Everything you need to write brilliantly</h2>
          <div className={styles.featureGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <BookOpen size={28} />
              </div>
              <h3>Knowledge Library</h3>
              <p>Add reference materials, notes, and sources. Your AI assistant uses them to inform every suggestion.</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <Sparkles size={28} />
              </div>
              <h3>AI Writing Partner</h3>
              <p>An intelligent assistant that understands context. Get help writing, editing, and refining your prose.</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <FileText size={28} />
              </div>
              <h3>Beautiful Editor</h3>
              <p>A distraction-free writing environment with rich formatting. Focus on your words, not the interface.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <Feather size={20} />
            <span>Inkjet</span>
          </div>
          <p className={styles.footerText}>
            Crafted for writers who value their knowledge.
          </p>
        </div>
      </footer>
    </div>
  );
}

