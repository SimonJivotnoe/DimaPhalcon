<?php
use Phalcon\Db\RawValue;
class OrderController  extends \Phalcon\Mvc\Controller 
{
    public function createNewOrderAction() {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $prId = $this->request->getPost('productId');
            $order = new Orders;
            $order->setArticle('В-ОЦ-У-0001')
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
}
