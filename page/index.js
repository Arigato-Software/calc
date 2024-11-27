import { getText } from '@zos/i18n'
import * as Styles from 'zosLoader:./index.[pf].layout.js'
import { setWakeUpRelaunch } from '@zos/display'
import { UI } from '../utils/ui'

Page({
  onInit() {
    setWakeUpRelaunch({ relaunch: true }); // Чтобы страница не закрывалась когда потухнет экран
  },

  build() {

    this.ui = new UI(Styles.params);
    this.ui.load();

  },

  onDestroy() {
    this.ui.save();
  }

})
