import { resources, NameSpace } from "@Src/locales/i18n";

interface ITranslateConfig {
  ns?: NameSpace;
}

export const useTranslation = () => {
  const t = (origin: string, config?: ITranslateConfig) => {
    const { ns = "common" } = config || {};

    return resources[ns][origin] || origin;
  };

  return {
    t,
  };
};
