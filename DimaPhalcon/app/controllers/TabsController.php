<?php

use Phalcon\Db\RawValue;

class TabsController extends \Phalcon\Mvc\Controller 
{    
    public function getLeftTabsListAction() {      
        if ($this->request->isAjax() && $this->request->isGet()) {
            $tabs = Tabs::find();
            $this->response->setContentType('application/json', 'UTF-8');
            if ($tabs == false) {
                $this->response->setJsonContent(['success' => false, 'error' => __METHOD__ . ':' . $tabs->getMessages()]);
                return $this->response;
            }
            $html = false;
            $active = false;
            $prodId = false;
            $tabArr['preferences1'] = (object)[
                                                'active' => '',
                                                'productId' => 'preferences1'
            ];
            $resObj = [];
            if (count($tabs)) {
                $substObj = new Substitution();                

                foreach ($tabs as $val) {
                    $tabsList = array();
                    if ($val->getActive()) {
                        $tabsList['%ACTIVE%'] = 'active';
                        $active = $val->getTabId();
                        $prodId = $val->getProductId();
                    } else {
                        $tabsList['%ACTIVE%'] = '';
                    }
                    $tabsList['%ID%'] = $val->getId();
                    $tabsList['%TABID%'] = $val->getTabId();
                    $tabsList['%PRODUCT_ID%'] = $val->getProductId();
                    $product = Products::findFirst($val->getProductId());
                    $tabsList['%PRODUCT_NAME%'] = $product->getProductName();
                    $html .= $substObj->subHTMLReplace('tab_li.html', $tabsList);

                    $tabArr[$val->getTabId()] = (object)[
                                'active' => $val->getActive(),
                                'productId' => $val->getProductId()];
                }
                $kim = Kim::find();
                foreach ($kim as $val) {
                    $resObj[$val->getKim()] = $val->getKimHard();
                }                
            }
            $this->response->setJsonContent([
                                    'html' => $html,
                                    'active' => $active,
                                    'productId' => $prodId,
                                    'tabsList' => (object)$tabArr,
                                    'kim' => (object)$resObj
                                ]
            );

            return $this->response;
            
        } else {
            $this->response->redirect('');
        }
    }
    
    public function getLastLeftTabAction() {
        if ($this->request->isAjax() && $this->request->isGet()) {
            $tabs = Tabs::maximum(array("column" => "id"));
               if (!empty($tabs)) {
                   $this->response->setContentType('application/json', 'UTF-8');
                   $this->response->setJsonContent($tabs);
               } else {
                   $this->response->setContentType('application/json', 'UTF-8');
                   $this->response->setJsonContent(array());
               }
               return $this->response;
           } else {
               $this->response->redirect('');
       }
    }
    
    public function getLeftTabContentAction($productId) {
        if ($this->request->isAjax() && $this->request->isGet()) {
            $product = Products::findFirst($productId);
            if ($product == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($product->getMessages() as $message) {
                    echo $message, "\n";
                }
            } else {
                $substObj = new Substitution();
                $tabContent = '';

                $productCatId = $product->getCategoryId();
                $productKim = $product->getKim();
                $productMetall = $product->getMetall();
                $table = json_decode($product->getTableContent());
                $alwaysInTable = json_decode($product->getAlwaysintable());

                $productObj = new ProductsController;
                $categoryObj = new CategoriesController;
                $kimObj = new KimController;
                $metallsObj = new MetallsController;
                $formulaHelperObj = new FormulasController;
                $addToOrder = new OrderController;

                $prName = $product->getProductName();
                'Новое изделие' === $prName ? $prName = '' : true ;

                $css = '';
                $prStatus = $product->getStatus();
                if ('draft' === $prStatus) {
                    $prStatus = '<button type="button" class="btn btn-danger btn-sm" id="saveInDB">Сохранить в базе данных</button>';
                } else if ('save' === $prStatus){
                    $prStatus = 'Сохранено в базе данных' ;
                    $css = 'saveInDB';
                } else if ('order') {
                    $prStatus = '' ;
                    $css = 'addedToOrder';
                }

                $formulas = json_decode($product->getFormulas());

                $productDetails = array(
                    '%PRODUCT_NAME%' => $prName,
                    '%CATEGORIES%' => $categoryObj->createCategoriesList($productCatId),
                    '%KIM_LIST%' => $kimObj->createKimList($productKim),
                    '%METALL_LIST%' => $metallsObj->createMetallsList($productMetall),
                    '%CREATED%' => $product->getCreated(),
                    '%SAVE_IN_DB%' => $prStatus,
                    '%TABLE_CONTENT%' => $productObj->createTableRes($table, 'tableContent.html'),
                    '%ALWAYS_IN_TABLE%' => $productObj->createTableRes($alwaysInTable, 'alwaysInTable.html'),
                    '%FORMULAS_HELPER%' => $formulaHelperObj->createFormulaHelperList(),
                    '%FORMULAS%' => $formulaHelperObj->createFormulasList($formulas),
                    '%ADD_TO_ORDER%' => $addToOrder->createAddToOrder()
                );
                $tabContent .= $substObj->subHTMLReplace('tabContent.html', $productDetails);
                $this->response->setContentType('application/json', 'UTF-8');
                $this->response->setJsonContent(['html' => $tabContent, 'css' => $css]);

                return $this->response;
            }
        } else {
            $this->response->redirect('');
        }
    }

    public function changeActiveLeftTabAction() {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $tabs = Tabs::find("active = 1");
            foreach ($tabs as $val) {
                $val->setActive(0);
                $val->save();
            }
            if ($tabs == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($tabs->getMessages() as $message) {
                    echo $message, "\n";
                }
            } else {
                $id = $this->request->getPost('id');
                $tabId = $this->request->getPost('tabId');
                $tabs = Tabs::find(array("id = '$id'", "tab_id = '$tabId'"));
                foreach ($tabs as $val) {
                    $val->setActive(1);
                    $val->save();
                }
                $this->response->setContentType('application/json', 'UTF-8');
                $this->response->setJsonContent('ok');

                return $this->response;
            }
        } else {
            $this->response->redirect('');
        }
    }

    public function addNewLeftTabAction($id) {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $tab = new Tabs();
            $categoryId = Categories::minimum(array("column" => "category_id"));
            if (empty($categoryId)) {
                $category = new Categories();
                $category->setCategoryName('Нераспределенное');
                $category->save();
                $categoryId = Categories::minimum(array("column" => "category_id"));
            }
            $kimId = Kim::minimum(array("column" => "kim_id"));
            var_dump($kimId);
            if (empty($kimId)) {
                $kim = new Kim();
                $kim->setKimHard('Прямой участок')
                        ->setKim('1.1')
                        ->save();
                $kimId = Kim::minimum(array("column" => "kim_id"));
            }
            $metallId = Metalls::minimum(array("column" => "id"));
            if (empty($metallId)) {
                $metall = new Metalls();
                $metall->setName('металл оц. 0.55')
                        ->setPrice('185')
                        ->setMass('8.5')
                        ->setOutPrice('245')
                        ->save();
                $metallId = Metalls::minimum(array("column" => "id"));
            }
            $productId = '';
            $alwaysInTable = file_get_contents('files/alwaysInTable.json');
            $product = new Products();
            $product->setProductName('Новое изделие')
                    ->setCategoryId($categoryId)
                    ->setKim($kimId)
                    ->setMetall($metallId)
                    ->setAlwaysintable($alwaysInTable)
                    ->setCreated(new RawValue('default'))
                    ->setStatus(new RawValue('default'))
                    ->setTemplate(new RawValue('default'));
            //$product->setTableContent(new RawValue('default'));
            if ($product->save() == false) {
                $message = $product->getMessages();
                $this->response->setJsonContent(array($message[0]->__toString()));
                return $this->response;
            } else {
                $productId = $product->getProductId();
            }
            $tabs = Tabs::find("active = 1");
            foreach ($tabs as $val) {
                $val->setActive(0);
                $val->save();
            }

            $tab->setTabId('pr' . $id)
                    ->setProductId($productId)
                    ->setActive(1)
                    ->save();
            $this->response->setContentType('application/json', 'UTF-8');
            $this->response->setJsonContent('ok');
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

    public function closeTabAction() {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $id = $this->request->getPost('id');
            $tabId = $this->request->getPost('tabId');
            $nextActive = $this->request->getPost('nextActiveTab');
            $tabs = Tabs::findFirst(array("id = '$id'", "tab_id = '$tabId'"));
            $productObj = Products::findFirst($tabs->getProductId());
            if ($tabs != false) {
                if ($tabs->delete() == false) {
                    echo "Sorry, we can't delete the robot right now: \n";
                    $message = $tabs->getMessages();
                    $this->response->setJsonContent(array($message[0]->__toString()));
                    return $this->response;
                } else {
                    $changeActiveStatus = Tabs::findFirst(array("tab_id = '$nextActive'"));
                    $changeActiveStatus->setActive(1)->save();
                    'draft' === $productObj->getStatus() ? $productObj->delete() : true ;
                    $this->response->setContentType('application/json', 'UTF-8');
                    $this->response->setJsonContent('ok');
                    return $this->response;
                }
            }
        } else {
            $this->response->redirect('');
        }
    }

    public function changeTabNameAction() {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $prId = $this->request->getPost('prId');
            $prName = $this->request->getPost('prName');
            $catId = $this->request->getPost('categoryId');
            $kimId = $this->request->getPost('kimId');
            $metallId = $this->request->getPost('metallId');
            $product = Products::findFirst(array("product_id = '$prId'"));
            if ($product == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($product->getMessages() as $message) {
                    echo $message, "\n";
                }
            } else {
                $product->setProductName($prName)
                        ->setCategoryId($catId)
                        ->setKim($kimId)
                        ->setMetall($metallId)
                        ->save();
                $this->response->setContentType('application/json', 'UTF-8');
                $this->response->setJsonContent('ok');

                return $this->response;
            }
        } else {
            $this->response->redirect('');
        }
    }

    public function getRightTabsListAction() {
        if ($this->request->isAjax() && $this->request->isGet()) {
            $tabs = TabsRight::find();
            if ($tabs == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($tabs->getMessages() as $message) {
                    echo $message, "\n";
                }
            } else {
                $this->response->setContentType('application/json', 'UTF-8');
                if (count($tabs)) {
                    $active = 'kim';
                    $orderId = '';
                    $tabsLi = '';
                    $tabArr = array();
                    $substObj = new Substitution();
                    foreach ($tabs as $val) {
                        $tabsList = array();
                        if ($val->getActive()) {
                            $tabsList['%ACTIVE%'] = 'active';
                            $active = $val->getId();
                            $orderId = $val->getOrderId();
                        } else {
                            $tabsList['%ACTIVE%'] = '';
                        }
                        $tabsList['%ID%'] = 'or' . $val->getId();
                        $tabsList['%TABID%'] = $val->getId();
                        $tabsList['%ORDER_ID%'] = $val->getOrderId();
                        $order = Orders::findFirst($val->getOrderId());
                        $tabsList['%ORDER_NAME%'] = $order->getArticle();
                        $tabsLi .= $substObj->subHTMLReplace('tab_li_right.html', $tabsList);

                        $tabArr['or' . $val->getId()] = (object) [
                                    'active' => $val->getActive(),
                                    'orderId' => $val->getOrderId()
                                ];
                        $tabArr['kim'] = (object)[
                                                'active' => '',
                                                'orderId' => 'kim'
            ];
                    }
                    $this->response->setJsonContent([
                        'tabs' => true,
                        'tabId' => $active,
                        'orderId' => $orderId,
                        'obj' => (object) $tabArr,
                        'html' => $tabsLi
                            ]
                    );
                    return $this->response;
                }

                $this->response->setJsonContent(array(false));

                return $this->response;
            }
        } else {
            $this->response->redirect('');
        }
    }

    public function getRightTabContentOrderDetailsAction() {
        if ($this->request->isAjax() && $this->request->isGet()) {
            $orderId = $this->request->get('orderId', 'int');
            $this->response->setContentType('application/json', 'UTF-8');
            $order = Orders::findFirst($orderId);
            if ($order == false) {
                $this->response->setJsonContent(['success' => false, 'error' => __METHOD__ . ':' . $order->getMessages()]);
                return $this->response;
            }
            $substObj = new Substitution();

            $rows = (array) json_decode($order->getOrderDescription());
            $rows['%ORDER_NAME%'] = $order->getArticle();
            $discount = $order->getDiscount();
            $rows['%DISCOUNT%'] = $discount;

            $res = $substObj->subHTMLReplace('rightTabContent.html', $rows);
            $this->response->setJsonContent(['success' => true, 'html' => $res]);

            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

    public function getRightTabContentTableAction() {
        if ($this->request->isAjax() && $this->request->isGet()) {
            $orderId = $this->request->get('orderId');
            $productsInOrder = Productinorder::find(array("orderId = '$orderId'"));
            $this->response->setContentType('application/json', 'UTF-8');
            if ($productsInOrder == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($productsInOrder->getMessages() as $message) {
                    echo $message, "\n";
                }
                return false;
            }
            $order = Orders::findFirst($orderId);
            if ($order == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($order->getMessages() as $message) {
                    echo $message, "\n";
                }
                return false;
            }
            $substObj = new Substitution();

            $rows = array();
            $products = array();
            $discount = $order->getDiscount();
            foreach ($productsInOrder as $val) {
                $products[$val->getProductId()] = $val->getQuantity();
            }
            $productObj = new ProductsController;
            foreach ($products as $key => $val) {
                $rows['%PRODUCTS%'] .= $productObj->createProductInOrder($key, $val, $orderId, $discount);
            }

            $res = $substObj->subHTMLReplace('orderTable.html', $rows);
            $this->response->setJsonContent(['html' => $res]);

            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }
    
    public function changeActiveRightTabAction() {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $tabs = TabsRight::find("active = 1");
            foreach ($tabs as $val) {
                $val->setActive(0);
                $val->save();
            }
            if ($tabs == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($tabs->getMessages() as $message) {
                    echo $message, "\n";
                }
            } else {
                $id = $this->request->getPost('id');
                $tabs = TabsRight::find(array("id = '$id'"));
                foreach ($tabs as $val) {
                    $val->setActive(1);
                    $val->save();
                }
                $this->response->setContentType('application/json', 'UTF-8');
                $this->response->setJsonContent('ok');

                return $this->response;
            }
        } else {
            $this->response->redirect('');
        }
    }
    
    public function addNewRightTab($order_id) {
        $tabActive = TabsRight::find(array("active = 1"));
        foreach ($tabActive as $val) {
            $val->setActive(0);
            $val->save();
        }
        if ($tabActive == false) {
            echo "Мы не можем сохранить робота прямо сейчас: \n";
            foreach ($tabActive->getMessages() as $message) {
                echo $message, "\n";
            }
        } else {
            
        }
        $tab = new TabsRight;
        $tab->setOrderId($order_id)
                ->setActive('1')
                ->save();
        if ($tab == false) {
            return false;
        }

        return true;
    }

}
