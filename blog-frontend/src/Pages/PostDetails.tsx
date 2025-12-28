import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface Post {
id: number;      
title: string;
content: string;
created_at: string;
image: string;  
}

const PostDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);

    const getDetail =  async()=>{
        try {
            const response = await fetch(`/api/${id}/`)
            if (response.ok) {
                const data = await response.json()
                setPost(data)
            } else {
                console.error("Failed to fetch post");
            }
        } catch (error) {
            console.error("Error fetching post:", error);
        }
    }

    useEffect(()=>{
        getDetail()
    },[id])

    if (!post) {
        return (
            <div className="text-center mt-5">
                <h2>Post not found</h2>
                <Link to="/" className="btn btn-primary mt-3">Back to Home</Link>
            </div>
        );
    }

    return (
        <>
            {/* Header - Full Width */}
            <header className="flex items-center gap-3 border-b border-gray-600 px-4 py-3 bg-gray-700 w-full">
                <div className="flex items-center gap-3">
                    <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-gray-800 text-white">
                        <span className="text-xl font-bold cursor-pointer" onClick={() => window.location.href = '/'}>M</span>
                    </div>
                    <div className="flex flex-col cursor-pointer" onClick={() => window.location.href = '/'}>
                        <span className="text-lg font-semibold text-white">MakBlog</span>
                        <span className="text-xs text-gray-300">Personal Blog</span>
                    </div>
                </div>
            </header>

            {/* Content Area */}
            <div className="w-full px-4 py-4">
                <div className="max-w-4xl mx-auto">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">{post.title}</li>
                        </ol>
                    </nav>
                
                    <article>
                        <figure className="mb-4">
                            <img className="rounded w-full max-w-lg object-cover" src={post.image} alt={post.title} style={{ maxHeight: '500px' }} />
                        </figure>
                        <header className="mb-4">
                            <h1 className="fw-bolder mb-1">{post.title}</h1>
                            <div className="text-muted fst-italic mb-2">Posted on {new Date(post.created_at).toLocaleDateString()} </div>
                        </header>
                        <section className="mb-5">
                            <p className="fs-5 mb-4">{post.content}</p>
                        </section>
                    </article>
                    
                    <div className="mt-5">
                        <Link to="/" className="btn btn-secondary">&larr; Back to Posts</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostDetails;
