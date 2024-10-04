import { NativeModules, Platform } from 'react-native';
import type {
  Language,
  Survey,
  TranslationItemKey,
  UserTraitsContext,
} from './types';
import { useSelector } from 'react-redux';
import type { State } from './redux';

const availableLanguages = (survey: Survey): Language[] => {
  const languages = survey.translations?.map((t) => t.language) ?? [];
  if (survey.primary_language) {
    languages.unshift(survey.primary_language);
  }

  return languages;
};

const getPreferredLanguage = (
  survey: Survey,
  userTraits?: UserTraitsContext
): Language => {
  const deviceLanguageWithRegion =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ??
        NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
      : NativeModules.I18nManager.localeIdentifier;
  const deviceLanguage = deviceLanguageWithRegion.substring(0, 2);

  const userTraitLanguage = userTraits?.language as Language;

  if (
    userTraitLanguage != null &&
    availableLanguages(survey).includes(userTraitLanguage)
  ) {
    return userTraitLanguage;
  }

  if (availableLanguages(survey).includes(deviceLanguage)) {
    return deviceLanguage;
  }

  return 'en';
};

const getTranslationForKey = (
  key: TranslationItemKey,
  survey: Survey,
  userTraits?: UserTraitsContext
): string | undefined => {
  const language = getPreferredLanguage(survey, userTraits);
  const translation = survey.translations?.find((t) => t.language === language);

  return translation?.items?.[key]?.text;
};

export const useTranslation = (key: TranslationItemKey) => {
  const survey = useSelector((state: State) => state.survey);
  const userTraits = useSelector((state: State) => state.userTraits);
  if (survey == null) {
    return undefined;
  }

  return getTranslationForKey(key, survey, userTraits);
};
