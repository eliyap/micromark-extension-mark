import { HtmlExtension } from 'micromark-util-types';

export const pandocHighlightHtml: HtmlExtension = {
    enter: {
        highlight() {
            this.tag('<mark>')
        }
    },
    exit: {
        highlight() {
            this.tag('</mark>')
        }
    }
}