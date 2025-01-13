import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import LanguageIcon from '@mui/icons-material/Language';

const HeaderContainer = styled.header`
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: #333;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(Link)<{ active: boolean }>`
  text-decoration: none;
  color: ${props => props.active ? '#1890ff' : '#333'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  
  &:hover {
    color: #1890ff;
  }
`;

function Header() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };
  
  const navItems = [
    { path: '/introduction', label: t('nav.introduction') },
    { path: '/modeling', label: t('nav.modeling') },
    { path: '/simulation', label: t('nav.simulation') },
    { path: '/evaluation', label: t('nav.evaluation') },
    { path: '/knowledge-base', label: t('nav.knowledgeBase') },
  ];

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">{t('nav.home')}</Logo>
        <NavLinks>
          {navItems.map(item => (
            <NavLink 
              key={item.path}
              to={item.path}
              active={location.pathname === item.path}
            >
              {item.label}
            </NavLink>
          ))}
          <Button
            variant="outlined"
            startIcon={<LanguageIcon />}
            onClick={toggleLanguage}
            sx={{
              color: '#1890ff',
              borderColor: '#1890ff',
              '&:hover': {
                borderColor: '#1890ff',
                backgroundColor: 'rgba(24, 144, 255, 0.04)',
              },
              marginLeft: '16px',
              textTransform: 'none',
            }}
          >
            {i18n.language === 'zh' ? 'English' : '中文'}
          </Button>
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
}

export default Header;