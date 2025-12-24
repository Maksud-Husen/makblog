import React from 'react';
import { Link } from 'react-router-dom';
import './PostCard.css';

interface PostCardProps {
    id: number;
    title: string;
    contant: string;
    created_at: string;
    image?: string;
}

const PostCard: React.FC<PostCardProps> = ({ id, title, contant, created_at, image }) => {
    return (
        <div className="card mb-4 shadow-sm post-card">
            <img src={image} className="card-img-top" alt="Post Cover" style={{ height: '200px', objectFit: 'cover' }} />
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{contant.slice(0,100) + "..."}</p>
                <div className="text-muted mb-2 small">
                    <span>{new Date(created_at).toLocaleDateString()}</span> 
                </div>
                <Link to={`/post/${id}`} className="btn btn-outline-primary btn-sm">
                    Read More &rarr;
                </Link>
            </div>
            
        </div>
    );
};

export default PostCard;
