import SecuritySettings from '@/components/SecuritySettings';
import { MOCK_SESSIONS } from '@/components/SecuritySettings/SecuritySettings.mocks';

export default function SettingsPage() {
  return <SecuritySettings sessions={MOCK_SESSIONS} />;
}
