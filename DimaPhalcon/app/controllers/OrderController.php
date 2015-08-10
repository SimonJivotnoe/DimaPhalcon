<?php
use Phalcon\Db\RawValue;
class OrderController  extends \Phalcon\Mvc\Controller 
{
    public function createNewOrderAction() {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $prId = $this->request->getPost('productId');
            $orderMax = Orders::maximum(array("column" => "order_number"));
            $orderNumber = 1;            
            if (empty($orderMax)) {
                $order = new Orders;
                $order->setOrderNumber('1')->save();
            } else {
                $orderNumber = (int)($orderMax->getOrderNumber()) + 1;
            }
            $order = new Orders;
            $order->setArticle($this->generateArticle($orderNumber))
                  ->setDiscount(new RawValue('default'));
            
            $this->response->setContentType('application/json', 'UTF-8');
            
            if ($order->save() == false) {                
                $this->response->setJsonContent('error');
                return $this->response;
            }
            $order_id = $order->getId();
            $prInOrder = new Productinorder;
            $prInOrder->setOrderid($order_id)
                      ->setProductid($prId)
                      ->setQuantity(new RawValue('default'));
            if ($prInOrder->save() == false) {
                $this->response->setJsonContent('error');
                return $this->response;
            }
            
            $tab = new TabsController;
            $this->response->setJsonContent($tab->addNewRightTab($order_id));
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }
    
    public function createAddToOrder() {
        //$substObj = new Substitution();
        $res = '<button class="btn btn-info btn-sm" id="createOrderBtn">Создать новый ордер</button>'
                . '<button class="btn btn-info btn-sm" id="addToOrderBtn">Добавить в текущий ордер</button>';
        return $res;
    }
    
    public function generateArticle($number) {
        $zero = '00';
        if (100 > $number) {
           $zero = '0';
        } else if(1000 > $number) {
            $zero = '';
        }
        return date('y') . '-' . $zero . strval($number) . '-' . date('d') . date('m') . date('o');
    }
}
