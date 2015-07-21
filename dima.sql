-- phpMyAdmin SQL Dump
-- version 4.0.10.6
-- http://www.phpmyadmin.net
--
-- Хост: 127.0.0.1:3306
-- Время создания: Июл 21 2015 г., 11:14
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
-- Структура таблицы `kim`
--

CREATE TABLE IF NOT EXISTS `kim` (
  `kim_id` int(11) NOT NULL AUTO_INCREMENT,
  `kim_hard` varchar(255) NOT NULL,
  `kim` varchar(8) NOT NULL,
  PRIMARY KEY (`kim_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=22 ;

--
-- Дамп данных таблицы `kim`
--

INSERT INTO `kim` (`kim_id`, `kim_hard`, `kim`) VALUES
(17, 'Прямой участок', '1.1'),
(18, 'Фасонный участок', '1.4'),
(19, 'Утка', '1.2'),
(20, 'Коллектор', '1.15');

-- --------------------------------------------------------

--
-- Структура таблицы `metalls`
--

CREATE TABLE IF NOT EXISTS `metalls` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` varchar(255) NOT NULL,
  `mass` varchar(255) NOT NULL,
  `out_price` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `products`
--

CREATE TABLE IF NOT EXISTS `products` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) NOT NULL,
  `category_id` int(11) NOT NULL,
  `kim` int(11) DEFAULT NULL,
  `metall` int(11) DEFAULT NULL,
  `table_content` text,
  `alwaysInTable` text,
  `formulas` text,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`),
  KEY `category_id` (`category_id`),
  KEY `kim` (`kim`),
  KEY `metall` (`metall`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=188 ;

--
-- Дамп данных таблицы `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `category_id`, `kim`, `metall`, `table_content`, `alwaysInTable`, `formulas`, `created`) VALUES
(185, 'Утка', 11, NULL, NULL, '{"0":{"%ROW_NUMBER%":"A1","%ROW_NAME%":"","%DATA_CELL%":"A1","%DATA_FORMULA%":"","%INPUT_VALUE%":"-67.93"},"1":{"%ROW_NUMBER%":"A2","%ROW_NAME%":"","%DATA_CELL%":"A2","%DATA_FORMULA%":"","%INPUT_VALUE%":"-50.97"},"2":{"%ROW_NUMBER%":"A3","%ROW_NAME%":"","%DATA_CELL%":"A3","%DATA_FORMULA%":"A1*A2","%INPUT_VALUE%":"3462.39"},"3":{"%ROW_NUMBER%":"A4","%ROW_NAME%":"","%DATA_CELL%":"A4","%DATA_FORMULA%":"","%INPUT_VALUE%":""}}', '{"0":{"%ROW_NUMBER%":"KIM1","%ROW_NAME%":"КИМ","%DATA_CELL%":"KIM1","%DATA_FORMULA%":"","%INPUT_VALUE%":"0.30"},"1":{"%ROW_NUMBER%":"S1","%ROW_NAME%":"Площадь, м2","%DATA_CELL%":"S1","%DATA_FORMULA%":"","%INPUT_VALUE%":""},"2":{"%ROW_NUMBER%":"PR1","%ROW_NAME%":"Цена за м2, грн","%DATA_CELL%":"PR1","%DATA_FORMULA%":"","%INPUT_VALUE%":""},"3":{"%ROW_NUMBER%":"SUM1","%ROW_NAME%":"Сумма, грн","%DATA_CELL%":"SUM1","%DATA_FORMULA%":"PRODUCT(S1,PR1)","%INPUT_VALUE%":"0"}}', '{"0":{"formula":"A1*A2","cell":"A3"}}', '2015-07-19 21:44:20'),
(186, 'Новое изделие', 11, NULL, NULL, NULL, '[\r\n    {\r\n        "%ROW_NUMBER%": "KIM1",\r\n        "%ROW_NAME%": "КИМ",\r\n        "%DATA_CELL%": "KIM1",\r\n        "%DATA_FORMULA%": "",\r\n        "%INPUT_VALUE%": "0.1"\r\n    },\r\n    {\r\n        "%ROW_NUMBER%": "S1",\r\n        "%ROW_NAME%": "Площадь, м2",\r\n        "%DATA_CELL%": "S1",\r\n        "%DATA_FORMULA%": "",\r\n        "%INPUT_VALUE%": ""\r\n    },\r\n    {\r\n        "%ROW_NUMBER%": "PR1",\r\n        "%ROW_NAME%": "Цена за м2, грн",\r\n        "%DATA_CELL%": "PR1",\r\n        "%DATA_FORMULA%": "",\r\n        "%INPUT_VALUE%": ""\r\n    },\r\n    {\r\n        "%ROW_NUMBER%": "SUM1",\r\n        "%ROW_NAME%": "Сумма, грн",\r\n        "%DATA_CELL%": "SUM1",\r\n        "%DATA_FORMULA%": "PRODUCT(S1,PR1)",\r\n        "%INPUT_VALUE%": ""\r\n    }\r\n]\r\n', NULL, '2015-07-20 22:03:09'),
(187, 'Прямоугольный (скругленный)', 11, NULL, NULL, '{"0":{"%ROW_NUMBER%":"A1","%ROW_NAME%":"Высота H,м","%DATA_CELL%":"A1","%DATA_FORMULA%":"","%INPUT_VALUE%":"0.15"},"1":{"%ROW_NUMBER%":"A2","%ROW_NAME%":"Ширина L,м","%DATA_CELL%":"A2","%DATA_FORMULA%":"","%INPUT_VALUE%":"0.20"}}', '{"0":{"%ROW_NUMBER%":"KIM1","%ROW_NAME%":"КИМ","%DATA_CELL%":"KIM1","%DATA_FORMULA%":"","%INPUT_VALUE%":"1.40"},"1":{"%ROW_NUMBER%":"S1","%ROW_NAME%":"Площадь, м2","%DATA_CELL%":"S1","%DATA_FORMULA%":"KIM1*(2*(A1+0.11)*(A1+0.11)+(0.21+3.14*A1/4)*(A2+0.08)+0.21*(A2+0.08))","%INPUT_VALUE%":"0.40"},"2":{"%ROW_NUMBER%":"PR1","%ROW_NAME%":"Цена за м2, грн","%DATA_CELL%":"PR1","%DATA_FORMULA%":"","%INPUT_VALUE%":"135"},"3":{"%ROW_NUMBER%":"SUM1","%ROW_NAME%":"Сумма, грн","%DATA_CELL%":"SUM1","%DATA_FORMULA%":"PRODUCT(S1,PR1)","%INPUT_VALUE%":"54.01"}}', '{"0":{"formula":"KIM1*(2*(A1+0.11)*(A1+0.11)+(0.21+3.14*A1/4)*(A2+0.08)+0.21*(A2+0.08))","cell":"S1"}}', '2015-07-20 22:10:00');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=296 ;

--
-- Дамп данных таблицы `tabs`
--

INSERT INTO `tabs` (`id`, `tab_id`, `product_id`, `active`) VALUES
(293, 'pr1', 185, 0),
(295, 'pr294', 187, 1);

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
  ADD CONSTRAINT `products_ibfk_3` FOREIGN KEY (`metall`) REFERENCES `metalls` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`kim`) REFERENCES `kim` (`kim_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `tabs`
--
ALTER TABLE `tabs`
  ADD CONSTRAINT `tabs_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
