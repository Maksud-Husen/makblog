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

            {/* Add/Edit Post Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {modalMode === 'create' ? 'Create New Post' : 'Edit Post'}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {modalMode === 'create' 
                                        ? 'Fill in the details below to create a new blog post' 
                                        : 'Update the post information below'}
                                </p>
                            </div>
                            <button 
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                            <form onSubmit={handleSubmitPost} className="space-y-6">
                                {/* Title Field */}
                                <div className="space-y-2">
                                    <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
                                        Post Title
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <p className="text-xs text-gray-500">Enter a catchy title for your blog post</p>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={newPost.title}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g., Getting Started with React"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>

                                {/* Content Field */}
                                <div className="space-y-2">
                                    <label htmlFor="content" className="block text-sm font-semibold text-gray-700">
                                        Post Content
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <p className="text-xs text-gray-500">Write the main content of your post</p>
                                    <textarea
                                        id="content"
                                        name="content"
                                        value={newPost.content}
                                        onChange={handleInputChange}
                                        rows={6}
                                        required
                                        placeholder="Enter your post content here..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                    />
                                </div>

                                {/* Image Field */}
                                <div className="space-y-2">
                                    <label htmlFor="image" className="block text-sm font-semibold text-gray-700">
                                        Featured Image
                                        {modalMode === 'create' && <span className="text-gray-400 ml-1 font-normal">(Optional)</span>}
                                    </label>
                                    <p className="text-xs text-gray-500">Upload an image to accompany your post (JPG, PNG, or GIF)</p>
                                    
                                    {/* Current Image Preview */}
                                    {currentImageUrl && !newPost.image && (
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <p className="text-xs font-medium text-gray-600 mb-2">Current Image:</p>
                                            <img 
                                                src={currentImageUrl} 
                                                alt="Current" 
                                                className="max-w-xs h-auto rounded-md border border-gray-300"
                                            />
                                        </div>
                                    )}

                                    {/* New Image Preview */}
                                    {newPost.image && (
                                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                            <p className="text-xs font-medium text-blue-600 mb-2">New Image Selected:</p>
                                            <div className="flex items-center gap-2">
                                                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-sm text-gray-700">{newPost.image.name}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* File Input */}
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
                                    />
                                </div>

                                {/* Form Actions */}
                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        {modalMode === 'create' ? 'Create Post' : 'Update Post'}
                                    </button>
                                </div>
                            </form>
                        </div>
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
