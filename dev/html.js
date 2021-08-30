export const pandocMarkHtml = {
    enter: {
        mark() {
            this.tag('<mark>');
        }
    },
    exit: {
        mark() {
            this.tag('</mark>');
        }
    }
};
