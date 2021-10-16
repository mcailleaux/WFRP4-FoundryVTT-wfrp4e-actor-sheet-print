export const i18n = () => (<any>game).i18n;
export const i18nLocalize = (id: string) => i18n().localize(id);
export const i18nFormat = (id: string, data?: any) => i18n().format(id, data);

export const TEXT_SIZE = 10;
export const LABEL_SIZE = 8;
export const MARGINS = { top: 10, left: 10, bottom: 10, right: 10 };
