<?php

class OrderController  extends \Phalcon\Mvc\Controller 
{
    public function createAddToOrder($productId) {
        $substObj = new Substitution();
        $res = '<button class="btn btn-info btn-sm" id="createOrderBtn">Создать новый ордер</button>'
                . '<button class="btn btn-info btn-sm" id="addToOrderBtn">Добавить в текущий ордер</button>';
        return $res;
    }
}
