-- phpMyAdmin SQL Dump
-- version 4.0.10.6
-- http://www.phpmyadmin.net
--
-- Хост: 127.0.0.1:3306
-- Время создания: Окт 05 2015 г., 01:29
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=15 ;

--
-- Дамп данных таблицы `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`) VALUES
(11, 'Нераспределенное'),
(12, 'Утки'),
(13, 'Тройник'),
(14, 'Воздуховод');

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
  `article_kim` varchar(255) NOT NULL,
  PRIMARY KEY (`kim_id`),
  UNIQUE KEY `kim_hard` (`kim_hard`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=21 ;

--
-- Дамп данных таблицы `kim`
--

INSERT INTO `kim` (`kim_id`, `kim_hard`, `kim`, `article_kim`) VALUES
(17, 'Прямой участок', '1.21', 'Пр'),
(18, 'Фасонный участок', '1.19', 'ФУ'),
(20, 'Коллектор', '1.16', 'ФВУ');

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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Дамп данных таблицы `metalls`
--

INSERT INTO `metalls` (`id`, `name`, `price`, `mass`, `out_price`, `article`) VALUES
(2, 'металл оц. 0.55', '185', '8.5', '246', 'ОШ'),
(3, 'резина 1мм', '200', '10', '300', 'РЕ'),
(4, 'дерево', '50', '60', '70', 'ДЕ');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=36 ;

--
-- Дамп данных таблицы `orders`
--

INSERT INTO `orders` (`id`, `order_number`, `article`, `discount`, `order_description`, `map`, `status`) VALUES
(34, 1, '15-001-12092015', '6', '{"%FIO%":"\\u0433\\u043e\\u0432\\u043d\\u043e","%PROJECT_NAME%":"","%APPEAL%":"","%PROJECT_DESCR%":"","%COMPANY_NAME%":"","%ADDRES%":"","%ACC_NUMBER%":"","%CITY%":"","%ESTIMATE%":"2015-09-12","%DATE%":"2015-09-10"}', '{"out":[{"193":"12"}],"Раздел 1":[],"Раздел 2":[]}', 'save'),
(35, 2, '15-002-29092015', '0', '{"%FIO%":"","%PROJECT_NAME%":"","%APPEAL%":"","%PROJECT_DESCR%":"","%COMPANY_NAME%":"","%ADDRES%":"","%ACC_NUMBER%":"","%CITY%":"","%ESTIMATE%":"2015-09-29","%DATE%":"2015-09-29"}', '{"out":[{"198":"1"},{"195":"1"},{"193":"1"}],"Раздел 1":[],"Раздел 2":[]}', 'save');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=63 ;

--
-- Дамп данных таблицы `productInOrder`
--

INSERT INTO `productInOrder` (`id`, `orderId`, `productId`) VALUES
(59, 34, 193),
(62, 35, 193),
(61, 35, 195),
(60, 35, 198);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=200 ;

--
-- Дамп данных таблицы `products`
--

INSERT INTO `products` (`product_id`, `article`, `product_name`, `category_id`, `kim`, `metall`, `table_content`, `alwaysInTable`, `formulas`, `created`, `status`, `template`) VALUES
(193, '', 'воздуховод', 14, 20, 2, '{"0":{"%ROW_NUMBER%":"A17","%ROW_NAME%":"говно","%DATA_CELL%":"A17","%DATA_FORMULA%":"","%INPUT_VALUE%":"12.07"},"1":{"%ROW_NUMBER%":"A18","%ROW_NAME%":"жопа","%DATA_CELL%":"A18","%DATA_FORMULA%":"","%INPUT_VALUE%":"0.90"},"2":{"%ROW_NUMBER%":"A19","%ROW_NAME%":"","%DATA_CELL%":"A19","%DATA_FORMULA%":"","%INPUT_VALUE%":""}}', '{"0":{"%ROW_NUMBER%":"KIM1","%ROW_NAME%":"КИМ","%DATA_CELL%":"KIM1","%DATA_FORMULA%":"","%INPUT_VALUE%":"1.16"},"1":{"%ROW_NUMBER%":"S1","%ROW_NAME%":"Площадь, м2","%DATA_CELL%":"S1","%DATA_FORMULA%":"A17*A18","%INPUT_VALUE%":"10.86"},"2":{"%ROW_NUMBER%":"PR1","%ROW_NAME%":"Цена входящая за м2, грн","%DATA_CELL%":"PR1","%DATA_FORMULA%":"","%INPUT_VALUE%":"185"},"3":{"%ROW_NUMBER%":"SUM1","%ROW_NAME%":"Цена изделия входящая, грн","%DATA_CELL%":"SUM1","%DATA_FORMULA%":"PRODUCT(S1,PR1)","%INPUT_VALUE%":"2009.66"},"4":{"%ROW_NUMBER%":"PR2","%ROW_NAME%":"Цена исходящая, грн","%DATA_CELL%":"PR2","%DATA_FORMULA%":"","%INPUT_VALUE%":"246"},"5":{"%ROW_NUMBER%":"SUM2","%ROW_NAME%":"Цена изделия исходящая, грн","%DATA_CELL%":"SUM2","%DATA_FORMULA%":"","%INPUT_VALUE%":""}}', '{"0":{"formula":"RADIANS()","cell":""},"1":{"formula":"A17*A18","cell":"S1"},"2":{"formula":"S1+A18","cell":""}}', '2015-09-12 16:02:53', 'save', '0'),
(195, '', 'Тест', 12, 17, 2, '{"0":{"%ROW_NUMBER%":"A1","%ROW_NAME%":"","%DATA_CELL%":"A1","%DATA_FORMULA%":"","%INPUT_VALUE%":"-0.11"},"1":{"%ROW_NUMBER%":"A3","%ROW_NAME%":"","%DATA_CELL%":"A3","%DATA_FORMULA%":"","%INPUT_VALUE%":"-0.01"},"2":{"%ROW_NUMBER%":"A4","%ROW_NAME%":"","%DATA_CELL%":"A4","%DATA_FORMULA%":"","%INPUT_VALUE%":"-0.01"},"3":{"%ROW_NUMBER%":"A5","%ROW_NAME%":"","%DATA_CELL%":"A5","%DATA_FORMULA%":"","%INPUT_VALUE%":""}}', '{"0":{"%ROW_NUMBER%":"KIM1","%ROW_NAME%":"КИМ","%DATA_CELL%":"KIM1","%DATA_FORMULA%":"","%INPUT_VALUE%":"1.19"},"1":{"%ROW_NUMBER%":"S1","%ROW_NAME%":"Площадь, м2","%DATA_CELL%":"S1","%DATA_FORMULA%":"","%INPUT_VALUE%":""},"2":{"%ROW_NUMBER%":"PR1","%ROW_NAME%":"Цена входящая за м2, грн","%DATA_CELL%":"PR1","%DATA_FORMULA%":"","%INPUT_VALUE%":"185"},"3":{"%ROW_NUMBER%":"SUM1","%ROW_NAME%":"Цена изделия входящая, грн","%DATA_CELL%":"SUM1","%DATA_FORMULA%":"PRODUCT(S1,PR1)","%INPUT_VALUE%":"0"},"4":{"%ROW_NUMBER%":"PR2","%ROW_NAME%":"Цена исходящая, грн","%DATA_CELL%":"PR2","%DATA_FORMULA%":"","%INPUT_VALUE%":"245"},"5":{"%ROW_NUMBER%":"SUM2","%ROW_NAME%":"Цена изделия исходящая, грн","%DATA_CELL%":"SUM2","%DATA_FORMULA%":"PRODUCT(S1,PR2)","%INPUT_VALUE%":"0"}}', NULL, '2015-09-19 20:49:57', 'save', '0'),
(196, '', 'Тройник', 13, 17, 2, '{}', '{"0":{"%ROW_NUMBER%":"KIM1","%ROW_NAME%":"КИМ","%DATA_CELL%":"KIM1","%DATA_FORMULA%":"","%INPUT_VALUE%":"1.21"},"1":{"%ROW_NUMBER%":"S1","%ROW_NAME%":"Площадь, м2","%DATA_CELL%":"S1","%DATA_FORMULA%":"","%INPUT_VALUE%":""},"2":{"%ROW_NUMBER%":"PR1","%ROW_NAME%":"Цена входящая за м2, грн","%DATA_CELL%":"PR1","%DATA_FORMULA%":"","%INPUT_VALUE%":"185"},"3":{"%ROW_NUMBER%":"SUM1","%ROW_NAME%":"Цена изделия входящая, грн","%DATA_CELL%":"SUM1","%DATA_FORMULA%":"PRODUCT(S1,PR1)","%INPUT_VALUE%":"0"},"4":{"%ROW_NUMBER%":"PR2","%ROW_NAME%":"Цена исходящая, грн","%DATA_CELL%":"PR2","%DATA_FORMULA%":"","%INPUT_VALUE%":"245"},"5":{"%ROW_NUMBER%":"SUM2","%ROW_NAME%":"Цена изделия исходящая, грн","%DATA_CELL%":"SUM2","%DATA_FORMULA%":"PRODUCT(S1,PR2)","%INPUT_VALUE%":"0"}}', NULL, '2015-09-23 22:46:18', 'save', '0'),
(198, '', 'Новое изделие', 11, 17, 2, '{"0":{"%ROW_NUMBER%":"A1","%ROW_NAME%":"","%DATA_CELL%":"A1","%DATA_FORMULA%":"","%INPUT_VALUE%":"300"},"1":{"%ROW_NUMBER%":"A2","%ROW_NAME%":"","%DATA_CELL%":"A2","%DATA_FORMULA%":"","%INPUT_VALUE%":"200"},"2":{"%ROW_NUMBER%":"A3","%ROW_NAME%":"","%DATA_CELL%":"A3","%DATA_FORMULA%":"","%INPUT_VALUE%":"500"}}', '{"0":{"%ROW_NUMBER%":"KIM1","%ROW_NAME%":"КИМ","%DATA_CELL%":"KIM1","%DATA_FORMULA%":"","%INPUT_VALUE%":"1.21"},"1":{"%ROW_NUMBER%":"S1","%ROW_NAME%":"Площадь, м2","%DATA_CELL%":"S1","%DATA_FORMULA%":"","%INPUT_VALUE%":"10"},"2":{"%ROW_NUMBER%":"PR1","%ROW_NAME%":"Цена входящая за м2, грн","%DATA_CELL%":"PR1","%DATA_FORMULA%":"","%INPUT_VALUE%":"185"},"3":{"%ROW_NUMBER%":"SUM1","%ROW_NAME%":"Цена изделия входящая, грн","%DATA_CELL%":"SUM1","%DATA_FORMULA%":"PRODUCT(S1,PR1)","%INPUT_VALUE%":"1850"},"4":{"%ROW_NUMBER%":"PR2","%ROW_NAME%":"Цена исходящая, грн","%DATA_CELL%":"PR2","%DATA_FORMULA%":"","%INPUT_VALUE%":"245"},"5":{"%ROW_NUMBER%":"SUM2","%ROW_NAME%":"Цена изделия исходящая, грн","%DATA_CELL%":"SUM2","%DATA_FORMULA%":"PRODUCT(S1,PR2)","%INPUT_VALUE%":"2450"}}', NULL, '2015-09-29 07:07:53', 'save', '0'),
(199, NULL, 'Новое изделие', 11, 17, 2, '{"0":{"%ROW_NUMBER%":"A1","%ROW_NAME%":"","%DATA_CELL%":"A1","%DATA_FORMULA%":"","%INPUT_VALUE%":""},"1":{"%ROW_NUMBER%":"A2","%ROW_NAME%":"","%DATA_CELL%":"A2","%DATA_FORMULA%":"","%INPUT_VALUE%":""}}', '{"0":{"%ROW_NUMBER%":"KIM1","%ROW_NAME%":"КИМ","%DATA_CELL%":"KIM1","%DATA_FORMULA%":"","%INPUT_VALUE%":"1.21"},"1":{"%ROW_NUMBER%":"S1","%ROW_NAME%":"Площадь, м2","%DATA_CELL%":"S1","%DATA_FORMULA%":"","%INPUT_VALUE%":""},"2":{"%ROW_NUMBER%":"PR1","%ROW_NAME%":"Цена входящая за м2, грн","%DATA_CELL%":"PR1","%DATA_FORMULA%":"","%INPUT_VALUE%":"185"},"3":{"%ROW_NUMBER%":"SUM1","%ROW_NAME%":"Цена изделия входящая, грн","%DATA_CELL%":"SUM1","%DATA_FORMULA%":"PRODUCT(S1,PR1)","%INPUT_VALUE%":"0"},"4":{"%ROW_NUMBER%":"PR2","%ROW_NAME%":"Цена исходящая, грн","%DATA_CELL%":"PR2","%DATA_FORMULA%":"","%INPUT_VALUE%":"246"},"5":{"%ROW_NUMBER%":"SUM2","%ROW_NAME%":"Цена изделия исходящая, грн","%DATA_CELL%":"SUM2","%DATA_FORMULA%":"PRODUCT(S1,PR2)","%INPUT_VALUE%":"0"}}', NULL, '2015-10-04 21:40:28', 'draft', '0');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=304 ;

--
-- Дамп данных таблицы `tabs`
--

INSERT INTO `tabs` (`id`, `tab_id`, `product_id`, `active`) VALUES
(298, 'pr', 193, 1),
(303, 'pr298', 199, 0);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=27 ;

--
-- Дамп данных таблицы `tabs_right`
--

INSERT INTO `tabs_right` (`id`, `order_id`, `active`) VALUES
(25, 34, 0),
(26, 35, 1);

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `formulas`
--
ALTER TABLE `formulas`
  ADD CONSTRAINT `formulas_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

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
