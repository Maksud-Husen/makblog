import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout as authLogout } from '../service/auth';
import '../Components/Admin.css';

interface Post {
    id: number;
    title: string;
    content: string;
    created_at: string;
    image: string;
}

interface NewPost {
    title: string;
    content: string;
    image: File | null;
}

const Admin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'posts'>('dashboard');
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
    const [newPost, setNewPost] = useState<NewPost>({
        title: '',
        content: '',
        image: null
    });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/');
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
      if (!window.confirm("Are you sure you want to delete this post?")) return;
  
      try {
        const response = await fetch(`/api/delete/${id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          },
        });
  
        if (response.ok) {
          alert("Post deleted successfully");
          setPosts(posts.filter(post => post.id !== id));
        } else {
          const err = await response.json();
          console.error(err);
          alert("Delete failed");
        }
      } catch (error) {
        console.error("Delete error:", error);
      }
    };


    const handleEdit = async (id: number) => {
        try {
            const response = await fetch(`/api/${id}/`);
            if (response.ok) {
                const data = await response.json();
                setNewPost({
                    title: data.title,
                    content: data.content,
                    image: null
                });
                setEditingId(id);
                setCurrentImageUrl(data.image);
                setModalMode('edit');
                setShowModal(true);
            } else {
                alert("Failed to fetch post details");
            }
        } catch (error) {
            console.error("Error fetching post details:", error);
            alert("An error occurred while fetching post details");
        }
    };

    const handleAddPost = () => {
        setModalMode('create');
        setEditingId(null);
        setCurrentImageUrl(null);
        setNewPost({ title: '', content: '', image: null });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewPost({ title: '', content: '', image: null });
        setCurrentImageUrl(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewPost(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setNewPost(prev => ({ ...prev, image: file }));
    };

    const handleSubmitPost = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', newPost.title);
        formData.append('content', newPost.content);
        if (newPost.image) {
            formData.append('image', newPost.image);
        }

        const url = modalMode === 'create' ? '/api/create/' : `/api/update/${editingId}/`;
        const method = modalMode === 'create' ? 'POST' : 'PUT';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: formData,
            });

            if (response.ok) {
                alert(`Post ${modalMode === 'create' ? 'created' : 'updated'} successfully`);
                handleCloseModal();
                fetchPosts(); // Refresh the list
            } else {
                const err = await response.json();
                console.error(`${modalMode === 'create' ? 'Creation' : 'Update'} error:`, err);
                alert(`Post ${modalMode === 'create' ? 'creation' : 'update'} failed`);
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert(`An error occurred during post ${modalMode === 'create' ? 'creation' : 'update'}`);
        }
    };

    const handleLogout = () => {
        authLogout();
        navigate('/login');
    };

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <h3>Admin Panel</h3>
                <ul className="sidebar-menu">
                    <li>
                        <button 
                            className={activeTab === 'dashboard' ? 'active' : ''} 
                            onClick={() => setActiveTab('dashboard')}
                        >
                            Dashboard
                        </button>
                    </li>
                    <li>
                        <button 
                            className={activeTab === 'posts' ? 'active' : ''} 
                            onClick={() => setActiveTab('posts')}
                        >
                            Posts
                        </button>
                    </li>
                </ul>
                <div className="sidebar-logout">
                    <button className="btn-logout" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </aside>

            <main className="admin-content">
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <>
                        {activeTab === 'dashboard' && (
                            <div className="dashboard-view">
                                <h1 className="mb-4">Dashboard</h1>
                                <div className="stats-grid">
                                    <div className="stat-card">
                                        <h4>Total Posts</h4>
                                        <div className="count">{posts.length}</div>
                                        <p className="text-muted small">published on blog</p>
                                    </div>
                                    <div className="stat-card">
                                        <h4>Total Views</h4>
                                        <div className="count">1.2k</div> {/* Dummy data */}
                                        <p className="text-muted small">all time views</p>
                                    </div>
                                    <div className="stat-card">
                                        <h4>Comments</h4>
                                        <div className="count">45</div> {/* Dummy data */}
                                        <p className="text-muted small">user interactions</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'posts' && (
                            <div className="posts-view">
                                <div className="posts-header">
                                    <h1 className="mb-4">Manage Posts</h1>
                                    <button className="btn-add-post" onClick={handleAddPost}>
                                        + Post
                                    </button>
                                </div>
                                <div className="posts-table-container">
                                    <table className="posts-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Title</th>
                                                <th>Date</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {posts.map((post, index) => (
                                                <tr key={post.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{post.title}</td>
                                                    <td>{new Date(post.created_at).toLocaleDateString()}</td>
                                                    <td>
                                                        <button 
                                                            className="action-btn btn-edit"
                                                            onClick={() => handleEdit(post.id)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            className="action-btn btn-delete"
                                                            onClick={() => handleDelete(post.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {posts.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="text-center text-muted">No posts found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Add Post Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{modalMode === 'create' ? 'Add New Post' : 'Edit Post'}</h2>
                            <button className="modal-close" onClick={handleCloseModal}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmitPost}>
                            <div className="form-group">
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={newPost.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="content"
                                    value={newPost.content}
                                    onChange={handleInputChange}
                                    rows={4}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="image">Image</label>
                                {currentImageUrl && !newPost.image && (
                                    <div className="current-image-preview mb-2">
                                        <p className="small text-muted mb-1">Current Image:</p>
                                        <img src={currentImageUrl} alt="Current" style={{ maxWidth: '100px', borderRadius: '4px' }} />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <button type="submit" className="btn-submit">
                                {modalMode === 'create' ? 'Create Post' : 'Update Post'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
