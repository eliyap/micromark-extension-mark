import { splice } from 'micromark-util-chunked';
import { classifyCharacter } from 'micromark-util-classify-character';
import { resolveAll } from 'micromark-util-resolve-all';
import { codes } from 'micromark-util-symbol/codes.js';
import { constants } from 'micromark-util-symbol/constants.js';
import { types } from 'micromark-util-symbol/types.js';
let pandocMark = function (options = {}) {
    // Take events and resolve mark.
    let resolveAllMark = function (events, context) {
        let index = -1;
        let mark;
        let text;
        let open;
        let nextEvents;
        // Walk through all events.
        while (++index < events.length) {
            // Find a token that can close.
            if (events[index][0] === 'enter' &&
                events[index][1].type === 'markSequenceTemporary' &&
                events[index][1]._close) {
                open = index;
                // Now walk back to find an opener.
                while (open--) {
                    // Find a token that can open the closer.
                    if (events[open][0] === 'exit' &&
                        events[open][1].type === 'markSequenceTemporary' &&
                        events[open][1]._open &&
                        // If the sizes are the same:
                        events[index][1].end.offset - events[index][1].start.offset ===
                            events[open][1].end.offset - events[open][1].start.offset) {
                        events[index][1].type = 'markSequence';
                        events[open][1].type = 'markSequence';
                        mark = {
                            type: 'mark',
                            start: Object.assign({}, events[open][1].start),
                            end: Object.assign({}, events[index][1].end)
                        };
                        text = {
                            type: 'markText',
                            start: Object.assign({}, events[open][1].end),
                            end: Object.assign({}, events[index][1].start)
                        };
                        // Opening.
                        nextEvents = [
                            ['enter', mark, context],
                            ['enter', events[open][1], context],
                            ['exit', events[open][1], context],
                            ['enter', text, context]
                        ];
                        // Between.
                        splice(nextEvents, nextEvents.length, 0, resolveAll(context.parser.constructs.insideSpan.null, events.slice(open + 1, index), context));
                        // Closing.
                        splice(nextEvents, nextEvents.length, 0, [
                            ['exit', text, context],
                            ['enter', events[index][1], context],
                            ['exit', events[index][1], context],
                            ['exit', mark, context]
                        ]);
                        splice(events, open - 1, index - open + 3, nextEvents);
                        index = open + nextEvents.length - 2;
                        break;
                    }
                }
            }
        }
        index = -1;
        while (++index < events.length) {
            if (events[index][1].type === 'markSequenceTemporary') {
                events[index][1].type = types.data;
            }
        }
        return events;
    };
    let tokenizeMark = function (effects, ok, nok) {
        const previous = this.previous;
        const events = this.events;
        let size = 0;
        let more = function (code) {
            const before = classifyCharacter(previous);
            if (code === codes.equalsTo) {
                // If this is the third marker, exit.
                if (size > 1)
                    return nok(code);
                effects.consume(code);
                size++;
                return more;
            }
            if (size < 2)
                return nok(code);
            const token = effects.exit('markSequenceTemporary');
            const after = classifyCharacter(code);
            token._open =
                !after || (after === constants.attentionSideAfter && Boolean(before));
            token._close =
                !before || (before === constants.attentionSideAfter && Boolean(after));
            return ok(code);
        };
        let start = function (code) {
            if (code !== codes.equalsTo ||
                (previous === codes.equalsTo &&
                    events[events.length - 1][1].type !== types.characterEscape)) {
                return nok(code);
            }
            effects.enter('markSequenceTemporary');
            return more(code);
        };
        return start;
    };
    const tokenizer = {
        tokenize: tokenizeMark,
        resolveAll: resolveAllMark
    };
    return {
        text: { [codes.equalsTo]: tokenizer },
        insideSpan: { null: [tokenizer] },
        attentionMarkers: { null: [codes.equalsTo] }
    };
};
export { pandocMark };
