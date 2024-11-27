import { createWidget, widget, prop, getTextLayout } from '@zos/ui'
import { onGesture, GESTURE_LEFT, GESTURE_RIGHT, onKey, KEY_UP, KEY_DOWN, KEY_SELECT, KEY_EVENT_CLICK, onDigitalCrown, KEY_HOME } from '@zos/interaction'
import { Vibrator, VIBRATOR_SCENE_SHORT_STRONG } from '@zos/sensor'
import { LocalStorage } from '@zos/storage'

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
            pos_x: this.params.keyboard.switches[2],
            switch_select: 2,
            expression: '',
            result: '',
            currentInput: '',
            memory: '',
            ...storage
        }
        calc.expression = this.storage.expression;
        calc.result = this.storage.result;
        calc.currentInput = this.storage.currentInput;
        calc.memory = this.storage.memory;
    }

    save() {
        this.storage.expression = calc.expression;
        this.storage.result = calc.result;
        this.storage.currentInput = calc.currentInput;
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
        return expression.replace(/\*/g, "×").replace(/\//g, "÷").replace(/%/g, "mod");;
    }

    showEdit() {
        this.showText(this.edit, calc.result !== '' ? calc.result : calc.currentInput, this.params.display.edit);
        this.showText(this.exp, this.formatExpression(calc.expression), this.params.display.exp);
        this.showText(this.memory, calc.memory, this.params.display.memory);

    }

    displayShow() {
        createWidget(widget.STROKE_RECT, this.params.display.rect.style);
        this.memory = createWidget(widget.TEXT, this.params.display.memory.style);
        this.edit = createWidget(widget.TEXT, this.params.display.edit.style);
        this.exp = createWidget(widget.TEXT, this.params.display.exp.style);
        this.showEdit();
    }

    keyboardShift(shift) {
        const select = this.storage.switch_select + shift;
        if (select < 0 || select >= this.params.keyboard.switches.length) return;
        this.storage.switch_select = select;
        this.to_x = this.params.keyboard.switches[select];
        this.sign = this.storage.pos_x < this.to_x ? 1 : -1;
        if (!this.interval) {
            this.interval = setInterval(() => {
                this.storage.pos_x += this.sign * this.params.keyboard.switch_speed;
                if (Math.abs(this.storage.pos_x + this.sign * this.params.keyboard.switch_speed - this.to_x) < this.params.keyboard.switch_speed) {
                    this.storage.pos_x = this.to_x;
                }
                this.container.setProperty(prop.MORE, {
                    pos_x: this.storage.pos_x,
                    pos_y: 0,
                });
                if (this.storage.pos_x == this.to_x) {
                    clearInterval(this.interval);
                    this.interval = null;
                }
            }, 20);
        }
    }

    keyboardShow() {
        onGesture({
            callback: (event) => {
                if (event === GESTURE_LEFT) {
                    this.keyboardShift(1);
                }
                if (event === GESTURE_RIGHT) {
                    this.keyboardShift(-1);
                }
                return true
            },
        });

        onKey({
            callback: (key, keyEvent) => {
                if (keyEvent === KEY_EVENT_CLICK) {
                    if (key === KEY_UP) {
                        this.keyboardShift(-1);
                    }
                    if (key === KEY_DOWN) {
                        this.keyboardShift(1);
                    }
                    if (key === KEY_SELECT) {
                        this.click(() => calc.calculate());
                    }
                }
                return false;
            },
        });

        onDigitalCrown({
            callback: (key, degree) => {
                if (key === KEY_HOME) {
                    if (degree > 0) {
                        this.keyboardShift(-1);
                    }
                    if (degree < 0) {
                        this.keyboardShift(1);
                    }
                }
            },
        });


        /*
        // Здесь были кнопки для прокрутки клавиатуры...
        const w = this.params.keyboard.s + this.params.keyboard.indent;
        let y = this.params.keyboard.y - this.params.keyboard.s;
        createWidget(widget.BUTTON, {
            x: 0,
            y: y,
            w: w,
            h: this.params.keyboard.s,
            normal_color: 0x004040,
            press_color: 0x008080,
            text_size: 36,
            radius: 20,
            text: '  >',
            click_func: () => this.keyboardShift(-1),
        });
        createWidget(widget.BUTTON, {
            x: 480 - w,
            y: y,
            w: w,
            h: this.params.keyboard.s,
            normal_color: 0x004040,
            press_color: 0x008080,
            text_size: 36,
            radius: 20,
            text: '<  ',
            click_func: () => this.keyboardShift(1),
        });/**/

        this.container = createWidget(widget.VIEW_CONTAINER, {
            x: 0,
            y: this.params.keyboard.y,
            w: this.params.keyboard.w,
            h: this.params.keyboard.h,
            pos_x: this.storage.pos_x,
            pos_y: 0,
            scroll_enable: 0,
        });
        let y = 0;
        for (const row of this.params.keyboard.keys) {
            let x = this.params.keyboard.indent;
            for (const key of row) {
                let w = this.params.keyboard.s;
                if (key) {
                    if (key.hasOwnProperty('indent')) {
                        w = this.params.keyboard.indent * key.indent;
                    } else {
                        w *= key.cols ?? 1;
                        const h = this.params.keyboard.s * (key.rows ?? 1);
                        this.container.createWidget(widget.BUTTON, {
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