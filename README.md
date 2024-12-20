# Zepp OS Calculator application

![](https://i.ibb.co/VpXkddg/icon.png)

Калькулятор с базовым набором функций.

Калькулятор, адаптированный для маленького экрана часов. Работает как на круглых, так и на прямоугольных часах.

## Описание

### Возможности

    Базовые арифметические операции.
    Выполнение операций с учетом приоритета (сначала умножение и деление, затем сложение и вычитание).
    Операция взятия процентов.
    Квадратный корень, возведение в степень, обратное значение числа.
    Работа с памятью.

### Особенности

    Клавиатура калькулятора пролистывается вправо/влево.
    Клавиша SELECT или SHORTCUT дублирует кнопку "=".
    Клавиши UP / DOWN либо прокручивание коронки дублируют кнопки "+" / "-".
    Долгий тап по кнопке [←] стирает число целиком.
    Свайп вправо по экрану калькулятора - закрыть калькулятор.
    После закрытия приложения сохраняется состояние и полностью восстанавливается при последующем запуске.

## Установка

Установка через режим разработчика - [подробнее как включить](https://4pda.to/forum/index.php?showtopic=1075239&view=findpost&p=125626228) 

### T-Rex 3 (480x480)

![](https://i.ibb.co/CsDcPJt/calc-r-MHS-480x480.png)

### Balance / Cheetah Pro (480x480)

![](https://i.ibb.co/KzrQMzX/calc-r-NXP-480x480.png)

### GTR4 (466x466)

![](https://i.ibb.co/0JjDjfR/calc-r-NXP-466x466.png)

### T-Rex Ultra / Cheetah Round (454x454)

![](https://i.ibb.co/Mg880W9/calc-r-NXP-454x454.png)

### GTS4 / Cheetah Square (390x450)

![](https://i.ibb.co/VVgmncZ/calc-s-Apollo-390x450.png)

### Falcon (416x416)

![](https://i.ibb.co/r0brmd2/calc-r-NXP-416x416.png)

### Active (390x450)

![](https://i.ibb.co/Zg8S5kR/calc-s-NXP-390x450.png)

### Bip 5 Core / Bip 5 Unity (320x380)

![](https://i.ibb.co/zXyQcmq/calc-s-Apollo-320x380.png)

## Внешний вид приложения

![](https://i.ibb.co/7rPgnfs/calc.jpg)

## Версии

### Версия: 1.0.4

Дата релиза: 06.12.2024

    Кнопки MR и MC поменялись местами.
    Ошибки отображаются красным цветом.

### Версия: 1.0.3 beta

Дата релиза: 01.12.2024

    Вместо пустого экрана выводится "0".
    Обновление версии библиотеки Scrolling до v1.1 (визуально ничего не меняется, просто небольшая оптимизация кода).
    Вывод на экран промежуточного результата вычислений при нажатии операций "+" и "-".
    На часах с коронкой клавиша SHORTCUT должна выполнять действие "=".

### Версия: 1.0.2 beta

Дата релиза: 30.11.2024

    Плавная прокрутка клавиатуры.
    Русифицированы сообщения об ошибках.
    Кнопка OFF для выхода из приложения.
    Выход из приложения свайпом вправо по экрану калькулятора.
    Клавиши UP / DOWN либо прокручивание коронки дублируют кнопки "+" / "-".
    Клавиша SELECT или SHORTCUT дублирует кнопку "=".

### Версия: 1.0.1 beta

Дата релиза: 28.11.2024

    Пересмотрен набор кнопок в самом правом столбце на круглых и прямоугольных часах.
    Добавлена коррекция точности вычисления, чтобы значения не уходили в ...9999 или ...0001 в дробной части.
    Устранена ошибка, из-за которой число 0 нельзя было поместить в память.
    Автоматическая очистка ввода после выполнения унарной операции (корень, 1/x и прочих).
    Немного пересмотрено поведение в состоянии "Error".

### Версия: 1.0.0 beta

Дата релиза: 27.11.2024

    Базовая версия приложения.
    
