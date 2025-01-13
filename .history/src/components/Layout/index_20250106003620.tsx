import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="layout">
      <header>
        <Link to="/" className="logo">
          <img src="/logo.svg" alt="Logo" />
        </Link>
        <nav>
          <Link to="/introduction">简介</Link>
          <Link to="/modeling">建模</Link>
          <Link to="/simulation">模拟</Link>
          <Link to="/evaluation">评估</Link>
          <Link to="/knowledge-base">知识库</Link>
        </nav>
      </header>
      
      <main>{children}</main>
      
      <footer>
        <div className="breadcrumbs">
          首页 {location.pathname !== '/' && `> ${getBreadcrumbName(location.pathname)}`}
        </div>
        <div className="footer-content">
          <div>联系方式</div>
          <div>条款</div>
          <div>隐私政策</div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 