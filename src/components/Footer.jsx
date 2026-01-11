import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-base-200 text-base-content border-t border-base-300">
            <div className="footer max-w-7xl mx-auto lg:flex lg:justify-between lg:items-center p-10">
                <aside>
                    <Link to="/" className="text-2xl font-black text-primary tracking-tight">
                        ContestHub
                    </Link>
                    <p className="max-w-xs text-base-content/70">
                        The ultimate platform for creative contests. Show your skills, win prizes, and get recognized.
                    </p>
                </aside>

                <nav>
                    <header className="footer-title">Quick Links</header>
                    <Link to="/" className="link link-hover">Home</Link>
                    <Link to="/all-contests" className="link link-hover">All Contests</Link>
                    <Link to="/leaderboard" className="link link-hover">Leaderboard</Link>
                    <Link to="/register" className="link link-hover">Join Now</Link>
                </nav>

                <nav>
                    <header className="footer-title">Company</header>
                    <Link to="/about" className="link link-hover">About Us</Link>
                    <Link to="/how-it-works" className="link link-hover">How It Works</Link>
                    <Link to="/contact" className="link link-hover">Contact</Link>
                    <Link to="/privacy" className="link link-hover">Privacy Policy</Link>
                </nav>

                <nav>
                    <header className="footer-title">Contact</header>
                    <a href="mailto:support@contesthub.com" className="link link-hover">ujjaldas827@gmail.com</a>
                    <span className="text-base-content/70">Sylhet, Bangladesh</span>

                    <div className="flex gap-4 mt-2">
                        <a href="https://www.linkedin.com/in/ujjal-web" className="text-xl hover:text-primary transition-colors"><FaLinkedin /></a>
                        <a href="https://github.com/Ujjal-web" className="text-xl hover:text-primary transition-colors"><FaGithub /></a>
                    </div>
                </nav>
            </div>

            <div className="footer footer-center p-4 border-t border-base-300 bg-base-200 text-base-content/60">
                <aside>
                    <p>Copyright © {new Date().getFullYear()} ContestHub - All rights reserved</p>
                </aside>
            </div>
        </footer>
    );
};

export default Footer;
