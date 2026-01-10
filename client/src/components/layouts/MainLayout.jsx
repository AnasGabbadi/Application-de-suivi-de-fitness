import { Outlet } from 'react-router-dom';
import HomeNavbar from '../common/HomeNavbar';
import HomeFooter from '../common/HomeFooter';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <HomeNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <HomeFooter />
    </div>
  );
};

export default MainLayout;