import { HtmlExtension } from 'micromark-util-types';

export const pandocMarkHtml: HtmlExtension = {
    enter: {
        mark() {
            this.tag('<mark>')
        }
    },
    exit: {
        mark() {
            this.tag('</mark>')
        }
    }
}