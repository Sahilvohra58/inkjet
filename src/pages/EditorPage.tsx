import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { GenericId } from 'convex/values';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { 
  ArrowLeft,
  Save,
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Plus,
  X,
  BookOpen,
  Send,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
  Copy,
  Check
} from 'lucide-react';
import styles from './EditorPage.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const documentId = id as GenericId<"documents">;
  
  const document = useQuery(api.documents.get, { id: documentId });
  const knowledge = useQuery(api.knowledge.list, { documentId });
  const updateDocument = useMutation(api.documents.update);
  const createKnowledge = useMutation(api.knowledge.create);
  const deleteKnowledge = useMutation(api.knowledge.remove);
  const aiChat = useAction(api.ai.chat);
  
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [knowledgeSidebarOpen, setKnowledgeSidebarOpen] = useState(true);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(true);
  
  // Knowledge form state
  const [newKnowledgeTitle, setNewKnowledgeTitle] = useState('');
  const [newKnowledgeContent, setNewKnowledgeContent] = useState('');
  const [showKnowledgeForm, setShowKnowledgeForm] = useState(false);
  const [expandedKnowledge, setExpandedKnowledge] = useState<string | null>(null);
  
  // AI chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your document...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
    ],
    content: document?.content || '',
    editorProps: {
      attributes: {
        class: styles.proseMirror,
      },
    },
  });

  // Update editor content when document loads
  useEffect(() => {
    if (document && editor && !editor.isDestroyed) {
      if (editor.getHTML() !== document.content) {
        editor.commands.setContent(document.content || '');
      }
      setTitle(document.title);
    }
  }, [document, editor]);

  // Auto-save
  const saveDocument = useCallback(async () => {
    if (!editor || !document) return;
    
    setIsSaving(true);
    try {
      await updateDocument({
        id: documentId,
        title,
        content: editor.getHTML(),
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  }, [editor, document, documentId, title, updateDocument]);

  // Debounced auto-save on content change
  useEffect(() => {
    if (!editor) return;
    
    const handler = () => {
      const timeout = setTimeout(saveDocument, 2000);
      return () => clearTimeout(timeout);
    };
    
    editor.on('update', handler);
    return () => {
      editor.off('update', handler);
    };
  }, [editor, saveDocument]);

  const handleAddKnowledge = async () => {
    if (!newKnowledgeTitle.trim() || !newKnowledgeContent.trim()) return;
    
    await createKnowledge({
      documentId,
      title: newKnowledgeTitle,
      content: newKnowledgeContent,
    });
    
    setNewKnowledgeTitle('');
    setNewKnowledgeContent('');
    setShowKnowledgeForm(false);
  };

  const handleDeleteKnowledge = async (knowledgeId: GenericId<"knowledge">) => {
    await deleteKnowledge({ id: knowledgeId });
  };

  const handleAiChat = async () => {
    if (!aiInput.trim() || !editor) return;
    
    const userMessage = aiInput;
    setAiInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsAiLoading(true);
    
    try {
      const response = await aiChat({
        documentId,
        message: userMessage,
        currentContent: editor.getHTML(),
      });
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const insertAiResponse = (content: string) => {
    if (!editor) return;
    editor.chain().focus().insertContent(content).run();
  };

  const copyToClipboard = async (content: string, index: number) => {
    await navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatLastSaved = () => {
    if (!lastSaved && document) {
      return `Last saved ${new Date(document.updatedAt).toLocaleTimeString()}`;
    }
    if (!lastSaved) return '';
    return `Last saved ${lastSaved.toLocaleTimeString()}`;
  };

  if (!document) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading document...</p>
      </div>
    );
  }

  return (
    <div className={styles.editor}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="btn btn-ghost"
          >
            <ArrowLeft size={18} />
            Dashboard
          </button>
          <div className={styles.divider}></div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveDocument}
            placeholder="Untitled Document"
            className={styles.titleInput}
          />
        </div>
        <div className={styles.headerRight}>
          <span className={styles.saveStatus}>
            {isSaving ? (
              <>
                <Loader2 size={14} className={styles.spinner} />
                Saving...
              </>
            ) : (
              formatLastSaved()
            )}
          </span>
          <button 
            onClick={saveDocument} 
            className="btn btn-secondary"
            disabled={isSaving}
          >
            <Save size={16} />
            Save
          </button>
        </div>
      </header>

      <div className={styles.mainContainer}>
        {/* Left Sidebar - Knowledge */}
        <aside className={`${styles.sidebar} ${styles.knowledgeSidebar} ${knowledgeSidebarOpen ? styles.open : styles.closed}`}>
          <div className={styles.sidebarHeader}>
            <button 
              onClick={() => setKnowledgeSidebarOpen(!knowledgeSidebarOpen)}
              className={styles.sidebarToggle}
            >
              <BookOpen size={18} />
              <span>Knowledge</span>
              {knowledgeSidebarOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          </div>
          
          {knowledgeSidebarOpen && (
            <div className={styles.sidebarContent}>
              <p className={styles.sidebarDescription}>
                Add reference materials and sources. The AI will use these when assisting your writing.
              </p>
              
              {!showKnowledgeForm ? (
                <button 
                  onClick={() => setShowKnowledgeForm(true)}
                  className={`btn btn-secondary ${styles.addKnowledgeBtn}`}
                >
                  <Plus size={16} />
                  Add Knowledge
                </button>
              ) : (
                <div className={styles.knowledgeForm}>
                  <input
                    type="text"
                    placeholder="Title (e.g., Research Notes)"
                    value={newKnowledgeTitle}
                    onChange={(e) => setNewKnowledgeTitle(e.target.value)}
                    className="input"
                  />
                  <textarea
                    placeholder="Paste your reference content here..."
                    value={newKnowledgeContent}
                    onChange={(e) => setNewKnowledgeContent(e.target.value)}
                    className={styles.knowledgeTextarea}
                  />
                  <div className={styles.knowledgeFormActions}>
                    <button 
                      onClick={() => setShowKnowledgeForm(false)}
                      className="btn btn-ghost"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleAddKnowledge}
                      className="btn btn-primary"
                      disabled={!newKnowledgeTitle.trim() || !newKnowledgeContent.trim()}
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              <div className={styles.knowledgeList}>
                {knowledge?.map((item) => (
                  <div key={item._id} className={styles.knowledgeItem}>
                    <button
                      onClick={() => setExpandedKnowledge(
                        expandedKnowledge === item._id ? null : item._id
                      )}
                      className={styles.knowledgeItemHeader}
                    >
                      <BookOpen size={16} />
                      <span>{item.title}</span>
                      {expandedKnowledge === item._id ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                    {expandedKnowledge === item._id && (
                      <div className={styles.knowledgeItemContent}>
                        <p>{item.content}</p>
                        <button
                          onClick={() => handleDeleteKnowledge(item._id)}
                          className={styles.deleteKnowledgeBtn}
                        >
                          <X size={14} />
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Editor */}
        <main className={styles.editorMain}>
          {/* Toolbar */}
          <div className={styles.toolbar}>
            <div className={styles.toolbarGroup}>
              <button
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`${styles.toolbarBtn} ${editor?.isActive('bold') ? styles.active : ''}`}
                title="Bold"
              >
                <Bold size={16} />
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`${styles.toolbarBtn} ${editor?.isActive('italic') ? styles.active : ''}`}
                title="Italic"
              >
                <Italic size={16} />
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                className={`${styles.toolbarBtn} ${editor?.isActive('underline') ? styles.active : ''}`}
                title="Underline"
              >
                <UnderlineIcon size={16} />
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                className={`${styles.toolbarBtn} ${editor?.isActive('strike') ? styles.active : ''}`}
                title="Strikethrough"
              >
                <Strikethrough size={16} />
              </button>
            </div>

            <div className={styles.toolbarDivider}></div>

            <div className={styles.toolbarGroup}>
              <button
                onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                className={`${styles.toolbarBtn} ${editor?.isActive({ textAlign: 'left' }) ? styles.active : ''}`}
                title="Align Left"
              >
                <AlignLeft size={16} />
              </button>
              <button
                onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                className={`${styles.toolbarBtn} ${editor?.isActive({ textAlign: 'center' }) ? styles.active : ''}`}
                title="Align Center"
              >
                <AlignCenter size={16} />
              </button>
              <button
                onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                className={`${styles.toolbarBtn} ${editor?.isActive({ textAlign: 'right' }) ? styles.active : ''}`}
                title="Align Right"
              >
                <AlignRight size={16} />
              </button>
            </div>

            <div className={styles.toolbarDivider}></div>

            <div className={styles.toolbarGroup}>
              <button
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={`${styles.toolbarBtn} ${editor?.isActive('bulletList') ? styles.active : ''}`}
                title="Bullet List"
              >
                <List size={16} />
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                className={`${styles.toolbarBtn} ${editor?.isActive('orderedList') ? styles.active : ''}`}
                title="Numbered List"
              >
                <ListOrdered size={16} />
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                className={`${styles.toolbarBtn} ${editor?.isActive('blockquote') ? styles.active : ''}`}
                title="Quote"
              >
                <Quote size={16} />
              </button>
            </div>

            <div className={styles.toolbarDivider}></div>

            <div className={styles.toolbarGroup}>
              <button
                onClick={() => editor?.chain().focus().undo().run()}
                className={styles.toolbarBtn}
                disabled={!editor?.can().undo()}
                title="Undo"
              >
                <Undo size={16} />
              </button>
              <button
                onClick={() => editor?.chain().focus().redo().run()}
                className={styles.toolbarBtn}
                disabled={!editor?.can().redo()}
                title="Redo"
              >
                <Redo size={16} />
              </button>
            </div>
          </div>

          {/* Editor Content */}
          <div className={styles.editorWrapper}>
            <EditorContent editor={editor} className={styles.editorContent} />
          </div>
        </main>

        {/* Right Sidebar - AI Chat */}
        <aside className={`${styles.sidebar} ${styles.aiSidebar} ${aiSidebarOpen ? styles.open : styles.closed}`}>
          <div className={styles.sidebarHeader}>
            <button 
              onClick={() => setAiSidebarOpen(!aiSidebarOpen)}
              className={styles.sidebarToggle}
            >
              <Sparkles size={18} />
              <span>AI Assistant</span>
              {aiSidebarOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          </div>
          
          {aiSidebarOpen && (
            <div className={styles.aiContent}>
              <div className={styles.aiMessages}>
                {messages.length === 0 ? (
                  <div className={styles.aiWelcome}>
                    <Sparkles size={32} />
                    <h3>AI Writing Assistant</h3>
                    <p>Ask me to help you write, edit, or improve your document. I'll use your knowledge sources for context.</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`${styles.aiMessage} ${styles[msg.role]}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className={styles.aiMessageHeader}>
                          <Sparkles size={14} />
                          <span>Assistant</span>
                        </div>
                      )}
                      <div className={styles.aiMessageContent}>
                        {msg.content}
                      </div>
                      {msg.role === 'assistant' && (
                        <div className={styles.aiMessageActions}>
                          <button
                            onClick={() => insertAiResponse(msg.content)}
                            className={styles.aiActionBtn}
                          >
                            <Plus size={14} />
                            Insert
                          </button>
                          <button
                            onClick={() => copyToClipboard(msg.content, index)}
                            className={styles.aiActionBtn}
                          >
                            {copiedIndex === index ? (
                              <><Check size={14} /> Copied</>
                            ) : (
                              <><Copy size={14} /> Copy</>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
                {isAiLoading && (
                  <div className={`${styles.aiMessage} ${styles.assistant}`}>
                    <div className={styles.aiMessageHeader}>
                      <Sparkles size={14} />
                      <span>Assistant</span>
                    </div>
                    <div className={styles.aiTyping}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.aiInputWrapper}>
                <textarea
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAiChat();
                    }
                  }}
                  placeholder="Ask AI to write or edit..."
                  className={styles.aiInput}
                  rows={3}
                />
                <button
                  onClick={handleAiChat}
                  disabled={!aiInput.trim() || isAiLoading}
                  className={`btn btn-primary ${styles.aiSendBtn}`}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

