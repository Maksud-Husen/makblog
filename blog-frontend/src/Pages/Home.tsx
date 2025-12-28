import { useEffect, useState } from 'react';
import PostCard from '../Components/PostCard';    

interface Post {
  id: number;      
  title: string;
  content: string;
  created_at: string;
  image: string;  
}

const Home = () => {
        const [posts,setPost] = useState<Post[]>([]);

 const api_call = async () => {
    const response = await fetch('/api/')
    const data = await response.json()
    setPost(data)
    console.log(data)
}

useEffect(()=>{
    api_call()
},[])




    return (
        <>
            {/* Header - Full Width */}
            <header className="flex items-center gap-3 border-b border-gray-600 px-4 py-4 bg-gray-700 w-full">
                <div className="flex items-center gap-3">
                    <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-gray-800 text-white">
                        <span className="text-xl font-bold">M</span>
                    </div>
                    <div className="flex flex-col cursor-pointer" onClick={() => window.location.reload()}>
                        <span className="text-lg font-semibold text-white">MakBlog</span>
                        <span className="text-xs text-gray-300">Personal Blog</span>
                    </div>
                </div>
            </header>

            {/* Content Area */}
            <div className="home-page">
                <div className="mb-4">
                    <h1 className="mb-3">Latest Posts</h1>
                    <p className="text-muted">Read our latest thoughts and updates.</p>
                </div>
                <div className="row">
                    {posts.map(post => (
                        <div className="col-md-4" key={post.id}>
                            <PostCard
                                id={post.id}
                                title={post.title}
                                contant={post.content}
                                created_at={post.created_at}
                                image={post.image}
                            />
                        </div> 
                    ))}
                </div>
            </div>
        </>
    );
};

export default Home;
