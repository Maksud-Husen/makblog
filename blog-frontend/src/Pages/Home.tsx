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
        <div className="home-page">
            <div className="mb-4">
                <h1 className="mb-3">Latest Posts</h1>
                <p className="text-muted">Read our latest thoughts and updates.</p>
            </div>
            <div className="row">
                {posts.map(post => (
                    <div className="col-md-6" key={post.id}>
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
    );
};

export default Home;
