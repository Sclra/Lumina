import { useState } from 'react';
import { ThemeProvider, useTheme } from './theme';
import { LangProvider, useLang } from './lang';
import { ManagerProvider } from './managerStore';
import BottomNav from './components/BottomNav';
import ManagerNav from './components/ManagerNav';
import SignIn from './screens/SignIn';
import Home from './screens/Home';
import Payments from './screens/Payments';
import PaymentDetail from './screens/PaymentDetail';
import MonthlyDetail from './screens/MonthlyDetail';
import Reservations from './screens/Reservations';
import ReservationBooking from './screens/ReservationBooking';
import News from './screens/News';
import NewsDetail from './screens/NewsDetail';
import Settings from './screens/Settings';
import Preferences from './screens/Preferences';
import ManagerSetup from './screens/manager/ManagerSetup';
import ManagerDashboard from './screens/manager/ManagerDashboard';
import ManagerUnits from './screens/manager/ManagerUnits';
import ManagerUnitNew from './screens/manager/ManagerUnitNew';
import ManagerUnitDetail from './screens/manager/ManagerUnitDetail';
import ManagerBilling from './screens/manager/ManagerBilling';
import ManagerChargeNew from './screens/manager/ManagerChargeNew';
import ManagerNews from './screens/manager/ManagerNews';
import ManagerNewsNew from './screens/manager/ManagerNewsNew';
import ManagerTeam from './screens/manager/ManagerTeam';
import ManagerStaffNew from './screens/manager/ManagerStaffNew';
import FAQ from './screens/FAQ';
import Feedback from './screens/Feedback';
import LanguageSettings from './screens/LanguageSettings';
import NotificationsSettings from './screens/NotificationsSettings';
import Accounts from './screens/Accounts';
import NewsCreate from './screens/NewsCreate';

export type Screen =
  | 'signin' | 'home' | 'payments'
  | 'payment-detail' | 'monthly-detail'
  | 'reservations' | 'reservation-booking' | 'reservation-success'
  | 'news' | 'news-detail' | 'news-create'
  | 'settings' | 'preferences'
  | 'faq' | 'feedback' | 'language-settings' | 'notifications-settings' | 'accounts'
  | 'm-setup' | 'm-settings' | 'm-dashboard' | 'm-units' | 'm-unit-new' | 'm-unit-detail'
  | 'm-billing' | 'm-charge-new' | 'm-news' | 'm-news-new'
  | 'm-team' | 'm-staff-new';

export type PaymentType = 'apartment' | 'water' | 'energy';
export type Amenity = 'gym' | 'rooftop' | 'pool';

export interface NavParams {
  paymentType?: PaymentType;
  month?: number;
  amenity?: Amenity;
  bookingDate?: string;
  bookingTime?: string;
  newsId?: number;
  unitId?: string;
  isManager?: boolean;
}

export interface NavProps {
  navigate: (screen: Screen, params?: NavParams) => void;
  goBack: () => void;
  params: NavParams;
}

const TAB_SCREENS: Screen[] = ['home', 'payments', 'reservations', 'news', 'settings'];
const MANAGER_TAB_SCREENS: Screen[] = ['m-settings', 'm-dashboard', 'm-units', 'm-billing', 'm-news', 'm-team'];

function PhoneShell() {
  const { t } = useTheme();
  const { dir } = useLang();
  const [screen, setScreen] = useState<Screen>('signin');
  const [historyScreens, setHistoryScreens] = useState<Screen[]>([]);
  const [historyParams, setHistoryParams] = useState<NavParams[]>([]);
  const [params, setParams] = useState<NavParams>({});

  const navigate = (s: Screen, p?: NavParams) => {
    setHistoryScreens(prev => [...prev, screen]);
    setHistoryParams(prev => [...prev, params]);
    setScreen(s);
    setParams(p ?? {});
    document.querySelector('.app-scroll')?.scrollTo(0, 0);
  };

  const goBack = () => {
    const prev = historyScreens[historyScreens.length - 1];
    const prevP = historyParams[historyParams.length - 1];
    setHistoryScreens(h => h.slice(0, -1));
    setHistoryParams(h => h.slice(0, -1));
    setScreen(prev ?? 'home');
    setParams(prevP ?? {});
    document.querySelector('.app-scroll')?.scrollTo(0, 0);
  };

  const showBottomNav = TAB_SCREENS.includes(screen);
  const showManagerNav = MANAGER_TAB_SCREENS.includes(screen);
  const navProps: NavProps = { navigate, goBack, params };

  return (
    <div
      className="phone-shell w-full flex flex-col relative"
      style={{
        background: t.bg,
        transition: 'background 0.3s',
      }}
    >
      <div className="app-scroll min-h-0 flex-1 overflow-y-auto scrollbar-hide" dir={dir}>
        {screen === 'signin' && <SignIn {...navProps} />}
        {screen === 'home' && <Home {...navProps} />}
        {screen === 'payments' && <Payments {...navProps} />}
        {screen === 'payment-detail' && <PaymentDetail {...navProps} />}
        {screen === 'monthly-detail' && <MonthlyDetail {...navProps} />}
        {screen === 'reservations' && <Reservations {...navProps} />}
        {screen === 'reservation-booking' && <ReservationBooking {...navProps} />}
        {screen === 'news' && <News {...navProps} />}
        {screen === 'news-detail' && <NewsDetail {...navProps} />}
        {screen === 'news-create' && <NewsCreate {...navProps} />}
        {screen === 'settings' && <Settings {...navProps} />}
        {screen === 'preferences' && <Preferences {...navProps} />}
        {screen === 'faq' && <FAQ {...navProps} />}
        {screen === 'feedback' && <Feedback {...navProps} />}
        {screen === 'language-settings' && <LanguageSettings {...navProps} />}
        {screen === 'notifications-settings' && <NotificationsSettings {...navProps} />}
        {screen === 'accounts' && <Accounts {...navProps} />}
        {screen === 'm-setup' && <ManagerSetup {...navProps} />}
        {screen === 'm-settings' && <Settings {...navProps} params={{ ...params, isManager: true }} />}
        {screen === 'm-dashboard' && <ManagerDashboard {...navProps} />}
        {screen === 'm-units' && <ManagerUnits {...navProps} />}
        {screen === 'm-unit-new' && <ManagerUnitNew {...navProps} />}
        {screen === 'm-unit-detail' && <ManagerUnitDetail {...navProps} />}
        {screen === 'm-billing' && <ManagerBilling {...navProps} />}
        {screen === 'm-charge-new' && <ManagerChargeNew {...navProps} />}
        {screen === 'm-news' && <ManagerNews {...navProps} />}
        {screen === 'm-news-new' && <ManagerNewsNew {...navProps} />}
        {screen === 'm-team' && <ManagerTeam {...navProps} />}
        {screen === 'm-staff-new' && <ManagerStaffNew {...navProps} />}
      </div>
      {showBottomNav && <BottomNav active={screen} navigate={navigate} />}
      {showManagerNav && <ManagerNav active={screen} navigate={navigate} />}
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
    <ThemeProvider>
      <ManagerProvider>
        <div
          className="app-viewport min-h-screen flex items-center justify-center p-4 py-8"
          style={{ background: '#0E1210' }}
        >
          <PhoneShell />
        </div>
      </ManagerProvider>
    </ThemeProvider>
    </LangProvider>
  );
}
