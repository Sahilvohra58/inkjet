import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { useAuthActions } from '@convex-dev/auth/react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../convex/_generated/api';
import { 
  Feather, 
  Plus, 
  FileText, 
  Trash2, 
  LogOut, 
  Clock,
  MoreVertical,
  Search 
} from 'lucide-react';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const documents = useQuery(api.documents.list);
  const createDocument = useMutation(api.documents.create);
  const deleteDocument = useMutation(api.documents.remove);
  const { signOut } = useAuthActions();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleCreateDocument = async () => {
    const id = await createDocument({ title: 'Untitled Document' });
    navigate(`/document/${id}`);
  };

  const handleDeleteDocument = async (id: string) => {
    await deleteDocument({ id: id as any });
    setActiveMenu(null);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const filteredDocuments = documents?.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <Feather className={styles.logoIcon} />
            <span className={styles.logoText}>Inkjet</span>
          </div>
          <button 
            onClick={() => signOut()} 
            className="btn btn-ghost"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.titleSection}>
            <h1>Your Documents</h1>
            <p>Create, edit, and manage your documents with AI assistance</p>
          </div>

          <div className={styles.toolbar}>
            <div className={styles.searchWrapper}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input"
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
            <button 
              onClick={handleCreateDocument}
              className="btn btn-primary"
            >
              <Plus size={18} />
              New Document
            </button>
          </div>

          {documents === undefined ? (
            <div className={styles.loading}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading your documents...</p>
            </div>
          ) : filteredDocuments && filteredDocuments.length > 0 ? (
            <div className={styles.documentGrid}>
              {filteredDocuments.map((doc, index) => (
                <div 
                  key={doc._id}
                  className={styles.documentCard}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => navigate(`/document/${doc._id}`)}
                >
                  <div className={styles.documentIcon}>
                    <FileText size={24} />
                  </div>
                  <div className={styles.documentInfo}>
                    <h3>{doc.title || 'Untitled Document'}</h3>
                    <p>
                      <Clock size={14} />
                      {formatDate(doc.updatedAt)}
                    </p>
                  </div>
                  <div className={styles.documentActions}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === doc._id ? null : doc._id);
                      }}
                      className="btn btn-icon btn-ghost"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {activeMenu === doc._id && (
                      <div className={styles.dropdownMenu}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDocument(doc._id);
                          }}
                          className={styles.deleteBtn}
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <FileText size={48} />
              </div>
              <h2>No documents yet</h2>
              <p>Create your first document to start writing with AI assistance</p>
              <button 
                onClick={handleCreateDocument}
                className="btn btn-primary"
              >
                <Plus size={18} />
                Create Your First Document
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

