// File: app/components/controls/panels/SystemSettingsPanel.tsx | Version: v2.3.2
import React, { useState, useEffect } from 'react';
import { SettingsToggle } from '../../visualizers/ui/controls/SettingsToggle';
import { useVisuals, useUI } from '@/src/context/AppContext';
import { CustomSelect } from '../../visualizers/ui/controls/CustomSelect';
import { SegmentedControl } from '../../visualizers/ui/controls/SegmentedControl';
import { BentoCard } from '../../visualizers/ui/layout/BentoCard';
import { Language } from '../../../types/index';
import { PresetManager } from './system/PresetManager';
import { LoginButton } from '../../auth/LoginButton';
import { LoginForm } from '../../auth/LoginForm';
import { useAuth } from '../../auth/AuthProvider';
import { Button } from '../../ui/button';
import { saveSettingsToCloud, loadSettingsFromCloud, getLastSyncTime } from '@/src/services/cloudStorageService';
import { Cloud, User as UserIcon, RefreshCw, Save, Download, AlertCircle } from 'lucide-react';

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' }, { value: 'zh', label: '简体中文' }, { value: 'zh-TW', label: '繁體中文' },
  { value: 'ja', label: '日本語' }, { value: 'es', label: 'Español' }, { value: 'ko', label: '한국儿' },
  { value: 'de', label: 'Deutsch' }, { value: 'fr', label: 'Français' }, { value: 'ru', label: 'Русский' },
  { value: 'ar', label: 'العربية' }, { value: 'pt', label: 'Português' }, { value: 'pt-BR', label: 'Português (Brasil)' }
];

const CloudSyncSection: React.FC<{ uid: string }> = ({ uid }) => {
  const { settings, setSettings } = useVisuals();
  const { t, showToast } = useUI();
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [permissionError, setPermissionError] = useState(false);

  useEffect(() => {
    getLastSyncTime(uid)
      .then(setLastSync)
      .catch((err) => {
        if (err.message?.includes('permissions')) {
          setPermissionError(true);
        }
      });
  }, [uid]);

  const handleSave = async () => {
    setSyncing(true);
    try {
      await saveSettingsToCloud(uid, settings);
      setLastSync(new Date());
      showToast(t?.messages?.saveSuccess || "Settings saved to cloud", 'success');
      setPermissionError(false);
    } catch (err: any) {
      if (err.message?.includes('permissions')) {
        setPermissionError(true);
        showToast("Cloud Sync Error: Missing permissions. Please check Firestore rules.", 'error', 5000);
      } else {
        showToast(err.message || "Failed to save settings", 'error');
      }
    } finally {
      setSyncing(false);
    }
  };

  const handleLoad = async () => {
    setSyncing(true);
    try {
      const cloudSettings = await loadSettingsFromCloud(uid);
      if (cloudSettings) {
        setSettings(cloudSettings);
        showToast(t?.messages?.loadSuccess || "Settings loaded from cloud", 'success');
        setPermissionError(false);
      }
    } catch (err: any) {
      if (err.message?.includes('permissions')) {
        setPermissionError(true);
        showToast("Cloud Sync Error: Missing permissions. Please check Firestore rules.", 'error', 5000);
      } else {
        showToast(err.message || "Failed to load settings", 'error');
      }
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cloud className={`w-3 h-3 ${permissionError ? 'text-red-500' : 'text-blue-500'}`} />
          <span className="text-[10px] font-black text-black/30 dark:text-white/30 uppercase tracking-widest">{t?.systemPanel?.cloudSync || "Cloud Storage"}</span>
        </div>
        {lastSync && (
          <span className="text-[8px] font-bold text-black/20 dark:text-white/20 uppercase">
            {t?.systemPanel?.lastSync}: {lastSync.toLocaleTimeString()}
          </span>
        )}
      </div>

      {permissionError && (
        <div className="flex items-start gap-2 p-2 bg-red-500/5 border border-red-500/10 rounded-lg">
          <AlertCircle className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
          <p className="text-[8px] font-bold text-red-500/70 leading-tight uppercase">
            Firestore Permissions Missing. Please configure Security Rules to allow access to &apos;userSettings&apos; collection.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button 
          onClick={handleSave}
          disabled={syncing}
          className="flex items-center justify-center gap-2 py-2 bg-blue-500/10 text-blue-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-500/20 transition-all disabled:opacity-50"
        >
          {syncing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
          {t?.systemPanel?.saveToCloud || "Save"}
        </button>
        <button 
          onClick={handleLoad}
          disabled={syncing}
          className="flex items-center justify-center gap-2 py-2 bg-green-500/10 text-green-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-green-500/20 transition-all disabled:opacity-50"
        >
          {syncing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
          {t?.systemPanel?.loadFromCloud || "Load"}
        </button>
      </div>
    </div>
  );
};

const PersonalManagementSection: React.FC = () => {
  const { t } = useUI();
  return (
    <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/5">
      <div className="flex items-center gap-2">
        <UserIcon className="w-3 h-3 text-purple-500" />
        <span className="text-[10px] font-black text-black/30 dark:text-white/30 uppercase tracking-widest">{t?.systemPanel?.personalManagement || "Personal Management"}</span>
      </div>
      <div className="grid grid-cols-1 gap-2">
        <button className="w-full text-left px-3 py-2 bg-black/[0.02] dark:bg-white/[0.02] rounded-xl border border-black/5 dark:border-white/5 text-[9px] font-bold uppercase tracking-widest hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-all">
          {t?.systemPanel?.profileSettings || "Profile Settings"}
        </button>
        <button className="w-full text-left px-3 py-2 bg-black/[0.02] dark:bg-white/[0.02] rounded-xl border border-black/5 dark:border-white/5 text-[9px] font-bold uppercase tracking-widest hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-all">
          {t?.systemPanel?.dataPrivacy || "Data & Privacy"}
        </button>
      </div>
    </div>
  );
};

const AccountSection: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const { t } = useUI();

  if (loading) return <div className="animate-pulse h-20 bg-black/5 dark:bg-white/5 rounded-xl" />;

  if (user) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-black/[0.02] dark:bg-white/[0.02] rounded-xl border border-black/5 dark:border-white/5">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold overflow-hidden">
            {user.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" /> : (user.email?.[0].toUpperCase() || 'U')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">{t?.systemPanel?.account || 'Logged In As'}</p>
            <p className="text-xs font-bold truncate">{user.displayName || user.email}</p>
          </div>
        </div>
        
        <PersonalManagementSection />
        <CloudSyncSection uid={user.uid} />

        <Button 
          variant="destructive" 
          className="w-full text-[9px] font-black uppercase tracking-widest h-9 rounded-xl mt-4"
          onClick={logout}
        >
          {t?.systemPanel?.signOut || 'Sign Out'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <LoginForm />
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-black/5 dark:border-white/5"></span></div>
        <div className="relative flex justify-center text-[8px] uppercase font-black tracking-widest"><span className="bg-white dark:bg-[#0a0a0a] px-2 text-black/30 dark:text-white/30">Or continue with</span></div>
      </div>
      <LoginButton />
    </div>
  );
};

export const SystemSettingsPanel: React.FC = () => {
  const { settings, setSettings } = useVisuals();
  const { t, resetSettings, language, setLanguage, setShowHelpModal, setHelpModalInitialTab } = useUI();

  return (
    <div id="panel-system" className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
      {/* Column 1: Appearance & Interaction (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-3">
        <BentoCard id="panel-system-localization" title={t?.systemPanel?.localization || "Aesthetics & Language"}>
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CustomSelect label={t?.language} value={language} options={LANGUAGES} onChange={(v) => setLanguage(v as Language)} />
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-black/50 dark:text-white/50 uppercase tracking-wider">{t?.systemPanel?.uiMode}</label>
                    <SegmentedControl value={settings.uiMode} options={[{ id: 'simple', label: t?.common?.simple }, { id: 'advanced', label: t?.common?.advanced }]} onChange={(v) => setSettings({...settings, uiMode: v as any})} />
                  </div>
                </div>
                <div className="pt-4 border-t border-black/5 dark:border-white/5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-black/50 dark:text-white/50 uppercase tracking-wider">{t?.styleTheme || "Global Theme"}</label>
                    <SegmentedControl value={settings.appTheme} options={[{ id: 'dark', label: t?.systemPanel?.darkMode || 'Dark' }, { id: 'light', label: t?.systemPanel?.lightMode || 'Light' }]} onChange={(v) => setSettings({...settings, appTheme: v as any})} />
                  </div>
                </div>
            </div>
        </BentoCard>

        <BentoCard id="panel-system-behavior" title={t?.systemPanel?.interface || "System & Behavior"} className="flex-1">
            <div className="space-y-6">
              <div className="space-y-3">
                <span className="text-[10px] font-black text-black/30 dark:text-white/30 uppercase tracking-widest">{t?.systemPanel?.uiSettings || "Interface"}</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-1 gap-x-6">
                  <SettingsToggle label={t?.showTooltips} value={settings.showTooltips} onChange={() => setSettings({...settings, showTooltips: !settings.showTooltips})} variant="clean" />
                  <SettingsToggle label={t?.autoHideUi} value={settings.autoHideUi} onChange={() => setSettings({...settings, autoHideUi: !settings.autoHideUi})} variant="clean" />
                  <SettingsToggle label={t?.hideCursor} value={settings.hideCursor} onChange={() => setSettings({...settings, hideCursor: !settings.hideCursor})} variant="clean" />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/5">
                <span className="text-[10px] font-black text-black/30 dark:text-white/30 uppercase tracking-widest">{t?.systemPanel?.interaction || "Interaction"}</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-1 gap-x-6">
                  <SettingsToggle label={t?.doubleClickFullscreen} value={!!settings.doubleClickFullscreen} onChange={() => setSettings({...settings, doubleClickFullscreen: !settings.doubleClickFullscreen})} variant="clean" />
                  <SettingsToggle label={t?.wakeLock} value={settings.wakeLock} onChange={() => setSettings({...settings, wakeLock: !settings.wakeLock})} variant="clean" />
                  <SettingsToggle label={t?.mirrorDisplay} value={!!settings.mirrorDisplay} onChange={() => setSettings({...settings, mirrorDisplay: !settings.mirrorDisplay})} variant="clean" />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/5">
                <span className="text-[10px] font-black text-black/30 dark:text-white/30 uppercase tracking-widest">{t?.systemPanel?.performance || "Performance"}</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-1 gap-x-6">
                  <SettingsToggle label={t?.showFps} value={settings.showFps} onChange={() => setSettings({...settings, showFps: !settings.showFps})} variant="clean" />
                </div>
              </div>
            </div>
        </BentoCard>
      </div>

      {/* Column 2: Information & Data (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-3">
        <BentoCard id="panel-system-resources" title={t?.helpModal?.title || "Project Resources"}>
            <div className="grid grid-cols-1 gap-2">
                <a href="https://github.com/sutchan/AuraFlux" target="_blank" rel="noopener noreferrer" className="py-2.5 bg-yellow-500/10 text-yellow-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-yellow-500/20 hover:text-yellow-400 transition-all border border-yellow-500/10 flex items-center justify-center gap-2">
                    <span className="text-lg">★</span> Star on GitHub
                </a>
                <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => { setHelpModalInitialTab('guide'); setShowHelpModal(true); }} className="py-2.5 bg-black/[0.04] dark:bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all border border-black/5 dark:border-white/5 flex items-center justify-center gap-2">{t?.helpModal?.tabs?.guide || 'Guide'}</button>
                    <button onClick={() => { setHelpModalInitialTab('shortcuts'); setShowHelpModal(true); }} className="py-2.5 bg-black/[0.04] dark:bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all border border-black/5 dark:border-white/5 flex items-center justify-center gap-2">{t?.helpModal?.tabs?.shortcuts || 'Keys'}</button>
                    <button onClick={() => { setHelpModalInitialTab('about'); setShowHelpModal(true); }} className="py-2.5 bg-black/[0.04] dark:bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all border border-black/5 dark:border-white/5 flex items-center justify-center gap-2">{t?.helpModal?.tabs?.about || 'About'}</button>
                </div>
            </div>
        </BentoCard>

        <BentoCard id="panel-system-account" title={t?.systemPanel?.account || "Account"}>
            <AccountSection />
        </BentoCard>

        <BentoCard id="panel-system-data" title={t?.config?.title || "Data Management"} className="flex-1">
            <div className="flex flex-col h-full space-y-4">
                <PresetManager />
                <div className="pt-2 mt-auto border-t border-black/5 dark:border-white/5">
                    <button onClick={() => window.confirm(t?.hints?.confirmReset) && resetSettings()} className="w-full text-center py-2 bg-red-500/10 text-red-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500/20 hover:text-red-400 transition-all border border-red-500/10">
                        {t?.systemPanel?.factoryReset || 'HARD RESET'}
                    </button>
                </div>
            </div>
        </BentoCard>
      </div>
    </div>
  );
};