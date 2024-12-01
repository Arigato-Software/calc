import { getText } from '@zos/i18n'
import { createWidget, widget, prop, getTextLayout } from '@zos/ui'
import { onKey, KEY_UP, KEY_DOWN, KEY_SELECT, KEY_SHORTCUT, KEY_EVENT_CLICK, onDigitalCrown, KEY_HOME } from '@zos/interaction'
import { Vibrator, VIBRATOR_SCENE_SHORT_STRONG } from '@zos/sensor'
import { LocalStorage } from '@zos/storage'
import { Scrolling, SCROLL_MODE_HORIZONTAL } from '../libs/scrolling'

const globalData = getApp()._options.globalData;
const calc = globalData.calc;

export class UI {

    constructor(params) {
        this.params = params;
        this.interval = null;
        this.vibrator = new Vibrator();
        this.load();
        this.keyboardShow();
        this.displayShow();
    }

    load() {
        const localStorage = new LocalStorage();
        const storage = JSON.parse(localStorage.getItem('calc', '{}'));
        this.storage = {
            pos_x: this.params.keyboard.pos_x,
            expression: '',
            result: '',
            currentInput: '0',
            replacement: false,
            memory: '',
            ...storage
        }
        calc.expression = this.storage.expression;
        calc.result = this.storage.result;
        calc.currentInput = this.storage.currentInput;
        calc.replacement = this.storage.replacement;
        calc.memory = this.storage.memory;
    }

    save() {
        this.storage.expression = calc.expression;
        this.storage.result = calc.result;
        this.storage.currentInput = calc.currentInput;
        this.storage.replacement = calc.replacement;
        this.storage.memory = calc.memory;
        const localStorage = new LocalStorage();
        localStorage.setItem('calc', JSON.stringify(this.storage));
    }

    showText(elem, text, param) {
        let size = param.size_max;
        for (; size >= param.size_min; size--) {
            const style = {
                text_size: size,
                text_width: 666,
                wrapped: 0,
            };
            const { width } = getTextLayout(text, style);
            if (width <= param.w) break;
        }
        elem.setProperty(prop.MORE, { text_size: size });
        elem.setProperty(prop.TEXT, text);
    }

    formatExpression(expression) {
        return expression.replace(/\*/g, "×").replace(/\//g, "÷").replace(/%/g, "mod");
    }

    showEdit() {
        this.showText(this.edit, calc.result !== "" ? calc.result : calc.currentInput, this.params.display.edit);
        this.showText(this.exp, this.formatExpression(calc.expression), this.params.display.exp);
        this.showText(this.memory, calc.memory, this.params.display.memory);
        const text = calc.memory !== "" ? getText("memory") : "";
        this.hint.setProperty(prop.TEXT, text);
    }

    displayShow() {
        const container = createWidget(widget.VIEW_CONTAINER, {
            scroll_enable: false,
            ...this.params.display.container
        });
        container.createWidget(widget.STROKE_RECT, this.params.display.rect.style);
        this.hint = container.createWidget(widget.TEXT, this.params.display.hint);
        this.memory = container.createWidget(widget.TEXT, this.params.display.memory.style);
        this.edit = container.createWidget(widget.TEXT, this.params.display.edit.style);
        this.exp = container.createWidget(widget.TEXT, this.params.display.exp.style);
        this.showEdit();
    }

    keyboardShow() {

        // Рассчитываем ширину первого ряда клавиш клавиатуры
        const xIndent = Math.floor(this.params.keyboard.s - this.params.keyboard.indent / 2);
        let keyboardWidth = 2 * xIndent;
        for (const key of this.params.keyboard.keys[0]) {
            if (key.hasOwnProperty('indent')) {
                keyboardWidth += this.params.keyboard.indent * key.indent;
            } else {
                keyboardWidth += this.params.keyboard.s * (key.cols ?? 1);
            }
        }

        const scrolling = new Scrolling({
            mode: SCROLL_MODE_HORIZONTAL,
            step_x: this.params.keyboard.indent,
            scroll_complete_func: (info) => { this.storage.pos_x = info.x },
            container: {
                y: this.params.keyboard.y,
                w: keyboardWidth,
                pos_x: this.storage.pos_x,
            },
        });

        onKey({
            callback: (key, keyEvent) => {
                if (keyEvent === KEY_EVENT_CLICK) {
                    if (key === KEY_SELECT || key === KEY_SHORTCUT) {
                        this.click(() => calc.calculate());
                        return true;
                    }
                    if (key === KEY_UP) {
                        this.click(() => calc.enterOperation("+"));
                    }
                    if (key === KEY_DOWN) {
                        this.click(() => calc.enterOperation("-"));
                    }
                }
                return false;
            },
        });

        onDigitalCrown({
            callback: (key, degree) => {
                if (key === KEY_HOME) {
                    if (Math.sign(degree) > 0) {
                        this.click(() => calc.enterOperation("+"));
                    }
                    if (Math.sign(degree) < 0) {
                        this.click(() => calc.enterOperation("-"));
                    }
                }
            },
        });

        let y = 0;
        for (const row of this.params.keyboard.keys) {
            let x = xIndent;
            for (const key of row) {
                let w = this.params.keyboard.s;
                if (key) {
                    if (key.hasOwnProperty('indent')) {
                        w = this.params.keyboard.indent * key.indent;
                    } else {
                        w *= key.cols ?? 1;
                        const h = this.params.keyboard.s * (key.rows ?? 1);
                        const button = scrolling.container.createWidget(widget.BUTTON, {
                            x: x + 2,
                            y: y + 2,
                            w: w - 4,
                            h: h - 4,
                            normal_color: key.color,
                            press_color: key.color + 0x404040,
                            text_size: key.text_size ?? this.params.keyboard.text_size,
                            radius: this.params.keyboard.radius,
                            text: key.text,
                            click_func: () => this.click(key.click ?? null),
                            longpress_func: () => this.click(key.longpress ?? null),
                        });
                        scrolling.setScrolling(button);
                    }
                }
                x += w;
            }
            y += this.params.keyboard.s;
        }

    }

    click(callback) {
        this.vibration();
        if (callback) {
            callback();
            this.showEdit();
        }
    }

    vibration() {
        this.vibrator.setMode(VIBRATOR_SCENE_SHORT_STRONG);
        this.vibrator.start();
    }

}