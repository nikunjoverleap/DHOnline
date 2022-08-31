import { logError } from './Global';

export function getConfigValue({ configData, country, abValue }) {
  try {
    if (configData?.useInheritedConfig) {
      let finalConfig = configData;
      const countryConfig = configData?.countries?.[country];
      if (configData?.ab?.[abValue]) {
        finalConfig = { ...finalConfig, ...configData?.ab?.[abValue] };
      }
      if (countryConfig) {
        finalConfig = { ...finalConfig, ...countryConfig };
        const abCountryConfig =
          configData?.countries?.[country]?.ab?.countries?.[country];
        if (abCountryConfig) {
          finalConfig = { ...finalConfig, ...abCountryConfig };
        }
      }

      delete finalConfig.ab;
      delete finalConfig.countries;
      return finalConfig;
    }
  } catch (e) {
    logError(e);
  }
  return configData;
}
