import clearHtml from "sanitize-html";

const sanitizationOptions = {
    allowedTags: [],
    allowedAttributes: {}
} satisfies clearHtml.IOptions;

export const sanitizeHtml = (dirty: string) =>
    clearHtml(dirty, sanitizationOptions)
        .trim();
