import { useEffect, useState } from 'react';

import { Edit, Trash, FileText, Eye, MessageSquare } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"

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

function AdminContent({ activeTab }: { activeTab: 'dashboard' | 'posts' }) {
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
                 // Check if the response is JSON
                const contentType = response.headers.get("content-type") || "";
                let errData;

                if (contentType.includes("application/json")) {
                    errData = await response.json();
                } else {
                    // Fallback: read as text (HTML error page, etc.)
                    errData = await response.text();
                }

                console.error(`${modalMode === 'create' ? 'Creation' : 'Update'} error:`, errData);
                alert(`Post ${modalMode === 'create' ? 'creation' : 'update'} failed`);
}
        } catch (error) {
            console.error("Submission error:", error);
            alert(`An error occurred during post ${modalMode === 'create' ? 'creation' : 'update'}`);
        }
    };

    return (
        <>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-600 px-4 bg-sidebar text-white">
                    <SidebarTrigger className="-ml-1" />
                    <div className="h-8 w-px bg-gray-400" />
                    <h1 className="text-lg font-semibold capitalize text-white">{activeTab}</h1>
                    <div className="flex-1">
                        {/* Empty space for future content */}
                    </div>
                </header>
                <main className="flex-1 p-6">
                    {loading ? (
                        <div className="text-center">Loading...</div>
                    ) : (
                        <>
                            {activeTab === 'dashboard' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <Card className="hover:shadow-md transition-shadow">
                                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                                <CardTitle className="text-sm font-medium text-gray-500">Total Posts</CardTitle>
                                                <FileText className="w-4 h-4 text-gray-400" />
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
                                                <p className="text-xs text-gray-500 mt-1">published on blog</p>
                                            </CardContent>
                                        </Card>

                                        <Card className="hover:shadow-md transition-shadow">
                                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                                <CardTitle className="text-sm font-medium text-gray-500">Total Views</CardTitle>
                                                <Eye className="w-4 h-4 text-gray-400" />
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold text-gray-900">1.2k</div>
                                                <p className="text-xs text-gray-500 mt-1">all time views</p>
                                            </CardContent>
                                        </Card>

                                        <Card className="hover:shadow-md transition-shadow">
                                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                                <CardTitle className="text-sm font-medium text-gray-500">Comments</CardTitle>
                                                <MessageSquare className="w-4 h-4 text-gray-400" />
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold text-gray-900">45</div>
                                                <p className="text-xs text-gray-500 mt-1">user interactions</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'posts' && (
                                <div className="posts-view">
                                    <div className="flex justify-end mb-4">
                                        <button 
                                            className="bg-[#343a40] text-white px-6 py-2 rounded-full hover:bg-gray-700 transition-colors font-semibold" 
                                            onClick={handleAddPost}
                                        >
                                            + Post
                                        </button>
                                    </div>
                                    <div className="posts-table-container">
                                        <Table className="caption-center">
                                            <TableHeader>
                                                <TableRow className="bg-gray-600 hover:bg-gray-600">
                                                    <TableHead className="w-[100px] text-center text-white">ID</TableHead>
                                                    <TableHead className="text-center text-white">Title</TableHead>
                                                    <TableHead className="text-center text-white">Date</TableHead>
                                                    <TableHead className="text-center text-white">Action</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {posts.map((post, index) => (
                                                    <TableRow key={post.id}>
                                                        <TableCell className="text-center">{index + 1}</TableCell>
                                                        <TableCell className="text-center">{post.title}</TableCell>
                                                        <TableCell className="text-center">{new Date(post.created_at).toLocaleDateString()}</TableCell>
                                                        <TableCell className="text-center flex justify-center gap-4">
                                                            <Edit 
                                                                className="w-5 h-5 cursor-pointer text-blue-500 hover:text-blue-700" 
                                                                onClick={() => handleEdit(post.id)}
                                                            />
                                                            <Trash 
                                                                className="w-5 h-5 cursor-pointer text-red-500 hover:text-red-700" 
                                                                onClick={() => handleDelete(post.id)}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {posts.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="text-center text-muted-foreground p-4">No posts found.</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </SidebarInset>

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
        </>
    );
}

const Admin = () => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'posts'>('dashboard');

    return (
        <SidebarProvider>
            <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <AdminContent activeTab={activeTab} />
        </SidebarProvider>
    );
};

export default Admin;
