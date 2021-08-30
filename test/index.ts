import test from 'tape'
import { micromark } from 'micromark'
import {
    pandocHighlight as syntax,
    pandocHighlightHtml as html
} from '../dev/index.js'

test('markdown -> html (micromark)', (t) => {
    const defaults = syntax()

    t.isNotDeepEqual(
        micromark('a =b=', {
            extensions: [defaults],
            htmlExtensions: [html]
        }),
        '<p>a <mark>b</mark></p>',
        'should not support highlight w/ one equals'
    )

    t.deepEqual(
        micromark('a ==b==', {
            extensions: [defaults],
            htmlExtensions: [html]
        }),
        '<p>a <mark>b</mark></p>',
        'should support highlight w/ two equals'
    )

    t.deepEqual(
        micromark('a ===b===', {
            extensions: [defaults],
            htmlExtensions: [html]
        }),
        '<p>a ===b===</p>',
        'should not support highlight w/ three equals'
    )

    t.deepEqual(
        micromark('a \\===b== c', {
            extensions: [defaults],
            htmlExtensions: [html]
        }),
        '<p>a =<mark>b</mark> c</p>',
        'should support highlight w/ after an escaped equals'
    )

    t.deepEqual(
        micromark('a ==b ==c== d== e', {
            extensions: [defaults],
            htmlExtensions: [html]
        }),
        '<p>a <mark>b <mark>c</mark> d</mark> e</p>',
        'should support nested highlight'
    )

    t.deepEqual(
        micromark('a ==-1== b', {
            extensions: [defaults],
            htmlExtensions: [html]
        }),
        '<p>a <mark>-1</mark> b</p>',
        'should open if preceded by whitespace and followed by punctuation'
    )

    t.deepEqual(
        micromark('a ==b.== c', {
            extensions: [defaults],
            htmlExtensions: [html]
        }),
        '<p>a <mark>b.</mark> c</p>',
        'should close if preceded by punctuation and followed by whitespace'
    )

    t.deepEqual(
        micromark('==b.==.', {
            extensions: [syntax({ singleTilde: true })],
            htmlExtensions: [html]
        }),
        '<p><mark>b.</mark>.</p>',
        'should close if preceded and followed by punctuation (mark)'
    )

    t.deepEqual(
        micromark('a =b= ==c== d', {
            extensions: [syntax({ singleTilde: false })],
            htmlExtensions: [html]
        }),
        '<p>a =b= <mark>c</mark> d</p>',
        'should not support highlight w/ one equals'
    )

    t.end()
})
