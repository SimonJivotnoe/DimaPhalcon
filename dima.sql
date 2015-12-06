-- phpMyAdmin SQL Dump
-- version 4.0.10.6
-- http://www.phpmyadmin.net
--
-- Хост: 127.0.0.1:3306
-- Время создания: Дек 07 2015 г., 01:43
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
  `article` varchar(255) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=15 ;

--
-- Дамп данных таблицы `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`, `article`) VALUES
(11, 'Нераспределенное', 'НЕ'),
(12, 'Утки', 'УТ'),
(13, 'Тройник', 'ТР'),
(14, 'Воздуховод', 'ВЗ');

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
  PRIMARY KEY (`kim_id`),
  UNIQUE KEY `kim_hard` (`kim_hard`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=21 ;

--
-- Дамп данных таблицы `kim`
--

INSERT INTO `kim` (`kim_id`, `kim_hard`, `kim`) VALUES
(17, 'Прямой участок', '1.21'),
(18, 'Фасонный участок', '1.19'),
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
  `article` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Дамп данных таблицы `metalls`
--

INSERT INTO `metalls` (`id`, `name`, `price`, `mass`, `out_price`, `article`) VALUES
(2, 'металл оц. 0.55', '185', '8.5', '246', 'ОШ'),
(3, 'резина 1мм', '200', '10', '300', 'РЕ'),
(4, 'дерево', '50', '60', '70', 'ДЕ'),
(6, 'Тест1', '80', '2', '90', 'Тест1');

-- --------------------------------------------------------

--
-- Структура таблицы `metall_prices_history`
--

CREATE TABLE IF NOT EXISTS `metall_prices_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `price` varchar(255) NOT NULL,
  `out_price` varchar(255) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `metall_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `metall_id` (`metall_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Дамп данных таблицы `metall_prices_history`
--

INSERT INTO `metall_prices_history` (`id`, `price`, `out_price`, `date`, `metall_id`) VALUES
(1, '100', '120', '2015-12-06 20:52:27', 6),
(2, '110', '130', '2015-12-06 21:09:07', 6),
(3, '80', '90', '2015-12-06 22:25:17', 6);

-- --------------------------------------------------------

--
-- Структура таблицы `orders`
--

CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_number` int(11) NOT NULL,
  `article` varchar(255) NOT NULL,
  `discount` varchar(255) NOT NULL DEFAULT '0',
  `order_description` text,
  `map` text,
  `status` enum('draft','save','','') NOT NULL DEFAULT 'draft',
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=61 ;

--
-- Дамп данных таблицы `orders`
--

INSERT INTO `orders` (`id`, `order_number`, `article`, `discount`, `order_description`, `map`, `status`) VALUES
(34, 1, '15-001-12092015', '6', '{"%FIO%":"\\u0433\\u043e\\u0432\\u043d\\u043e","%PROJECT_NAME%":"","%APPEAL%":"","%PROJECT_DESCR%":"","%COMPANY_NAME%":"fddfsrf","%ADDRES%":"","%ACC_NUMBER%":"","%CITY%":"","%ESTIMATE%":"2015-09-12","%DATE%":"2015-09-10"}', '{"out":[{"193":"1"}],"Раздел 1":[],"Раздел 2":[],"Раздел 3":[],"Раздел 4":[]}', 'save'),
(35, 2, '15-002-29092015', '1', '{"%FIO%":"\\u0436\\u043e\\u043f\\u0430","%PROJECT_NAME%":"","%APPEAL%":"","%PROJECT_DESCR%":"","%COMPANY_NAME%":"","%ADDRES%":"","%ACC_NUMBER%":"","%CITY%":"","%ESTIMATE%":"2015-09-29","%DATE%":"2015-09-29"}', '{"out":[{"201":"2"},{"203":"3"}]}', 'save'),
(60, 3, '15-003-04122015', '9', '{"%FIO%":"\\u0432\\u043a\\u043a\\u0438\\u0432\\u043a\\u0438","%PROJECT_NAME%":"\\u0432\\u0430\\u0438\\u0432\\u0430","%APPEAL%":"\\u0432\\u043a\\u0430\\u0438\\u0432\\u043a\\u0438\\u0432\\u043a","%PROJECT_DESCR%":"\\u0432\\u0430\\u0438\\u0430\\u0432\\u0438","%COMPANY_NAME%":"\\u0432\\u0430\\u0438\\u0432\\u043a\\u0430\\u0438\\u0432","%ADDRES%":"15-003-04122015","%ACC_NUMBER%":"\\u0432\\u0432\\u043a\\u0438\\u0432\\u043a\\u0438","%CITY%":"\\u0432\\u0430\\u0438\\u0432\\u0430\\u0432\\u0430\\u0438","%ESTIMATE%":"2015-12-04","%DATE%":"2015-12-04","undefined":""}', '{"out":[{"205":"1"}],"Утка 2":[{"204":"1"}]}', 'draft');

-- --------------------------------------------------------

--
-- Структура таблицы `productInOrder`
--

CREATE TABLE IF NOT EXISTS `productInOrder` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `orderId` (`orderId`,`productId`),
  KEY `productId` (`productId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=84 ;

--
-- Дамп данных таблицы `productInOrder`
--

INSERT INTO `productInOrder` (`id`, `orderId`, `productId`) VALUES
(69, 35, 201),
(68, 35, 203),
(82, 60, 204),
(83, 60, 205);

-- --------------------------------------------------------

--
-- Структура таблицы `products`
--

CREATE TABLE IF NOT EXISTS `products` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `article` varchar(255) DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `category_id` int(11) NOT NULL,
  `kim` int(11) DEFAULT NULL,
  `metall` int(11) DEFAULT NULL,
  `table_content` text,
  `alwaysInTable` text,
  `formulas` text,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('draft','save','','') NOT NULL DEFAULT 'draft',
  `template` varchar(255) NOT NULL DEFAULT '0',
  PRIMARY KEY (`product_id`),
  KEY `category_id` (`category_id`),
  KEY `kim` (`kim`),
  KEY `metall` (`metall`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=208 ;

--
-- Дамп данных таблицы `products`
--

INSERT INTO `products` (`product_id`, `article`, `product_name`, `category_id`, `kim`, `metall`, `table_content`, `alwaysInTable`, `formulas`, `created`, `status`, `template`) VALUES
(195, 'УТОШ234', 'Тест', 12, 17, 2, '{"0":{"%ROW_NUMBER%":"A1","%ROW_NAME%":"Один","%DATA_CELL%":"A1","%DATA_FORMULA%":"","%INPUT_VALUE%":"2"},"1":{"%ROW_NUMBER%":"A3","%ROW_NAME%":"Два","%DATA_CELL%":"A3","%DATA_FORMULA%":"","%INPUT_VALUE%":"3"},"2":{"%ROW_NUMBER%":"A4","%ROW_NAME%":"Три","%DATA_CELL%":"A4","%DATA_FORMULA%":"","%INPUT_VALUE%":"4"}}', '{"0":{"%ROW_NUMBER%":"KIM1","%ROW_NAME%":"КИМ","%DATA_CELL%":"KIM1","%DATA_FORMULA%":"","%INPUT_VALUE%":"1.21"},"1":{"%ROW_NUMBER%":"S1","%ROW_NAME%":"Площадь, м2","%DATA_CELL%":"S1","%DATA_FORMULA%":"A1+A3*A4","%INPUT_VALUE%":"14"},"2":{"%ROW_NUMBER%":"PR1","%ROW_NAME%":"Цена входящая за м2, грн","%DATA_CELL%":"PR1","%DATA_FORMULA%":"","%INPUT_VALUE%":"185"},"3":{"%ROW_NUMBER%":"SUM1","%ROW_NAME%":"Цена изделия входящая, грн","%DATA_CELL%":"SUM1","%DATA_FORMULA%":"PRODUCT(S1,PR1)","%INPUT_VALUE%":"2590"},"4":{"%ROW_NUMBER%":"PR2","%ROW_NAME%":"Цена исходящая, грн","%DATA_CELL%":"PR2","%DATA_FORMULA%":"","%INPUT_VALUE%":"246"},"5":{"%ROW_NUMBER%":"SUM2","%ROW_NAME%":"Цена изделия исходящая, грн","%DATA_CELL%":"SUM2","%DATA_FORMULA%":"PRODUCT(S1,PR2)","%INPUT_VALUE%":"3444"}}', '{"0":{"formula":"A1+A3*A4","cell":"S1"}}', '2015-09-19 20:49:57', 'save', '0'),
(196, NULL, 'Тройник', 13, 17, 2, '{}', '{"0":{"%ROW_NUMBER%":"KIM1","%ROW_NAME%":"КИМ","%DATA_CELL%":"KIM1","%DATA_FORMULA%":"","%INPUT_VALUE%":"1.21"},"1":{"%ROW_NUMBER%":"S1","%ROW_NAME%":"Площадь, м2","%DATA_CELL%":"S1","%DATA_FORMULA%":"","%INPUT_VALUE%":""},"2":{"%ROW_NUMBER%":"PR1","%ROW_NAME%":"Цена входящая за м2, грн","%DATA_CELL%":"PR1","%DATA_FORMULA%":"","%INPUT_VALUE%":"185"},"3":{"%ROW_NUMBER%":"SUM1","%ROW_NAME%":"Цена изделия входящая, грн","%DATA_CELL%":"SUM1","%DATA_FORMULA%":"PRODUCT(S1,PR1)","%INPUT_VALUE%":"0"},"4":{"%ROW_NUMBER%":"PR2","%ROW_NAME%":"Цена исходящая, грн","%DATA_CELL%":"PR2","%DATA_FORMULA%":"","%INPUT_VALUE%":"245"},"5":{"%ROW_NUMBER%":"SUM2","%ROW_NAME%":"Цена изделия исходящая, грн","%DATA_CELL%":"SUM2","%DATA_FORMULA%":"PRODUCT(S1,PR2)","%INPUT_VALUE%":"0"}}', NULL, '2015-09-23 22:46:18', 'save', '0'),
(198, NULL, 'Новое изделие', 11, 17, 2, '{"0":{"%ROW_NUMBER%":"A1","%ROW_NAME%":"","%DATA_CELL%":"A1","%DATA_FORMULA%":"","%INPUT_VALUE%":"300"},"1":{"%ROW_NUMBER%":"A2","%ROW_NAME%":"","%DATA_CELL%":"A2","%DATA_FORMULA%":"","%INPUT_VALUE%":"200"},"2":{"%ROW_NUMBER%":"A3","%ROW_NAME%":"","%DATA_CELL%":"A3","%DATA_FORMULA%":"","%INPUT_VALUE%":"500"}}', '{"0":{"%ROW_NUMBER%":"KIM1","%ROW_NAME%":"КИМ","%DATA_CELL%":"KIM1","%DATA_FORMULA%":"","%INPUT_VALUE%":"1.21"},"1":{"%ROW_NUMBER%":"S1","%ROW_NAME%":"Площадь, м2","%DATA_CELL%":"S1","%DATA_FORMULA%":"","%INPUT_VALUE%":"10"},"2":{"%ROW_NUMBER%":"PR1","%ROW_NAME%":"Цена входящая за м2, грн","%DATA_CELL%":"PR1","%DATA_FORMULA%":"","%INPUT_VALUE%":"185"},"3":{"%ROW_NUMBER%":"SUM1","%ROW_NAME%":"Цена изделия входящая, грн","%DATA_CELL%":"SUM1","%DATA_FORMULA%":"PRODUCT(S1,PR1)","%INPUT_VALUE%":"1850"},"4":{"%ROW_NUMBER%":"PR2","%ROW_NAME%":"Цена исходящая, грн","%DATA_CELL%":"PR2","%DATA_FORMULA%":"","%INPUT_VALUE%":"245"},"5":{"%ROW_NUMBER%":"SUM2","%ROW_NAME%":"Цена изделия исходящая, грн","%DATA_CELL%":"SUM2","%DATA_FORMULA%":"PRODUCT(S1,PR2)","%INPUT_VALUE%":"2450"}}', NULL, '2015-09-29 07:07:53', 'save', '0'),
(201, 'НЕОШ200300', 'Новое изделие', 11, 17, 2, '{"0":{"%ROW_NUMBER%":"A1","%ROW_NAME%":"sdfghn","%DATA_CELL%":"A1","%DATA_FORMULA%":"","%INPUT_VALUE%":"200"},"1":{"%ROW_NUMBER%":"A2","%ROW_NAME%":"sdfcgvbn","%DATA_CELL%":"A2","%DATA_FORMULA%":"","%INPUT_VALUE%":"300"}}', '{"0":{"%ROW_NUMBER%":"KIM1","%ROW_NAME%":"КИМ","%DATA_CELL%":"KIM1","%DATA_FORMULA%":"","%INPUT_VALUE%":"1.21"},"1":{"%ROW_NUMBER%":"S1","%ROW_NAME%":"Площадь, м2","%DATA_CELL%":"S1","%DATA_FORMULA%":"A1+A2","%INPUT_VALUE%":"500"},"2":{"%ROW_NUMBER%":"PR1","%ROW_NAME%":"Цена входящая за м2, грн","%DATA_CELL%":"PR1","%DATA_FORMULA%":"","%INPUT_VALUE%":"185"},"3":{"%ROW_NUMBER%":"SUM1","%ROW_NAME%":"Цена изделия входящая, грн","%DATA_CELL%":"SUM1","%DATA_FORMULA%":"PRODUCT(S1,PR1)","%INPUT_VALUE%":"92500"},"4":{"%ROW_NUMBER%":"PR2","%ROW_NAME%":"Цена исходящая, грн","%DATA_CELL%":"PR2","%DATA_FORMULA%":"","%INPUT_VALUE%":"246"},"5":{"%ROW_NUMBER%":"SUM2","%ROW_NAME%":"Цена изделия исходящая, грн","%DATA_CELL%":"SUM2","%DATA_FORMULA%":"PRODUCT(S1,PR2)","%INPUT_VALUE%":"123000"}}', '{"0":{"formula":"A1+A2","cell":"S1"}}', '2015-10-10 20:42:50', 'save', '0'),
(202, '', 'po', 11, 17, 2, '{"0":{"%ROW_NUMBER%":"A1","%ROW_NAME%":"","%DATA_CELL%":"A1","%DATA_FORMULA%":"","%INPUT_VALUE%":"20"},"1":{"%ROW_NUMBER%":"A2","%ROW_NAME%":"","%DATA_CELL%":"A2","%DATA_FORMULA%":"","%INPUT_VALUE%":"30"}}', '{"0":{"%ROW_NUMBER%":"KIM1","%ROW_NAME%":"КИМ","%DATA_CELL%":"KIM1","%DATA_FORMULA%":"","%INPUT_VALUE%":"1.21"},"1":{"%ROW_NUMBER%":"S1","%ROW_NAME%":"Площадь, м2","%DATA_CELL%":"S1","%DATA_FORMULA%":"","%INPUT_VALUE%":""},"2":{"%ROW_NUMBER%":"PR1","%ROW_NAME%":"Цена входящая за м2, грн","%DATA_CELL%":"PR1","%DATA_FORMULA%":"","%INPUT_VALUE%":"185"},"3":{"%ROW_NUMBER%":"SUM1","%ROW_NAME%":"Цена изделия входящая, грн","%DATA_CELL%":"SUM1","%DATA_FORMULA%":"PRODUCT(S1,PR1)","%INPUT_VALUE%":"0"},"4":{"%ROW_NUMBER%":"PR2","%ROW_NAME%":"Цена исходящая, грн","%DATA_CELL%":"PR2","%DATA_FORMULA%":"","%INPUT_VALUE%":"246"},"5":{"%ROW_NUMBER%":"SUM2","%ROW_NAME%":"Цена изделия исходящая, грн","%DATA_CELL%":"SUM2","%DATA_FORMULA%":"PRODUCT(S1,PR2)","%INPUT_VALUE%":"0"}}', '{"0":{"formula":"S1KIM1","cell":""},"1":{"formula":"SUM2PR2","cell":""},"2":{"formula":"KIM1KIM1SUM1","cell":""}}', '2015-10-21 21:54:18', 'save', '0'),
(203, 'НЕОШ23', 'Тест', 11, 17, 2, '{"0":{"%ROW_NUMBER%":"A1","%ROW_NAME%":"dfv","%DATA_CELL%":"A1","%DATA_FORMULA%":"","%INPUT_VALUE%":"2"},"1":{"%ROW_NUMBER%":"A2","%ROW_NAME%":"dfv","%DATA_CELL%":"A2","%DATA_FORMULA%":"","%INPUT_VALUE%":"3"}}', '{"0":{"%ROW_NUMBER%":"KIM1","%ROW_NAME%":"КИМ","%DATA_CELL%":"KIM1","%DATA_FORMULA%":"","%INPUT_VALUE%":"1.21"},"1":{"%ROW_NUMBER%":"S1","%ROW_NAME%":"Площадь, м2","%DATA_CELL%":"S1","%DATA_FORMULA%":"A1+A2","%INPUT_VALUE%":"5"},"2":{"%ROW_NUMBER%":"PR1","%ROW_NAME%":"Цена входящая за м2, грн","%DATA_CELL%":"PR1","%DATA_FORMULA%":"","%INPUT_VALUE%":"185"},"3":{"%ROW_NUMBER%":"SUM1","%ROW_NAME%":"Цена изделия входящая, грн","%DATA_CELL%":"SUM1","%DATA_FORMULA%":"PRODUCT(S1,PR1)","%INPUT_VALUE%":"925"},"4":{"%ROW_NUMBER%":"PR2","%ROW_NAME%":"Цена исходящая, грн","%DATA_CELL%":"PR2","%DATA_FORMULA%":"","%INPUT_VALUE%":"246"},"5":{"%ROW_NUMBER%":"SUM2","%ROW_NAME%":"Цена изделия исходящая, грн","%DATA_CELL%":"SUM2","%DATA_FORMULA%":"PRODUCT(S1,PR2)","%INPUT_VALUE%":"1230"}}', '{"0":{"formula":"A1+A2","cell":"S1"}}', '2015-11-24 22:49:45', 'save', '0'),
(204, 'УТРЕ73', 'утка-шмутка', 12, 20, 3, '{"0":{"%ROW_NUMBER%":"A1","%ROW_NAME%":"кпукм","%DATA_CELL%":"A1","%DATA_FORMULA%":"","%INPUT_VALUE%":"7"},"1":{"%ROW_NUMBER%":"A2","%ROW_NAME%":"укмукм","%DATA_CELL%":"A2","%DATA_FORMULA%":"","%INPUT_VALUE%":"3"}}', '{"0":{"%ROW_NUMBER%":"KIM1","%ROW_NAME%":"КИМ","%DATA_CELL%":"KIM1","%DATA_FORMULA%":"","%INPUT_VALUE%":"1.15"},"1":{"%ROW_NUMBER%":"S1","%ROW_NAME%":"Площадь, м2","%DATA_CELL%":"S1","%DATA_FORMULA%":"A1+A2","%INPUT_VALUE%":"10"},"2":{"%ROW_NUMBER%":"PR1","%ROW_NAME%":"Цена входящая за м2, грн","%DATA_CELL%":"PR1","%DATA_FORMULA%":"","%INPUT_VALUE%":"200"},"3":{"%ROW_NUMBER%":"SUM1","%ROW_NAME%":"Цена изделия входящая, грн","%DATA_CELL%":"SUM1","%DATA_FORMULA%":"PRODUCT(S1,PR1)","%INPUT_VALUE%":"2000"},"4":{"%ROW_NUMBER%":"PR2","%ROW_NAME%":"Цена исходящая, грн","%DATA_CELL%":"PR2","%DATA_FORMULA%":"","%INPUT_VALUE%":"300"},"5":{"%ROW_NUMBER%":"SUM2","%ROW_NAME%":"Цена изделия исходящая, грн","%DATA_CELL%":"SUM2","%DATA_FORMULA%":"PRODUCT(S1,PR2)","%INPUT_VALUE%":"3000"}}', '{"0":{"formula":"A1+A2","cell":"S1"}}', '2015-12-03 21:16:17', 'save', '0'),
(205, 'УТРЕ83', 'утка-шмутка', 12, 20, 3, '{"0":{"%ROW_NUMBER%":"A1","%ROW_NAME%":"кпукм","%DATA_CELL%":"A1","%DATA_FORMULA%":"","%INPUT_VALUE%":"8"},"1":{"%ROW_NUMBER%":"A2","%ROW_NAME%":"укмукм","%DATA_CELL%":"A2","%DATA_FORMULA%":"","%INPUT_VALUE%":"3"}}', '{"0":{"%ROW_NUMBER%":"KIM1","%ROW_NAME%":"КИМ","%DATA_CELL%":"KIM1","%DATA_FORMULA%":"","%INPUT_VALUE%":"1.15"},"1":{"%ROW_NUMBER%":"S1","%ROW_NAME%":"Площадь, м2","%DATA_CELL%":"S1","%DATA_FORMULA%":"A1+A2","%INPUT_VALUE%":"11"},"2":{"%ROW_NUMBER%":"PR1","%ROW_NAME%":"Цена входящая за м2, грн","%DATA_CELL%":"PR1","%DATA_FORMULA%":"","%INPUT_VALUE%":"200"},"3":{"%ROW_NUMBER%":"SUM1","%ROW_NAME%":"Цена изделия входящая, грн","%DATA_CELL%":"SUM1","%DATA_FORMULA%":"PRODUCT(S1,PR1)","%INPUT_VALUE%":"2200"},"4":{"%ROW_NUMBER%":"PR2","%ROW_NAME%":"Цена исходящая, грн","%DATA_CELL%":"PR2","%DATA_FORMULA%":"","%INPUT_VALUE%":"300"},"5":{"%ROW_NUMBER%":"SUM2","%ROW_NAME%":"Цена изделия исходящая, грн","%DATA_CELL%":"SUM2","%DATA_FORMULA%":"PRODUCT(S1,PR2)","%INPUT_VALUE%":"3300"}}', '{"0":{"formula":"A1+A2","cell":"S1"}}', '2015-12-03 21:18:29', 'save', '0'),
(207, 'НЕТест123', 'Тест', 11, 17, 6, '{"0":{"%ROW_NUMBER%":"A1","%ROW_NAME%":"ав","%DATA_CELL%":"A1","%DATA_FORMULA%":"","%INPUT_VALUE%":"2"},"1":{"%ROW_NUMBER%":"A2","%ROW_NAME%":"вам","%DATA_CELL%":"A2","%DATA_FORMULA%":"","%INPUT_VALUE%":"3"}}', '{"0":{"%ROW_NUMBER%":"KIM1","%ROW_NAME%":"КИМ","%DATA_CELL%":"KIM1","%DATA_FORMULA%":"","%INPUT_VALUE%":"1.21"},"1":{"%ROW_NUMBER%":"S1","%ROW_NAME%":"Площадь, м2","%DATA_CELL%":"S1","%DATA_FORMULA%":"A1*A2","%INPUT_VALUE%":"6"},"2":{"%ROW_NUMBER%":"PR1","%ROW_NAME%":"Цена входящая за м2, грн","%DATA_CELL%":"PR1","%DATA_FORMULA%":"","%INPUT_VALUE%":"110"},"3":{"%ROW_NUMBER%":"SUM1","%ROW_NAME%":"Цена изделия входящая, грн","%DATA_CELL%":"SUM1","%DATA_FORMULA%":"PRODUCT(S1,PR1)","%INPUT_VALUE%":"660"},"4":{"%ROW_NUMBER%":"PR2","%ROW_NAME%":"Цена исходящая, грн","%DATA_CELL%":"PR2","%DATA_FORMULA%":"","%INPUT_VALUE%":"130"},"5":{"%ROW_NUMBER%":"SUM2","%ROW_NAME%":"Цена изделия исходящая, грн","%DATA_CELL%":"SUM2","%DATA_FORMULA%":"PRODUCT(S1,PR2)","%INPUT_VALUE%":"780"}}', '{"0":{"formula":"A1*A2","cell":"S1"}}', '2015-12-06 21:26:47', 'save', '0');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=342 ;

--
-- Дамп данных таблицы `tabs`
--

INSERT INTO `tabs` (`id`, `tab_id`, `product_id`, `active`) VALUES
(338, 'pr', 204, 0),
(339, 'pr338', 205, 0),
(341, 'pr339', 207, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `tabs_right`
--

CREATE TABLE IF NOT EXISTS `tabs_right` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `active` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=62 ;

--
-- Дамп данных таблицы `tabs_right`
--

INSERT INTO `tabs_right` (`id`, `order_id`, `active`) VALUES
(61, 60, 0);

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `formulas`
--
ALTER TABLE `formulas`
  ADD CONSTRAINT `formulas_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `metall_prices_history`
--
ALTER TABLE `metall_prices_history`
  ADD CONSTRAINT `metall_prices_history_ibfk_1` FOREIGN KEY (`metall_id`) REFERENCES `metalls` (`id`);

--
-- Ограничения внешнего ключа таблицы `productInOrder`
--
ALTER TABLE `productInOrder`
  ADD CONSTRAINT `productinorder_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `productinorder_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`product_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`kim`) REFERENCES `kim` (`kim_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `products_ibfk_3` FOREIGN KEY (`metall`) REFERENCES `metalls` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `tabs`
--
ALTER TABLE `tabs`
  ADD CONSTRAINT `tabs_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `tabs_right`
--
ALTER TABLE `tabs_right`
  ADD CONSTRAINT `tabs_right_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
