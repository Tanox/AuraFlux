// File: app/locales/fr.ts | Version: v1.9.71
import { LyricsStyle, VisualizerMode } from '../../types/index.ts';
import { COLOR_THEMES } from '../../constants/index.ts';

const THEME_NAMES = ["Vaporwave", "Aurore", "Coucher de Soleil", "Barbe à Papa", "Électrique", "Néon", "Matrix", "Or", "Royal", "Solaire", "Océan", "Cyber", "Sakura", "Arctique", "Désert", "Voltage", "Émeraude", "Cyanure"];
const getThemeLabels = () => {
  const labels: { [key: string]: string } = {};
  COLOR_THEMES.forEach((_, i) => {
    labels[i.toString()] = THEME_NAMES[i];
  });
  return labels;
};

export const fr = {
  common: {
    queue: "File",
    empty: "Vide",
    clearAll: "Tout Effacer",
    confirmClear: "Voulez-vous vraiment vider la liste de lecture ?",
    updateAvailable: "Mise à jour détectée",
    updateAction: "Actualiser",
    dropFiles: "DÉPOSER POUR IMPORTER",
    unknownTrack: "Titre Inconnu",
    unknownArtist: "Artiste Inconnu",
    track: "Piste",
    artist: "Artiste",
    loading: "Chargement",
    processing: "Traitement",
    simple: "Simple",
    advanced: "Avancé",
    active: "Pistes",
  },
  appVersion: "v1.9.71",
  appTitle: "Aura Flux",
  welcomeSubtitle: "Moteur d'Intelligence Synesthésique",
  startExperience: "INITIALISER LE SYSTÈME",
  onboarding: {
    welcome: "Bienvenue",
    subtitle: "Configurons votre expérience Aura Flux",
    selectLanguage: "Choisissez votre langue préférée",
    next: "Suivant",
    back: "Retour",
    finish: "Terminer",
    features: {
