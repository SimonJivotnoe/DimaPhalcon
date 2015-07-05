-- phpMyAdmin SQL Dump
-- version 4.0.10.6
-- http://www.phpmyadmin.net
--
-- Хост: 127.0.0.1:3306
-- Время создания: Июл 03 2015 г., 10:45
-- Версия сервера: 5.5.41-log
-- Версия PHP: 5.6.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `dima`
--

-- --------------------------------------------------------

--
-- Структура таблицы `categories`
--

CREATE TABLE IF NOT EXISTS `categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=14 ;

--
-- Дамп данных таблицы `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`) VALUES
(11, 'Нераспределенное'),
(12, 'Утки'),
(13, 'Тройник');

-- --------------------------------------------------------

--
-- Структура таблицы `formulas`
--

CREATE TABLE IF NOT EXISTS `formulas` (
  `formula_id` int(11) NOT NULL AUTO_INCREMENT,
  `formula` text NOT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`formula_id`),
  KEY `category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `formulas_helper`
--

CREATE TABLE IF NOT EXISTS `formulas_helper` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- Дамп данных таблицы `formulas_helper`
--

INSERT INTO `formulas_helper` (`id`, `name`) VALUES
(1, 'TAN()'),
(2, 'SIN()'),
(8, 'RADIANS()'),
(9, 'PRODUCT()');

-- --------------------------------------------------------

--
-- Структура таблицы `products`
--

CREATE TABLE IF NOT EXISTS `products` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) NOT NULL,
  `category_id` int(11) NOT NULL,
  `table_content` text,
  `alwaysInTable` text,
  `formulas` text,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`),
  KEY `category_id` (`category_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=135 ;

--
-- Дамп данных таблицы `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `category_id`, `table_content`, `alwaysInTable`, `formulas`, `created`) VALUES
(92, 'Утка прямоугольная', 12, '<li class="ui-state-default ui-sortable-handle"><span class="rowNumber col-md-2">A1</span><span class="rowName"><input class="rowNameInput" type="text" value="Ширина входа B,м"></span><span class="rowValue" style=""><input class="rowValueInput" data-cell="A1" data-format="0[.]00" type="number" style=" width: 5em" step="0.1" value="0.15"></span></li><li class="ui-state-default ui-sortable-handle"><span class="rowNumber col-md-2">A2</span><span class="rowName"><input class="rowNameInput" type="text" value="Высота входа H,м"></span><span class="rowValue"><input class="rowValueInput" data-cell="A2" data-format="0[.]00" type="number" style=" width: 5em" step="0.1" value="0.35"></span></li><li class="ui-state-default ui-sortable-handle"><span class="rowNumber col-md-2">A3</span><span class="rowName"><input class="rowNameInput" type="text" value="Смещение высоты h,м"></span><span class="rowValue" style=""><input class="rowValueInput" data-cell="A3" data-format="0[.]00" type="number" style=" width: 5em" step="0.1" value=""></span></li><li class="ui-state-default ui-sortable-handle"><span class="rowNumber col-md-2">A4</span><span class="rowName"><input class="rowNameInput" type="text" value="Выход борта a, м"></span><span class="rowValue" style=""><input class="rowValueInput" data-cell="A4" data-format="0[.]00" type="number" style=" width: 5em" step="0.1" value="0.10"></span></li><li class="ui-state-default ui-sortable-handle"><span class="rowNumber col-md-2">A5</span><span class="rowName"><input class="rowNameInput" type="text" value="Угол наклона α, град"></span><span class="rowValue"><input class="rowValueInput" data-cell="A5" data-format="0[.]00" type="number" style=" width: 5em" step="0.1" value="29.70"></span></li><li class="ui-state-default ui-sortable-handle"><span class="rowNumber col-md-2">A6</span><span class="rowName"><input class="rowNameInput" type="text" value="КИМ"></span><span class="rowValue" style=""><input class="rowValueInput" data-cell="A6" data-format="0[.]00" type="number" style=" width: 5em" step="0.1" value="1.15"></span></li><li class="ui-state-default ui-sortable-handle"><span class="rowNumber col-md-2">A7</span><span class="rowName"><input class="rowNameInput" type="text" value="Цена за м2, грн"></span><span class="rowValue" style=""><input class="rowValueInput" data-cell="A7" data-format="0[.]00" type="number" style=" width: 5em" step="0.1" value="3.11" data-formula="A8+A6"></span></li><li class="ui-state-default ui-sortable-handle"><span class="rowNumber col-md-2">A8</span><span class="rowName"><input class="rowNameInput" type="text" value="Длина утки L,м"></span><span class="rowValue" style=""><input class="rowValueInput" data-cell="A8" data-format="0[.]00" type="number" style="width: 5em;" step="0.1" value=""></span></li><li class="ui-state-default ui-sortable-handle"><span class="rowNumber col-md-2">A9</span><span class="rowName"><input class="rowNameInput" type="text" value="Площадь 1шт, м2"></span><span class="rowValue" style=""><input class="rowValueInput" data-cell="A9" data-format="0[.]00" type="number" style="width: 5em;" step="0.1" data-formula="2*A6*1.05*((0.01+2*A4+A2*TAN(RADIANS(A5/2))+A3/TAN(RADIANS(A5)))*(0.01+A2+A3)+(0.01+2*A4+A2*TAN(RADIANS(A5/2))+A3/SIN(RADIANS(A5)))*(A1+0.06))" value="7.35"></span></li><li class="ui-state-default ui-sortable-handle"><span class="rowNumber col-md-2">A10</span><span class="rowName"><input class="rowNameInput" type="text" value="Сумма за шт,грн"></span><span class="rowValue" style=""><input class="rowValueInput" data-cell="A10" data-format="0[.]00" type="number" style="width: 5em;" step="0.1" data-formula="A8+A6" value="3.11"></span></li>\n            \n            \n            <li class="ui-state-default ui-sortable-handle" style="display: none;"><span class="rowNumber col-md-2">A11</span><span class="rowName"><input class="rowNameInput" type="text"></span><span class="rowValue"><input class="rowValueInput" data-cell="A11" data-format="0[.]00" type="number" style=" width: 5em" step="0.1"></span><span class="removeRow glyphicon glyphicon-remove" aria-hidden="true" style="display: none;"></span></li><li class="ui-state-default ui-sortable-handle" style="display: none;"><span class="rowNumber col-md-2">A12</span><span class="rowName"><input class="rowNameInput" type="text"></span><span class="rowValue"><input class="rowValueInput" data-cell="A12" data-format="0[.]00" type="number" style=" width: 5em" step="0.1"></span><span class="removeRow glyphicon glyphicon-remove" aria-hidden="true" style="display: none;"></span></li>\n            <li class="ui-state-default ui-sortable-handle" style="display: none;"><span class="rowNumber col-md-2">A13</span><span class="rowName"><input class="rowNameInput" type="text"></span><span class="rowValue"><input class="rowValueInput" data-cell="A13" data-format="0[.]00" type="number" style=" width: 5em" step="0.1"></span><span class="removeRow glyphicon glyphicon-remove" aria-hidden="true" style="display: none;"></span></li>', NULL, '<li class="list-group-item">A8+A6</li>', '2015-06-21 17:50:28'),
(114, 'Утка', 12, '<li class="ui-state-default ui-sortable-handle"><span class="rowNumber col-md-2">A1</span><span class="rowName"><input class="rowNameInput" type="text" value="один1"></span><span class="rowValue"><input class="rowValueInput" data-cell="A1" data-format="0[.]00" type="tel" style=" width: 5em" value="77.77"></span><span class="removeRow glyphicon glyphicon-remove" aria-hidden="true" style="display: none;"></span></li><li class="ui-state-default ui-sortable-handle"><span class="rowNumber col-md-2">A2</span><span class="rowName"><input class="rowNameInput" type="text" value="два"></span><span class="rowValue"><input class="rowValueInput" data-cell="A2" data-format="0[.]00" type="tel" style="width: 5em;" value="230.29"></span><span class="removeRow glyphicon glyphicon-remove" aria-hidden="true" style="display: none;"></span></li><li class="ui-state-default ui-sortable-handle"><span class="rowNumber col-md-2">A3</span><span class="rowName"><input class="rowNameInput" type="text" value="рез1"></span><span class="rowValue"><input class="rowValueInput" data-cell="A3" data-format="0[.]00" type="tel" style="width: 5em;" value=""></span><span class="removeRow glyphicon glyphicon-remove" aria-hidden="true" style="display: none;"></span></li><li class="ui-state-default ui-sortable-handle"><span class="rowNumber col-md-2">A4</span><span class="rowName"><input class="rowNameInput" type="text" value="рез2"></span><span class="rowValue"><input class="rowValueInput" data-cell="A4" data-format="0[.]00" type="tel" style="width: 5em;" value=""></span><span class="removeRow glyphicon glyphicon-remove" aria-hidden="true" style="display: none;"></span></li><li class="ui-state-default ui-sortable-handle" style="display: none;"><span class="rowNumber col-md-2"></span><span class="rowName"><input class="rowNameInput" type="text"></span><span class="rowValue"><input class="rowValueInput" data-cell="CALX1" data-format="0[.]00" type="tel" style=" width: 5em"></span><span class="removeRow glyphicon glyphicon-remove" aria-hidden="true" style="display: none;"></span></li><li class="ui-state-default ui-sortable-handle" style="display: none;"><span class="rowNumber col-md-2"></span><span class="rowName"><input class="rowNameInput" type="text"></span><span class="rowValue"><input class="rowValueInput" data-cell="CALX2" data-format="0[.]00" type="tel" style=" width: 5em" value="2"></span><span class="removeRow glyphicon glyphicon-remove" aria-hidden="true" style="display: none;"></span></li><li class="ui-state-default ui-sortable-handle" style="display: none;"><span class="rowNumber col-md-2"></span><span class="rowName"><input class="rowNameInput" type="text"></span><span class="rowValue"><input class="rowValueInput" data-cell="CALX3" data-format="0[.]00" type="tel" style=" width: 5em"></span><span class="removeRow glyphicon glyphicon-remove" aria-hidden="true" style="display: none;"></span></li><li class="ui-state-default ui-sortable-handle" style="display: none;"><span class="rowNumber col-md-2"></span><span class="rowName"><input class="rowNameInput" type="text"></span><span class="rowValue"><input class="rowValueInput" data-cell="CALX4" data-format="0[.]00" type="tel" style=" width: 5em" value="5"></span><span class="removeRow glyphicon glyphicon-remove" aria-hidden="true" style="display: none;"></span></li>', NULL, '<li class="list-group-item"><span class="formulaValue">A2+A1</span></li><li class="list-group-item"><span class="formulaValue">A3+A2</span></li><li class="list-group-item"><span class="formulaValue">A6+A8</span></li>\n    <li class="list-group-item"><span class="formulaValue">A1*SIN(A2)</span></li>', '2015-06-29 19:54:00'),
(132, 'Новое изделие', 11, '', NULL, '<li class="list-group-item"><span class="formulaValue">KIM+S</span><span class="glyphicon glyphicon-retweet" aria-hidden="true"> P1</span></li>', '2015-07-03 07:40:13'),
(133, 'Новое изделие', 11, '', NULL, '<li class="list-group-item"><span class="formulaValue">P+Σ</span><span class="glyphicon glyphicon-retweet" aria-hidden="true"> KIM1</span></li>', '2015-07-03 07:41:30'),
(134, 'Новое изделие', 11, '', NULL, '<li class="list-group-item"><span class="formulaValue">KIM+S</span><span class="glyphicon glyphicon-retweet" aria-hidden="true"> P1</span></li>', '2015-07-03 07:42:03');

-- --------------------------------------------------------

--
-- Структура таблицы `tabs`
--

CREATE TABLE IF NOT EXISTS `tabs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tab_id` varchar(255) NOT NULL,
  `product_id` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `product_id_2` (`product_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=303 ;

--
-- Дамп данных таблицы `tabs`
--

INSERT INTO `tabs` (`id`, `tab_id`, `product_id`, `active`) VALUES
(260, 'pr1', 92, 0),
(282, 'pr282', 114, 0),
(302, 'pr283', 134, 1);

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `formulas`
--
ALTER TABLE `formulas`
  ADD CONSTRAINT `formulas_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `tabs`
--
ALTER TABLE `tabs`
  ADD CONSTRAINT `tabs_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
