<?php
use Phalcon\Db\RawValue;
class OrderController  extends ControllerBase
{
    public function getOrderDetailsAction() {
        $this->ajaxGetCheck();
        $res = true;
        $orderId = $this->request->get('orderId', 'int');
        $order = Orders::findFirst($orderId);
        if ($order) {
            $orderDescription = $this->getOrderDescriptionObj($order);
            $orderTableContent = $this->getOrderTableContent($order);
            if (!$orderDescription) {
                $res = false;
            }
        }
        return $this->response->setJsonContent([
            'success' => $res,
            //'html' => $res,
            'orderDescription' => $orderDescription,
            'orderTableContent' => $orderTableContent['html'],
            'consolidateData' => $orderTableContent['consolidateData']
        ]);
        /*$orderObj = Orders::findFirst($orderId);
        if ($orderObj) {
        }
        if ($this->request->isAjax() && $this->request->isGet()) {
            $orderId = $this->request->get('orderId', 'int');
            $this->response->setContentType('application/json', 'UTF-8');
            $order = Orders::findFirst($orderId);
            if ($order == false) {
                $this->response->setJsonContent(['success' => false, 'error' => __METHOD__ . ':' . $order->getMessages()]);
                return $this->response;
            }
            $substObj = new Substitution();

            $orderObj = new OrderController();
            $orderDescription = $orderObj->getOrderDescriptionObj();
            $rows = $orderDescription;
            $status = $order->getStatus();
            'draft' === $status
                ? $rows['%SAVE_ORDER_IN_DB%'] = '<button type="button" class="btn btn-danger btn-sm" id="saveOrderInDB">Сохранить в БД</button>'
                : $rows['%SAVE_ORDER_IN_DB%'] = 'Сохранено в базе данных';
            $rows['%ORDER_NAME%'] = $order->getArticle();
            $rows['%DELETE_ORDER%'] = '<button type="button" class="btn btn-danger btn-sm" id="deleteOrder">Удалить Ордер</button>';
            if ('TRUE' === $order->getConsolidate()) {
                $rows['%DELETE_ORDER%'] = '';
                $rows['%SAVE_ORDER_IN_DB%'] = '';
            }
            $discount = $order->getDiscount();
            $rows['%DISCOUNT%'] = $discount;
            $res = $substObj->subHTMLReplace('rightTabContent.html', $rows);
            $this->response->setJsonContent(['success' => true, 'html' => $res, 'orderDescription' => $orderDescription, 'consolidate' => $order->getConsolidate()]);

            return $this->response;
        } else {
            $this->response->redirect('');
        }*/
    }
    
    public function getOrderTableContent($order) {
        if ($order) {
            $orderId = $order->getId();
            $substObj = new Substitution();
            $consolidateData = false;
            if ('TRUE' === $order->getConsolidate()) {
                $consolidateData = [];
                if (null === $order->getMap()) {
                    
                }
                $consolidateOrdersObj = ConsolidateOrders::find(array("order_id = '$orderId'"));
                if (false !== $consolidateOrdersObj) {
                    foreach ($consolidateOrdersObj as $val) {
                        $consOrderId = $val->getConsOrderId();
                        $orderObj = Orders::findFirst($consOrderId);
                        if (false !== $orderObj) {
                            $consolidateData[$consOrderId] = ['map' => json_decode($orderObj->getMap())];
                            $consolidateData[$consOrderId]['products'] = [];
                            $prInOrder = Productinorder::find(array("orderId = '$consOrderId'"));
                            if (false !== $prInOrder) {
                                foreach ($prInOrder as $obj) {
                                    $alwaysInTable = json_decode($obj->getAlwaysInTable());
                                    $prId = $obj->getProductId();
                                    $consolidateData[$consOrderId]['products'][$prId] = [
                                        'inSum' => $alwaysInTable['3']->{'rowValueInput'},
                                        'outSum' => $alwaysInTable['5']->{'rowValueInput'},
                                        'inPrice' => $alwaysInTable['2']->{'rowValueInput'},
                                        'outPrice' => $alwaysInTable['4']->{'rowValueInput'}
                                    ];
                                    $prDetObj = Products::findFirst(array("product_id = '$prId'"));
                                    if (false !== $prDetObj) {
                                        $metallId = $prDetObj->getMetall();
                                        $metallObj = Metalls::findFirst($metallId);
                                        $consolidateData[$consOrderId]['products'][$prId]['article'] = $prDetObj->getArticle();
                                        $consolidateData[$consOrderId]['products'][$prId]['productName'] = $prDetObj->getProductName() . ' из ' . $metallObj->getName();
                                    }
                                }
                            }
                        }
                    }
                }
            } 
            $res = array('%SECTIONS%' => '', '%WITHOUT_SECTIONS%' => '');
            $map = json_decode($order->getMap());
            $moveTo = array();
            $productObj = new ProductsController;
            $currentSection = '';
            if ('' !== $map && null !== $map) {
                $orderObj = new OrderController;
                foreach ($map as $key => $val) {
                    if ('out' === $key && count($val)) {
                        $i = 1;
                        foreach ($val as $num => $obj) {
                            foreach ($obj as $productId => $quantity) {
                                $res['%WITHOUT_SECTIONS%'] .= $productObj->createProductInOrder($productId, $quantity, $orderId, $i, 'withoutSectionRow', $map, 'out');
                            }
                            $i++;
                        }
                    } else if ('out' !== $key) {
                        if (!count($val)) {
                            $currentSection = $key;
                        }
                        $res['%SECTIONS%'] .= '<tr class="orderTableSectionName" name="' . $key . '">
                    <th colspan="9"><span class="orderSectionName" contenteditable="true">' . $key . '</span></th><td><span class="glyphicon glyphicon-remove removeRowSection" name="' . $key . '" aria-hidden="true"></span></td></tr>';
                        if (count($val)) {
                            $i = 1;
                            foreach ($val as $num => $obj) {
                                foreach ($obj as $productId => $quantity) {
                                    $res['%SECTIONS%'] .= $productObj->createProductInOrder($productId, $quantity, $orderId, $i, 'orderTableSection', $map, $key);
                                }
                                $i++;
                            }
                        } else if (!count($val)) {
                            $moveTo[$key] = array();
                        }
                    }
                }
            }
        }
        return ['html' => $substObj->subHTMLReplace('orderTable.html', $res), 'consolidateData' => $consolidateData];
        //$this->response->setJsonContent(['html' => $substObj->subHTMLReplace('orderTable.html', $res), 'success' => true, 'consolidateData' => $consolidateData]);
    }
    
    public function createNewOrderAction() {
        $this->ajaxPostCheck();
        $success = false;
        $msg = 'Ошибка при создании Ордера';
        $orderMax = Orders::maximum(array("column" => "order_number"));
        $consolidate = $this->request->getPost('consolidate');
        $project = $this->request->getPost('project');
        $orderNumber = 1;
        if ($orderMax) {
            $orderNumber = (int)($orderMax) + 1;
        }

        $order = new Orders;
        $order->setOrderNumber($orderNumber)
              ->setArticle($this->generateArticle($orderNumber))
              ->setDiscount(new RawValue('default'))
              ->setProject($project)
              ->setMap(new RawValue('default'))
              ->setConsolidate($consolidate);
        if ('true' === $consolidate) {
            $order->setStatus('draft');
        } else {
            $order->setStatus('save');
        }

        if ($order->save()) {
            $success = true;
            $msg = 'Ордер успешно создан';
        }
        $order_id = $order->getId();

        /*if ('true' === $consolidate) {
            $tab = new TabsController;
            $this->response->setJsonContent($tab->addNewRightTab($order_id));
        } else {
            $this->response->setJsonContent(true);
        }*/

        return $this->response->setJsonContent(['success' => $success, 'msg' => $msg, 'orderId' => $order_id]);
    }

    public function addProductToOrderAction() {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $orderId = $this->request->getPost('orderId');
            $prId = $this->request->getPost('productId');
            $alwaysInTable = $this->request->getPost('alwaysInTable');
            $this->response->setContentType('application/json', 'UTF-8');
            $orObj = Productinorder::findFirst(
                "orderId = '" . $orderId . "' AND productId = '" . $prId . "'"
            );
            if (!$orObj) {
                $prInOrder = new Productinorder;
                $prInOrder->setOrderid($orderId)
                          ->setProductid($prId)
                          ->setAlwaysInTable($alwaysInTable);
                if ($prInOrder->save() == false) {
                    $this->response->setJsonContent('error');
                    return $this->response;
                }
                $this->response->setJsonContent(array('status' => 'ok'));
                return $this->response;
            }
            $this->response->setJsonContent(array('status' => 'already'));
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

    public function addToConsolidateOrderAction() {
        $this->ajaxPostCheck();
        $success = true;
        $orderId = $this->request->getPost('orderId');
        $arr = $this->request->getPost('arr');
        foreach ($arr as $val) {
            $orObj = ConsolidateOrders::findFirst(
                "order_id = '" . $orderId . "' AND cons_order_id = '" . $val . "'"
            );
            if (!$orObj) {
                $consOrder = new ConsolidateOrders;
                $consOrder->setOrderId($orderId)
                          ->setConsOrderId($val)
                          ->save();
            }
        }
        return $this->response->setJsonContent(['success' => $success]);
    }

    public function saveOrderInDBAction(){
        if ($this->request->isAjax() && $this->request->isPost()) {
            $orderId = $this->request->getPost('orderId');
            $this->response->setContentType('application/json', 'UTF-8');
            $orderObj = Orders::findFirst(array("id = '$orderId'"));
            if ($orderObj) {
                $q = $orderObj->setStatus('save');
                if($q->save() == true) {
                    $this->response->setJsonContent(true);
                } else {
                    $this->response->setJsonContent(false);
                }

                return $this->response;
            }
            $this->response->setJsonContent('error');
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

    public function changeDiscountAction(){
        if ($this->request->isAjax() && $this->request->isPost()) {
            $orderId = $this->request->getPost('orderId');
            $discount = $this->request->getPost('discount');
            $this->response->setContentType('application/json', 'UTF-8');
            $orderObj = Orders::findFirst(array("id = '$orderId'"));
            if ($orderObj) {
                $q = $orderObj->setDiscount($discount);
                if($q->save() == true) {
                    $this->response->setJsonContent(true);
                } else {
                    $this->response->setJsonContent(false);
                }

                return $this->response;
            }
            $this->response->setJsonContent('error');
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

    public function removeFromOrderAction () {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $orderId = $this->request->getPost('orderId');
            $productId = $this->request->getPost('productId');
            $this->response->setContentType('application/json', 'UTF-8');
            $orObj = Productinorder::findFirst(
                "orderId = '" . $orderId . "' AND productId = '" . $productId . "'"
            );
            if ($orObj) {
                if($orObj->delete() == true) {
                    $this->response->setJsonContent(true);
                } else {
                    $this->response->setJsonContent(false);
                }

                return $this->response;
            }
            $this->response->setJsonContent('error');
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

    public function openSavedOrderAction() {
       if ($this->request->isAjax() && $this->request->isPost()) {
            $arr = $this->request->getPost('arr');
            $tab = $this->request->getPost('tab');
            $active = $this->request->getPost('active');
            $this->response->setContentType('application/json', 'UTF-8');
            foreach ($arr as $id) {
               $orderId = $id;
               $tabs = TabsRight::findFirst(array("order_id = '$orderId'"));
               if ($tabs) {
                   continue;
               }
               if ('new' === $tab) {
                   $tabObj = new TabsRight();
                   $tabs = TabsRight::find("active = 1");
                   $activeMark = 0;
                   if ('true' === $active) {
                       foreach ($tabs as $val) {
                           $val->setActive(0);
                           $val->save();
                       }
                       $activeMark = 1;
                   }
                   $tabObj->setOrderId($orderId)
                       ->setActive($activeMark)
                       ->save();
               } else {
                   $tabs = TabsRight::findFirst(array("order_id = '$orderId'"));
                   $tabs->setOrderId($orderId)
                        ->save();
               }
            }
            $this->response->setJsonContent(true);
            return $this->response;
       } else {
            $this->response->redirect('');
       }
    }

    public function deleteOrderAction($orderId) {
        $this->ajaxDeleteCheck();
        $success = false;
        $msg = 'Ошибка при удалении Ордера!';
        try {
            if ($this->deleteProductsFromOrder($orderId)    &&
                $this->deleteOrderFromTabs($orderId)        &&
                $this->deleteFromConsolidateOrder($orderId) &&
                $this->deleteOrder($orderId)
            ) {
                $success = true;
                $msg = 'Ордер успешно удалён.';
            }
        } catch (\Exception $e) {

        }
        return $this->response->setJsonContent(['success' => $success, 'msg' => $msg]);
    }

    public function deleteOrder($id)
    {
        $orObj = Orders::findFirst($id);
        $res = true;
        if ($orObj) {
            $consolidate = $orObj->getConsolidate();
            if ('TRUE' === $consolidate) {
                $consolidateObj = ConsolidateOrders::find(array("order_id = '$id'"));
                $consolidateObj->delete();
            }
            if (!$orObj->delete()) {
                $res = false;
            }
        }
        return $res;
    }

    public function deleteProductsFromOrder($id)
    {
        $orObj = Productinorder::find(array("orderId = '$id'"));
        $res = true;
        if ($orObj) {
            if (!$orObj->delete()) {
                $res = false;
            }
        }
        return $res;
    }

    public function deleteFromConsolidateOrder($id)
    {
        $orObj = ConsolidateOrders::find(array("cons_order_id = '$id'"));
        $res = true;
        if ($orObj) {
            if (!$orObj->delete()) {
                $res = false;
            }
        }
        return $res;
    }

    public function deleteOrderFromTabs($id)
    {
        $orObj = TabsRight::find(array("order_id = '$id'"));
        $res = true;
        if ($orObj) {
            if (!$orObj->delete()) {
                $res = false;
            }
        }
        return $res;
    }

    public function createAddToOrder() {
        //$substObj = new Substitution();
        $res = '<button class="btn btn-info btn-sm" id="addToOrderBtn">Добавить в ордер</button>';
        return $res;
    }

    public function generateArticle($number) {
        $zero = '00';
        if (9 < $number && 100 > $number) {
           $zero = '0';
        } else if(100 < $number && 1000 > $number) {
            $zero = '';
        }
        return date('y') . '-' . $zero . strval($number) . '-' . date('d') . date('m') . date('o');
    }

    public function getOrderDescriptionObj($order){
        $orderDescription = false;
        if ($order) {
            $orderDescription = [
                'fio'          => $order->Projects->Clients->getFio(),
                'appeal'       => $order->Projects->Clients->getAppeal(),
                'companyName'  => $order->Projects->Clients->getCompanyName(),
                'addres'       => $order->Projects->Clients->getAdress(),
                'accNumber'    => $order->Projects->Clients->getAccaunt(),
                'city'         => $order->Projects->Clients->getZip(),
                'projectName'  => $order->Projects->getName(),
                'projectDescr' => $order->Projects->getDescription(),
                'estimate'     => $order->Projects->getEstimate(),
                'date'         => $order->Projects->getDate(),
                'orderName'    => $order->getArticle(),
                'discount'     => $order->getDiscount(),
                'deleteOrder'  => ('TRUE' === $order->getConsolidate()) ? false : true
            ];
        }
        
        return $orderDescription;
    }
}