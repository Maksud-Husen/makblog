import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer mt-auto py-3 bg-dark text-white">
            <div className="container text-center">
                <span>&copy; {new Date().getFullYear()} MakBlog. All rights reserved.</span>
            </div>
        </footer>
    );
};

export default Footer;
