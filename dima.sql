-- phpMyAdmin SQL Dump
-- version 4.0.10.6
-- http://www.phpmyadmin.net
--
-- Хост: 127.0.0.1:3306
-- Время создания: Янв 04 2016 г., 01:40
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
-- Структура таблицы `clients`
--

CREATE TABLE IF NOT EXISTS `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fio` text NOT NULL,
  `appeal` text NOT NULL,
  `company_name` text NOT NULL,
  `adress` text NOT NULL,
  `accaunt` text NOT NULL,
  `zip` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Дамп данных таблицы `clients`
--

INSERT INTO `clients` (`id`, `fio`, `appeal`, `company_name`, `adress`, `accaunt`, `zip`) VALUES
(2, 'Клиент_ТЕСТ', 'в', 'ТЕСТ', '', '', '');

-- --------------------------------------------------------

--
-- Структура таблицы `consolidate_orders`
--

CREATE TABLE IF NOT EXISTS `consolidate_orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `cons_order_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `cons_order_id` (`cons_order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

--
-- Дамп данных таблицы `metalls`
--

INSERT INTO `metalls` (`id`, `name`, `price`, `mass`, `out_price`, `article`) VALUES
(6, 'Тест1', '50', '2', '60', 'Тест1'),
(7, 'Жопа', '90', '20', '95', 'ЖОПА');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Дамп данных таблицы `metall_prices_history`
--

INSERT INTO `metall_prices_history` (`id`, `price`, `out_price`, `date`, `metall_id`) VALUES
(1, '100', '120', '2015-12-06 20:52:27', 6),
(2, '100', '130', '2015-12-06 21:09:07', 6),
(3, '80', '90', '2015-12-06 22:25:17', 6),
(4, '200', '300', '2015-12-10 22:09:26', 6),
(5, '100', '150', '2015-12-15 22:26:21', 7);

-- --------------------------------------------------------

--
-- Структура таблицы `orders`
--

CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_number` int(11) NOT NULL,
  `article` varchar(255) NOT NULL,
  `discount` varchar(255) NOT NULL DEFAULT '0',
  `project` int(11) DEFAULT NULL,
  `map` text,
  `status` enum('draft','save','','') NOT NULL DEFAULT 'draft',
  `consolidate` enum('TRUE','FALSE') NOT NULL DEFAULT 'FALSE',
  PRIMARY KEY (`id`),
  KEY `id` (`id`),
  KEY `project` (`project`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=68 ;

--
-- Дамп данных таблицы `orders`
--

INSERT INTO `orders` (`id`, `order_number`, `article`, `discount`, `project`, `map`, `status`, `consolidate`) VALUES
(67, 67, 'домТест', '0', 3, NULL, 'save', 'FALSE');

-- --------------------------------------------------------

--
-- Структура таблицы `productInOrder`
--

CREATE TABLE IF NOT EXISTS `productInOrder` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `always_in_table` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `orderId` (`orderId`,`productId`),
  KEY `productId` (`productId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

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
  `status` enum('draft','save') NOT NULL DEFAULT 'draft',
  `template` varchar(255) NOT NULL DEFAULT '0',
  `image` text,
  PRIMARY KEY (`product_id`),
  KEY `category_id` (`category_id`),
  KEY `kim` (`kim`),
  KEY `metall` (`metall`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=214 ;

--
-- Дамп данных таблицы `products`
--

INSERT INTO `products` (`product_id`, `article`, `product_name`, `category_id`, `kim`, `metall`, `table_content`, `alwaysInTable`, `formulas`, `created`, `status`, `template`, `image`) VALUES
(211, 'УТТест112', 'Кусок Жопы', 12, 17, 6, '{"0":{"%ROW_NUMBER%":"A1","%ROW_NAME%":"","%DATA_CELL%":"A1","%DATA_FORMULA%":"","%INPUT_VALUE%":"1"},"1":{"%ROW_NUMBER%":"A2","%ROW_NAME%":"","%DATA_CELL%":"A2","%DATA_FORMULA%":"","%INPUT_VALUE%":"2"}}', '{"0":{"%ROW_NUMBER%":"KIM1","%ROW_NAME%":"КИМ","%DATA_CELL%":"KIM1","%DATA_FORMULA%":"","%INPUT_VALUE%":"1.21"},"1":{"%ROW_NUMBER%":"S1","%ROW_NAME%":"Площадь, м2","%DATA_CELL%":"S1","%DATA_FORMULA%":"A1*A2","%INPUT_VALUE%":"2"},"2":{"%ROW_NUMBER%":"PR1","%ROW_NAME%":"Цена входящая за м2, грн","%DATA_CELL%":"PR1","%DATA_FORMULA%":"","%INPUT_VALUE%":"200"},"3":{"%ROW_NUMBER%":"SUM1","%ROW_NAME%":"Цена изделия входящая, грн","%DATA_CELL%":"SUM1","%DATA_FORMULA%":"PRODUCT(S1,PR1)","%INPUT_VALUE%":"400"},"4":{"%ROW_NUMBER%":"PR2","%ROW_NAME%":"Цена исходящая, грн","%DATA_CELL%":"PR2","%DATA_FORMULA%":"","%INPUT_VALUE%":"300"},"5":{"%ROW_NUMBER%":"SUM2","%ROW_NAME%":"Цена изделия исходящая, грн","%DATA_CELL%":"SUM2","%DATA_FORMULA%":"PRODUCT(S1,PR2)","%INPUT_VALUE%":"600"}}', '{"0":{"formula":"A1*A2","cell":"S1"}}', '2015-12-14 19:37:57', 'save', '0', '211.jpg'),
(212, 'ТРТест123', 'Кусок Говна', 13, 18, 6, '{"0":{"%ROW_NUMBER%":"A1","%ROW_NAME%":"","%DATA_CELL%":"A1","%DATA_FORMULA%":"","%INPUT_VALUE%":"2"},"1":{"%ROW_NUMBER%":"A2","%ROW_NAME%":"","%DATA_CELL%":"A2","%DATA_FORMULA%":"","%INPUT_VALUE%":"3"}}', '{"0":{"%ROW_NUMBER%":"KIM1","%ROW_NAME%":"КИМ","%DATA_CELL%":"KIM1","%DATA_FORMULA%":"","%INPUT_VALUE%":"1.19"},"1":{"%ROW_NUMBER%":"S1","%ROW_NAME%":"Площадь, м2","%DATA_CELL%":"S1","%DATA_FORMULA%":"A1*A2","%INPUT_VALUE%":"6"},"2":{"%ROW_NUMBER%":"PR1","%ROW_NAME%":"Цена входящая за м2, грн","%DATA_CELL%":"PR1","%DATA_FORMULA%":"","%INPUT_VALUE%":"200"},"3":{"%ROW_NUMBER%":"SUM1","%ROW_NAME%":"Цена изделия входящая, грн","%DATA_CELL%":"SUM1","%DATA_FORMULA%":"PRODUCT(S1,PR1)","%INPUT_VALUE%":"1200"},"4":{"%ROW_NUMBER%":"PR2","%ROW_NAME%":"Цена исходящая, грн","%DATA_CELL%":"PR2","%DATA_FORMULA%":"","%INPUT_VALUE%":"300"},"5":{"%ROW_NUMBER%":"SUM2","%ROW_NAME%":"Цена изделия исходящая, грн","%DATA_CELL%":"SUM2","%DATA_FORMULA%":"PRODUCT(S1,PR2)","%INPUT_VALUE%":"1800"}}', '{"0":{"formula":"A1*A2","cell":"S1"}}', '2015-12-14 21:44:13', 'save', '0', '212.jpg'),
(213, 'ВЗТест134', 'Кусок Хера', 14, 20, 6, '{"0":{"%ROW_NUMBER%":"A1","%ROW_NAME%":"","%DATA_CELL%":"A1","%DATA_FORMULA%":"","%INPUT_VALUE%":"3"},"1":{"%ROW_NUMBER%":"A2","%ROW_NAME%":"","%DATA_CELL%":"A2","%DATA_FORMULA%":"","%INPUT_VALUE%":"4"}}', '{"0":{"%ROW_NUMBER%":"KIM1","%ROW_NAME%":"КИМ","%DATA_CELL%":"KIM1","%DATA_FORMULA%":"","%INPUT_VALUE%":"1.15"},"1":{"%ROW_NUMBER%":"S1","%ROW_NAME%":"Площадь, м2","%DATA_CELL%":"S1","%DATA_FORMULA%":"A1*A2","%INPUT_VALUE%":"12"},"2":{"%ROW_NUMBER%":"PR1","%ROW_NAME%":"Цена входящая за м2, грн","%DATA_CELL%":"PR1","%DATA_FORMULA%":"","%INPUT_VALUE%":"200"},"3":{"%ROW_NUMBER%":"SUM1","%ROW_NAME%":"Цена изделия входящая, грн","%DATA_CELL%":"SUM1","%DATA_FORMULA%":"PRODUCT(S1,PR1)","%INPUT_VALUE%":"2400"},"4":{"%ROW_NUMBER%":"PR2","%ROW_NAME%":"Цена исходящая, грн","%DATA_CELL%":"PR2","%DATA_FORMULA%":"","%INPUT_VALUE%":"300"},"5":{"%ROW_NUMBER%":"SUM2","%ROW_NAME%":"Цена изделия исходящая, грн","%DATA_CELL%":"SUM2","%DATA_FORMULA%":"PRODUCT(S1,PR2)","%INPUT_VALUE%":"3600"}}', '{"0":{"formula":"A1*A2","cell":"S1"}}', '2015-12-14 21:45:04', 'save', '0', '213.jpg');

-- --------------------------------------------------------

--
-- Структура таблицы `projects`
--

CREATE TABLE IF NOT EXISTS `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `description` text NOT NULL,
  `estimate` varchar(11) NOT NULL,
  `date` varchar(11) NOT NULL,
  `client` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `client` (`client`),
  KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Дамп данных таблицы `projects`
--

INSERT INTO `projects` (`id`, `name`, `description`, `estimate`, `date`, `client`) VALUES
(3, 'Дом', 'ук', '', '', 2);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Дамп данных таблицы `tabs`
--

INSERT INTO `tabs` (`id`, `tab_id`, `product_id`, `active`) VALUES
(4, 'pr', 211, 0),
(5, 'pr4', 212, 1);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `themes`
--

CREATE TABLE IF NOT EXISTS `themes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `css` text,
  `active` enum('1','0') NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Дамп данных таблицы `themes`
--

INSERT INTO `themes` (`id`, `name`, `css`, `active`) VALUES
(1, 'Черный', '{"body":{"backgroundColor":"#262424"}}', '0'),
(2, 'Синий', '{"body":{"backgroundColor":"#0e23e8"}}', '0'),
(3, 'Желтый', '{"body":{"backgroundColor":"#c2a406"}}', '0');

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `consolidate_orders`
--
ALTER TABLE `consolidate_orders`
  ADD CONSTRAINT `consolidate_orders_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `consolidate_orders_ibfk_2` FOREIGN KEY (`cons_order_id`) REFERENCES `orders` (`id`);

--
-- Ограничения внешнего ключа таблицы `formulas`
--
ALTER TABLE `formulas`
  ADD CONSTRAINT `formulas_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `projects` (`id`);

--
-- Ограничения внешнего ключа таблицы `metall_prices_history`
--
ALTER TABLE `metall_prices_history`
  ADD CONSTRAINT `metall_prices_history_ibfk_1` FOREIGN KEY (`metall_id`) REFERENCES `metalls` (`id`);

--
-- Ограничения внешнего ключа таблицы `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`project`) REFERENCES `projects` (`id`);

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
-- Ограничения внешнего ключа таблицы `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`client`) REFERENCES `clients` (`id`);

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
