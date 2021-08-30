export const pandocHighlightHtml = {
    enter: {
        highlight() {
            this.tag('<mark>');
        }
    },
    exit: {
        highlight() {
            this.tag('</mark>');
        }
    }
};
